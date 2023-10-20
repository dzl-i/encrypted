import { getUserDms } from "../helper/dmHelper";

export async function dmList(userId: string) {
  const res = await getUserDms(userId);
  const dms = res.memberOfDms;

  return dms;
}
