"use client";

import { useState, useEffect } from "react";
import { emergencyNumbersByCountry } from "@/lib/emergencyNumbers";
import type { EmergencyNumber } from "@/lib/emergencyNumbers";
import { getLocation, getLocationErrorMessage } from "@/lib/getLocation";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PrimaryButton({ num }: { num: EmergencyNumber }) {
  return (
    <a
      href={`tel:${num.number}`}
      className="flex items-center justify-between w-full min-h-[88px] px-6 py-5 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-900/40 transition-colors"
      aria-label={`Call ${num.number} — ${num.label}`}
    >
      <div>
        <div className="text-5xl font-black tracking-tight leading-none">
          {num.number}
        </div>
        <div className="text-base font-semibold mt-1.5 opacity-90">
          {num.label}
        </div>
        {num.description && (
          <div className="text-sm opacity-70 mt-0.5">{num.description}</div>
        )}
      </div>
      <PhoneIcon className="w-10 h-10 shrink-0 ml-4 opacity-90" />
    </a>
  );
}

function SecondaryButton({ num }: { num: EmergencyNumber }) {
  return (
    <a
      href={`tel:${num.number}`}
      className="flex flex-col items-center justify-center min-h-[80px] px-3 py-4 rounded-2xl bg-gray-800 hover:bg-gray-700 active:bg-gray-900 text-white border border-gray-700 transition-colors text-center"
      aria-label={`Call ${num.number} — ${num.label}`}
    >
      <PhoneIcon className="w-5 h-5 mb-1.5 text-gray-400" />
      <div className="text-3xl font-black tracking-tight leading-none">
        {num.number}
      </div>
      <div className="text-xs font-semibold mt-1.5 text-gray-300 leading-tight">
        {num.label}
      </div>
    </a>
  );
}

export default function HomePage() {
  const [country, setCountry] = useState("IN");
  const [isOnline, setIsOnline] = useState(true);
  const [sosLoading, setSosLoading] = useState(false);
  const [sosError, setSosError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("roadsos_country");
      if (saved === "IN" || saved === "US") setCountry(saved);
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  function selectCountry(code: string) {
    setCountry(code);
    localStorage.setItem("roadsos_country", code);
  }

  const numbers = emergencyNumbersByCountry[country] ?? emergencyNumbersByCountry.IN;
  const primary = numbers.find((n) => n.primary);
  const secondary = numbers.filter((n) => !n.primary);

  async function handleSos() {
    setSosLoading(true);
    setSosError(null);
    try {
      const loc = await getLocation();
      const body = `EMERGENCY — I need help. My location: https://maps.google.com/?q=${loc.lat},${loc.lng} (Accuracy: ${Math.round(loc.accuracy)}m)`;
      window.location.href = `sms:112?body=${encodeURIComponent(body)}`;
    } catch (err) {
      setSosError(getLocationErrorMessage(err));
    } finally {
      setSosLoading(false);
    }
  }

  return (
    <main className="flex flex-col min-h-dvh px-4 pt-8 pb-6 max-w-md mx-auto">
      <div className="flex justify-center mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isOnline
              ? "bg-green-900/40 text-green-400"
              : "bg-red-900/40 text-red-400"
          }`}
        >
          {isOnline ? "🟢 Online" : "🔴 Offline mode"}
        </span>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {["IN", "US"].map((code) => (
          <button
            key={code}
            onClick={() => selectCountry(code)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              country === code
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {code === "IN" ? "🇮🇳 India" : "🇺🇸 USA"}
          </button>
        ))}
      </div>

      <header className="mb-8 text-center">
        <h1 className="text-4xl font-black tracking-tight text-white">
          Road<span className="text-red-500">SoS</span>
        </h1>
        <p className="mt-1 text-gray-400 text-sm font-medium">
          Emergency help, one tap away
        </p>
        <p className="mt-3 text-gray-300 text-base font-medium">
          Tap any number to call instantly
        </p>
      </header>

      {primary && (
        <section aria-label="Primary emergency number" className="mb-4">
          <PrimaryButton num={primary} />
        </section>
      )}

      <section
        aria-label="Other emergency numbers"
        className="grid grid-cols-2 gap-3"
      >
        {secondary.map((num) => (
          <SecondaryButton key={num.number} num={num} />
        ))}
      </section>

      <section aria-label="Send SOS with location" className="mt-6">
        <button
          onClick={handleSos}
          disabled={sosLoading}
          className="flex items-center justify-center w-full min-h-[72px] px-6 py-5 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xl font-black shadow-lg shadow-red-900/40 transition-colors"
          aria-label="Send SOS text with my GPS location"
        >
          {sosLoading ? "Getting location…" : "🚨 Send SOS with My Location"}
        </button>
        <p className="mt-2 text-center text-xs text-gray-500">
          Opens your texting app with location pre-filled
        </p>
        {sosError && (
          <p className="mt-2 text-center text-sm text-red-400" role="alert">
            {sosError}
          </p>
        )}
      </section>

      <footer className="mt-8 text-center text-xs text-gray-500 leading-relaxed">
        Works offline.{" "}
        <span className="text-gray-400">
          Calls use your phone&apos;s cellular network.
        </span>
      </footer>
    </main>
  );
}
