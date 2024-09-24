import { PropsWithChildren, useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-react';
import { TooltipProvider } from "@radix-ui/react-tooltip";
import './App.css';
import HomePage from './views/HomePage';
import { ApolloClientProvider } from "./providers/ApolloClientProvider";
import MainLayout from "@/components/layouts/MainLayout";
import AuthWrapper from "./components/custom/AuthWrapper";
import { useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';

const MESSAGE_RECEIVED_SUBSCRIPTION = gql`
  subscription OnMessageReceived($userId: ID!) {
    messageReceived(userId: $userId) {
      id
      content
      userId
    }
  }
`;

const App = () => {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route element={<AuthWrapper />}>
            <Route element={<HomePage />} path='/' index />
          </Route>
        </Routes>
      </Providers>
    </BrowserRouter>
  )
}

const Providers = (props: PropsWithChildren<NonNullable<unknown>>) => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ClerkLoaded>
        <ApolloClientProvider url={import.meta.env.VITE_GRAPHQL_URL}>
          <TooltipProvider>
            <MainLayout>
              <WebSocketHandler />
              {props.children}
            </MainLayout>
          </TooltipProvider>
        </ApolloClientProvider>
      </ClerkLoaded>
    </ClerkProvider >
  )
}

const WebSocketHandler = () => {
  const { isSignedIn, getToken, userId } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      const connectWebSocket = async () => {
        const token = await getToken();
        const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          console.log("Received message:", message);
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed");
        };
      };

      connectWebSocket();
    }
  }, [isSignedIn, getToken]);

  useSubscription(MESSAGE_RECEIVED_SUBSCRIPTION, {
    variables: { userId },
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("Subscription data:", subscriptionData);
    },
  });

  return null;
}

export default App;