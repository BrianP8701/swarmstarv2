import { useEffect, useRef, useState } from "react";
import { MessageFragment, MessageRoleEnum, useFetchChatLazyQuery } from "@/graphql/generated/graphql";

interface UserMessageProps {
  content: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ content }) => (
  <div className="self-center w-[90%] max-w-[700px]">
    <div className="flex justify-end">
      <div className="inline-block bg-stone-700 rounded-3xl p-3 max-w-[77.78%] text-left">
        {content}
      </div>
    </div>
  </div>
);

interface AiMessageProps {
  content: string;
}

const AiMessage: React.FC<AiMessageProps> = ({ content }) => (
  <div className="self-center w-[90%] max-w-[700px]">
    <div className="text-left  rounded-3xl p-3">
      {content}
    </div>
  </div>
);

interface ChatMessagesProps {
  selectedChatId: string | null;
  isDialogMode?: boolean;
}

export function ChatMessages({selectedChatId, isDialogMode }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<MessageFragment[]>([])
  const [fetchChat, { data: chatData }] = useFetchChatLazyQuery()

  useEffect(() => {
    if (selectedChatId) {
      fetchChat({ variables: { id: selectedChatId } })
    }
  }, [selectedChatId, fetchChat]);

  useEffect(() => {
    if (chatData?.fetchChat) {
      setMessages(chatData.fetchChat.data?.messages ?? [])
    }
  }, [chatData])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const heightClass = isDialogMode ? "h-[calc(100vh-163px)]" : "h-[calc(100vh-200px)]"

  return (
    <div className={`flex flex-col justify-start overflow-y-auto mt-10 gap-4 ${heightClass}`}>
      {messages.map((message) => (
        message.role === MessageRoleEnum.User ? (
          <UserMessage key={message.id} content={message.content ?? ""} />
        ) : (
          <AiMessage key={message.id} content={message.content ?? ""} />
        )
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
