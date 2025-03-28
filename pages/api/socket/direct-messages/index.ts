import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "../../../../types";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    } 

    try {
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const rawBody = Buffer.concat(chunks).toString('utf8');
        const body = rawBody ? JSON.parse(rawBody) : {};

        const conversationId = req.query.conversationId as string | undefined;
        const userId = req.query.userId as string | undefined;
        const content = body?.content;

        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID is required" });
        }

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        if (!content) {
            return res.status(400).json({ error: "Message content is required" });
        }

        const user = await db.user.findUnique({
            where: { usrId: userId },
            select: { id: true }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let message;
        try {
            message = await db.message.create({
                data: {
                    body: content.trim(),
                    conversationId: conversationId,
                    senderId: user.id,
                    seenIds: [user.id]
                },
                include: {
                    sender: true,
                    conversation: true
                }
            });

            await db.conversation.update({
                where: { id: conversationId },
                data: {
                    lastMessageAt: new Date(),
                    messagesIds: { push: message.id }
                }
            });
        } catch (dbError) {
            return res.status(500).json({ 
                error: "Message creation failed", 
                details: dbError instanceof Error ? dbError.message : String(dbError)
            });
        }

        try {
            if (!res?.socket?.server?.io) {
                return res.status(500).json({ error: "Socket.io is not initialized" });
            }

            const channelKey = `chat:${conversationId}:messages`;
            res.socket.server.io.emit(channelKey, message);
        } catch (socketError) {
            // Silent catch for socket errors
        }

        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json({ 
            error: "Unexpected server error", 
            details: error instanceof Error ? error.message : String(error)
        });
    }
}

export const config = {
  api: {
    bodyParser: false
  }
};