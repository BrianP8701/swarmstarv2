import { NextFunction, Request, Response } from 'express'
import { AsyncLocalStorage } from 'node:async_hooks'
import * as crypto from 'crypto'
import { AuthenticatedRequest } from '../auth/AuthRequest'
import { logger } from './logger'
import functions from '@google-cloud/functions-framework'
import { CloudEventPayload } from '../../functions/pubsub/CloudEventSubscriber'

/**
 * This is intended to track data relevant to a single request by leveraging the W3C Trace Context standard.
 *
 * @see https://www.w3.org/TR/trace-context/#traceparent-header
 * @see https://cloud.google.com/trace/docs/trace-context
 */
export class TraceContext {
  readonly traceId: string
  // This is the current active spanId set by caller. Null if parent is root span
  // Encoded as 8-byte hex string, but GCP uses decimal representation for spanIds
  readonly parentSpanId: string | null

  private static als: AsyncLocalStorage<TraceContext> = new AsyncLocalStorage<TraceContext>()

  constructor(traceId: string, parentSpanId: string | null) {
    this.traceId = traceId
    this.parentSpanId = parentSpanId
  }

  static run<T>(context: TraceContext, fn: () => T): T {
    return TraceContext.als.run(context, fn)
  }

  static async runAsync<T>(context: TraceContext, fn: () => Promise<T>): Promise<T> {
    return await TraceContext.als.run(context, fn)
  }

  static getContext(): TraceContext | undefined {
    return TraceContext.als.getStore() as TraceContext
  }

  static fromRequest(req: Request): TraceContext {
    const traceparent = req.header('traceparent')
    if (traceparent) {
      return TraceContext.fromTraceparent(traceparent)
    } else {
      return TraceContext.generateNewContext()
    }
  }

  static toMessageAttributes(): Record<string, string> {
    const context = TraceContext.getContext()
    return {
      ...(context?.traceId ? { traceId: context.traceId } : {}),
      ...(context?.parentSpanId ? { spanId: context.parentSpanId } : {}),
    }
  }

  static fromCloudEvent(cloudEvent: functions.CloudEvent<CloudEventPayload>): TraceContext {
    // https://github.com/cloudevents/spec/blob/main/cloudevents/extensions/distributed-tracing.md
    if (cloudEvent.traceparent) {
      return TraceContext.fromTraceparent(cloudEvent.traceparent as string)
    } else if (cloudEvent.data?.message.attributes?.traceId) {
      return new TraceContext(
        cloudEvent.data.message.attributes.traceId,
        cloudEvent.data.message.attributes.parentSpanId || null
      )
    }

    return TraceContext.generateNewContext()
  }

  static fromTraceparent(traceparent: string): TraceContext {
    const parts = traceparent.split('-')
    const traceId = parts[1]
    const parentSpanId = parts[2]
    return new TraceContext(traceId, parentSpanId)
  }

  static expressMiddleware() {
    return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
      try {
        const traceContext = TraceContext.fromRequest(req)
        TraceContext.run(traceContext, () => {
          logger.debug('Request headers', { headers: req.headers })
          next()
        })
      } catch (e) {
        logger.error('Unexpected error', { cause: e })
      }
    }
  }

  static generateNewContext(): TraceContext {
    const traceId = TraceContext.generateTraceId()
    return new TraceContext(traceId, null)
  }

  private static generateTraceId(): string {
    return crypto.randomBytes(16).toString('hex')
  }
}
