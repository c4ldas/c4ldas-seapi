// SHOW PAGE
// PENDING

"use client"

import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Link from "next/link";

import Header from "@/app/components/Header";
import { Dialog, openDialog } from "@/app/components/Dialog";
import Linkbox from "@/app/components/Linkbox";
import FooterComponent from "@/app/components/Footer";

import { encodeData } from "@/app/lib/streamelements";

export default function Share({ _, searchParams }) {
  const error = searchParams.error;

  const [cookie, setCookie] = useState({});
  const [overlays, setOverlays] = useState([]);
  const [encoded, setEncoded] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    setEncoded(encodeData("overlay_show"));
    setCookie(getCookies());
    overlayShow();
  }, [cookie.se_id]);

  async function overlayShow() {
    if (!cookie["se_id"]) return;
    /* 
    const request = await fetch(`/api/overlays/show-shared/${cookie["se_tag"]}`, { method: "GET" });
    const response = await request.json();
    setOverlays(response.docs); 
    */
  }

  async function createCode(e) {
    e.preventDefault();
    const data = e.currentTarget.dataset;
    const request = await fetch(`/api/overlays/share/${cookie["se_tag"]}/${data.overlayId}`, { method: "POST" });
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
        <h1 className="title">Overlay / widget show</h1>
        <hr />
        {!cookie.se_id &&
          <>
            <h2 className="title">Login with Streamelements</h2>
            <h3 className="subtitle">
              Here you can see all overlays you shared from your account. Check the code or simply remove so it is not shared anymore.
              <br />
              Don&apos;t worry, the overlays you unshare will still exist in your Streamelements account.
              <br /><br />
              Click on the button below to login with Streamelements:
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
            <h2 className="title">Shared overlays</h2>
            <h3 className="subtitle">
              Here you can see all overlays you have shared. Check the code again or simply remove the overlay so it is not shared anymore:
            </h3>
            <div class="red">This feature is still in development, please check back later</div>
            {/* <div className="main" id="overlay-list">
              {overlays && overlays.map((overlay) => (
                <Linkbox
                  a={true} link="#" onClick={createCode} key={overlay._id}
                  title={`${overlay.name}`} image={overlay.preview.replaceAll(" ", "%20")}
                  data-overlay-id={overlay._id} data-overlay-name={overlay.name} data-account-id={overlay.channel}
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
            </dialog> */}
          </>
        }
        {error && <p className="error red">Error: {error}</p>}
      </main>
      <FooterComponent />
    </div >
  );
}
