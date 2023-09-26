import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import "dotenv/config";
import { getHash } from "./util"

const prisma = new PrismaClient();

export async function generateToken(id: string): Promise<string> {
  // Create the token based on the user's id
  const token: string = jwt.sign({ uuid: uuidv4() }, process.env.SECRET as string, {
    expiresIn: "3h"
  });
  const expiresBy = new Date(new Date().getTime() + 60 * 60 * 3 * 1000);

  // Add the token to the database
  await prisma.token.create({
    data: {
      token: getHash(token),
      userId: id,
      expiresBy: expiresBy
    }
  }).catch(e => { console.error(e.message) })

  return token;
}
