"use client";
import { useEffect } from "react";

// This page is created due to inability to change the callback URL on Streamelements oAuth (yet)
// It just redirects to /api/callback
export default function Callback({ _, searchParams }) {

  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    const interval = setInterval(() => {
      // const params = new URLSearchParams(searchParams);

      console.log(params);

      if (params.size) {
        clearInterval(interval);
        window.location.assign(`${window.location.origin}/api/callback?${params}`);
      }
    }, 1000);

    //const params = new URLSearchParams(searchParams);
    //console.log("params:", params)
    //window.location.assign(`${window.location.origin}/api/callback?${params}`);
  }, [params.size]);

  return null;
}