import { useState } from "react";
import { Expand, PanelRightOpen, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ExpandedChat, ChatContent } from "./ChatUtils";
import ChatSidebar from "@/views/Chat/ChatSidebar";
import { SwarmWithDataFragment } from "@/src/graphql/generated/graphql";

export interface ChatProps {
  swarm: SwarmWithDataFragment | undefined
}

export default function Chat({ swarm }: ChatProps) {
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
      <ChatContent swarm={swarm} />
      <Dialog>
        <DialogTrigger asChild>
          <Button className="absolute top-2 right-2 px-1 py-2 z-30" variant="ghost">
            <Expand size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] h-[95vh] max-w-full p-0 bg-secondary">
          <div className="w-full h-full">
            <ExpandedChat chats={chats} onChatChange={handleChatChange} swarm={swarm} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
