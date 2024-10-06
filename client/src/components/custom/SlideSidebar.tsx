import React from 'react'
import { Button } from '@/components/ui/button'

interface ChatSidebarProps {
  options: { value: string; label: string }[]
  selectedOptionId: string | null
  setSelectedOptionId: (value: string | null) => void
}

const SlideSidebar: React.FC<ChatSidebarProps> = ({ options, selectedOptionId, setSelectedOptionId }) => {
  return (
    <div className='bg-background h-full p-4 rounded-xl'>
      <div className='mt-8'>
        {options.map(option => (
          <Button
            key={option.value}
            className={`w-full justify-start py-2 px-4 hover:bg-accent hover:text-accent-foreground rounded-xl ${selectedOptionId === option.value ? 'bg-accent text-accent-foreground' : ''}`}
            onClick={() => setSelectedOptionId(option.value)}
            variant='ghost'
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default SlideSidebar
