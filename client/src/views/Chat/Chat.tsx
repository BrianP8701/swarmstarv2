import { useState } from "react";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatContent } from "./ChatContent";
import ChatSidebar from "@/views/Chat/ChatSidebar";
import { SwarmWithDataFragment } from "@/src/graphql/generated/graphql";

export interface ChatProps {
  swarm: SwarmWithDataFragment | undefined
  isDialogMode?: boolean;
}

export default function Chat({ swarm, isDialogMode }: ChatProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chats = [
    { value: "1", label: "Chat 1" },
    { value: "2", label: "Chat 2" },
  ];

  const handleChatChange = (value: string) => {
    console.log("Selected chat:", value);
  };

  return (
    <div className="relative flex flex-col h-full rounded-xl bg-secondary">
      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-2 left-2 px-1 py-2 z-30"
        variant="ghost"
      >
        {isSidebarOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
      </Button>
      <div className={`z-20 absolute top-0 left-0 h-full transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <ChatSidebar options={chats} onSelect={handleChatChange} />
      </div>
      <ChatContent swarm={swarm} isDialogMode={isDialogMode} />
    </div>
  );
}
