import React from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TooltipButtonProps extends ButtonProps {
    onClick: () => void;
    tooltipText: string;
    ariaLabel: string;
  }

export default function TooltipButton({ children, className, variant = "ghost", size = "icon", ariaLabel, onClick, tooltipText }: TooltipButtonProps) {
    return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          aria-label={ariaLabel}
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}
