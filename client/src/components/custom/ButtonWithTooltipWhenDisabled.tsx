import { Button, ButtonProps } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/utils/cn'

interface ButtonWithTooltipWhenDisabledProps extends ButtonProps {
  onClick: () => void
  tooltipText: string
  ariaLabel: string
  disabled: boolean
}

export default function ButtonWithTooltipWhenDisabled({
  children,
  className,
  variant = 'ghost',
  size = 'icon',
  ariaLabel,
  onClick,
  tooltipText,
  disabled,
}: ButtonWithTooltipWhenDisabledProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick()
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(className, disabled && 'cursor-not-allowed')}
          aria-label={ariaLabel}
          onClick={handleClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      {disabled && (
        <TooltipContent side='right' sideOffset={5}>
          {tooltipText}
        </TooltipContent>
      )}
    </Tooltip>
  )
}
