import React from 'react';
import { Button } from '../components/ui/button';

interface ChatSidebarProps {
    options: { value: string; label: string }[];
    onSelect: (value: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ options, onSelect }) => {
    return (
        <div className="bg-background/50 h-full p-4">
            <div className='mt-6'>
                {options.map((option) => (
                    <Button
                        key={option.value}
                        className="w-full text-left py-2 px-4 hover:bg-muted-foreground rounded"
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