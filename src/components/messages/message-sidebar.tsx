import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { MessageMember } from "./message-member"
import { MessageSearch } from "./message-search"
import { db } from "@/lib/db"

interface MessageSidebarProps {
  userId: string;
}

export const MessageSidebar = async ({
  userId
}:MessageSidebarProps) => {

  const user = await db.user.findUnique({
    where: {
      usrId: userId
    },
    select: {
      connectionIds: true
    }
  });

  // Store the connectionIds or default to empty array if user not found
  const connectedIds = user?.connectionIds || [];

  // Fetch connected users if needed
  const connectedUsers = await db.user.findMany({
    where: {
      usrId: {
        in: connectedIds
      }
    }
  });


    return (
      <div className="hidden md:flex fixed left-0 top-[65px] bottom-0 w-[350px] flex-col text-primary bg-blackborder-r z-40 bg-black text-white">
        
        <ScrollArea className="flex-1 px-3">
          <div className="mt-2">
            <MessageSearch/>
          </div>

          <Separator className="bg-zinc-800 rounded-md my-2"/>

          <div className="space-y-[2px]">
            {connectedIds.map((target) => (
               <MessageMember key={target} target={target}/>
            ))}
          </div>

        </ScrollArea>

      </div>
    )
  }