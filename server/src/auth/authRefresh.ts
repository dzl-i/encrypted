import jwt from "jsonwebtoken";
import "dotenv/config";

import { checkValidToken, deleteRefreshToken, generateToken, getUserFromToken } from "../helper/tokenHelper";

export async function authRefresh(refreshToken: string) {
  // Check if the refresh token exists in the database
  if (! await checkValidToken(refreshToken)) throw { status: 401, message: "Refresh token does not exist." };

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET as string, (err) => {
    if (err) throw { status: 403, message: "Refresh token is not valid or have expired." };
  });

  // Get the user's id from the token
  const user = await getUserFromToken(refreshToken);
  if (user === null) throw { status: 403, message: "Refresh token is not valid or have expired." };

  // Generate a new access token and refresh token
  const token = await generateToken(user.id);

  // Delete the old refresh token from the database
  await deleteRefreshToken(refreshToken);

  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    userFullName: user.name,
    userHandle: user.handle,
    userPublicKey: user.publicKey
  };
}