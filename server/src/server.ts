import 'reflect-metadata'

import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { expressMiddleware } from '@apollo/server/express4'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import { container } from './utils/di/container'
import { ResolverContext, createApolloServer } from './graphql/createApolloServer'
import { checkAuthenticated } from './utils/auth/auth'
import { TraceContext } from './utils/logging/TraceContext'
import { Environment } from './services/SecretService'
import { initializePubSubHandlers } from './functions/pubsub/initializePubSubHandlers'
import { logger } from './utils/logging/logger'
import { WebSocketServer } from './websocket-server'

const CORS_WHITELIST = [
  'http://localhost:5173',
  'https://studio.apollographql.com',
  'https://client-7xir3z4nfa-uc.a.run.app',
  'https://client-911903497338.us-central1.run.app',
  'https://swarmstar.ai',
]

dotenv.config()
const app = express()

const clerkAuth = ClerkExpressWithAuth()

const PORT = process.env.PORT || 5001

// Middleware
app.use(express.json())
app.use(clerkAuth, checkAuthenticated)
app.use(TraceContext.expressMiddleware())

// Paths setup
app.get('/', (_req, res) => {
  res.send('Nothing to see here')
})

if (process.env.MODE === Environment.LOCAL) {
  initializePubSubHandlers()
}

const startServer = async () => {
  const httpServer = createServer(app)
  const apolloServer = createApolloServer(httpServer)
  await apolloServer.start()

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({ origin: CORS_WHITELIST, credentials: true }),
    expressMiddleware(apolloServer, {
      context: async ({ req }): Promise<ResolverContext> => {
        return {
          req,
          container,
        }
      },
    })
  )

  if (process.env.MODE === Environment.LOCAL) {
    const webSocketServer = WebSocketServer.getInstance();
    await webSocketServer.initialize();
  }

  httpServer.listen(PORT, () => {
    logger.info(`HTTP server running on port ${PORT}`);
    if (process.env.MODE === Environment.LOCAL) {
      logger.info(`WebSocket server running on port ${process.env.WS_PORT || '8080'}`);
    }
  });
};

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
});
