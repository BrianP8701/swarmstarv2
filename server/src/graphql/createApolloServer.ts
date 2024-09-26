import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Server } from 'http';
import { Container } from 'inversify';
import { AuthenticatedRequest } from '../utils/auth/AuthRequest';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { checkAuthenticated } from '../utils/auth/auth';
import { Response } from 'express'; // Add this import

export interface ResolverContext {
  req: AuthenticatedRequest;
  container: Container;
}

export const createApolloServer = (httpServer: Server): ApolloServer => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  useServer({
    schema,
    context: async (ctx) => {
      const token = (ctx.connectionParams as { Authorization?: string })?.Authorization?.split(' ')[1];
      if (!token) {
        throw new Error('Authentication failed: No token provided');
      }
      const req = { 
        headers: { authorization: `Bearer ${token}` }
      } as AuthenticatedRequest;
      const res = {} as Response; // This should now use the correct type
      const next = () => {};

      await checkAuthenticated(req, res, next);
      return { userId: req.auth?.userId };
    },
  }, wsServer);

  return server;
};
