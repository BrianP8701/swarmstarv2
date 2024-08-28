import { createContext } from "react";
import { Outlet } from 'react-router-dom';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useFetchUserQuery, UserTypeEnum } from "../../graphql/generated/graphql";

export const IsAdminContext = createContext<boolean>(false)

const AuthWrapper = () => {

  const { data: user } = useFetchUserQuery()
  const isAdmin = user?.fetchUser?.type === UserTypeEnum.Admin

  return (
    <IsAdminContext.Provider value={isAdmin}>
      <SignedIn>
        <TooltipProvider>
          <Outlet />
        </TooltipProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </IsAdminContext.Provider>
  )
}

export default AuthWrapper;
