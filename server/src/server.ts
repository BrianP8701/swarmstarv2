import 'reflect-metadata'

import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'

import { expressMiddleware } from '@apollo/server/express4'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import { container } from './utils/di/container'
import { ResolverContext, createApolloServer } from './graphql/createApolloServer'
import { checkAuthenticated } from './utils/auth/auth'
import { TraceContext } from './utils/logging/TraceContext'
import { PubSub } from '@google-cloud/pubsub';
import { Firestore } from '@google-cloud/firestore';

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

const startServer = async () => {
  const httpServer = createServer(app)
  const apolloServer = createApolloServer(httpServer)
  await apolloServer.start()

  // WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Use graphql-ws
  useServer(
    {
      schema: apolloServer.schema,
      context: async (ctx) => {
        // Add authentication here if needed
        return { req: ctx.extra.request, container };
      },
    },
    wsServer
  );

  // Implement subscription management using Firestore
  useServer(
    {
      schema: apolloServer.schema,
      onSubscribe: async (ctx, msg) => {
        const subscriptionId = generateUniqueId();
        await firestore.collection('subscriptions').doc(subscriptionId).set({
          operation: msg.payload.query,
          variables: msg.payload.variables,
          connectionId: ctx.connectionParams.connectionId,
        });
        return { subscriptionId };
      },
      onComplete: async (ctx, msg) => {
        await firestore.collection('subscriptions').doc(msg.subscriptionId).delete();
      },
    },
    wsServer
  );

  // Listen for events from PubSub
  pubsub.subscription('graphql-events').on('message', async (message) => {
    const event = JSON.parse(message.data.toString());
    const subscriptions = await firestore.collection('subscriptions').where('eventType', '==', event.type).get();
    
    subscriptions.forEach(async (sub) => {
      const { connectionId, operation, variables } = sub.data();
      // Execute the subscription operation and send the result over the WebSocket
      // You'll need to implement this part based on your specific setup
    });

    message.ack();
  });

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

  httpServer.listen(PORT)
}

startServer()
