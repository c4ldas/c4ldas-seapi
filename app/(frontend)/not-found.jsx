"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Page not found</h1>
        <hr />

        <h3 className="subtitle">
          The page you are looking for could not be found.
        </h3>
        <div className="main">

          <button style={{ padding: "0.5rem" }}
            onClick={() => window.history.length > 1 ? router.back() : router.push('/')} >Go back</button>
        </div>
      </main >
      <FooterComponent />
    </div >
  );
}
