'use client'

import { Palette } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function SelectTheme() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <Palette className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('snow')}>Snow</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('midnight')}>Midnight</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('neutral')}>Neutral</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('ice')}>Ice</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('volcano')}>Volcano</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('green')}>Green</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('elixir')}>Elixir</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('forest')}>Forest</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('red')}>Red</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('blue')}>Blue</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('purple')}>Purple</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('concrete')}>Concrete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
