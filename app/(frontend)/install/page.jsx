"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCookies } from "cookies-next";
import Link from "next/link";
import confetti from "canvas-confetti";

import Header from "@/app/components/Header";
import { Dialog, openDialog } from "@/app/components/Dialog";
import FooterComponent from "@/app/components/Footer";

import { encodeData } from "@/app/lib/streamelements";

export default function Install({ _, searchParams }) {
  const error = searchParams.error;
  const pathName = usePathname();

  const [cookie, setCookie] = useState({});
  const [code, setCode] = useState();
  const [isInstalled, setIsInstalled] = useState(false);
  const [overlayConfigURL, setOverlayConfigURL] = useState();
  const [overlayUrl, setOverlayUrl] = useState();
  const [encoded, setEncoded] = useState("");
  const [obsUrl, setObsUrl] = useState();

  useEffect(() => {
    setEncoded(encodeData("overlay_install"));
    setCookie(getCookies());
  }, [cookie.se_id]);


  async function handleSubmit(e) {
    e.preventDefault();
    const request = await fetch(`/api/overlays/install/${cookie.se_tag}/${code}`, { method: "POST" });
    const data = await request.json();

    // In case the overlay is not installed, show an error popup
    if (data.statusCode || data.status == "failed") {
      const dialog = document.querySelector("#installation-failed");
      dialog.style.marginLeft = "auto";
      dialog.style.backgroundColor = "rgba(255, 0, 0, 0.4)";
      dialog.showModal();
      document.querySelector("#error-code").innerHTML = `${data.statusCode}: ${data.message}<br />&nbsp`;
      return;
    }

    setIsInstalled(true);
    setOverlayUrl(data.overlay_url);
    setOverlayConfigURL(data.overlay_config_url);
    setObsUrl(`${data.overlay_url}?layer-name=${data.overlay_name}&layer-width=${data.overlay_width}&layer-height=${data.overlay_height}`);

    confetti({
      angle: 110,
      origin: { x: 0.4 }
    })
  }

  function copyOBSUrl(event) {
    const dialog = document.querySelector("#copy-overlay-success");
    const command = event.target.getAttribute("datacommand");
    navigator.clipboard.writeText(command);

    // Show the dialog next to the clicked element
    dialog.style.top = (event.pageY - 70) + "px";
    dialog.style.marginLeft = (event.pageX) + "px";
    dialog.show();

    // Close the dialog after 2 seconds
    setTimeout(() => {
      dialog.close();
    }, 2000);
  }


  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Overlay / widget install</h1>
        <hr />
        {!cookie.se_id &&
          <>
            <h2 className="title">Login with Streamelements</h2>
            <h3 className="subtitle">
              You can use this page to install an overlay code you received from a friend or colleague.
              <br />
              After logging in, you can type the code to have it installed in your Streamelements account and add to your OBS.
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
            <p className="description">This page will help you to install the overlay in your account.</p>
            <p><strong>Channel name:</strong> {cookie.se_username} </p>
            <p><strong>Channel ID:</strong> {cookie.se_id}</p>
            <p><button id="remove-integration" type="submit" onClick={() => openDialog({ pathName })}>Remove integration</button></p>
            <form id="form" onSubmit={handleSubmit} className="form" style={{ paddingTop: "10px" }}>
              <input type="text" id="se-code" className="se-code" placeholder="Type the overlay code here" onChange={e => setCode(e.target.value)} required={true} />
              <input type="submit" id="se-install-overlay" className="se-install-overlay" value="Install overlay" />
            </form>
            <Dialog />
            <dialog id="installation-failed" className="dialog">
              <div id="dialog-title">
                An error has occurred during the installation.<br />
                If you are sure the code is correct, try to remove the integration and install it again.<br />
              </div>
              <div id="error-code"></div>
              <div id="dialog-buttons">
                {/* <button id="submit" type="submit" onClick={""}>Confirm</button> */}
                <button id="cancel" type="reset" onClick={() => document.querySelector("#installation-failed").close()}>Close popup</button>
              </div>
            </dialog>
          </>
        }
        {isInstalled &&
          <>
            <p className="description" style={{ color: "green" }}>
              The overlay has been installed successfully in your account!<br /><br />
              - To configure it, click on the &quot;Overlay Config page&quot; link below.<br />
              - Use the OBS Browser source URL to add it to your OBS Studio.</p>
            <p><strong>Overlay Config page</strong>:
              <a href={overlayConfigURL} target="_blank" style={{ cursor: "pointer", fontStyle: "italic" }}>{overlayConfigURL}
              </a>
            </p>

            <p><strong>OBS Browser source</strong> (click to copy):
              <span id="overlay-url" onClick={copyOBSUrl} datacommand={overlayUrl} style={{ cursor: "pointer", fontStyle: "italic" }}>
                https://streamelements.com/overlay/••••••••••••
              </span></p>

            <p>Alternatively, you can drag the button below to your OBS and it will be added to your scene.</p>
            <a
              id="obs-button"
              className="obs-button"
              draggable="true"
              onClick={(e) => e.preventDefault()}
              onDragStart={e => e.dataTransfer.setData("text/uri-list", obsUrl)}
            >
              Drag me to OBS Studio
            </a>

            <dialog id="copy-overlay-success" style={{ visibility: "visible", marginLeft: "10px", backgroundColor: "var(--popup-color)" }}>Overlay URL copied to clipboard</dialog>
          </>
        }
        {error && <p className="error red">Error: {error}</p>}
      </main>
      <FooterComponent />
    </div >
  );
}
