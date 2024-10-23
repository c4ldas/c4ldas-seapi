"use client";

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useEffect, useState } from "react";

export default function Endpoints({ request, searchParams }) {

  const [origin, setOrigin] = useState(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Endpoints</h1>
        <hr />
        <>
          <h2 className="title">Endpoints for Twitch chat</h2>
          <h3 className="subtitle">
            I created some endpoints so you can use in your stream chat to automate the process.
            <br />
            At the moment, these are the available ones. If you have any idea for a new one, you can contact me and I will try to help you to create it.
            <br /><br />
          </h3>
          <h2>Top leaderboard</h2>
          <code>{origin}/api/top/[username]</code>
          <h2>Top watchtime</h2>
          <code>{origin}/api/watchtime/[username]</code>
          <h2>Youtube search</h2>
          <code>https://c4ldas.com.br/api/youtube/search/[videoId]?type=text</code>
          <div className="main">

          </div>
        </>


      </main>
      <FooterComponent />
    </div >
  );
}
