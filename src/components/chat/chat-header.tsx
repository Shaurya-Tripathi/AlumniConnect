import { Hash } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
// import { SocketIndicator } from "@/components/socket-indicator";


interface ChatHeaderProps{
    name: string;
    imageUrl?: string;
}

export const ChatHeader = ({
    name,
    imageUrl
}: ChatHeaderProps) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-800 border-b-2">
            <MobileToggle/>
            
            <UserAvatar
                src={imageUrl}
                className="h-8 w-8 md:h-8 md:w-8 mr-2"
            />
            <p className="font-semibold text-md text-white">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                {/* <SocketIndicator/> */}
            </div>
        </div>
    );
}