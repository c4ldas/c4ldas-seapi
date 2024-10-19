"use client"

import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Link from "next/link";

import Header from "@/app/components/Header";
import { Dialog, openDialog } from "@/app/components/Dialog";
import Linkbox from "@/app/components/Linkbox";
import FooterComponent from "@/app/components/Footer";

import { getOverlays, encodeData } from "@/app/lib/streamelements";

export default function Share({ _, searchParams }) {
  const error = searchParams.error;

  const [cookie, setCookie] = useState({});
  const [overlays, setOverlays] = useState([]);
  const [encoded, setEncoded] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    setEncoded(encodeData("overlay_share"));
    setCookie(getCookies());
    overlayList();
  }, [cookie.se_id]);

  async function overlayList() {
    if (!cookie["se_id"]) return;
    const data = { id: cookie["se_id"], access_token: cookie["se_access_token"] };
    setOverlays((await getOverlays(data)).docs);
  }

  async function createCode(e) {
    e.preventDefault();
    const data = e.currentTarget.dataset;
    const request = await fetch(`/api/overlays/share/${data.channelId}/${data.overlayId}`, { method: "POST" });
    const response = await request.json();

    setCode(response.code);
    const dialog = document.querySelector("#code-generated");
    dialog.style.marginLeft = "auto";
    dialog.showModal();
  }


  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Overlay / widget share</h1>
        <hr />
        {!cookie.se_id &&
          <>
            <h2 className="title">Login with Streamelements</h2>
            <h3 className="subtitle">
              You can use this page to share your own widgets or overlays with your friends. Click on the button below to login with Streamelements.
              <br />
              Once you clicked and authorized the page, you will see your overlay list and choose which one you want to share.
            </h3>
            <div className="main">
              <Link href={`/login?state=${encoded}`}>
                <button type="submit" style={{ padding: "0.5rem" }}>Login with Streamelements</button>
              </Link>
            </div>
          </>
        }
        {cookie.se_id &&
          <>
            <p><strong>Channel name:</strong> {cookie.se_username} </p>
            <p><strong>Channel ID:</strong> {cookie.se_id}</p>
            <p><button id="remove-integration" type="submit" onClick={openDialog}>Remove integration</button></p>
            <h2 className="title">Overlay list</h2>
            <h3 className="subtitle">
              Here you can see all overlays you have installed on your account. Click in one of them to generate a sharing code:
            </h3>
            <div className="main" id="overlay-list">
              {overlays && overlays.map((overlay) => (
                <Linkbox
                  a={true} link="#" onClick={createCode} key={overlay._id}
                  title={`${overlay.name}`} image={overlay.preview.replaceAll(" ", "%20")}
                  data-overlay-id={overlay._id} data-overlay-name={overlay.name} data-channel-id={overlay.channel}
                />
              ))}
            </div>
            <Dialog />
            <dialog id="code-generated" >
              <h3 id="dialog-title">
                Code generated successfully!<br />
                Code: {code}
              </h3>
              <div id="dialog-copy">
                <button id="copy" onClick={() => { navigator.clipboard.writeText(code) }}>Copy code</button>
                <button id="cancel" onClick={() => { navigator.clipboard.writeText(code); document.querySelector("#code-generated").close() }}>Copy code and close</button>
              </div>
            </dialog>
          </>
        }
        {error && <p className="error red">Error: {error}</p>}
      </main>
      <FooterComponent />
    </div >
  );
}
