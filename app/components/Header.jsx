"use client"

import Image from "next/image";
import Link from "next/link";
import DarkMode from "./DarkMode";

export default function Header(props) {

  return (
    <header className="header">
      <Link href="/">
        <Image
          src="/images/logo.webp"
          className="image"
          alt="Avatar image"
          width={300}
          height={300}
          quality={100}
          priority={true}
          placeholder="empty"
        />
      </Link>
      <div className="header-links">
        <Link id="home" href="/"><div style={{ color: "var(--color)" }}>Home</div></Link>
        <Link id="share" href="/share"><div style={{ color: "var(--color)" }}>Share overlay</div></Link>
        <Link id="install" href="/install"><div style={{ color: "var(--color)" }}>Install overlay</div></Link>
        <Link id="show-shared" href="/show-shared"><div style={{ color: "var(--color)" }}>Overlays shared</div></Link>
        <Link id="endpoints" href="/redemptions"><div style={{ color: "var(--color)" }}>Redemptions</div></Link>
        <Link id="leaderboard" href="/leaderboard"><div style={{ color: "var(--color)" }}>Leaderboard</div></Link>
        <Link id="endpoints" href="/endpoints"><div style={{ color: "var(--color)" }}>Endpoints</div></Link>
      </div>

      <DarkMode />
    </header>
  )
}

