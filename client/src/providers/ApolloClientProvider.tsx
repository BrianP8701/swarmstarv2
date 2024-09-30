import { PropsWithChildren, useCallback, useMemo } from 'react'
import { ApolloClient, ApolloProvider, createHttpLink, from, InMemoryCache, split } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { useAuth } from '@clerk/clerk-react'

interface Props {
  url: string
}

export const ApolloClientProvider = ({ children, url }: PropsWithChildren<Props>) => {
  const { getToken, isSignedIn } = useAuth()

  const httpLink = useMemo(() => createHttpLink({ uri: url, credentials: 'include' }), [url])

  const wsLink = new GraphQLWsLink(
    createClient({
      url: url.replace(/^http/, 'ws'),
      connectionParams: async () => {
        if (isSignedIn) {
          const token = await getToken()
          return {
            Authorization: `Bearer ${token}`,
          }
        }
        return {}
      },
    })
  )

  const getConnectionContext = useCallback(async () => {
    if (isSignedIn) {
      try {
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

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLink
  )

  const client = new ApolloClient({
    link: from([authLink, errorLink, splitLink]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
