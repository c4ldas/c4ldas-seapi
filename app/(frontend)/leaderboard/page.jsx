"use client"

import Header from "@/app/components/Header"
import FooterComponent from "@/app/components/Footer"
import { useState } from "react";
import { getAccountInfo } from "@/app/lib/streamelements";

export default function Leaderboard() {

  const [username, setUsername] = useState("");
  const [radio, setRadio] = useState("");
  const [amount, setAmount] = useState("");
  const [offset, setOffset] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const data = {
      username: username,
      radio: radio,
      amount: amount,
      offset: offset
    }
    leaderboardDownload(data);
  }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Streamelements Leaderboard CSV download</h1>
        <hr />
        <p className="red" style={{ fontStyle: "italic" }}>This page is still in development. Please check back later.</p>
        <form id="form" onSubmit={handleSubmit} className="csv-leaderboard" style={{ paddingTop: "10px" }}>
          <input type="text" id="user" className="se-code" placeholder="Type your username here" onChange={e => setUsername(e.target.value)} required={true} />
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
          <input type="submit" id="se-install-overlay" className="se-install-overlay" value="Download CSV" />
        </form>
      </main>
      <FooterComponent />
    </div >
  )
}

async function leaderboardDownload(data) {

  try {

    console.log(data.username);
    const accountId = await getAccountInfo(data.username);
    const request = await fetch(`https://api.streamelements.com/kappa/v2/points/${accountId._id}/${data.radio}?offset=${data.offset}&limit=${data.amount}`);
    const response = await request.json();
    console.log(response);


  } catch (error) {
    console.log("leaderboardDownload():", error);
    throw { status: "failed", message: error.message };
  }
}

/*
  // Generating file
  errorMessage.innerText = 'Generating CSV file...'
  errorMessage.style.color = 'blue'
  errorMessage.style.display = 'block'

  const accountIdFetch = await fetch(`https://api.streamelements.com/kappa/v2/channels/${username.value}`);
  const accountIdResponse = await accountIdFetch.json();
  const accountId = accountIdResponse._id;

  if (!accountId) {
    errorMessage.innerText = 'User not found!'
    errorMessage.style.color = 'red'
    errorMessage.style.display = 'block'
  }

  const leaderboardFetch = await fetch(`https://api.streamelements.com/kappa/v2/points/${accountId}/${radio.value}?offset=${offset}&limit=${limit}`);



  const leaderboardResponse = await leaderboardFetch.json();
  const title = Object.keys(leaderboardResponse.users[0]).toString();
  const lineBreak = '\r\n';
  var text = title + lineBreak;

  for (x in leaderboardResponse.users) {
    line = Object.values(leaderboardResponse.users[x]).toString();
    text += line + lineBreak;
  }



  // Create a Blob object with the CSV content
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });

  // Create a URL for the Blob
  const url = window.URL.createObjectURL(blob);

  // Create a link element for downloading
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'leaderboard.csv';

  // Add the link to the document body and trigger a click event to download
  document.body.appendChild(a);
  a.click();

  // Clean up by revoking the Blob URL
  window.URL.revokeObjectURL(url);
  */