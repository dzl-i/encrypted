import { getDm } from "../helper/dmHelper";
import { getUserByHandle, getUserById } from "../helper/userHelper";

export async function dmMessages(userId: string, dmId: string) {
  const user = await getUserById(userId);
  const dm = await getDm(dmId);

  const dmName = dm.dmName.replace(" ", "");
  const friendHandle = dmName.split(",").filter(name => name !== user?.handle)[0];

  const friend = await getUserByHandle(friendHandle);
  const friendFullName = friend?.name;
  const friendPublicKey = friend?.publicKey;
  const messages = dm.messages;

  // Returns array of messages sorted ascendingly based on timeSent
  return {
    friendFullName: friendFullName,
    friendHandle: friendHandle,
    friendPublicKey: friendPublicKey,
    messages: messages
  };
}