import { getUserByHandle, getUserById } from "../helper/userHelper";
import { addUserToDm, createDm, findDm } from "../helper/dmHelper";
import { createKey } from "../helper/keyHelper";

export async function dmCreate(userId: string, userHandle: string, userEncryptedAESKey: string, friendEncryptedAESKey: string) {
  const owner = await getUserById(userId);
  if (owner === null) throw { status: 400, message: "Invalid userId." }

  // Name of the DM is initially a concatenation of all user handles
  let dmNames = [owner.handle];

  // Error checking and retrieving user handle
  const user = await getUserByHandle(userHandle);
  if (user === null) throw { status: 400, message: "Invalid username." }
  dmNames.push(userHandle);
  const friendId = user.id;

  const dmName = dmNames.sort().join(", ");

  const dmFind = await findDm(dmName);
  if (dmFind !== null) return dmFind;

  // Create the DM
  const dm = await createDm(userId, dmName);

  // Create the AESKeys
  if (! await createKey(userEncryptedAESKey, userId, dm.id)) throw { status: 400, message: "Invalid Key." };
  if (! await createKey(friendEncryptedAESKey, friendId, dm.id)) throw { status: 400, message: "Invalid Key." };

  // Add the user to the DM
  await addUserToDm(dm.id, friendId);

  return dm;
}
