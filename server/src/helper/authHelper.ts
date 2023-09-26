import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function checkEmailExists(email: string): Promise<boolean> {
  // Prisma Queries
  const res = await prisma.user.findFirst({
    where: {
      email: email
    }
  }).catch(e => { console.error(e.message) })

  if (res === null) return false; else return true;
}

export async function checkHandleExists(handle: string): Promise<boolean> {
  // Prisma Queries
  const res = await prisma.user.findFirst({
    where: {
      handle: handle
    }
  }).catch(e => { console.error(e.message) })

  if (res === null) return false; else return true;
}