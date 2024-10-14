"use client";
import { useEffect } from "react";

// This page is created due to inability to change the callback URL on Streamelements oAuth (yet)
// It just redirects to /api/callback
export default function Callback({ _, searchParams }) {

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    window.location.assign(`${window.location.origin}/api/callback?${params}`);
  }, [searchParams]);

  return null;
}