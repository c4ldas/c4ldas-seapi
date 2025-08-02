"use client"

import Header from "@/app/components/Header";
import Linkbox from "@/app/components/Linkbox";
import FooterComponent from "@/app/components/Footer";


export default function Overlays() {

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Overlays</h1>
        <hr />
        <h2 className="title">Share / Install overlays</h2>
        <h3 className="subtitle">Use the buttons below to generate a code and share your own overlay or install it from a code sent to you.</h3>
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
            link="/show-shared"
            image=""
          />
        </div>

      </main >
      <FooterComponent />
    </div >
  );
}
