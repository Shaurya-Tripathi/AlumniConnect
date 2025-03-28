import { Hash } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { ChatHeaderMember } from "./chat-header-profile";
import { cn } from "@/lib/utils";
import { SocketIndicator } from "../socket-indicator";

interface ChatHeaderProps {
    target: string;
}

export const ChatHeader = ({
    target
}: ChatHeaderProps) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-800 border-b-2">
            <MobileToggle/>
            
            <div className="w-1/4 ml-2"> {/* Added width constraint and slight margin */}
                <ChatHeaderMember target={target}/>
            </div>
            
            <div className="ml-auto flex items-center">
                <SocketIndicator/>
            </div>
        </div>
    );
}