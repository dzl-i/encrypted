import { getPublicKey } from "../helper/authHelper";

export async function authPublicKey(handle: string) {
  const publicKey = await getPublicKey(handle);

  return publicKey;
}