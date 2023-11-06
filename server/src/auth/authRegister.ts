import validator from 'validator';

import { checkEmailExists, checkHandleExists } from '../helper/authHelper';
import { getHash } from '../helper/util';
import { generateToken } from '../helper/tokenHelper';

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function authRegister(name: string, email: string, password: string, handle: string, publicKey: string) {
  // Error Handling
  if (name.length < 1) throw { status: 400, message: "Name cannot be empty." };
  if (!validator.isEmail(email)) throw { status: 400, message: "Invalid email address." };
  if (await checkEmailExists(email)) throw { status: 400, message: "Email address is already being used by another user." };
  if (await checkHandleExists(handle)) throw { status: 400, message: "Handle is already being used by another user." };

  // Create the user
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: getHash(password),
      handle: handle,
      publicKey: publicKey
    }
  });

  // Generate the token
  const { accessToken, refreshToken } = await generateToken(user.id);

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    userId: user.id,
    userHandle: user.handle,
    userFullName: user.name
  };
}
