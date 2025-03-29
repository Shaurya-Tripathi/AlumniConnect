'use client';

import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useRef, ElementRef } from "react";

import { Message, User, Conversation } from "@prisma/client";
import { ChatItem } from "./chat-item";

const DATE_FORMAT = "d MMM yyyy, HH:mm";
import { format } from "date-fns"

type MessagesWithSender = Message & {
  sender: User;
  seen: User[];
  conversation: Conversation & {
    users: User[];
  };
}

interface ChatMessagesProps{
    current: string;
    target: string;
    chatId: string;
    apiUrl: string;
    paramKey: "conversationId";
    paramValue: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
}
export const ChatMessages = ({
    current,
    target,
    chatId,
    apiUrl,
    paramKey,
    paramValue,
    socketUrl,
    socketQuery
}: ChatMessagesProps) => {
  const queryKey = `chat:${target}`;
  const addKey = `chat:${target}:messages`;
  
  const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      status,
  } = useChatQuery({
      queryKey,
      apiUrl: "/api/direct-messages", // Adjust to match your API route
      paramValue: paramValue // Use the conversation ID
  });

    if (status === "pending"){ // loading is now changed to pending
        return (
          <div className="flex flex-col flex-1 justify-center items-center">
            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Loading messages...
            </p>
          </div>
        );
    }

    if (status === "error"){
        return (
          <div className="flex flex-col flex-1 justify-center items-center">
            <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Something went wrong!
            </p>
          </div>
        );
    }

    return(
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
          {!hasNextPage && <div className="flex-1"/>} 
          {hasNextPage && (
              <div className="flex justify-center">
                {isFetchingNextPage ? (
                  <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4"/>  
                ) : (
                  <button
                    onClick={() => fetchNextPage()}
                    className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
                  >
                    Load previous messages
                  </button>
                )}
              </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
              {data?.pages?.map((group, i) => (
                <Fragment key={i}>
                  {group.items.map((message: Message) => (
                    
                    <ChatItem
                      key={message.id}
                      id={message.id}
                      currentId={message.senderId}
                      content={message.body}
                      timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                      socketUrl={socketUrl}
                      socketQuery={socketQuery}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
        </div>
    )
}