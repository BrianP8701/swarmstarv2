import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useRouter } from "next/router";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Inter } from "next/font/google";
import './App.css';
import HomePage from './pages/home/page'; // Adjust the import path as necessary

const inter = Inter({ subsets: ["latin"] });

function App() {
  return (
    <ClerkProvider>
      <div className={inter.className}>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SignedOut><RedirectToSignIn /></SignedOut>} />
              <Route path="/home" element={<SignedIn><AuthWrapper><HomePage /></AuthWrapper></SignedIn>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </div>
    </ClerkProvider>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // const response = await fetch("/api/checkAuthStatus");
      // const data = await response.json();
      const isAuthenticated = true;

      if (isAuthenticated) {
        router.push("/home");
      } else {
        router.push("/home");
      }
    };

    checkAuthStatus();
  }, [router]);

  return <>{children}</>;
}

export default App;
