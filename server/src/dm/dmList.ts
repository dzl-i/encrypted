import { getUserDms } from "../helper/dmHelper";
import { getUserById } from "../helper/userHelper";

export async function dmList(userId: string) {
  const user = await getUserById(userId);

  const res = await getUserDms(userId);
  const userDms = res.memberOfDms.concat(res.ownerOfDms);

  return {
    dms: userDms
  };
}