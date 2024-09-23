import { useEffect, useRef } from "react";
import ChatSidebar from "@/views/Chat/ChatSidebar";
import { ChatInput } from "./ChatInput";
import { Loader2Icon } from "lucide-react";
import { SwarmWithDataFragment, MessageRoleEnum } from "@/graphql/generated/graphql";

export interface ExpandedChatProps {
    chats: { value: string, label: string }[], 
    onChatChange: (value: string) => void, 
    swarm: SwarmWithDataFragment | undefined 
}

export function ExpandedChat({ chats, onChatChange, swarm }: ExpandedChatProps) {
  return (
    <div className="flex h-full w-full">
      <div className="w-64 h-full overflow-y-auto">
        <ChatSidebar options={chats} onSelect={onChatChange} />
      </div>
      <div className="flex-1">
        <ChatContent swarm={swarm} />
      </div>
    </div>
  );
}

interface Message {
  id: string;
  content: string;
  role: MessageRoleEnum;
}

interface UserMessageProps {
  content: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ content }) => (
  <div className="self-end w-[70%] mr-[5%] mb-5">
    <div className="bg-slate-700 rounded-lg p-3">
      {content}
    </div>
  </div>
);

interface AiMessageProps {
  content: string;
}

const AiMessage: React.FC<AiMessageProps> = ({ content }) => (
  <div className="self-center w-[90%] mb-5">
    <div className="text-left">
      {content}
    </div>
  </div>
);

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col justify-start overflow-y-auto border-red-500">
      {messages.map((message) => (
        message.role === MessageRoleEnum.User ? (
          <UserMessage key={message.id} content={message.content} />
        ) : (
          <AiMessage key={message.id} content={message.content} />
        )
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export function ChatContent({ swarm }: { swarm: SwarmWithDataFragment | undefined }) {
  const messages = [
    { id: "1", content: "Hello, how are you?", role: MessageRoleEnum.User },
    { id: "2", content: "I'm fine, thank you!", role: MessageRoleEnum.Assistant },
    { id: "3", content: "What is your name?", role: MessageRoleEnum.User },
    { id: "4", content: "The question about context on my mind right now is more of a question of typing. There are two kinds of context: Operational and Node context. At the moment context is stored as a JSON column. The reason for this was because all the arguments being passed between actions became messy. But having unknown types is even worst. We could imagine for each ActionEnum defining a Pydantic type for it's node level context and it's spawn operation context. What about action and termination operations? In the first iteration we decoupled by every blocking operation, which wasn't strictly necessary. Now the only time we consider a node being \"blocked\" is when it needs to perform a search. And for a search node it's when it needs to ask the user questions. Those are two very specific points in the system and other than that I believe we can count on not having to think of blocking operations? Yet that is not true. We can easily imagine there being many more blocking operations and we need a standard way to handle them. So I think we might want to consider bringing back the Blocking Operation. In fact now we only have one Blocking Operation. Performing a search is a Spawn Operation.", role: MessageRoleEnum.Assistant },
    { id: "5", content: "The question about context on my mind right now is more of a question of typing. There are two kinds of context: Operational and Node context. At the moment context is stored as a JSON column. The reason for this was because all the arguments being passed between actions became messy. But having unknown types is even worst. We could imagine for each ActionEnum defining a Pydantic type for it's node level context and it's spawn operation context. What about action and termination operations? In the first iteration we decoupled by every blocking operation, which wasn't strictly necessary. Now the only time we consider a node being \"blocked\" is when it needs to perform a search. And for a search node it's when it needs to ask the user questions. Those are two very specific points in the system and other than that I believe we can count on not having to think of blocking operations? Yet that is not true. We can easily imagine there being many more blocking operations and we need a standard way to handle them. So I think we might want to consider bringing back the Blocking Operation. In fact now we only have one Blocking Operation. Performing a search is a Spawn Operation.", role: MessageRoleEnum.Assistant },
  ];

  return (
    <div className="flex flex-col h-full border-red-500">
      {swarm === undefined ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2Icon className="animate-spin" size={32} />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4">
            <MessageList messages={messages} />
          </div>
        </div>
      )}
      <div className="w-full max-w-[800px] mx-auto p-4">
        <ChatInput />
      </div>
    </div>
  );
}
