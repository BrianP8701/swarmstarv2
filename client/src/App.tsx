import { PropsWithChildren } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-react'
import { TooltipProvider } from '@/components/ui/tooltip'
import './App.css'
import HomePage from './views/HomePage'
import { ApolloClientProvider } from './providers/ApolloClientProvider'
import AuthWrapper from './components/custom/AuthWrapper'
import { ThemeProvider } from './providers/ThemeProvider'

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
          <ThemeProvider>
            <TooltipProvider>
              {/* Remove the WebSocketHandler component from here */}
              {props.children}
            </TooltipProvider>
          </ThemeProvider>
        </ApolloClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  )
}

export default App
