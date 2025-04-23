// The idea of this route is to the user simply authenticate with StreamElements and have the overlay code installed in their account directly.
// Once the overlay is installed, it redirects to the overlay configuration page.

"use client";

import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Link from "next/link";

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useParams } from "next/navigation";
import { encodeData } from "@/app/lib/streamelements";

export default function Install({ _, searchParams }) {
  const error = searchParams.error;
  const { installCode } = useParams();
  const [cookie, setCookie] = useState({});
  const [overlayEditor, setOverlayEditor] = useState();
  const [isInstalled, setIsInstalled] = useState(false);
  const [encoded, setEncoded] = useState("");

  useEffect(() => {
    if (!cookie.se_id) {
      setEncoded(encodeData(`overlay_install/${installCode}`));
      setCookie(getCookies());
    }

    if (cookie.se_id && !isInstalled) {
      handleSubmit();
    }

    if (cookie.se_id && isInstalled) {
      window.location.assign(overlayEditor);
    }
  }, [cookie.se_id, isInstalled, installCode]);


  async function handleSubmit(e) {
    if (isInstalled) return;

    const request = await fetch(`/api/overlays/install/${cookie.se_tag}/${installCode}`, { method: "POST" });
    const data = await request.json();

    // In case the overlay is not installed, show an error popup
    if (data.statusCode || data.status == "failed") {
      const dialog = document.querySelector("#installation-failed");
      dialog.style.marginLeft = "auto";
      dialog.showModal();
      document.querySelector("#error-code").innerHTML = `<br/>Error description: ${data.message}<br />&nbsp`;
      return;
    }

    setIsInstalled(true);
    setOverlayEditor(`https://streamelements.com/overlay/${data.overlay_id}/editor`);
    return;
  }

  function closeErrorDialog() {
    document.querySelector("#installation-failed").close();
    window.location.assign("/");
  }


  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Overlay / widget installation</h1>
        <hr />
        {!cookie.se_id &&
          <>
            <h2 className="title">Login with Streamelements</h2>
            <h3 className="subtitle">
              Log in with Streamelements to have your widget installed!
              The overlay with the widget(s) will be added to your Streamelements account.
              <br />
            </h3>
            <div className="main">
              <Link href={`/login?state=${encoded}`}>
                <button className="button button-login" type="submit" style={{ padding: "0.5rem" }}>Login with Streamelements</button>
              </Link>
            </div>
          </>
        }

        {cookie.se_id && !isInstalled && (
          <>
            <p>Installing overlay, please wait...</p>
            <dialog id="installation-failed" className="dialog dialog-installation-failed">
              <div id="dialog-title">
                An error has occurred during the installation.<br />
                If you are sure the URL is correct, try to remove the integration and install it again.<br />
              </div>
              <div id="error-code"></div>
              <div id="dialog-buttons">
                <button id="cancel" type="reset" className="button button-pink" onClick={closeErrorDialog}>Close popup</button>
              </div>
            </dialog>
          </>
        )}

        {cookie.se_id && isInstalled &&
          <p>Overlay installed, redirecting...</p>
        }

        {error && <p className="error red">Error: {error}</p>}
      </main>
      <FooterComponent />
    </div >
  );
}
