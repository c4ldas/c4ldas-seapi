import { cookies } from "next/headers";
import { seSaveToDatabase } from "@/app/lib/database";
import { getTokenCode, getUserData, decodeData, generateTag } from "@/app/lib/streamelements";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const state = decodeData(obj.state);
  const origin = request.nextUrl.origin;

  if (obj.error) return Response.redirect(`${origin}/?error=${obj.error}`);
  if ((state.status == "failed") ||
    (!state.startsWith("overlay_share") && !state.startsWith("overlay_install") && !state.startsWith("overlay_show-shared"))) {
    return Response.redirect(`${origin}?error=State changed during login. Please try again.`);
  }

  const token = await getTokenCode(obj.code);
  const user = await getUserData(token.access_token);
  const tag = await generateTag();

  const data = {
    tag: tag,
    account_id: user._id,
    username: user.username,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  };

  const saved = await seSaveToDatabase(data);
  if (!saved) return Response.redirect(`${origin}?error=Error while saving to database. Please try again later.`);

  cookies().set('se_id', data.account_id);
  cookies().set('se_username', data.username);
  cookies().set('se_tag', data.tag);

  return Response.redirect(`${origin}/${state.split("_")[1]}`);
}
