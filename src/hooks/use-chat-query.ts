import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
    queryKey: string;
    apiUrl: string;
    paramValue: string;
};

export const useChatQuery = ({
    queryKey,
    apiUrl,
    paramValue
}: ChatQueryProps) => {
    const { isConnected } = useSocket();

    const fetchMessages = async ({ pageParam = undefined }) => {
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
              cursor: pageParam,
              conversationId: paramValue, // Add conversationId to the query
            }
        },
        { skipNull: true });

        const res = await fetch(url);
        return res.json();
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: [queryKey, paramValue], // Include paramValue in queryKey
        queryFn: fetchMessages,
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval:  1000,
    });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    };
}