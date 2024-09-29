import { ChatInput } from "./ChatInput";
import { Loader2Icon } from "lucide-react";
import { SwarmFragment } from "@/graphql/generated/graphql";
import { ChatMessages } from "./ChatMessages";

interface ChatContentProps {
    swarm: SwarmFragment | undefined;
    isDialogMode?: boolean;
    selectedChatId: string | null;
    sendMessageLoading: boolean;
    onSendMessage: (message: string) => void;
}

export function ChatContent({ swarm, isDialogMode, selectedChatId, sendMessageLoading, onSendMessage }: ChatContentProps) {
    return (
        <div className="flex flex-col h-full">
          {swarm === undefined ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2Icon className="animate-spin" size={32} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <ChatMessages selectedChatId={selectedChatId} isDialogMode={isDialogMode} />
            </div>
          )}
          <div className="w-full max-w-[800px] mx-auto px-4 pb-4">
            <ChatInput loading={sendMessageLoading} onSendMessage={onSendMessage} />
          </div>
        </div>
      );
  }
  