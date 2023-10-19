import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import "dotenv/config";
import crypto from "crypto";

import { getHash } from "./util";

const prisma = new PrismaClient();

export async function generateToken(id: string) {
  // Create the token based on the user's id and/or a random uuid
  const accessToken: string = jwt.sign({ uuid: crypto.randomUUID(), userId: id }, process.env.ACCESS_JWT_SECRET as string, {
    expiresIn: "15m"
  });

  const refreshToken: string = jwt.sign({ uuid: crypto.randomUUID() }, process.env.REFRESH_JWT_SECRET as string, {
    expiresIn: "90d"
  });

  // Add the token to the database
  await prisma.refreshToken.create({
    data: {
      accessToken: getHash(accessToken),
      refreshToken: getHash(refreshToken),
      userId: id,
    }
  }).catch(e => { console.error(e.message) });

  return {
    accessToken: accessToken,
    refreshToken: refreshToken
  };
}

export async function deleteRefreshToken(refreshToken: string) {
  return await prisma.refreshToken.delete({
    where: {
      refreshToken: getHash(refreshToken)
    }
  })
}

export async function checkValidToken(refreshToken: string) {
  const res = await prisma.refreshToken.findFirst({
    where: {
      refreshToken: getHash(refreshToken)
    }
  })

  if (res === null) return false; else return true;
}

export async function getIdFromToken(refreshToken: string) {
  const res = await prisma.refreshToken.findFirst({
    where: {
      refreshToken: getHash(refreshToken)
    }
  });

  if (res === null) return null; else return res.userId;
}
