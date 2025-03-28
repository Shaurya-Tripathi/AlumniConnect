import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "../../../../types";
import { db } from "@/lib/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
){
    if (req.method !== "POST")
        return res.status(405).json({ error: "Method not allowed" });

    try{
        const { content,senderId } = req.body;
        const { conversationId } = req.query;

        if (!conversationId)
            return res.status(400).json({ error: "Conversation ID Missing" });

        if (!content)
            return res.status(400).json({ error: "Content Missing" });

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string
            }
        });

        if (!conversation)
            return res.status(404).json({ error: "Conversation not found" });

        // Create the message
        const message = await db.message.create({
            data: {
                body: content,
                conversationId: conversationId as string,
                senderId: senderId as string,
                seenIds: [senderId as string]
            },
            include: {
                sender: true,
                conversation: true
            }
        });

        // Socket event
        const channelKey = `chat:${conversationId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);

    

    } catch (error) {
        console.error("[DIRECT_MESSAGES_POST]", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
}