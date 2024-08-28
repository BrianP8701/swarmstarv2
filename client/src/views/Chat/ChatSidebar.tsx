import React from 'react';
import { Button } from '@/components/ui/button';

interface ChatSidebarProps {
    options: { value: string; label: string }[];
    onSelect: (value: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ options, onSelect }) => {
    return (
        <div className="bg-background h-full p-4 rounded-lg">
            <div className='mt-8'>
                {options.map((option) => (
                    <Button
                        key={option.value}
                        className="w-full justify-start py-2 px-4 hover:bg-accent hover:text-accent-foreground rounded"
                        onClick={() => onSelect(option.value)}
                        variant="ghost"
                    >
                        {option.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default ChatSidebar;