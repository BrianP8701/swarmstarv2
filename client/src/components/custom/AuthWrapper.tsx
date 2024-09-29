import { Outlet } from 'react-router-dom';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { TooltipProvider } from "@radix-ui/react-tooltip";

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

export default AuthWrapper;
