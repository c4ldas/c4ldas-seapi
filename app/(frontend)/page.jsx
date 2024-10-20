"use client"

import Header from "@/app/components/Header";
import Linkbox from "@/app/components/Linkbox";
import FooterComponent from "@/app/components/Footer";

import { useEffect, useState } from "react";
import Link from "next/link";
// import Image from "next/image";

export default function Home({ _, searchParams }) {

  const [widgets, setWidgets] = useState(null);
  const [error, setError] = useState(null);


  const seError = searchParams.error;

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await fetch("/api/github/widgets");
        const response = await request.json();

        if (response.error) throw new Error(response.error);
        setWidgets(response);
        setError(null);

      } catch (error) {
        setError(error.message);
        setWidgets(null);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Overlays</h1>
        <hr />

        <h2 className="title">Share / Install overlays</h2>
        <h3 className="subtitle">
          Use the buttons below to generate a code and share your own overlay or install it from a code sent to you.
        </h3>
        <div className="main">
          <Linkbox
            title="Share overlay / widget"
            description="Generate a code to share your Streamelements overlay / widget."
            link="/share"
            image=""
          />
          <Linkbox
            title="Install overlay / widget"
            description="Install the overlay into your Streamelements account using a code."
            link="/install"
            image=""
          />
          <Linkbox
            title="My shared overlays / widgets"
            description="See your shared overlays / widgets, confirm the code or unshare them."
            link="/show"
            image=""
          />
        </div>
        {seError && <p className="error red">Error: {seError}</p>}
        <hr />

        <h2 className="title">Custom widgets</h2>
        <h3 className="subtitle">
          The widgets below were created by me to the community.
          Click on any of them to have more information about it or to install it.</h3>
        <div className="main">
          {widgets && widgets.map((widget) => (
            <Linkbox
              key={widget.widget_folder}
              title={widget.widget_name}
              description={widget.widget_description}
              link={`https://github.com/c4ldas/streamelements-widgets/tree/main/${widget.widget_folder}`}
              image=""
            />
          ))}
          {error &&
            <p className="error">
              Error loading widgets.
              Please visit Github page directly clicking on the button below:
              <br />
              <Link href="https://github.com/c4ldas/streamelements-widgets">
                <button style={{ cursor: "pointer", padding: "0.3rem", backgroundColor: "var(--linkbox-background-color)" }}>https://github.com/c4ldas/streamelements-widgets</button>
              </Link>
            </p>}
        </div>
      </main >
      <FooterComponent />
    </div >
  );
}
