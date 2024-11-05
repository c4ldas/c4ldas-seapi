"use client";

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useEffect, useState } from "react";
import Image from "next/image";

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
        <div className="main block">
          <h2 className="title">Endpoints for Twitch chat</h2>
          <h3 className="subtitle">
            I created some endpoints so you can use in your stream chat to automate the process.
            <br />
            At the moment, these are the available ones. If you have any idea for a new one, you can contact me and I will try to help you to create it.
            <br />
          </h3>

          <h2>Top leaderboard</h2>
          <p>Shows the top <span className="red">5</span> users in the leaderboard. You can change the amount of users and the order. You can also opt to show points.</p>
          <div className="code">.me $(touser) ► $(customapi.{origin}/api/top/$(channel)?amount=<span className="red">5</span>&points=<span className="red">true</span>&order=<span className="red">asc</span>)</div>
          <p><span className="red">amount</span>: any number from 1 to 1000. The amount of users that will be shown in the response.</p>
          <p><span className="red">points</span>: true or false. If true, the points will be shown in the response.</p>
          <p><span className="red">order</span>: asc or desc. The order in which the users will be shown in the response.</p>
          <h3>Example response:</h3>
          <Image src="/images/leaderboard.png" width={433} height={668} alt="Leaderboard" />
          <br />

          <h2>Top watchtime</h2>
          <p>Shows the top <span className="red">5</span> users that have watched the most your stream. You can change the amount of users and the order. You can also opt to show the time watched.</p>
          <div className="code">.me $(touser) ► $(customapi.{origin}/api/watchtime/$(channel)?amount=<span className="red">5</span>&minutes=<span className="red">true</span>&order=<span className="red">asc</span>)</div>
          <p><span className="red">amount</span>: any number from 1 to 1000. The amount of users that will be shown in the response.</p>
          <p><span className="red">minutes</span>: true or false. If true, time will be shown in the response.</p>
          <p><span className="red">order</span>: asc or desc. The order in which the users will be shown in the response.</p>
          <h3>Example response:</h3>
          <Image src="/images/watchtime.png" width={433} height={668} alt="Leaderboard" />
          <br />
        </div>
      </main>
      <FooterComponent />
    </div >
  );
}
