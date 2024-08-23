import { PropsWithChildren } from "react";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { ClerkProvider, ClerkLoaded, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { TooltipProvider } from "@radix-ui/react-tooltip";
import './App.css';
import NewHomePage from './pages/newHome/HomePage';
import { ApolloClientProvider } from "./providers/ApolloClientProvider";
import MainLayout from "@/components/layouts/MainLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route element={<AuthWrapper />}>
            <Route element={<NewHomePage />} path='/' index />
          </Route>
          <Route element={<Navigate to='/' />} path='/*' />
        </Routes>
      </Providers>
    </BrowserRouter>
  )
}

const Providers = (props: PropsWithChildren<NonNullable<unknown>>) => {
  const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ClerkLoaded>
        <ApolloClientProvider url={import.meta.env.VITE_REACT_APP_GRAPHQL_URL!}>
          <TooltipProvider>
            <MainLayout>
              {props.children}
            </MainLayout>
          </TooltipProvider>
        </ApolloClientProvider>
      </ClerkLoaded>
    </ClerkProvider >
  )
}

const AuthWrapper = () => {
  return (
    <>
      <SignedIn>
        <TooltipProvider>
          <Outlet />
        </TooltipProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

export default App;
