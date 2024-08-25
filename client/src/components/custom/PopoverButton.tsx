import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { Button } from '../ui/button'

export const PopoverButton = React.forwardRef<
  HTMLButtonElement,
  {
    title?: string
    selectedOptions: { label: string; value: string }[]
    togglePopover?: () => void
    className?: string
  }
>(({ title, selectedOptions, togglePopover, className }, ref) => (
  <Button
    className={className}
    ref={ref}
    size='sm'
    variant='outline'
    onClick={togglePopover}
  >
    <ChevronDown className='w-4 h-4 mr-2' />
    <div className='overflow-hidden max-w-[180px] truncate'>{title}</div>
  </Button>
))

PopoverButton.displayName = 'PopoverButton'
