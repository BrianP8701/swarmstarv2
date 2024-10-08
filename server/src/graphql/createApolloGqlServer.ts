import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { Server } from 'http'
import { Container } from 'inversify'
import { AuthenticatedRequest } from '../utils/auth/AuthRequest'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'

export interface ResolverContext {
  req: AuthenticatedRequest
  container: Container
}

export const createApolloGqlServer = (httpServer: Server): ApolloServer => {
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  return server
}
