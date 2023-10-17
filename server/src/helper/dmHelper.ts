import { PrismaClient } from "@prisma/client";
import { getUserById } from "./userHelper";
const prisma = new PrismaClient();

export async function createDm(id: string, name: string) {
  const user = await getUserById(id);
  if (user === null) throw { status: 400, message: "Invalid userId." }

  return await prisma.dm.create({
    data: {
      dmName: name,
      owners: {
        connect: [user]
      }
    }
  })
}

export async function addUserToDm(dmId: string, userId: string) {
  const user = await getUserById(userId);
  if (user === null) throw { status: 400, message: "Invalid userId." }

  return await prisma.dm.update({
    where: {
      id: dmId
    },
    data: {
      members: {
        connect: [user]
      }
    }
  })
}
