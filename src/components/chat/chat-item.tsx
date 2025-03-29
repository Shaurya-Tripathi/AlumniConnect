'use client'

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

import { firestore } from "@/lib/firebase";
import { doc, getDoc } from 'firebase/firestore';
import { getUserById } from "@/lib/getUserById";
interface ChatItemProps {
    id: string;
    currentId: string;
    content: string;
    timestamp: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

export const ChatItem = ({
    id,
    currentId,
    content,
    timestamp,
    socketUrl,
    socketQuery
}: ChatItemProps) => {

    const pathSegments = window.location.pathname.split("/");
    const userId = pathSegments[1];  // First segment after domain
    const targetId = pathSegments[3]; // Third segment (after "messages")

    const [message, setMessage] = useState(content);
    const formattedTime = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

    const [loggedUser, setLoggedUser] = useState<{ name: string; avatar: string; email: string, } | null>(null);
    const [otherUser, setOtherUser] = useState<{ name: string; avatar: string; email: string, } | null>(null);

    const [sanji, setSanji] = useState<string>("");

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await getUserById(userId);
            if (id) setSanji(id);
        };

        fetchUserId();
    }, [userId]);

    const isCurrentUser = sanji === currentId;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const [userDoc, targetDoc] = await Promise.all([
                    getDoc(doc(firestore, "users", userId)),
                    getDoc(doc(firestore, "users", targetId))
                ]);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setLoggedUser({
                        name: userData.name || "Unknown User",
                        avatar: userData.pp || "",
                        email: userData.email || "",
                    });
                }

                if (targetDoc.exists()) {
                    const targetData = targetDoc.data();
                    setOtherUser({
                        name: targetData.name || "Unknown User",
                        avatar: targetData.pp || "",
                        email: targetData.email || "",
                    });
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [userId, targetId]);

    // useEffect(() => {
    //     const socket = io(socketUrl, { query: socketQuery });
    //     socket.on("message-update", (updatedMessage: { id: string; content: string }) => {
    //         if (updatedMessage.id === id) {
    //             setMessage(updatedMessage.content);
    //         }
    //     });
    //     return () => {
    //         socket.disconnect();
    //     };
    // }, [socketUrl, socketQuery, id]);

    return (
        <div className="mb-4"> {/* Added margin-bottom for spacing between messages */}
            <div className={cn("flex items-end space-x-2", isCurrentUser ? "justify-end" : "justify-start")}>
                {/* Avatar (Only for other users) */}
                {!isCurrentUser && (
                    <img src={otherUser?.avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
                )}

                {/* Message Box */}
                <div
                    className={cn(
                        "flex flex-col space-y-1 p-3 rounded-xl min-w-32 max-w-md",
                        isCurrentUser
                            ? "bg-blue-800 text-white rounded-br-none self-end"
                            : "bg-gray-700 text-white rounded-bl-none self-start"
                    )}
                >
                    {/* Username (Optional) */}
                    {!isCurrentUser && <p className="text-xs text-zinc-400 font-semibold italic">{otherUser?.name}</p>}

                    {/* Message */}
                    <p className="text-sm break-words">{message}</p>

                    {/* Timestamp */}
                    <span className="text-xs text-gray-400 self-end">{formattedTime}</span>
                </div>

                {/* Avatar (For current user) */}
                {isCurrentUser && (
                    <img src={loggedUser?.avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
                )}
            </div>
        </div>
    );


}


//safe