import 'reflect-metadata'

import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { expressMiddleware } from '@apollo/server/express4'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import { container } from './utils/di/container'
import { ResolverContext, createApolloGqlServer } from './graphql/createApolloGqlServer'
import { checkAuthenticated } from './utils/auth/auth'
import { TraceContext } from './utils/logging/TraceContext'
import { createApolloWsServer } from './graphql/createApolloWsServer'
import { initializePubSubHandlers } from './functions/pubsub/initializePubSubHandlers'

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
const IS_LOCAL = process.env.NODE_ENV !== 'production'

// Middleware
app.use(express.json())
app.use(clerkAuth, checkAuthenticated)
app.use(TraceContext.expressMiddleware())

// Paths setup
app.get('/', (_req, res) => {
  res.send('Nothing to see here')
})

const startServer = async () => {
  const httpServer = createServer(app)
  const apolloServer = createApolloGqlServer(httpServer)

  if (IS_LOCAL) {
    initializePubSubHandlers()
    const { serverCleanup } = createApolloWsServer(httpServer, container)

    apolloServer.addPlugin({
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          },
        }
      },
    })
  }

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

  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
    if (IS_LOCAL) {
      console.log(`WebSocket server is also running on ws://localhost:${PORT}/graphql`)
    }
  })
}

startServer()
