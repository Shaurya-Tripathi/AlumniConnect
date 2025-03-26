"use client";

import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "@/components/user-avatar";
import { useEffect, useState } from "react";
import { firestore } from "@/lib/firebase";
import { doc, getDoc } from 'firebase/firestore';

interface ChatHeaderMemberProps {
    target: string;
}

export const ChatHeaderMember = ({ target }: ChatHeaderMemberProps) => {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userDoc = await getDoc(doc(firestore, "users", target));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUser({
                    name: userData.name || "Unknown User",
                    avatar: userData.pp || "",
                });
            }
        };

        fetchUser();
    }, [target]);

    const onClick = () => {
        router.push(`/profile/${target}`);
    };

    return (
        <button 
            onClick={onClick} 
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700 transition", // Removed mb-1
                "relative" // Added to control positioning
            )}
        >
            <UserAvatar
                src={user?.avatar || "/default-avatar.png"}
                className="h-9 w-8 md:h-8 md:w-8 mr-2"
            />
            <p className={cn(
                "font-semibold text-sm text-zinc-300 group-hover:text-zinc-500 transition"
            )}>
                {user?.name || "Loading..."}
            </p>
        </button>
    );
};