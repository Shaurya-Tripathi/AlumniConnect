import { Menu } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet"
import { Button } from "./ui/button"
import { MessageSidebar } from "./messages/message-sidebar"

export const MobileToggle = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <MessageSidebar/>
            </SheetContent>
        </Sheet>
    )
}