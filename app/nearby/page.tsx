"use client";

import { useState } from "react";
import { getLocation, getLocationErrorMessage } from "@/lib/getLocation";
import {
  cacheNearby,
  getCachedNearby,
  getAnyCachedNearby,
  type NearbyService,
} from "@/lib/nearbyCache";

type NearbyResult = NearbyService & { distanceKm?: number };

type ApiResponse = {
  count: number;
  source: string;
  results: NearbyResult[];
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

function timeAgo(ts: number): string {
  const minutes = Math.floor((Date.now() - ts) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NearbyPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<NearbyResult[] | null>(null);
  const [cachedAt, setCachedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFind() {
    setLoading(true);
    setError(null);
    setResults(null);
    setCachedAt(null);

    let loc;
    try {
      loc = await getLocation();
    } catch (err) {
      setError(getLocationErrorMessage(err));
      setLoading(false);
      return;
    }

    const { lat, lng } = loc;
    const radius = 5000;

    if (typeof navigator !== "undefined" && navigator.onLine) {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ApiResponse = await res.json();
        const toCache: NearbyService[] = data.results.map(
          ({ name, type, phone, lat: sLat, lng: sLng }) => ({
            name,
            type,
            phone,
            lat: sLat,
            lng: sLng,
          })
        );
        await cacheNearby(lat, lng, radius, toCache);
        setResults(data.results);
        setLoading(false);
        return;
      } catch {
        // network failed — fall through to cache
      }
    }

    // Offline or fetch failed — try exact location cache first
    const exact = await getCachedNearby(lat, lng, radius);
    if (exact) {
      setResults(exact.services);
      setCachedAt(exact.cachedAt);
      setLoading(false);
      return;
    }

    // Try any cached entry regardless of location
    const any = await getAnyCachedNearby();
    if (any) {
      setResults(any.services);
      setCachedAt(any.cachedAt);
      setLoading(false);
      return;
    }

    setError(
      "No internet and no cached data. Use the emergency dialer above."
    );
    setLoading(false);
  }

  return (
    <main className="flex flex-col min-h-dvh px-4 pt-8 pb-6 max-w-md mx-auto">
      <header className="mb-6">
        <a
          href="/"
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Back
        </a>
        <h1 className="text-2xl font-black text-white mt-3">
          Nearby<span className="text-red-500"> Help</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Hospitals, police, pharmacies within 5 km
        </p>
      </header>

      <button
        onClick={handleFind}
        disabled={loading}
        className="w-full min-h-[56px] px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-lg font-bold shadow-lg shadow-red-900/40 transition-colors mb-6"
      >
        {loading ? "Searching…" : "📍 Find Nearby Help"}
      </button>

      {cachedAt !== null && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-300">
          📡 Offline — showing cached results from {timeAgo(cachedAt)}
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm text-center mb-4" role="alert">
          {error}
        </p>
      )}

      {results && results.length === 0 && (
        <p className="text-gray-500 text-sm text-center">
          No services found nearby. Try a larger radius.
        </p>
      )}

      {results && results.length > 0 && (
        <ul className="flex flex-col gap-3">
          {results.map((svc, i) => (
            <li
              key={i}
              className="px-4 py-4 rounded-2xl bg-gray-800 border border-gray-700"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{svc.name}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">
                    {svc.type.replace(/_/g, " ")}
                    {svc.distanceKm !== undefined
                      ? ` · ${svc.distanceKm.toFixed(1)} km`
                      : ""}
                  </p>
                </div>
                {svc.phone && (
                  <a
                    href={`tel:${svc.phone}`}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors"
                  >
                    Call
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
