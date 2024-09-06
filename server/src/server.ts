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
const app = express()

const clerkAuth = ClerkExpressWithAuth({})

const PORT = 8080

const CORS_WHITELIST = [
  'http://localhost:5173',
  'https://studio.apollographql.com',
  'https://swarmstar.ai',
  'https://www.swarmstar.ai'
]

// Middleware
app.use(express.json())
app.use(clerkAuth, checkAuthenticated)
app.use(TraceContext.expressMiddleware())

// Paths setup
app.get('/', (_req, res) => {
  res.send('Nothing to see here')
})

// Update the CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: CORS_WHITELIST,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Origin'],
}

const startServer = async () => {
  const httpServer = createServer(app)
  const apolloServer = createApolloServer(httpServer)
  await apolloServer.start()

  app.use(
    '/graphql',
    cors(corsOptions),
    expressMiddleware(apolloServer, {
      context: async ({ req }): Promise<ResolverContext> => {
        return {
          req,
          container,
        }
      },
    })
  )

  // Add CORS middleware to the entire app
  app.use(cors(corsOptions))

  httpServer.listen(PORT)
}

startServer()
