"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCookies, deleteCookie } from "cookies-next";
import Link from "next/link";

import Header from "@/app/components/Header";
import { Dialog, openDialog } from "@/app/components/Dialog";
import Linkbox from "@/app/components/Linkbox";
import FooterComponent from "@/app/components/Footer";

import { encodeData } from "@/app/lib/streamelements";

export default function Share({ _, searchParams }) {
  const error = searchParams.error;
  const pathName = usePathname();

  const [cookie, setCookie] = useState({});
  const [overlays, setOverlays] = useState([]);
  const [encoded, setEncoded] = useState("");
  const [code, setCode] = useState("");
  const [origin, setOrigin] = useState();
  const [quicklink, setQuicklink] = useState("");

  useEffect(() => {
    setEncoded(encodeData("overlay_share"));
    setCookie(getCookies());
    overlayList();
    setOrigin(window.location.origin);
  }, [cookie.se_id]);

  async function overlayList() {
    if (!cookie["se_id"]) return;
    const request = await fetch(`/api/overlays/list/${cookie["se_tag"]}`, { method: "GET" });
    const response = await request.json();

    if (response.status == "failed") {
      deleteCookie("se_id");
      deleteCookie("se_tag");
      deleteCookie("se_username");
      window.location.reload();
    }

    setOverlays(response.docs);
  }

  async function createCode(e) {
    e.preventDefault();
    const data = e.currentTarget.dataset;
    const request = await fetch(`/api/overlays/share/${cookie["se_tag"]}/${data.overlayId}`, { method: "POST" });
    const response = await request.json();

    setCode(response.code);
    setQuicklink(`${origin}/install`);
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
              You can use this page to share your own widgets or overlays with your friends. After logging in, you will see your overlay list and choose which one(s) you want to share.
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
            <p><button id="remove-integration" type="submit" onClick={() => openDialog({ pathName })}>Remove integration</button></p>
            <h2 className="title">Overlay list</h2>
            <h3 className="subtitle">
              Here you can see all overlays you have installed on your account. Click in one of them to generate a sharing code:
            </h3>
            <div className="main" id="overlay-list">
              {overlays && overlays.map((overlay) => (
                <Linkbox
                  a="true" link="#" onClick={createCode} key={overlay._id}
                  title={`${overlay.name}`} image={overlay.preview ? overlay.preview.replaceAll(" ", "%20") : ""}
                  /* image={overlay.preview.replaceAll(" ", "%20") || ""} */
                  data-overlay-id={overlay._id} data-overlay-name={overlay.name} data-account-id={overlay.channel}
                />
              ))}
            </div>
            <Dialog />
            <dialog id="code-generated" >
              <h3 id="dialog-title">
                Code generated successfully!<br />
                Quicklink: {quicklink}/{code}<br />
                Code: {code}

              </h3>
              <div id="dialog-copy">
                <button style={{ padding: "0.5rem", marginRight: "0.5rem" }} id="copy" onClick={() => { navigator.clipboard.writeText(`${quicklink}/${code}`) }}>Copy Quicklink</button>
                <button style={{ padding: "0.5rem", marginRight: "0.5rem" }} id="cancel" onClick={() => { navigator.clipboard.writeText(`${quicklink}/${code}`); document.querySelector("#code-generated").close() }}>Copy Quicklink and close</button>
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
