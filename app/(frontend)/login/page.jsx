import { redirect } from "next/navigation";
import crypto from "crypto";
import zlib from "zlib";
import { ACTIONS } from "@/app/lib/streamelements";

export default function Login({ _, searchParams }) {

  const action = searchParams.action;

  if (!action || !Object.hasOwn(ACTIONS, action)) {
    console.log("Invalid action:", action);
    return redirect("/");
  }

  const state = createState({ action: searchParams.action, env: searchParams.env || "prod" });
  const scope = ACTIONS[searchParams.action].scopes.join(" ");

  const baseURL = "https://streamelements.com/oauth2/authorize?";
  const urlSearchParams = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SE_CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.SE_REDIRECT_URI,
    state: state
  });

  redirect(`${baseURL}${urlSearchParams}`);
}


function createState({ action, env }) {

  const def = ACTIONS[action];
  if (!def) throw new Error("Invalid action");

  const stateObj = JSON.stringify({
    v: 1,
    action: action,
    env: env,
    redirect: def.redirect,
    scopes: def.scopes,
    csrf: crypto.randomBytes(8).toString("hex"),
    iat: Math.floor(Date.now() / 1000)
  });

  const compressed = zlib.gzipSync(stateObj);
  const state = Buffer.from(compressed).toString("base64url");
  console.log("state:", state);
  console.log("env:", env);
  return state;

}