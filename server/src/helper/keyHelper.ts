import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createKey(key: string, userId: string, dmId: string) {
  const res = await prisma.aESKeys.create({
    data: {
      encryptedKey: key,
      userId: userId,
      dmId: dmId
    }
  });

  if (res === null) return false; else return true;
}

export async function getAESKey(userId: string, dmId: string) {
  const res = await prisma.aESKeys.findUnique({
    where: {
      dmId_userId: {
        userId: userId,
        dmId: dmId
      }
    }
  });

  return res?.encryptedKey;
}
