import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";

const chatPage = async ({params}:{params:{targetId: string}}) => {
    const awaitedParams = await params;
    return (
        <div className="bg-[#04060d] flex flex-col h-[calc(100vh-64px)]">
            <ChatHeader
                imageUrl={"khe"}
                name={"King"}
            />
            <div className="flex-1 bg-[#040d1f] overflow-hidden text-gray-300">future messages</div>
            <div className="p-4 bg-[#383a40]">
                <ChatInput targetId={awaitedParams.targetId}/>
            </div>
        </div>
    )
}

export default chatPage;