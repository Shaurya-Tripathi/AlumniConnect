import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { getOrCreateConversation } from "@/lib/conversation";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ChatPageProps{
    params: {
        userId: string;
        targetId: string;
    }
}

const chatPage = async ({
    params
}: ChatPageProps) => {
    const awaitedParams = await params;

    const conversation = await getOrCreateConversation(awaitedParams.userId, awaitedParams.targetId);

    if(!conversation){
        // to create user model for users who have not used messages yet
        return redirect(`/${awaitedParams.userId}/messages`);
    }

    return (
        <div className="bg-[#04060d] flex flex-col h-[calc(100vh-64px)]">
            <ChatHeader
                target={awaitedParams.targetId}
            />
            <ChatMessages 
                current={awaitedParams.userId}
                target={awaitedParams.targetId}
                chatId={conversation.id}
                apiUrl="api/direct-messages"
                paramKey="conversationId"
                paramValue={conversation.id}
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                    conversationId: conversation.id
                }}
            />
            <div className="p-4 bg-[#383a40]">
                <ChatInput 
                targetId={awaitedParams.targetId}
                apiUrl="/api/socket/messages"
                query={{
                    conversationId: conversation.id
                  }}
                />
            </div>
        </div>
    )
}

export default chatPage;