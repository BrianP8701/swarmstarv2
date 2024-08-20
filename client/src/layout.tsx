// app/layout.tsx
'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { usePathname } from 'next/navigation'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  RedirectToSignIn
} from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className={inter.className}>
            <TooltipProvider>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
              <SignedIn>
                <UserButton />
                <AuthWrapper>{children}</AuthWrapper>
              </SignedIn>
            </TooltipProvider>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // const response = await fetch("/api/checkAuthStatus");
      // const data = await response.json();
      const isAuthenticated = true;

      if (isAuthenticated) {
      } else {
        router.push("/signup")
      }
    };

    checkAuthStatus();
  }, [router, pathName]);

  return <>{children}</>;
}
