"use client";
import React from 'react';
import { Menu, HoveredLink } from '@/components/aceternity/navbar-menu';
import NeonButton from '@/components/aceternity/neon-button';
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentPage } from "@/app/store/appSlice";
import { SelectTheme } from "@/components/custom/SelectTheme"
import Image from 'next/image';
import moonxuDark from 'public/moonxu_dark.svg';
import moonxuLight from 'public/moonxu_light.svg';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const logoSrc = theme === 'dark' ? moonxuDark : moonxuLight;

    const handleClick = async () => {
        const isAuthenticated = true;

        if (isAuthenticated) {
            router.push('/copilot');
            dispatch(setCurrentPage('copilot'));
        } else {
            router.push('/signin');
            dispatch(setCurrentPage('/'));
        }
    };

    return (
        <div className="grid grid-rows-[auto_1fr] h-screen">
            <div className="fixed top-0 left-0 w-full h-24 flex items-center justify-between px-4">
                <div className="fixed top-6 left-6">
                    <Button variant="ghost" size="xl" aria-label="Home">
                        <Image src={logoSrc} alt="Logo" className="h-12 w-12" />
                    </Button>
                </div>
                <div className="fixed left-1/2 transform -translate-x-1/2">
                    <Menu>
                        <HoveredLink href="/landing/tools">Tools</HoveredLink>
                        <HoveredLink href="/landing/copilot">Copilot</HoveredLink>
                        <HoveredLink href="/landing/pricing">Pricing</HoveredLink>
                        <NeonButton onClick={handleClick} textSize='sm' paddingX='3' paddingY='1'>
                            Try Beta
                        </NeonButton>
                    </Menu>
                </div>
                <div className="fixed top-4 right-4">
                    <SelectTheme />
                </div>
            </div>
            <div className="flex items-center justify-center mt-24">
                {children}
            </div>
        </div>
    );
};

export default LandingLayout;
