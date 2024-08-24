import { useState } from "react";
import { ChatInput } from "./ChatInput";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import ChatSidebar from "@/views/ChatSidebar";
import { Button } from "@/components/ui/button";

export default function Chat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentChat = "1"; // Temporary constant for currentChat
  const chats = [
    ["1", "Chat 1"],
    ["2", "Chat 2"],
  ]; // Temporary constant for chats

  const handleChatChange = (value: string) => {
    console.log("Selected chat:", value);
  };

  return (
    <div className="relative flex h-full">
      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-2 left-2 z-30 px-1 py-2"
        variant="ghost"
      >
        {isSidebarOpen ? <PanelRightClose size={26} /> : <PanelRightOpen size={26} />}
      </Button>
      <div className={`absolute top-0 left-0 h-full transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <ChatSidebar
          options={chats.map(([value, label]) => ({ value, label }))}
          onSelect={handleChatChange}
        />
      </div>
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1">
          {/* Chat messages will go here */}
        </div>
        <div className="w-full max-w-[800px] mx-auto">
          <ChatInput />
        </div>
      </div>
    </div>
  )
}