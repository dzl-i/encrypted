import { getUserByHandle } from "../helper/userHelper";

export async function authPublicKey(handle: string) {
  const user = await getUserByHandle(handle);

  return user?.publicKey;
}
