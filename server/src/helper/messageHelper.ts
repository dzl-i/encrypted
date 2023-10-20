import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function storeMessage(userId: string, message: string, dmId: string) {
  const res = await prisma.message.create({
    data: {
      senderId: userId,
      message: message,
      dmId: dmId
    }
  });

  return res;
}
