import React from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface TooltipDialogButtonProps extends ButtonProps {
  tooltipText: string;
  ariaLabel: string;
  dialogContent: React.ReactNode;
}

export default function TooltipDialogButton({ children, className, variant = "ghost", size = "icon", ariaLabel, tooltipText, dialogContent }: TooltipDialogButtonProps) {
  return (
    <Tooltip>
      <Dialog>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              className={className}
              aria-label={ariaLabel}
            >
              {children}
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <DialogContent>
          {dialogContent}
        </DialogContent>
      </Dialog>
      <TooltipContent side="right" sideOffset={5}>
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}