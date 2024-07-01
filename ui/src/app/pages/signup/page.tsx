// app/home/signup/page.tsx
'use client'
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setUser } from '@/app/store/userSlice';
import { useDispatch } from 'react-redux';
import { signupUser } from '@/api/authentication';
import { ApiError } from "@/types/apiError";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectTheme } from "@/components/custom/SelectTheme"

export default function Signup() {
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false);
    const [isLastNameEmpty, setIsLastNameEmpty] = useState(false);
    const [isEmailEmpty, setIsEmailEmpty] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
    const [isConfirmPasswordEmpty, setIsConfirmPasswordEmpty] = useState(false);
    const [isPhoneEmpty, setIsPhoneEmpty] = useState(false);

    const router = useRouter(); // for routing

    const validateForm = () => {
        let isValid = true;
        let errorMessage = ''; // Use a local variable to accumulate error messages

        setIsFirstNameEmpty(!firstName);
        setIsLastNameEmpty(!lastName);
        setIsEmailEmpty(!email);
        setIsPasswordEmpty(!password);
        setIsConfirmPasswordEmpty(!confirmPassword);
        setIsPhoneEmpty(!phone);

        if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
            errorMessage = 'Fill out required fields';
            isValid = false;
        }

        if (password !== confirmPassword) {
            if (errorMessage) errorMessage += '\nPasswords do not match';
            else errorMessage = 'Passwords do not match';
            isValid = false;
        }

        setError(errorMessage); // Set the error state once at the end with the accumulated message
        return isValid;
    };

    const handleSignup = async () => {
        console.log('Signup button clicked');
        if (validateForm()) {
            setError('');
            try {
                const user = await signupUser(email, password, firstName, middleName, lastName, phone);
                dispatch(setUser(user));
                console.log('Signup successful', user);
                router.push('/pages/copilot'); // Redirect to dashboard upon success
            } catch (error) {
                const typedError = error as ApiError;
                setError(typedError.message || 'Signup failed');
            }
        }
    };

    return (
        <div className="w-full lg:grid lg:min-h-[600px] xl:min-h-[800px] relative">
            <div className="fixed top-4 right-4">
                <SelectTheme />
            </div>
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[380px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Sign up</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your details below to create an account
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first-name" className={isFirstNameEmpty ? 'error-color' : ''}>First name</Label>
                            <Input
                                id="first-name"
                                placeholder="Max"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="middle-name">Middle name</Label>
                            <Input
                                id="middle-name"
                                placeholder="Max"
                                required
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last-name" className={isLastNameEmpty ? 'error-color' : ''}>Last name</Label>
                            <Input
                                id="last-name"
                                placeholder="Robinson"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className={isEmailEmpty ? 'error-color' : ''}>Email</Label>
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
                            <Label htmlFor="phone" className={isPhoneEmpty ? 'error-color' : ''}>Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="123-456-7890"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className={isPasswordEmpty ? 'error-color' : ''}>Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-password" className={isConfirmPasswordEmpty ? 'error-color' : ''}>Confirm password</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <Button type="button" onClick={handleSignup} className="w-full">
                        Create an account
                    </Button>
                    {/* <Button variant="outline" className="w-full">
                        Sign up with Gmail
                    </Button> */}
                    {error.split('\n').map((line, index) => (
                        <p key={index} className="text-red-500 text-center text-sm">{line}</p>
                    ))}                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/signin" className="underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
