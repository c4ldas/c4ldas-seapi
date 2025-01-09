"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { encodeData } from "@/app/lib/streamelements";

export default function Share({ _, searchParams }) {
  const [encoded, setEncoded] = useState("");

  useEffect(() => {
    setEncoded(encodeData("full-auth_auth"));
  }, []);

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Account Info</h1>
        <hr />
        <h2 className="title">Login with Streamelements</h2>
        <h3 className="subtitle">
          Check the data info for your account.
          <br /><br />
          Click on the button below to login with Streamelements:
        </h3>
        <div className="main">
          <Link href={`/login?state=${encoded}`}>
            <button type="submit" style={{ padding: "0.5rem" }}>Login with Streamelements</button>
          </Link>
        </div>
      </main>
      <FooterComponent />
    </div >
  );
}
