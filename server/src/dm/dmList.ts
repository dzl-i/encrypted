import { getUserDms } from "../helper/dmHelper";
import { getUserById } from "../helper/userHelper";

export async function dmList(userId: string) {
  const user = await getUserById(userId);

  const res = await getUserDms(userId);
  const dms = res.memberOfDms;

  for (const dm of dms) {
    const dmName = dm.dmName.replace(" ", "");
    dm.dmName = dmName.split(",").filter(name => name !== user?.handle)[0];
  }

  return dms;
}
