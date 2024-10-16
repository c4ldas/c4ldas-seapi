"use server";
import { redirect } from 'next/navigation';

export default async function Login({ _, searchParams }) {
  console.log(searchParams);

  const baseURL = "https://streamelements.com/oauth2/authorize?";
  const urlSearchParams = new URLSearchParams({
    response_type: "code",
    client_id: "4e2b44d1efed3fd0",
    scope: "overlays:read overlays:write",
    redirect_uri: "https://seapi.c4ldas.com.br/api/callback",
    state: searchParams.state
  });

  if (searchParams.state == 'overlay_share' || searchParams.state == 'overlay_install') {
    redirect(`${baseURL}${urlSearchParams}`)
  }

  redirect(`/`);
}
