/*
import { twitchSaveToDatabase, twitchCheckUser } from "@/app/lib/database";
import { getTokenCode, getUserData } from "@/app/lib/twitch";
import { cookies } from "next/headers";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const { code } = obj;
  const origin = request.nextUrl.origin;

  if (!code) return Response.redirect(`${origin}/twitch?error=Code not found`);

  const token = await getTokenCode(code);
  const user = await getUserData(token.access_token);
  const userExists = await twitchCheckUser(user.id); // return user data if user exists, else null
  const userCode = userExists ? userExists.code : crypto.randomUUID().replace(/-/g, '');

  const data = {
    id: user.id,
    username: user.login,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    code: userCode
  };

  const saved = await twitchSaveToDatabase(data);
  if (!saved) return Response.redirect(`${origin}/twitch?error=Error while saving to database`);

  cookies().set('twitch_id', data.id);
  cookies().set('twitch_username', data.username);
  cookies().set('twitch_code', data.code);

  return Response.redirect(`${origin}/twitch`);
}
*/