import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { PopoverButton } from './PopoverButton';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectWithCreateProps {
  create: () => void;
  createMessage: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  className?: string;
  placeholder: string;
  selectedValue?: string;
  emptyMessage?: string;
}

const SelectWithCreate: React.FC<SelectWithCreateProps> = ({
  create,
  options,
  onSelect,
  className,
  placeholder,
  selectedValue,
  emptyMessage,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const togglePopover = () => setIsOpen(!isOpen);

  const handleSelect = (value: string) => {
    if (value === 'create') {
      create();
    } else {
      onSelect(value);
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <PopoverButton
          title={options.find(option => option.value === selectedValue)?.label ?? placeholder}
          togglePopover={togglePopover}
          className={className}
        />
      </PopoverTrigger>
      <PopoverContent align='start' className={`p-0 relative`}>
        <Command>
          <CommandInput placeholder="Search" create={create} />
          <CommandList>
            <CommandEmpty>{emptyMessage ?? 'No results found'}</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className={cn(
                    option.value === selectedValue && 'bg-accent'
                  )}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      option.value === selectedValue ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectWithCreate;