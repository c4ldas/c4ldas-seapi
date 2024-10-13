"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import Link from "next/link";

import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Linkbox from "@/app/components/Linkbox";

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

export default function Share({ _, searchParams }) {

  // Temporary - Configure to work with cookies later
  const error = searchParams.error;

  const [cookie, setCookie] = useState({});
  const [origin, setOrigin] = useState();

  useEffect(() => {
    setOrigin(window.location.origin);
    setCookie(getCookies());
  }, []);


  async function openDialog() {
    const dialog = document.querySelector("#dialog");
    dialog.style.marginLeft = "auto";
    dialog.showModal();
  }

  function closeDialog() {
    const dialog = document.querySelector("#dialog");
    dialog.close();
  }


  // Pending - Configure to actually remove the integration
  async function confirmRemoval() {
    const dialogTitle = document.querySelector("#dialog-title");
    const submit = document.querySelector("#submit");
    const cancel = document.querySelector("#cancel");
    dialogTitle.innerText = "Removing integration, please wait...";
    submit.style.display = "none";
    cancel.style.display = "none";

    setTimeout(async () => {
      // const request = await fetch("/api/twitch/logout", { "method": "POST" });
      // const response = await request.json();
      const response = {
        message: "Integration removed successfully"
      }
      dialogTitle.innerHTML = `${response.message}.<br/> Redirecting back to home page...`;
    }, 1500);

    setTimeout(() => {
      window.location.assign("/");
    }, 3000);
  }

  function copyCode(event) { }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Overlay / widget share</h1>
        <hr />
        {!cookie.twitch_id &&
          <>
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
          </>
        }
        {cookie.twitch_id &&
          <>
            <h2 className="red">Page still in construction, no integration has been done!</h2>
            <p><strong>Channel name:</strong> {cookie.twitch_username} </p>
            <p><strong>Channel ID:</strong> {cookie.twitch_id}</p>
            { /* <p><strong>Code (click to copy):</strong> <span style={{ cursor: "pointer" }} onClick={copyCode} datacommand={cookie.twitch_code}>••••••••••••</span></p> */}
            <p><button id="remove-integration" type="submit" onClick={openDialog}>Remove integration</button></p>
            <h2 className="title">Overlay list</h2>
            <h3 className="subtitle">
              Here you can see all overlays you have installed on your account. Click in one of them to generate a sharing code:
            </h3>
            <div className="main">
              <Linkbox link="/overlays/share/{accountId}/{overlayId}" title="{overlayName} 1" description="Description of overlay 1" />
              <Linkbox link="/overlays/share/{accountId}/{overlayId}" title="{overlayName} 2" description="Description of overlay 2" />
              <Linkbox link="/overlays/share/{accountId}/{overlayId}" title="{overlayName} 3" description="Description of overlay 3" />
              <Linkbox link="/overlays/share/{accountId}/{overlayId}" title="{overlayName} 4" description="Description of overlay 4" />
              <Linkbox link="/overlays/share/{accountId}/{overlayId}" title="{overlayName} 5" description="Description of overlay 5" />
              <Linkbox link="/overlays/share/{accountId}/{overlayId}" title="{overlayName} 6" description="Description of overlay 6" />
            </div>

            {/* <!-- pop-up dialog box, containing a form --> */}
            <dialog id="copy-success" style={{ visibility: "visible", marginLeft: "10px", backgroundColor: "var(--popup-color)" }}>Code copied to clipboard</dialog>
            <dialog id="dialog" className="dialog">
              <div id="dialog-title">
                Are you sure you want to remove the integration?<br />
                You can re-add it at any time.
              </div>
              <div id="dialog-buttons">
                <button id="submit" type="submit" onClick={confirmRemoval}>Confirm</button>
                <button id="cancel" type="reset" onClick={closeDialog}>Cancel</button>
              </div>
            </dialog>
          </>
        }
        {error && <p>Error: {error}</p>}
      </main>
      <FooterComponent />
    </div>
  );
}
