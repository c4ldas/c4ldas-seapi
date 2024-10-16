import { redirect } from 'next/navigation';

export default async function Login({ _, searchParams }) {

  const baseURL = "https://streamelements.com/oauth2/authorize?";
  const urlSearchParams = new URLSearchParams({
    response_type: "code",
    client_id: "4e2b44d1efed3fd0",
    scope: "overlays:read overlays:write",
    redirect_uri: process.env.SE_REDIRECT_URI,
    state: searchParams.state
  });

  redirect(`${baseURL}${urlSearchParams}`);
}

