import { cookies } from "next/headers";
import { checkIfTagExists, seSaveToDatabase } from "@/app/lib/database";
import { getTokenCode, getUserData, decodeData, generateTag } from "@/app/lib/streamelements";
import { NextResponse } from "next/server";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const state = decodeData(obj.state);
  const origin = request.nextUrl.origin;
  let tag;
  const validPrefixes = [
    "overlay_share",
    "overlay_install",
    "overlay_show-shared",
    "full-auth_auth",
    "basic-auth_redemptions",
    "chatCommand"
  ];

  if (obj.error) return Response.redirect(`${origin}/?error=${obj.error}`);
  const isValid = validPrefixes.some((prefix) => state.startsWith(prefix));

  if (state.status == "failed" || !isValid) {
    return Response.redirect(`${origin}?error=State changed during login. Please try again.`);
  }

  /*   if (state.includes("milaeshop")) {
      return Response.redirect(`https://test.c4ldas.com.br/api/callback?code=${obj.code}&state=${obj.state}`);
    } */

  const token = await getTokenCode(obj.code);
  const user = await getUserData(token.access_token);

  const tagExists = await checkIfTagExists({ account_id: user._id, username: user.username });

  if (!tagExists.success) tag = await generateTag();
  else tag = tagExists.details[0].tag;

  const data = {
    tag: tag,
    account_id: user._id,
    username: user.username,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
  };

  const saved = await seSaveToDatabase(data);
  if (!saved) return Response.redirect(`${origin}?error=Error while saving to database. Please try again later.`);

  if (state.startsWith("full-auth")) {
    return NextResponse.json({ status: "success", data: data });
  }

  cookies().set('se_id', data.account_id);
  cookies().set('se_username', data.username);
  cookies().set('se_tag', data.tag);

  return Response.redirect(`${origin}/${state.split("_")[1]}`);
}
