import { ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { Button } from '../ui/button'

export const PopoverButton = React.forwardRef<
  HTMLButtonElement,
  {
    title?: string
    togglePopover?: () => void
    className?: string
  }
>(({ title, togglePopover, className }, ref) => (
  <Button
    className={`flex justify-between items-center ${className}`}
    ref={ref}
    size='sm'
    variant='outline'
    onClick={togglePopover}
  >
    <div className='overflow-hidden max-w-[180px] truncate text-left font-normal'>{title}</div>
    <ChevronsUpDown className='w-4 h-4 ml-2 flex-shrink-0' />
  </Button>
))

PopoverButton.displayName = 'PopoverButton'
