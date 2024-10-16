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

  useEffect(() => {
    setCookie(getCookies());
    overlayList();
  }, [cookie.se_id]);

  async function overlayList() {
    if (!cookie["se_id"]) return;
    const data = { id: cookie["se_id"], access_token: cookie["se_access_token"] };
    setOverlays((await getOverlays(data)).docs);
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
              {/* <Link href={baseURL + urlSearchParams.toString()}> */}
              <Link href={`/login?state=${encodeData("overlay_share")}`}>
                <button type="submit" style={{ padding: "0.5rem" }}>Login with Streamelements</button>
              </Link>
            </div>
          </>
        }
        {cookie.se_id &&
          <>
            <h2 className="red">Page still in construction, no integration has been done!</h2>
            <p><strong>Channel name:</strong> {cookie.se_username} </p>
            <p><strong>Channel ID:</strong> {cookie.se_id}</p>
            <p><button id="remove-integration" type="submit" onClick={openDialog}>Remove integration</button></p>
            <h2 className="title">Overlay list</h2>
            <h3 className="subtitle">
              Here you can see all overlays you have installed on your account. Click in one of them to generate a sharing code:
            </h3>
            <div className="main" id="overlay-list">
              { /* Create actual boxes with images */}
              {overlays && overlays.map((overlay) => (
                <Linkbox key={overlay._id} link={`/overlays/share/${overlay.channel}/${overlay._id}`} title={`${overlay.name}`} image={overlay.preview.replaceAll(" ", "%20")} />
              ))}
            </div>
            <Dialog />
          </>
        }
        {error && <p className="error red">Error: {error}</p>}
      </main>
      <FooterComponent />
    </div >
  );
}
