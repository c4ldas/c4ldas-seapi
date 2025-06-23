import { redirect } from 'next/navigation';

export default async function Login({ _, searchParams }) {

  const state = searchParams.state;
  const fullScope = "tips:read tips:write activities:read activities:write loyalty:read loyalty:write overlays:read overlays:write bot:read bot:write";
  const overlayScope = "overlays:read overlays:write";
  const basicScope = "channel:read";
  const chatCommandScope = "bot:read bot:write";
  let scope;

  if (state.startsWith("YmFzaWMtYXV")) { // basic-auth_redemptions
    scope = basicScope;

  } else if (state.startsWith("b3ZlcmxheV9")) {  // overlay_share, overlay_install, overlay_show-shared
    scope = overlayScope;

  } else if (state.startsWith("Y2hhdENvbW1hbm")) { // chatCommand
    scope = chatCommandScope;

  } else {
    scope = fullScope;

  }


  const baseURL = "https://streamelements.com/oauth2/authorize?";
  const urlSearchParams = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SE_CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.SE_REDIRECT_URI,
    state: searchParams.state
  });

  redirect(`${baseURL}${urlSearchParams}`);
}

