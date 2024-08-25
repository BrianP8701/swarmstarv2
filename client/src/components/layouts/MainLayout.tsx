"use client";
import React from 'react';
import { Settings } from "lucide-react"
import TooltipDialogButton from "@/components/custom/TooltipDialog"

export default function MainLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="grid h-screen w-screen grid-cols-[53px_1fr]">
      {/* Bottom-left: Sidebar */}
      <aside className="flex flex-col border-r p-2">
        <nav className="mt-auto grid gap-1">
          <TooltipDialogButton tooltipText="Settings" ariaLabel="Settings" dialogContent={<div>Account</div>}>
            <Settings className="size-5" />
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
