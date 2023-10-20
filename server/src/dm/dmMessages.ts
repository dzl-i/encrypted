import { getDmMessages } from "../helper/dmHelper";

export async function dmMessages(dmId: string) {
  // Returns array of messages sorted ascendingly based on timeSent
  return (await getDmMessages(dmId)).messages;
}