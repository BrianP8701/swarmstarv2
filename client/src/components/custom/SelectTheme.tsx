"use client"

import * as React from "react"
import { Palette } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SelectTheme() {
  const { setTheme, resolvedTheme } = useTheme()

  React.useEffect(() => {
    if (resolvedTheme) {
      document.documentElement.classList.forEach(className => {
        if (className.endsWith('_theme')) {
          document.documentElement.classList.remove(className)
        }
      })
      document.documentElement.classList.add(resolvedTheme)
    }
  }, [resolvedTheme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("snow_theme")}>
          Snow
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("midnight")}>
          Midnight
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("ice")}>
          Ice
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("volcano")}>
          Volcano
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("elixir")}>
          Elixir
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("forest")}>
          Forest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("concrete")}>
          Concrete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("green_theme")}>
          Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("red_theme")}>
          Red
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("blue_theme")}>
          Blue
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("purple_theme")}>
          Purple
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
