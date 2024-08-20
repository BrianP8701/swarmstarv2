"use client";
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  LifeBuoy,
  SquareUser,
  DiamondIcon,
  Sparkle,
  Brain,
  Network
} from "lucide-react"
import SelectTheme from "@/src/components/custom/SelectTheme"
import { useRouter } from 'next/navigation';
import {
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/src/components/ui/dialog"
import { setCurrentPage, setCurrentSwarm } from "@/store/appSlice"
import { useDispatch } from "react-redux"
import TooltipDialogButton from "@/src/components/custom/TooltipDialog"
import TooltipButton from "@/src/components/custom/TooltipButton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const current_page = useSelector((state: RootState) => state.app.current_page);
  const chats = useSelector((state: RootState) => state.app.chats);
  const currentChat = useSelector((state: RootState) => state.app.current_chat);

  const handleSwarmChange = (value: string) => {
    dispatch(setCurrentSwarm(value));
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (current_page !== path) {
      dispatch(setCurrentPage(path));
    }
  }

  return (
    <div className="grid h-screen w-full pl-[53px]">
      <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-3">
          <Sparkle className="h-7 w-7" />
        </div>
        <nav className="grid gap-1 p-2">
          <TooltipButton tooltipText="Home" onClick={() => handleNavigation('/home')} ariaLabel="Home">
            <DiamondIcon className="size-5" />
          </TooltipButton>
          <TooltipButton tooltipText="Decisions" onClick={() => handleNavigation('/decisions')} ariaLabel="Decisions">
            <Network className="size-5" />
          </TooltipButton>
          <TooltipButton tooltipText="Memory" onClick={() => handleNavigation('/memory')} ariaLabel="Memory">
            <Brain className="size-5" />
          </TooltipButton>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <TooltipDialogButton tooltipText="Help" ariaLabel="Help" dialogContent={
            <DialogHeader>
              <DialogTitle>Looking for help?</DialogTitle>
              <DialogDescription>
                Text me directly at 929-386-6970, don&apos;t call. I&apos;ll repond as soon as I can.
              </DialogDescription>
            </DialogHeader>
          }>
            <LifeBuoy className="size-5" />
          </TooltipDialogButton>
          <TooltipDialogButton tooltipText="Account" ariaLabel="Account" dialogContent={<div>Account</div>}>
            <SquareUser className="size-5" />
          </TooltipDialogButton>
        </nav>
      </aside>
      <div className="flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
          <div className="flex-1 flex justify-end gap-2">
            <Select onValueChange={handleSwarmChange} value={currentChat || ""}>
              <SelectTrigger className="justify-end inline-flex min-w-[30px] max-w-[300px]">
                <SelectValue placeholder="Select Swarm" />
              </SelectTrigger>
              <SelectContent>
                {chats && chats.length > 0 ? (
                  chats.map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-chats" disabled>
                    No existing swarms.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <SelectTheme />
          </div>
        </header>
        <div className="flex-1 overflow-hidden">
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
