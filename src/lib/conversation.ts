import { db } from "@/lib/db"

export const getOrCreateConversation = async (currentUsrId: string, targetUsrId: string) => {
    // First, find the users by their usrId to get their MongoDB _id
    const currentUser = await db.user.findUnique({
        where: { usrId: currentUsrId }
    });

    const targetUser = await db.user.findUnique({
        where: { usrId: targetUsrId }
    });

    if (!currentUser || !targetUser) {
        return null;
    }

    let conversation = await findConversation(currentUser.id, targetUser.id) ||
                       await findConversation(targetUser.id, currentUser.id);
    
    if (!conversation) {
        conversation = await createNewConversation(currentUser.id, targetUser.id);
    }

    return conversation;
}

const findConversation = async (currentUserId: string, targetUserId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { NOT: { isGroup: true } },
                    { 
                        userIds: { 
                            hasEvery: [currentUserId, targetUserId] 
                        } 
                    }
                ]
            },
            include: {
                users: true
            }
        });
    } catch {
        return null;
    }
}

const createNewConversation = async (currentUserId: string, targetUserId: string) => {
    try {
        return await db.conversation.create({
            data: {
                isGroup: false,
                userIds: [currentUserId, targetUserId],
                users: {
                    connect: [
                        { id: currentUserId },
                        { id: targetUserId }
                    ]
                }
            },
            include: {
                users: true
            }
        });
    } catch {
        return null;
    }
}