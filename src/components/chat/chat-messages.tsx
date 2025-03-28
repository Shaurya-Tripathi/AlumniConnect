'use client';

import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";

interface ChatMessagesProps{
    current: string;
    target: string;
    chatId: string;
    apiUrl: string;
    paramValue: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
}
export const ChatMessages = ({
    current,
    target,
    chatId,
    apiUrl,
    paramValue,
    socketUrl,
    socketQuery
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;

    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        status,
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramValue
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
            <div className="flex-1"/>
            Chat Messages
        </div>
    )
}