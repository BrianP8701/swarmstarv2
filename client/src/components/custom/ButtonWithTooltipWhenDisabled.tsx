import { Button, ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ButtonWithTooltipWhenDisabledProps extends ButtonProps {
  onClick: () => void;
  tooltipText: string;
  ariaLabel: string;
  disabled: boolean;
}

export default function ButtonWithTooltipWhenDisabled({ 
  children, 
  className, 
  variant = "ghost", 
  size = "icon", 
  ariaLabel, 
  onClick, 
  tooltipText, 
  disabled 
}: ButtonWithTooltipWhenDisabledProps) {
  const button = (
    <Button
      variant={variant}
      size={size}
      className={className}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );

  if (!disabled) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {button}
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}
