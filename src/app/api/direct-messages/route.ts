import { NextResponse } from "next/server";
import { Message } from "@prisma/client";
import { db } from "@/lib/db";

const MESSAGES_BATCH = 10;

export async function GET(req: Request){
    try{

        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");

        if (!conversationId)
            return new NextResponse("Conversation ID Missing", { status: 400 });

        let messages: Message[] = [];

        if(cursor){
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where:{
                    conversationId
                },
                include: {
                    sender: true,
                    conversation: true
                },
                orderBy: { createdAt: "desc" }
            })
        } else {
            messages = await db.message.findMany({
              take: MESSAGES_BATCH,
              where: { conversationId },
              include: {
                sender: true,
                conversation: true
              },
              orderBy: { createdAt: "desc" }
            });
        }
        let nextCursor = null;

        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }

        return NextResponse.json({ items: messages, nextCursor });

    } catch (error) {
    console.error("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}