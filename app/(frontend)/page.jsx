"use client"

import Header from "@/app/components/Header";
import Linkbox from "@/app/components/Linkbox";
import FooterComponent from "@/app/components/Footer";

import { useEffect, useState } from "react";
// import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const [widgets, setWidgets] = useState(null);
  const [error, setError] = useState(null);

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

  /*   
  function collapseMenu(event) {
    const element = event.currentTarget;
    element.classList.toggle("active");
    var item = element.nextElementSibling;
    if (item.style.maxHeight) {
      item.style.maxHeight = null;
    } else {
      item.style.maxHeight = item.scrollHeight + "px";
    }
  }
 */

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Overlays</h1>
        <hr />

        <h2 className="title">Share / Install overlays</h2>
        <h3 className="subtitle">
          Use the buttons below to generate a code and share your own overlay or install it from a code sent to you
        </h3>
        <div className="main">
          <Linkbox
            title="Share overlay / widget"
            description="Generate a code to share your overlay / widget"
            link="/login"
          />
          <Linkbox
            title="Install overlay / widget"
            description="Install the overlay into your account using a code"
            link="/install"
          />
        </div>
        <hr />

        <h2 className="title">Custom widgets</h2>
        <h3 className="subtitle">
          The widgets below are created by me to the community.
          Click on any of them to have more information about it and instructions to install it.</h3>
        <div className="main">
          {error &&
            <p className="error">
              Error loading widgets.
              Please visit Github page directly on
              <Link style={{ backgroundColor: "var(--linkbox-background-color)" }} href="https://github.com/c4ldas/streamelements-widgets">
                https://github.com/c4ldas/streamelements-widgets
              </Link>
            </p>}
          {widgets && widgets.map((widget) => (
            <Linkbox
              key={widget.widgetFolder}
              title={widget.widgetName}
              description={widget.widgetDescription}
              link={`https://github.com/c4ldas/streamelements-widgets/tree/main/${widget.widgetFolder}`}
            />
          ))}
        </div>
      </main >
      <FooterComponent />
    </div >
  );
}
