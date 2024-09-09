import { WebSocketServer } from 'ws';
import { PubSub } from '@google-cloud/pubsub';
import { Redis } from 'ioredis';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const pubsub = new PubSub();
const redis = new Redis(process.env.REDIS_URL);

wss.on('connection', (ws) => {
  const clientId = generateClientId();
  redis.set(`client:${clientId}`, process.env.INSTANCE_ID);

  ws.on('close', () => {
    redis.del(`client:${clientId}`);
  });
});

pubsub.subscription('websocket-messages').on('message', async (message) => {
  const { clientId, data } = JSON.parse(message.data.toString());
  const instanceId = await redis.get(`client:${clientId}`);
  
  if (instanceId === process.env.INSTANCE_ID) {
    // Send message to the client
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  message.ack();
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});

function generateClientId(): string {
  return Math.random().toString(36).substr(2, 9);
}