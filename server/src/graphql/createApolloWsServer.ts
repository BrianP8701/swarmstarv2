import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { Server } from 'http'
import { Container } from 'inversify'
import { AuthenticatedRequest } from '../utils/auth/AuthRequest'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'
import { checkAuthenticated } from '../utils/auth/auth'
import { Response } from 'express'
import { logger } from '../utils/logging/logger'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import { AuthenticationError } from 'apollo-server-express'

export interface ResolverContext {
  req: AuthenticatedRequest
  container: Container
}

export const createApolloWsServer = (httpServer: Server, container: Container) => {
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const clerkAuth = ClerkExpressWithAuth()

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx): Promise<ResolverContext> => {
        try {
          const req = {
            headers: {
              authorization: ctx.connectionParams?.Authorization as string,
            },
          } as AuthenticatedRequest
          const res = {} as Response
          const next = () => {}

          await new Promise((resolve, reject) => {
            clerkAuth(req, res, error => {
              if (error) reject(error)
              else resolve(undefined)
            })
          })

          await checkAuthenticated(req, res, next)

          return {
            req,
            container,
          }
        } catch (error) {
          logger.error('WebSocket authentication error', { error })
          throw new AuthenticationError('Authentication failed')
        }
      },
      onConnect: async ctx => {
        try {
          const req = {
            headers: {
              authorization: ctx.connectionParams?.Authorization as string,
            },
          } as AuthenticatedRequest
          const res = {} as Response
          const next = () => {}

          await new Promise(resolve => clerkAuth(req, res, resolve))
          await checkAuthenticated(req, res, next)
        } catch (error) {
          logger.error('WebSocket connection error', { error })
          throw new Error('Authentication failed')
        }
      },
    },
    wsServer
  )

  return { wsServer, serverCleanup }
}
