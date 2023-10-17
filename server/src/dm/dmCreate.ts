import jwt from "jsonwebtoken";

import { getUserById } from "../helper/userHelper";
import { addUserToDm, createDm } from "../helper/dmHelper";

interface JwtPayload extends jwt.JwtPayload {
  userId: string;
  uuid: string;
}

export async function dmCreate(accessToken: string, userIds: string[], name: string) {
  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET as string) as JwtPayload;
  const userId = decodedToken.userId;

  // Error checking
  for (const uId of userIds) {
    const res = await getUserById(uId);
    console.log(uId, res)
    if (res === null) throw { status: 400, message: "Invalid userId." }
  }

  // Create the DM
  const dm = await createDm(userId, name);

  // Add the users to the DM
  for (const uId of userIds) {
    await addUserToDm(dm.id, uId);
  }

  return {
    dmId: dm.id
  }
}