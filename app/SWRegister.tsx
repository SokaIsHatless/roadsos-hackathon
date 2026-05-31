// File: app/SWRegister.tsx
"use client";

import { useEffect } from "react";

export default function SWRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[SW] Registered successfully:", registration.scope);
        })
        .catch((err) => {
          console.error("[SW] Registration failed:", err);
        });
    }
  }, []);

  return null; // renders nothing
}