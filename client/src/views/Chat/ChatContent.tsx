import { ChatInput } from "./ChatInput";
import { Loader2Icon } from "lucide-react";
import { SwarmWithDataFragment, MessageRoleEnum } from "@/graphql/generated/graphql";
import { ChatMessages } from "./ChatMessages";

export function ChatContent({ swarm, isDialogMode }: { swarm: SwarmWithDataFragment | undefined, isDialogMode?: boolean }) {
    const messages = [
      { id: "1", content: "Hello, how are you?", role: MessageRoleEnum.User },
      { id: "2", content: "I'm fine, thank you!", role: MessageRoleEnum.Assistant },
      { id: "3", content: "What is your name?", role: MessageRoleEnum.User },
      { id: "4", content: "The question about context on my mind right now is more of a question of typing. There are two kinds of context: Operational and Node context. At the moment context is stored as a JSON column. The reason for this was because all the arguments being passed between actions became messy. But having unknown types is even worst. We could imagine for each ActionEnum defining a Pydantic type for it's node level context and it's spawn operation context. What about action and termination operations? In the first iteration we decoupled by every blocking operation, which wasn't strictly necessary. Now the only time we consider a node being \"blocked\" is when it needs to perform a search. And for a search node it's when it needs to ask the user questions. Those are two very specific points in the system and other than that I believe we can count on not having to think of blocking operations? Yet that is not true. We can easily imagine there being many more blocking operations and we need a standard way to handle them. So I think we might want to consider bringing back the Blocking Operation. In fact now we only have one Blocking Operation. Performing a search is a Spawn Operation.", role: MessageRoleEnum.Assistant },
      { id: "5", content: "The question about context on my mind right now is more of a question of typing. There are two kinds of context: Operational and Node context. At the moment context is stored as a JSON column. The reason for this was because all the arguments being passed between actions became messy. But having unknown types is even worst. We could imagine for each ActionEnum defining a Pydantic type for it's node level context and it's spawn operation context. What about action and termination operations? In the first iteration we decoupled by every blocking operation, which wasn't strictly necessary. Now the only time we consider a node being \"blocked\" is when it needs to perform a search. And for a search node it's when it needs to ask the user questions. Those are two very specific points in the system and other than that I believe we can count on not having to think of blocking operations? Yet that is not true. We can easily imagine there being many more blocking operations and we need a standard way to handle them. So I think we might want to consider bringing back the Blocking Operation. In fact now we only have one Blocking Operation. Performing a search is a Spawn Operation.", role: MessageRoleEnum.User },
    ];
  
    return (
        <div className="flex flex-col h-full">
          {swarm === undefined ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2Icon className="animate-spin" size={32} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <ChatMessages messages={messages} isDialogMode={isDialogMode} />
            </div>
          )}
          <div className="w-full max-w-[800px] mx-auto px-4 pb-4">
            <ChatInput />
          </div>
        </div>
      );
  }
  