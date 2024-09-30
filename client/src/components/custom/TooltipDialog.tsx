import React, { useState } from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface TooltipDialogButtonProps extends ButtonProps {
  tooltipText: string
  ariaLabel: string
  dialogContent: React.ReactNode
}

export default function TooltipDialogButton({
  children,
  className,
  variant = 'ghost',
  size = 'icon',
  ariaLabel,
  tooltipText,
  dialogContent,
}: TooltipDialogButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={className}
            aria-label={ariaLabel}
            onClick={() => setIsDialogOpen(true)}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side='right' sideOffset={5}>
          {tooltipText}
        </TooltipContent>
      </Tooltip>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>{dialogContent}</DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
