"use client";

import Header from "@/app/components/Header";
import { Dialog, openDialog } from "@/app/components/Dialog";
import FooterComponent from "@/app/components/Footer";

import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import Link from "next/link";

export default function Install({ _, searchParams }) {
  const error = searchParams.error;
  const isLoading = false;

  const [cookie, setCookie] = useState({});
  const [code, setCode] = useState();

  useEffect(() => {
    setCookie(getCookies());
  }, [cookie.se_id]);



  ////////////////////////////////////////
  // Install the overlay using the code //
  ////////////////////////////////////////
  async function handleSubmit(e) {
    e.preventDefault();
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
              You can use this page to install the overlay code you received. Click on the button below to login with Streamelements.
              <br />
              Once you clicked and authorized the page, you can type the code to have it installed in your Streamelements account.
            </h3>
            <div className="main">
              <Link href="/login?state=overlay_install">
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
            <p><button id="remove-integration" type="submit" onClick={openDialog}>Remove integration</button></p>
            <form id="form" onSubmit={handleSubmit} className="form" style={{ paddingTop: "10px" }}>
              <input type="text" id="se-code" className="se-code" placeholder="Type the overlay code here" onChange={e => setCode(e.target.value)} required={true} />
              <input type="submit" id="se-install-overlay" className="se-install-overlay" value="Install overlay" />
              {isLoading && (<div id="loading" className="loading">Loading...</div>)}
            </form>
            <Dialog />
          </>
        }
        {error && <p>Error: {error}</p>}
      </main>
      <FooterComponent />
    </div>
  );
}