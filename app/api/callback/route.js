import { cookies } from "next/headers";
import { checkIfTagExists, seSaveToDatabase } from "@/app/lib/database";
import { getTokenCode, getUserData, generateTag } from "@/app/lib/streamelements";
import { NextResponse } from "next/server";
import zlib from "zlib";

export async function GET(request) {
  // Convert query strings (map format) to object format - Only works for this specific case!
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  const cookieStore = await cookies();
  const origin = request.nextUrl.origin;
  let tag;

  if (!obj.state || !obj.code || obj.error) {
    return Response.redirect(`${origin}?state=${obj.state}&error=Application not authorized. Please try again later.`);
  }

  const state = decodeState(obj.state);

  if (state.env == "dev" && origin != "http://localhost:3000") {
    return Response.redirect(`http://localhost:3000/api/callback?code=${obj.code}&state=${obj.state}`);
  }

  const csrf = cookieStore.get("csrf")?.value;

  if (!csrf || state.csrf !== csrf) {
    cookieStore.delete("csrf");
    return Response.redirect(`${origin}?error=Invalid CSRF.`);
  }

  cookieStore.delete("csrf");

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

  cookieStore.set('se_id', data.account_id);
  cookieStore.set('se_username', data.username);
  cookieStore.set('se_tag', data.tag);
  cookieStore.set('se_provider', user.provider);
  cookieStore.set('user_avatar', Buffer.from(user.avatar).toString('base64url'));

  return Response.redirect(`${origin}/${state.redirect}`);
}


function decodeState(data) {

  const buffer = Buffer.from(data, "base64url");
  const uncompressed = zlib.gunzipSync(buffer).toString();
  const state = JSON.parse(uncompressed);

  return state;
}