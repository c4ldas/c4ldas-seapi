import { cookies } from "next/headers";
import { checkIfTagExists, seSaveToDatabase } from "@/app/lib/database";
import { getTokenCode, getUserData, generateTag } from "@/app/lib/streamelements";
import { NextResponse } from "next/server";
import zlib from "zlib";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const origin = request.nextUrl.origin;
  const state = decodeState(obj.state);

  let tag;
  const csrf = cookies().get("csrf")?.value;

  if (!csrf || state.csrf !== csrf) {
    cookies().delete("csrf");
    return Response.redirect(`${origin}?error=Invalid CSRF.`);
  }

  cookies().delete("csrf");

  if (state.env == "dev" && origin != "http://localhost:3000") {
    return Response.redirect(`http://localhost:3000/api/callback?code=${obj.code}&state=${obj.state}`);
  }

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

  if (state.action == "full" || state.action == "basic") {
    return NextResponse.json({ status: "success", data: data });
  }

  cookies().set('se_id', data.account_id);
  cookies().set('se_username', data.username);
  cookies().set('se_tag', data.tag);
  cookies().set('se_provider', user.provider);
  cookies().set('user_avatar', Buffer.from(user.avatar).toString('base64url'));

  return Response.redirect(`${origin}/${state.redirect}`);
}


function decodeState(data) {

  const buffer = Buffer.from(data, "base64url");
  const uncompressed = zlib.gunzipSync(buffer).toString();
  const state = JSON.parse(uncompressed);

  return state;
}