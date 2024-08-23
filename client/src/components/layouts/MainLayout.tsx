"use client";
import React from 'react';
import {
  LifeBuoy,
  SquareUser
} from "lucide-react"
import {
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog"
import TooltipDialogButton from "@/components/custom/TooltipDialog"

export default function MainLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="grid h-screen w-screen grid-cols-[53px_1fr]">
      {/* Bottom-left: Sidebar */}
      <aside className="flex flex-col border-r p-2">
        <nav className="mt-auto grid gap-1">
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

      {/* Bottom-right: Children */}
      <div className="overflow-auto p-4">
        {children}
      </div>
    </div>
  )
}
