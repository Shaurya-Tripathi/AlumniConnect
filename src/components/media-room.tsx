'use client';

import { useState, useEffect } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

import "@livekit/components-styles"
import { Loader2 } from "lucide-react";
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from "@/lib/firebase";


interface MediaRoomProps{
    chatId: string;
    video: boolean;
    audio: boolean;
};

export const MediaRoom = ({
    chatId,
    video,
    audio
}:MediaRoomProps) => {
    // const { user } = useUser();

    const pathSegments = window.location.pathname.split("/");
    const userId = pathSegments[1];  // First segment after domain

    const [loggedUser, setLoggedUser] = useState<{ name: string; avatar: string; email: string, } | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const [userDoc] = await Promise.all([
                    getDoc(doc(firestore, "users", userId)),
                ]);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setLoggedUser({
                        name: userData.name || "Unknown User",
                        avatar: userData.pp || "",
                        email: userData.email || "",
                    });
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [userId]);





    const [token, setToken] = useState("");

    useEffect(() => {
        if(!loggedUser?.name) return;

        const name = `${loggedUser.name}`;

        (async () => {
            try{
                const resp = await fetch(`/api/token/?room=${chatId}&username=${encodeURIComponent(name)}`);
                const data = await resp.json();
                setToken(data.token);
            } catch (e){
                console.log(e);
            }
        })()
    }, [loggedUser?.name, chatId]);

    if(token === ""){
        return(
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2
                    className="h-7 w-7 text-zinc-500 animate-spin my-4"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading...
                </p>
            </div>
        )
    }

    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
        >
            <VideoConference/>
        </LiveKitRoom>
    )

}