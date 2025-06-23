"use client";

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useEffect, useState } from "react";
import { encodeData } from "@/app/lib/streamelements";
import { getCookies } from "cookies-next";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Dialog, openDialog } from "@/app/components/Dialog";

export default function Generate({ request, searchParams }) {
  const error = searchParams.error;
  const pathName = usePathname();

  const [cookie, setCookie] = useState({});
  const [encoded, setEncoded] = useState("");
  const [code, setCode] = useState("");
  const [origin, setOrigin] = useState();

  useEffect(() => {
    // Encoded data will follow the pattern for callback: group_URLPath_timestamp. 
    // "Group" is used to separate scopes on /login page.
    // "URLPath" is the path used on callback page.
    // "Timestamp" is generated on the server. So, when encoded, the encoded data will look like this: chatCommand_generate-list_1749237834453
    setEncoded(encodeData("chatCommand_chat-commands/install-list"));
    setCookie(getCookies());
    setOrigin(window.location.origin);
  }, [cookie.se_id]);

  async function installList() {
    /*     
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
     */
  }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Install command list</h1>
        <hr />
        {!cookie.se_id &&
          <>
            <h2 className="title">Login with Streamelements</h2>
            <h3 className="subtitle">
              You can use this page to install a list of the custom command to your channel. Use it after obtaining the list from generate command list page.
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
            <h2 className="title">Install command list</h2>
            <h3 className="subtitle">
              Click below to upload the list of custom commands and install on your channel.
            </h3>

            <div className="main" id="overlay-list">
              <form>
                <input type="file" id="file" accept=".json" onChange={(e) => setCode(e.target.value)} />
                <button type="submit" onClick={installList}>Install</button>
              </form>
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
