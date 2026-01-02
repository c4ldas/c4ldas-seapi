"use client";

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useEffect, useState } from "react";
import { getCookies } from "cookies-next";
import { usePathname } from "next/navigation";
import Linkbox from "@/app/components/Linkbox";
import { Dialog, openDialog } from "@/app/components/Dialog";
import LoggedUser from "@/app/components/LoggedUser";

const action = "command/generate";

export default function Generate({ _, searchParams }) {
  const error = searchParams.error;
  const pathName = usePathname();

  const [cookie, setCookie] = useState({});
  const [href, setHref] = useState(`/login?action=${action}`);

  useEffect(() => {
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const url = `/login?action=${action}${isLocalhost ? `&env=dev` : ""}`;
    setHref(url);
    setCookie(getCookies());
  }, [cookie.se_id]);

  async function downloadList() {
    if (!cookie["se_id"]) return;
    try {

      const request = await fetch(`/api/chat-commands/download/${cookie["se_tag"]}`, { method: "POST" });
      const response = await request.blob();

      const url = URL.createObjectURL(response);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${cookie['se_id']}_command_list.json`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Generate command list</h1>
        <hr />
        {!cookie.se_id &&
          <>
            <h2 className="title">Login with Streamelements</h2>
            <h3 className="subtitle">
              You can use this page to generate the custom command list from your channel. Useful to have as a backup or to transfer to another channel.
              <br /><br />
              Click on the button below to login with Streamelements:
            </h3>
            <div className="main">
              <a href={href}>
                <button type="submit" style={{ padding: "0.5rem" }}>Login with Streamelements</button>
              </a>
            </div>
          </>
        }
        {cookie.se_id &&
          <>
            <LoggedUser username={cookie.se_username} id={cookie.se_id} provider={cookie.se_provider} avatar={atob(cookie.user_avatar)} />
            <hr />
            <span style={{ color: "red" }}>Make sure you have selected the correct channel and platform to download the command list. Otherwise, click on the button below to logout.</span>
            <hr />
            <p><button id="remove-integration" type="submit" onClick={() => openDialog({ pathName })}>Logout</button></p>
            <h2 className="title">Generate command list</h2>
            <h3 className="subtitle">
              Click below to download the list of custom commands of your channel.
            </h3>
            <div className="main" id="overlay-list">
              <Linkbox
                a="true" link="#"
                title={`Download`} image={""}
                description={`Click to download the list of custom commands of your channel.`}
                onClick={downloadList}
              />
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
