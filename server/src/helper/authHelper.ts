import { getHash } from "./util";

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

export async function verifyLogin(email: string, password: string) {
  // Prisma Queries
  const user = await prisma.user.findFirst({
    where: {
      email: email
    }
  });

  if (user === null) return false;

  // If password is correct, reset the remainingLoginAttempts to 3
  // If the password is incorrect, subtract the remainingLoginAttempts by 1
  if (user.password === getHash(password)) {
    await prisma.user.update({
      where: {
        email: email
      },
      data: {
        remainingLoginAttempts: 3
      }
    });

    return true;
  } else {
    await prisma.user.update({
      where: {
        email: email
      },
      data: {
        remainingLoginAttempts: {
          decrement: 1
        }
      }
    });

    return false;
  }
}

export async function checkBlockedAccount(email: string) {
  // Prisma Queries
  const user = await prisma.user.findFirst({
    where: {
      email: email
    }
  });

  if (user === null) return false;

  if (user.remainingLoginAttempts === 0) return true; else return false;
}
