"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCookies } from "cookies-next";
import Link from "next/link";

import Header from "@/app/components/Header";
import { Dialog, openDialog } from "@/app/components/Dialog";
import FooterComponent from "@/app/components/Footer";

import { encodeData } from "@/app/lib/streamelements";


export default function Redemptions({ _, searchParams }) {
  const error = searchParams.error;
  const pathName = usePathname();

  const [cookie, setCookie] = useState({});
  const [amount, setAmount] = useState("");
  const [offset, setOffset] = useState("");
  const [encoded, setEncoded] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEncoded(encodeData("basic-auth_redemptions"));
    setCookie(getCookies());
  }, [cookie.se_id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    const request = await fetch(`/api/redemptions/download/${cookie["se_tag"]}?` +
      new URLSearchParams({
        amount: amount,
        offset: offset
      }), { method: "GET" });
    const response = await request.json();

    if (response.status == "failed") {
      const dialog = document.querySelector("#download-failed");
      dialog.style.marginLeft = "auto";
      dialog.style.backgroundColor = "rgba(255, 0, 0, 0.4)";
      dialog.showModal();
      document.querySelector("#error-code").innerHTML = `Description: ${response.message}<br />&nbsp`;
      return;
    }

    const title = "Item name, Username, Details, Completed, Time";
    const lineBreak = '\r\n';
    let text = title + lineBreak;

    response.docs.forEach((element) => {
      let username = element.redeemer.username;
      let itemName = element.item?.name || "Item deleted";
      let { input, completed, createdAt, updatedAt } = element;
      text += `${itemName}, ${username}, ${input.toString().replaceAll(",", " / ")}, ${completed}, ${createdAt}` + lineBreak;
    });


    const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'redemptionList.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    setIsLoading(false);
  }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">StreamElements redemptions CSV download</h1>
        <hr />

        {!cookie.se_id &&
          <>
            <h2 className="title">Login with Streamelements</h2>
            <h3 className="subtitle">
              You can use this page to download the user redemption list from your StreamElements store.
              <br />
              After logging in, just click on Download CSV to download all (or some) redemptions in CSV format.
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

            <h3 className="subtitle">
              <p>You can use this page to download the redemptions from your StreamElements store.</p>
              <p>Click on <span className="red">Download CSV</span> button to generate and download the store redemptions from your channel in CSV file.</p>
            </h3>

            <form id="form" onSubmit={handleSubmit} className="csv-redemptions" style={{ paddingTop: "10px" }}>
              <div style={{ display: "block" }}>
                <input required={false} type="number" id="amount" style={{ marginTop: "0.6rem", padding: "0.5rem", fontSize: "1.1rem" }} className="se-code" placeholder="Amount (0 for everything)" onChange={e => setAmount(e.target.value)} /><br />
                <input required={false} type="number" id="offset" style={{ marginTop: "0.6rem", padding: "0.5rem", fontSize: "1.1rem" }} className="se-code" placeholder="Offset (default 0)" onChange={e => setOffset(e.target.value)} /><br /><br />
              </div>
              <input type="submit" id="se-download-redemptions" className="se-download-redemptions" value="Download CSV" />
            </form>
            <p className="italic red">Note: In case it fails to generate the file to download, use a smaller amount and play with offset to download in parts.</p>


            <Dialog />

            <dialog id="download-failed" className="dialog">
              <div id="dialog-title">
                An error has occurred when trying to generate a download link.<br />
                Please remove the integration and try again.<br />&nbsp;
              </div>
              <div id="error-code"></div>
              <div id="dialog-buttons">
                <button id="cancel" type="reset" onClick={() => document.querySelector("#download-failed").close()}>Close popup</button>
              </div>
            </dialog>
          </>
        }

        {isLoading && <div className="loading">Loading...</div>}
      </main>
      <FooterComponent />
    </div >
  )
}
