import { Container, ContainerModule, interfaces } from 'inversify'
import { PubSub } from '@google-cloud/pubsub'
import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'
import { ContextLogger, LoggerFactory } from '../logging/ContextLogger'
import { logger } from '../logging/logger'
import dotenv from 'dotenv'
import { Prisma } from '@prisma/client'
import { SecretService } from '../../services/SecretService'
import webSocketServer, { WebSocketServer } from '../../websocket-server';

dotenv.config()

export const container = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true,
  defaultScope: 'Singleton',
})

export const TYPES = {
  Logger: Symbol.for('Logger'),
  LoggerFactory: Symbol.for('LoggerFactory'),
}

export const coreBindingsModule = new ContainerModule((bind: interfaces.Bind) => {
  const secretService = new SecretService()
  bind(SecretService).toConstantValue(secretService)

  const prismaLogger = logger.child({ module: 'PrismaClient' })
  const prismaClient = new PrismaClient({
    log: [
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
      { emit: 'event', level: 'error' },
    ],
  })
  prismaClient.$on('info', (e: Prisma.LogEvent) => {
    prismaLogger.info(e)
  })
  prismaClient.$on('warn', (e: Prisma.LogEvent) => {
    prismaLogger.warn(e)
  })
  prismaClient.$on('error', (e: Prisma.LogEvent) => {
    prismaLogger.error(e)
  })
  bind(PrismaClient).toConstantValue(prismaClient)

  bind(PubSub).toConstantValue(new PubSub())
  bind(OpenAI).toConstantValue(new OpenAI({ apiKey: secretService.getEnvVars().OPENAI_API_KEY }))

  bind<LoggerFactory>(TYPES.LoggerFactory).to(LoggerFactory).inSingletonScope()
  bind<ContextLogger>(TYPES.Logger).toDynamicValue(ctx => {
    const loggerFactory = ctx.container.get<LoggerFactory>(TYPES.LoggerFactory)
    const named = ctx.currentRequest.target.metadata.filter(data => data.key === 'named')[0]
    if (named) {
      const context = named as unknown as { value: string }
      return loggerFactory.create(context.value)
    }
    return loggerFactory.create('RootLogger')
  })

  container.bind<WebSocketServer>(WebSocketServer).toConstantValue(webSocketServer);
})

container.load(coreBindingsModule)
