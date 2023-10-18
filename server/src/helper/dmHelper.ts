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

export async function getUserDms(userId: string) {
  const userDms = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      memberOfDms: true,
      ownerOfDms: true,
    },
  });

  if (userDms === null) throw { status: 400, message: "Invalid userId." }
  return userDms;
}
