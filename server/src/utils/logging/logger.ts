import winston, { format } from 'winston'
import { LoggingWinston } from '@google-cloud/logging-winston'
import { TraceContext } from './TraceContext'
import * as util from 'util'
import dotenv from 'dotenv'

dotenv.config()

const GCP_PRODUCTION_PROJECT_ID = process.env.GCP_PRODUCTION_PROJECT_ID || 'default-project-id'

const localConfig = {
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'HH:mm:ss.SSS',
    }),
    format.colorize({ level: true }),
    format.metadata({
      fillExcept: ['message', 'level', 'timestamp'],
    }),
    format.printf(info => {
      const msg = `${info.timestamp} [${info.level}] ${info.message}`

      if (Object.keys(info.metadata).length > 0) {
        return msg + `\n${util.inspect(info.metadata, { depth: 3, colors: true })}`
      }
      return msg
    })
  ),
  transports: [new winston.transports.Console()],
}

const gcpConfig = {
  level: 'info',
  transports: [new LoggingWinston()],
  format: format.combine(
    format(info => {
      const context = TraceContext.getContext()
      info = {
        ...info,
        // Format is `projects/${projectId}/traces/${traceId}`
        // https://cloud.google.com/trace/docs/trace-log-integration#:~:text=The%20trace%20field%20must%20be%20set%20to,PROJECT_ID%20is%20your%20Google%20Cloud%20project%20ID
        ...(context?.traceId
          ? { [LoggingWinston.LOGGING_TRACE_KEY]: `projects/${GCP_PRODUCTION_PROJECT_ID}/traces/${context?.traceId}` }
          : {}),
      }
      return info
    })(),
    format.json()
  ),
}

export const logger = winston.createLogger({
  // This should use the same ENV as rest of the app, but accessing container
  // in top level code can cause complex issues
  ...(process.env.NODE_ENV === 'production' ? gcpConfig : localConfig),
})