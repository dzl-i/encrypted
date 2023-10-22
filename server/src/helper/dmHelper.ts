import { PrismaClient } from "@prisma/client";
import { getUserById } from "./userHelper";
const prisma = new PrismaClient();

export async function createDm(id: string, name: string) {
  const user = await getUserById(id);
  if (user === null) throw { status: 400, message: "Invalid userId." }

  return await prisma.dm.create({
    data: {
      dmName: name,
      members: {
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
    },
  });

  if (userDms === null) throw { status: 400, message: "Invalid userId." };
  return userDms;
}

export async function getDm(dmId: string) {
  const dm = await prisma.dm.findUnique({
    where: {
      id: dmId
    },
    include: {
      messages: {
        orderBy: {
          timeSent: "asc"
        }
      }
    }
  });

  if (dm === null) throw { status: 400, message: "Invalid dmId." };
  return dm;
}

export async function checkAuthorisation(userId: string, dmId: string) {
  const dmMembers = await prisma.dm.findUnique({
    where: {
      id: dmId
    },
    select: {
      members: true
    }
  });

  if (dmMembers === null) throw { status: 400, message: "Invalid dmId." };

  for (const user of dmMembers.members) {
    if (user.id === userId) {
      return true;
    }
  }

  return false;
}

export async function findDm(dmName: string) {
  return await prisma.dm.findUnique({
    where: {
      dmName: dmName
    }
  });
}
