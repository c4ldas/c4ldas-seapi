import { cookies } from "next/headers";
import { seSaveToDatabase } from "@/app/lib/database";
import { getTokenCode, getUserData } from "@/app/lib/streamelements";

export async function GET(request) {

  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const origin = request.nextUrl.origin;

  if (obj.error) return Response.redirect(`${origin}/share?error=${obj.error}`);

  const token = await getTokenCode(obj.code);
  const user = await getUserData(token.access_token);

  const data = {
    id: user._id,
    username: user.username,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  };

  const saved = await seSaveToDatabase(data);
  if (!saved) return Response.redirect(`${origin}/share?error=Error while saving to database. Please try again later.`);

  cookies().set('se_id', data.id);
  cookies().set('se_username', data.username);
  cookies().set('se_access_token', data.access_token);

  return Response.redirect(`${origin}/share`);
}
