// app/home/signin/page.tsx
"use client";
import Link from "next/link"
import { useState } from "react";
import { useRouter } from "next/navigation";

import { setUser } from '@/app/store/userSlice';
import { signinUser } from '@/api/authentication';
import { useDispatch } from 'react-redux';
import { ApiError } from "@/types/apiError";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectTheme } from "@/components/custom/SelectTheme"

export default function Signin() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSignin = async () => {
    console.log('Signin button clicked');
    setError('');
    try {
      console.log('Signing in...');
      const user = await signinUser(email, password);
      dispatch(setUser(user));
      console.log('Signin successful', user);
      router.push('/pages/copilot');
    } catch (error) {
      const typedError = error as ApiError;
      console.log('Signin failed:', typedError);
      setError(typedError.message);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] xl:min-h-[800px]">
      <div className="fixed top-4 right-4">
        <SelectTheme />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="button" onClick={handleSignin} className="w-full">
              Login
            </Button>
          </div>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
