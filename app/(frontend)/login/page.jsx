import { redirect } from 'next/navigation';

export default async function Login({ _, searchParams }) {

  const state = searchParams.state;
  const fullscope = "tips:read tips:write activities:read activities:write loyalty:read loyalty:write overlays:read overlays:write bot:read bot:write"

  const baseURL = "https://streamelements.com/oauth2/authorize?";
  const urlSearchParams = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SE_CLIENT_ID,
    scope: !state.startsWith("b3ZlcmxheV9hdXRoXzE") ? "overlays:read overlays:write" : fullscope,
    redirect_uri: process.env.SE_REDIRECT_URI,
    state: searchParams.state
  });

  redirect(`${baseURL}${urlSearchParams}`);
}

