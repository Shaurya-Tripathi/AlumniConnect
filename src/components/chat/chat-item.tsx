'use client'

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    
    // Add loading state to prevent premature rendering decision
    const [isLoading, setIsLoading] = useState(true);
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    // First fetch the logged user ID and determine if current user
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await getUserById(userId);
                if (id) {
                    // Set current user determination here, after we have the ID
                    setIsCurrentUser(id === currentId);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching user ID:", error);
                setIsLoading(false);
            }
        };

        fetchUserId();
    }, [userId, currentId]);

    // Then fetch the user details
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

    const router = useRouter();

    const onClick = () => {
        router.push(`/profile/${targetId}?email=${otherUser?.email}`);
    };

    // Don't render until we've determined if this is the current user
    if (isLoading) {
        return <div className="h-12 w-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>;
    }

    return (
        <div className="mb-4">
            <div className={cn("flex items-end space-x-2", isCurrentUser ? "justify-end" : "justify-start")}>
                {/* Avatar (Only for other users) */}
                {!isCurrentUser && (
                    <img
                        onClick={onClick}
                        src={otherUser?.avatar}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full transition-all duration-200 cursor-default hover:cursor-pointer hover:scale-110"
                    />
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
                    {!isCurrentUser && <p
                        onClick={onClick}
                        className="text-xs text-zinc-400 font-semibold italic transition-all duration-200 cursor-default hover:cursor-pointer hover:scale-110 hover:text-zinc-100"
                    >
                        {otherUser?.name}
                    </p>}

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