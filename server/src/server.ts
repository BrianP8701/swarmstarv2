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

dotenv.config()

const CORS_WHITELIST = [
  'http://localhost:5173',
  'https://studio.apollographql.com',
  'https://swarmstar.ai',
]

dotenv.config()
const app = express()

const clerkAuth = ClerkExpressWithAuth({})

const PORT = process.env.PORT || 8080

// Add CORS middleware before other middleware
app.use(cors({
  origin: '*',
  credentials: true,
}))

// Middleware
app.use(express.json())
app.use(clerkAuth)
app.use(checkAuthenticated)
app.use(TraceContext.expressMiddleware())

// Paths setup
app.get('/', (_req, res) => {
  res.send('Nothing to see here')
})

const startServer = async () => {
  const httpServer = createServer(app)
  const apolloServer = createApolloServer(httpServer)
  await apolloServer.start()

  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req }): Promise<ResolverContext> => {
        return {
          req,
          container,
        }
      },
    })
  )

  httpServer.listen(PORT)
}

startServer()
