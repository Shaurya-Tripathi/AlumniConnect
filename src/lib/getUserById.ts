'use server'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserById(usrId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { usrId },
      select: { id: true }
    });
    
    return user?.id || null;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}