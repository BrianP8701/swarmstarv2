import { useState, useEffect } from "react";
import { ChatInput } from "./ChatInput";
import { PanelRightOpen, PanelRightClose, Expand } from "lucide-react";
import ChatSidebar from "@/views/ChatSidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export default function Chat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chats = [
    { value: "1", label: "Chat 1" },
    { value: "2", label: "Chat 2" },
  ]; // Temporary constant for chats

  const handleChatChange = (value: string) => {
    console.log("Selected chat:", value);
  };

  return (
    <div className="relative flex h-full flex-col rounded-xl bg-secondary">
      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-2 left-2 px-1 py-2 z-30"
        variant="ghost"
      >
        {isSidebarOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
      </Button>
      <div className={`z-20 absolute top-0 left-0 h-full transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <ChatSidebar
          options={chats}
          onSelect={handleChatChange}
        />
      </div>
      <div className="z-10 flex-1 flex flex-col p-4">
        <div className="flex-1 relative">
          {/* Chat messages will go here */}
        </div>
        <div className="w-full max-w-[800px] mx-auto relative">
          <ChatInput />
        </div>
      </div>
      <Button
        className="absolute top-2 right-2 px-1 py-2 z-30"
        variant="ghost"
      >
        <Dialog>
          <DialogTrigger>
            <Expand size={20} />
          </DialogTrigger>
          <DialogContent className="w-[95vw] h-[95vh] max-w-full p-0 bg-secondary">
            <ExpandedChat chats={chats} onChatChange={handleChatChange} />
          </DialogContent>
        </Dialog>
      </Button>
    </div>
  )
}

function ExpandedChat({ chats, onChatChange }: { chats: { value: string, label: string }[], onChatChange: (value: string) => void }) {
  const { width } = useWindowSize();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setIsSidebarOpen(width > 768); // Adjust this breakpoint as needed
  }, [width]);

  return (
    <div className="flex h-full">
      {width <= 768 && (
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-2 left-2 px-1 py-2 z-30"
          variant="ghost"
        >
          {isSidebarOpen ? <PanelRightClose size={22} /> : <PanelRightOpen size={22} />}
        </Button>
      )}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} h-full overflow-y-auto transition-all duration-300`}>
        <ChatSidebar
          options={chats}
          onSelect={onChatChange}
        />
      </div>
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 relative">
          {/* Chat messages will go here */}
        </div>
        <div className="w-full max-w-[800px] mx-auto relative">
          <ChatInput />
        </div>
      </div>
    </div>
  )
}