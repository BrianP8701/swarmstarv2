import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { PopoverButton } from './PopoverButton';
import { CheckIcon, PlusCircleIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectWithCreateProps {
  create: () => void;
  createMessage: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  className?: string;
  placeholder: string;
  selectedValue?: string;
}

const SelectWithCreate: React.FC<SelectWithCreateProps> = ({
  create,
  createMessage,
  options,
  onSelect,
  className,
  placeholder,
  selectedValue,
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

  const allOptions = [
    { value: 'create', label: createMessage },
    ...options
  ];

  const selectedOption = allOptions.find(option => option.value === selectedValue);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <PopoverButton
          selectedOptions={selectedOption ? [selectedOption] : []}
          title={placeholder}
          togglePopover={togglePopover}
          className={className}
        />
      </PopoverTrigger>
      <PopoverContent align='start' className={`p-0 relative ${className}`}>
        <Command>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {allOptions.map(option => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className={cn(
                    option.value === selectedValue && 'bg-accent'
                  )}
                >
                  {option.value === 'create' ? (
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                  ) : (
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        option.value === selectedValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                  )}
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
