import jwt from "jsonwebtoken";

import { getUserByHandle, getUserById } from "../helper/userHelper";
import { addUserToDm, createDm, findDm } from "../helper/dmHelper";

export async function dmCreate(userId: string, userHandles: string[]) {
  const owner = await getUserById(userId);
  if (owner === null) throw { status: 400, message: "Invalid userId." }

  // Name of the DM is initially a concatenation of all user handles
  let dmNames = [owner.handle];
  let userIds = [];

  // Error checking and retrieving user handles
  for (const uHandle of userHandles) {
    const user = await getUserByHandle(uHandle);
    if (user === null) throw { status: 400, message: "Invalid username." }
    dmNames.push(uHandle);
    userIds.push(user.id);
  }

  const dmName = dmNames.sort().join(", ");

  const dmFind = await findDm(dmName);
  if (dmFind !== null) return { dmId: dmFind.id };

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
