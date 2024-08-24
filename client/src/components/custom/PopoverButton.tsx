import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/seperator'
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
    {selectedOptions.length > 0 && (
      <>
        <Separator className='h-4 mx-2' orientation='vertical' />
        <Badge className='px-1 font-normal rounded-sm lg:hidden' variant='secondary'>
          {selectedOptions.length}
        </Badge>
        <div className='hidden space-x-1 lg:flex'>
          {selectedOptions.length > 1 ? (
            <Badge className='px-1 font-normal rounded-sm overflow-hidden max-w-[140px] truncate' variant='secondary'>
              {selectedOptions.length} selected
            </Badge>
          ) : (
            selectedOptions.map(option => (
              <Badge
                className='px-1 font-normal rounded-sm overflow-hidden max-w-[140px] truncate'
                key={option.value}
                variant='secondary'
              >
                {option.label}
              </Badge>
            ))
          )}
        </div>
      </>
    )}
  </Button>
))

PopoverButton.displayName = 'PopoverButton'
