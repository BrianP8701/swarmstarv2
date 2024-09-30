import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/utils/cn'
import { CheckIcon, Loader2Icon, PlusCircleIcon } from 'lucide-react'
import * as React from 'react'

type CommandCreateOption = {
  value: string
  label: string
  create: () => void
}

type CommandSectionProps = {
  title: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  selectedValues: Record<string, boolean>
  onSelectionChange: (selected: Record<string, boolean>) => void
  loading: boolean
  emptyMessage: string
  isRadio: boolean
  showSelectedAtTop?: boolean
  className?: string
  createOption?: CommandCreateOption
}

export function CommandSection({
  title,
  options,
  selectedValues,
  onSelectionChange,
  loading,
  emptyMessage,
  isRadio,
  className,
  createOption,
}: CommandSectionProps) {
  const handleSelect = (value: string) => {
    const newSelectedValues = { ...selectedValues }
    if (isRadio) {
      Object.keys(newSelectedValues).forEach(key => (newSelectedValues[key] = false))
    }
    newSelectedValues[value] = !newSelectedValues[value]
    onSelectionChange(newSelectedValues)
  }

  return (
    <Command className={className}>
      <CommandInput placeholder={title} />
      <CommandList>
        {loading ? (
          <div className='flex items-center justify-center h-20'>
            <Loader2Icon className='w-6 h-6 animate-spin' />
          </div>
        ) : options.length === 0 ? (
          <CommandEmpty>{emptyMessage}</CommandEmpty>
        ) : (
          <CommandGroup>
            {options.map(option => {
              const isSelected = selectedValues[option.value]
              const isCreateOption = option.value === createOption?.value
              return (
                <CommandItem
                  id={`option-${option.value}`}
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible',
                      isRadio ? 'rounded-full' : ''
                    )}
                  >
                    <CheckIcon className={cn('h-4 w-4')} />
                  </div>
                  {isCreateOption && <PlusCircleIcon className='w-4 h-4 mr-2 text-muted-foreground' />}
                  <span>{option.label}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
}
