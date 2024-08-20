import { PropsWithChildren, useCallback, useMemo } from 'react'

import { ApolloClient, ApolloProvider, createHttpLink, from, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'

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

  const client = new ApolloClient({
    link: from([authLink, errorLink, httpLink]),
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
