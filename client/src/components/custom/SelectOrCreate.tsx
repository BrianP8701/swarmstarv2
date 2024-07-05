import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SelectOrCreateProps {
  placeholder: string;
  newOptionPlaceholder: string;
  options: string[];
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  setOptions: React.Dispatch<React.SetStateAction<string[]>>;
}

const SelectOrCreate: React.FC<SelectOrCreateProps> = ({ placeholder, newOptionPlaceholder, options, setSelectedOption, setOptions }) => {
  const [newOption, setNewOption] = useState('');

  const handleCreateOption = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newOption.trim()) {
      const updatedOptions = [newOption, ...options];
      setOptions(updatedOptions);
      setSelectedOption(newOption);
      setNewOption('');
    }
  };

  return (
    <Select onValueChange={setSelectedOption}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={handleCreateOption}
            placeholder={newOptionPlaceholder}
          />
        </div>
        {options.map((option) => (
          <SelectItem key={option} value={option}>{option}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectOrCreate;
