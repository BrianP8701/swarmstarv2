import { useEffect, useRef } from "react";
import {
  MessageRoleEnum,
  NewMessageDocument,
  useFetchChatQuery,
  NewMessageSubscription,
  FetchChatQuery,
} from "@/graphql/generated/graphql";

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

export function ChatMessages({ selectedChatId, isDialogMode }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data, subscribeToMore } = useFetchChatQuery({
    variables: { chatId: selectedChatId ?? '' },
    skip: !selectedChatId,
  });

  useEffect(() => {
    if (selectedChatId) {
      const subscribeToNewMessages = subscribeToMore<NewMessageSubscription>({
        document: NewMessageDocument,
        variables: { chatId: selectedChatId ?? '' },
        updateQuery: (prev: FetchChatQuery, { subscriptionData }) => {
          if (!subscriptionData.data?.messageSent) return prev;
          const newMessage = subscriptionData.data.messageSent;

          return {
            ...prev,
            chat: prev.chat
              ? {
                ...prev.chat,
                messages: [
                  ...(prev.chat.messages?.filter(Boolean) || []),
                  newMessage,
                ].filter((message): message is NonNullable<typeof message> =>
                  message !== null && message !== undefined
                ),
              }
              : null,
          };
        },
      });

      return () => subscribeToNewMessages();
    }
  }, [selectedChatId, subscribeToMore]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [data?.chat?.messages])

  const heightClass = isDialogMode ? "h-[calc(100vh-163px)]" : "h-[calc(100vh-200px)]"

  const messages = data?.chat?.messages || [];

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
