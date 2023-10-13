import jwt from "jsonwebtoken";

import { checkValidToken, deleteRefreshToken, getIdFromToken } from "../helper/tokenHelper";

export async function authLogout(refreshToken: string) {
  // Check if the refresh token exists in the database
  if (! await checkValidToken(refreshToken)) throw { status: 401, message: "Refresh token does not exist." };

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET as string, (err) => {
    if (err) throw { status: 403, message: "Refresh token is not valid or have expired." };
  });

  // Get the user's id from the token
  const userId = await getIdFromToken(refreshToken);
  if (userId === null) throw { status: 403, message: "Refresh token is not valid or have expired." };

  // Delete the user's token
  await deleteRefreshToken(refreshToken);

  return;
}