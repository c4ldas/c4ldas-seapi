"use client"

import Image from "next/image";
import Link from "next/link";
import DarkMode from "./DarkMode";

export default function Header() {

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
      <DarkMode />
    </header>
  )
}

