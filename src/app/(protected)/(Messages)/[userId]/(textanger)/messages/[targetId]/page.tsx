import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
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
        return redirect(`/${awaitedParams.userId}/messages`);
    }

    return (
        <div className="bg-[#04060d] flex flex-col h-[calc(100vh-64px)]">
            <ChatHeader
                target={awaitedParams.targetId}
            />
            <div className="flex-1 bg-[#040d1f] overflow-hidden text-gray-300">future messages</div>
            <div className="p-4 bg-[#383a40]">
                <ChatInput targetId={awaitedParams.targetId}/>
            </div>
        </div>
    )
}

export default chatPage;