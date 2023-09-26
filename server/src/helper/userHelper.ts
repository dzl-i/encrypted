import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getUserById(id: string) {
  // Prisma Queries
  return await prisma.user.findFirst({
    where: {
      id: id
    }
  });
}

export async function getUserByEmail(email: string) {
  // Prisma Queries
  return await prisma.user.findFirst({
    where: {
      email: email
    }
  });
}
