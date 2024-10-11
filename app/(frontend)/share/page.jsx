"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import Link from "next/link";

// import { useState } from "react";
//import { getCookies } from "cookies-next";

const baseURL = "https://streamelements.com/oauth2/authorize?";
const urlSearchParams = new URLSearchParams({
  response_type: "code",
  client_id: "4e2b44d1efed3fd0",
  scope: "overlays:read overlays:write",
  redirect_uri: "https://seapi.c4ldas.com.br/callback/",
  show_dialog: false,   // It doesn't work
  force_verify: false,  // It doesn't work
  state: "overlay_share"
});

export default function Share() {

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Overlay / widget share</h1>
        <hr />
        <h2 className="title">Login with Streamelements</h2>
        <h3 className="subtitle">
          You can use this page to share your own widgets or overlays with your friends. Click on the button below to login with Streamelements.
          <br />
          Once you clicked and authorized the page, you will see your overlay list and choose which one you want to share.
        </h3>
        <div className="main">
          <Link href={baseURL + urlSearchParams.toString()}>
            <button type="submit">Login with Streamelements</button>
          </Link>
        </div>
      </main>
      <FooterComponent />
    </div>
  );
}
