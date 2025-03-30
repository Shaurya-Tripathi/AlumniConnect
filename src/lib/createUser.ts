'use server'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getOrSetUser(usrId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { usrId },
            select: { id: true }
        });

        if (!user) {
            await prisma.user.create({
                data: {
                    usrId: usrId,
                    name: "New User", // Use a default name or get from request
                    email: `user-${usrId}-${Date.now()}@placeholder.com`, // Generate unique email
                    connectionIds: [],
                    conversationIds: [],
                    seenMessageIds: []
                }
            });
        }

        // return user?.id || null;
    } catch (error) {
        console.error('Error fetching user ID:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}