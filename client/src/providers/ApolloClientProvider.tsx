import { PropsWithChildren, useCallback, useMemo } from 'react'

import { ApolloClient, ApolloProvider, createHttpLink, from, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

import { useAuth } from '@clerk/clerk-react'

interface Props {
  url: string
}

export const ApolloClientProvider = ({ children, url }: PropsWithChildren<Props>) => {
  const { getToken, isSignedIn } = useAuth()
  const httpLink = useMemo(() => createHttpLink({ uri: url, credentials: 'include' }), [url])

  const getConnectionContext = useCallback(async () => {
    if (isSignedIn) {
      try {
        // Fetch a new token for each request
        const token = await getToken()
        return {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      } catch {
        return undefined
      }
    }
    return undefined
  }, [isSignedIn, getToken])

  const authLink = useMemo(() => setContext(getConnectionContext), [getConnectionContext])

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) graphQLErrors.forEach(error => console.log(error))
    if (networkError) {
      console.log(`[Network error]: ${networkError}`)
    }
  })

  const wsLink = new GraphQLWsLink(createClient({
    url: url.replace('http', 'ws'),
    connectionParams: async () => {
      if (isSignedIn) {
        const token = await getToken();
        return { Authorization: `Bearer ${token}` };
      }
      return {};
    },
  }));

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  const client = new ApolloClient({
    link: from([authLink, errorLink, splitLink]),
    uri: url,
    cache: new InMemoryCache({
      typePolicies: {
        StripeQuery: { keyFields: [] },
        NoticeQuery: { keyFields: [] },
        User: { keyFields: [] },
      },
    }),
    connectToDevTools: true,
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
