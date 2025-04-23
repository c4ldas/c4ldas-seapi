"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCookies, deleteCookie } from "cookies-next";
import Link from "next/link";

import Header from "@/app/components/Header";
import { Dialog, openDialog } from "@/app/components/Dialog";
import FooterComponent from "@/app/components/Footer";

import { encodeData } from "@/app/lib/streamelements";


export default function ShowShared({ _, searchParams }) {
  const error = searchParams.error;
  const pathName = usePathname();

  const [cookie, setCookie] = useState({});
  const [sharedOverlays, setSharedOverlays] = useState([]);
  const [overlayToDelete, setOverlayToDelete] = useState({});
  const [encoded, setEncoded] = useState("");
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState();
  const [quicklink, setQuicklink] = useState();

  useEffect(() => {
    setEncoded(encodeData("overlay_show-shared"));
    setCookie(getCookies());
    overlayShowShared();
    setOrigin(window.location.origin);
  }, [cookie.se_id]);

  async function overlayShowShared() {
    if (!cookie["se_id"]) return;
    setLoading(true);
    const request = await fetch(`/api/overlays/show-shared/${cookie["se_tag"]}`, { method: "GET" });
    const response = await request.json();

    if (response.status == "failed") {
      deleteCookie("se_id");
      deleteCookie("se_tag");
      deleteCookie("se_username");
      window.location.reload();
    }

    setQuicklink(`${origin}/install`);
    setSharedOverlays(response);
    setLoading(false);
  }

  async function confirmDialog(e) {
    e.preventDefault();
    const data = e.currentTarget.dataset;

    const dialog = document.querySelector("#unshare-overlay");
    document.querySelector("#dialog-overlay-name").innerHTML = data.overlayName;
    document.querySelector("#dialog-overlay-code").innerHTML = data.overlayCode;

    setOverlayToDelete({ overlay_code: data.overlayCode });

    dialog.style.marginLeft = "auto";
    dialog.showModal();
  }

  async function unshareOverlay(e) {
    e.preventDefault();
    const dialog = document.querySelector("#unshare-overlay");
    await fetch(`/api/overlays/unshare/${cookie["se_tag"]}`, {
      method: "POST",
      body: JSON.stringify({ code: overlayToDelete.overlay_code }),
    });

    overlayShowShared();
    dialog.close();
  }

  async function copyCode(event, data) {
    const dialog = document.querySelector("#copy-success");
    navigator.clipboard.writeText(data/* event.target.textContent */);

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
            <p><button id="remove-integration" type="button" onClick={() => openDialog({ pathName })}>Remove integration</button></p>
            <h2 className="title">Shared overlays</h2>
            <h3 className="subtitle">
              Here you can see all overlays you have shared. Check the code again or simply remove the overlay so it is not shared anymore:
            </h3>
            <div className="main" id="overlay-list">

              {loading && !sharedOverlays.length && <p>Loading...</p>}
              {!loading && !sharedOverlays.length && <p>No shared overlays</p>}
              {sharedOverlays.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th style={{ padding: "0.4rem" }}>Name</th>
                      <th className="table-code" style={{ padding: "0.4rem" }}>Code (click to copy)</th>
                      <th className="table-quicklink" style={{ padding: "0.4rem" }}>Quick link (click to copy)</th>
                      <th style={{ padding: "0.4rem" }}>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharedOverlays.map((overlay) =>
                    (
                      <tr key={overlay.code}>
                        <th className="pointer" style={{ padding: "0.4rem" }} onClick={(event) => copyCode(event, `${quicklink}/${overlay.code}`)}>{overlay.name}</th>
                        <td className="table-code pointer" style={{ cursor: "pointer" }} onClick={(event) => copyCode(event, overlay.code)}>{overlay.code}</td>
                        <td className="table-quicklink pointer" onClick={(event) => copyCode(event, `${quicklink}/${overlay.code}`)}>{`${quicklink}/${overlay.code}`}</td>
                        <td>
                          <a href="#"
                            data-overlay-code={overlay.code}
                            data-overlay-name={overlay.name}
                            data-overlay-image={overlay.image}
                            onClick={e => confirmDialog(e)}>🗑️
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </div>
            <Dialog />
            {/* <dialog id="copy-success" style={{ visibility: "visible", marginLeft: "10px", backgroundColor: "var(--popup-color)" }}>Quicklink copied to clipboard</dialog> */}
            <dialog id="unshare-overlay" style={{ backgroundColor: "rgba(255,0,0,0.3)" }}>
              <h3 id="dialog-title">Are you sure you want to unshare this overlay?</h3>
              <div>
                <span><strong>Overlay name: </strong></span> <span id="dialog-overlay-name"></span>
              </div>
              <div>
                <span><strong>Overlay code: </strong></span> <span id="dialog-overlay-code"></span>
              </div><br />
              <div id="dialog-copy">
                <button style={{ padding: "0.5rem", marginRight: "0.5rem" }} id="copy" onClick={unshareOverlay}>Sure, unshare it!</button>
                <button style={{ padding: "0.5rem", marginRight: "0.5rem" }} id="cancel" onClick={() => document.querySelector("#unshare-overlay").close()}>Cancel</button>
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
