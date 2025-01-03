"use client"

import Header from "@/app/components/Header"
import FooterComponent from "@/app/components/Footer"
import { useState } from "react";
import { getAccountInfo, getLeaderboardToDownload } from "@/app/lib/streamelements";

export default function Leaderboard() {

  const [username, setUsername] = useState("");
  const [radio, setRadio] = useState("");
  const [amount, setAmount] = useState("");
  const [offset, setOffset] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    const accountInfo = await getAccountInfo(username);
    const data = {
      username: username,
      accountId: accountInfo._id,
      radio: radio,
      amount: amount,
      offset: offset
    }

    const response = await getLeaderboardToDownload(data);

    const title = Object.keys(response.users[0]).toString();
    const lineBreak = '\r\n';
    let text = title + lineBreak;

    response.users.forEach((element) => text += Object.values(element).toString() + lineBreak)

    // Create a Blob object with the CSV content
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });

    // Create a URL for the Blob and a link element for downloading
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'leaderboard.csv';

    // Add the link to the document body and trigger a click event to download
    document.body.appendChild(a);
    a.click();

    // Clean up by revoking the Blob URL
    window.URL.revokeObjectURL(url);

    setIsLoading(false);
  }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Streamelements Leaderboard CSV download</h1>
        <hr />
        <h2 className="title">Download CSV file</h2>
        <h3 className="subtitle">
          Here you can download the Streamelements leaderboard in CSV format.
          <br />
          Just type the Twitch channel name below, choose one of the options and click on Download button.
        </h3>
        <form id="form" onSubmit={handleSubmit} className="csv-leaderboard" style={{ paddingTop: "10px" }}>
          <input type="text" id="user" className="se-code" placeholder="Twitch Channel name" onChange={e => setUsername(e.target.value)} required={true} />
          <br></br>
          <div style={{ margin: "0.5rem", fontSize: "1.1rem" }}>
            <input style={{ marginTop: "0.6rem" }} id="top" type="radio" name="radio" value="top" onClick={e => setRadio(e.target.value)} required={true} />
            <label style={{ marginTop: "0.6rem", marginLeft: "0.5rem" }} htmlFor="top">Top (default)</label><br></br>

            <div style={{ display: radio === "top" ? "block" : "none" }}>
              <input required={radio === "top" ? true : false} type="number" id="amount" style={{ marginTop: "0.6rem", padding: "0.5rem", fontSize: "1.1rem" }} className="" placeholder="Amount (max 1000)" onChange={e => setAmount(e.target.value)} /><br />
              <input required={radio === "top" ? true : false} type="number" id="offset" style={{ marginTop: "0.6rem", padding: "0.5rem", fontSize: "1.1rem" }} className="" placeholder="Offset (default 0)" onChange={e => setOffset(e.target.value)} /><br />
            </div>

            <input style={{ marginTop: "0.6rem" }} id="alltime" type="radio" name="radio" value="alltime" onClick={e => setRadio(e.target.value)} required={true} />
            <label style={{ marginTop: "0.6rem", marginLeft: "0.5rem" }} htmlFor="alltime">Alltime</label><br></br>
          </div>
          <input type="submit" id="se-download-leaderboard" className="se-download-leaderboard" value="Download CSV" />
        </form>
        {isLoading && <div className="loading">Loading...</div>}
      </main>
      <FooterComponent />
    </div >
  )
}
