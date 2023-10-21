import { PrismaClient } from "@prisma/client";
import { getUserById } from "./userHelper";

const prisma = new PrismaClient();

export async function storeMessage(userId: string, message: string, dmId: string) {
  const user = await getUserById(userId);
  if (user === null) throw { status: 400, message: "Invalid userId." };

  const res = await prisma.message.create({
    data: {
      senderHandle: user.handle,
      message: message,
      dmId: dmId
    }
  });

  return res;
}
