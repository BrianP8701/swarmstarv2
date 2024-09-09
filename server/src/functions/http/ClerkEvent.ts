import { Request, Response } from 'express'
import { HttpFunction } from '@google-cloud/functions-framework'
import { container } from '../../utils/di/container'
import { logger } from '../../utils/logging/logger'
import { TraceContext } from '../../utils/logging/TraceContext'
import { Webhook } from 'svix'
import { PublisherService } from '../pubsub/PublisherService'
import { PubSubTopic } from '../pubsub/PubSubTopic'
import { UserDao } from '../../dao/UserDao'
import assert from 'assert'
import { AlertType } from '../pubsub/payload/AlertPayload'
import { SecretService } from '../../services/SecretService'

type GcpRequest = Request & { rawBody: Buffer }

const CLERK_SIGNATURE_HEADER = 'svix-signature'

export const ClerkEventHttp: HttpFunction = async (req: Request, res: Response): Promise<void> => {
  const context = TraceContext.fromRequest(req)
  logger.info('Clerk Event received', { header: req.header, body: req.body })

  await TraceContext.runAsync(context, async () => {
    const signature = req.header(CLERK_SIGNATURE_HEADER)
    const webhookSecret = container.get(SecretService).getEnvVars().CLERK_WEBHOOK_SECRET

    assert(webhookSecret, 'CLERK_WEBHOOK_SECRET is not set')

    if (!signature) {
      res.status(400).send('Invalid message signature')
      return
    }

    let event: null | { type: string; data: { id: string } }
    try {
      const payload = (req as GcpRequest).rawBody.toString()
      const headers = req.headers
      const svixHeaders: Record<string, string> = {}

      // Extract Svix headers
      for (const [key, value] of Object.entries(headers)) {
        if (key.startsWith('svix-')) {
          svixHeaders[key] = value as string
        }
      }

      // Verify the webhook signature
      const wh = new Webhook(webhookSecret)
      wh.verify(payload, svixHeaders)

      event = JSON.parse(payload)
    } catch (e) {
      const err = e as Error
      logger.error(`Error constructing Clerk event: ${err.message}`, { cause: err, request: req })
      res.status(400).send(`Error: ${err.message}`)
      return
    }

    if (!event) {
      logger.error('Received webhook event from Clerk is null')
      res.status(400).send('Received webhook event from Clerk is null')
      return
    }
    logger.info(`Received webhook event from Clerk: ${event.type}`, { event })

    if (event.type === 'user.created') {
      // Call the function to kick off email pubsub
      const publisherService = container.get(PublisherService)

      const userDao = container.get(UserDao)
      const user = await userDao.create({
        id: event.data.id,
        clerkId: event.data.id,
      })


      await publisherService.publishEvent(PubSubTopic.AlertHandler, {
        eventType: AlertType.NewUser,
        body: {
          type: AlertType.NewUser,
          userId: user.id
        },
      })
      logger.info('User created event received', { event, header: req.header, body: req.body })
    }

    res.status(200).json({ received: true })
  })
}
