import jwt from "jsonwebtoken";

import { getUserById } from "../helper/userHelper";
import { addUserToDm, createDm } from "../helper/dmHelper";

export async function dmCreate(userId: string, userIds: string[]) {
  const owner = await getUserById(userId);
  if (owner === null) throw { status: 400, message: "Invalid userId." }

  // Name of the DM is initially a concatenation of all user handles
  let dmNames = [owner.handle];

  // Error checking and retrieving user handles
  for (const uId of userIds) {
    const user = await getUserById(uId);
    if (user === null) throw { status: 400, message: "Invalid userId." }
    dmNames.push(user.handle);
  }

  const dmName = dmNames.sort().join(", ");

  // Create the DM
  const dm = await createDm(userId, dmName);

  // Add the users to the DM
  for (const uId of userIds) {
    await addUserToDm(dm.id, uId);
  }

  return {
    dmId: dm.id
  }
}