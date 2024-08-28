import { LoggingWinston } from '@google-cloud/logging-winston'
import { injectable } from 'inversify'
import * as winston from 'winston'

interface ContextLoggerOptions {
  context: string
}

type LogMetadata = Record<string, unknown>

@injectable()
class ContextLogger {
  private options: ContextLoggerOptions
  private logger: winston.Logger

  constructor(options: ContextLoggerOptions) {
    this.options = options

    const logFormat = winston.format.printf(({ timestamp, level, label, message, ...metadata }) => {
      let formatted = `[${timestamp}] [${JSON.stringify(label)}] ${level}: ${message}`
      if (Object.keys(metadata).length !== 0) {
        formatted += ` ${JSON.stringify(metadata)}`
      }
      return formatted
    })

    const transports: winston.transport[] = []
    if (process.env.MODE !== 'local') {
      const stackdriverTransport = new LoggingWinston({ redirectToStdout: true })
      transports.push(stackdriverTransport)
    } else {
      const localTransporter = new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), logFormat),
      })
      transports.push(localTransporter)
    }

    this.logger = winston.createLogger({
      level: process.env.MODE === 'prod' ? 'warn' : 'debug',
      format: winston.format.combine(
        winston.format.label({ label: this.options.context }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
        logFormat
      ),
      transports: transports,
      exceptionHandlers: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), logFormat),
        }),
      ],
    })
  }

  info(message: string, metadata?: LogMetadata) {
    this.logger.info(message, metadata)
  }

  error(message: string, metadata?: LogMetadata) {
    this.logger.error(message, metadata)
  }
}

@injectable()
export class LoggerFactory {
  create(context: string): ContextLogger {
    const logger = new ContextLogger({ context })
    return logger
  }
}

export { ContextLogger, ContextLoggerOptions }
