"use client"

import Header from "@/app/components/Header";
import Linkbox from "@/app/components/Linkbox";
import FooterComponent from "@/app/components/Footer";


export default function Commands() {

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Overlays</h1>
        <hr />

        <h2 className="title">Command transfer system</h2>
        <h3 className="subtitle">Use the buttons below to transfer chat commands from one channel to another.</h3>
        <div className="main">
          <Linkbox
            title="Generate command list"
            description="Import all public commands from your channel."
            link="/chat-commands/generate-list"
            image=""
          />
          <Linkbox
            title="Install commands"
            description="Export the command list to your destination channel."
            link="/chat-commands/install-list"
            image=""
          />
        </div>

      </main >
      <FooterComponent />
    </div >
  );
}
