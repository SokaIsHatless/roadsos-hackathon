"use client";

import Link from "next/link";
import { useState } from "react";

import {
  getLocation,
  getLocationErrorMessage,
} from "@/lib/getLocation";

export type NearbyService = {
  name: string;
  type: string;
  phone: string | null;
  lat: number;
  lng: number;
  distanceKm: number;
};

export type NearbyResponse = {
  services: NearbyService[];
  source: string;
};

type FilterKey =
  | "all"
  | "hospital"
  | "police"
  | "fire_station"
  | "blood_bank"
  | "ambulance";

type ViewState =
  | "idle"
  | "loading-location"
  | "loading-services"
  | "done"
  | "error";

type TypePresentation = {
  emoji: string;
  label: string;
  badgeClassName: string;
};

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "hospital", label: "Hospital" },
  { key: "police", label: "Police" },
  { key: "fire_station", label: "Fire" },
  { key: "blood_bank", label: "Blood Bank" },
];

const TYPE_STYLES: Record<string, TypePresentation> = {
  hospital: {
    emoji: "🏥",
    label: "Hospital",
    badgeClassName: "bg-red-500/15 text-red-200 border border-red-500/30",
  },
  police: {
    emoji: "👮",
    label: "Police",
    badgeClassName: "bg-blue-500/15 text-blue-200 border border-blue-500/30",
  },
  fire_station: {
    emoji: "🚒",
    label: "Fire",
    badgeClassName: "bg-orange-500/15 text-orange-200 border border-orange-500/30",
  },
  blood_bank: {
    emoji: "🩸",
    label: "Blood Bank",
    badgeClassName: "bg-pink-500/15 text-pink-200 border border-pink-500/30",
  },
  ambulance: {
    emoji: "🚑",
    label: "Ambulance",
    badgeClassName: "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30",
  },
};

function getTypePresentation(type: string): TypePresentation {
  return (
    TYPE_STYLES[type] ?? {
      emoji: "📍",
      label: type.replace(/_/g, " ") || "Service",
      badgeClassName: "bg-gray-700 text-gray-200 border border-gray-600",
    }
  );
}

function normalizeNearbyResponse(payload: unknown): NearbyResponse {
  const source =
    typeof payload === "object" && payload !== null && "source" in payload
      ? String(payload.source ?? "unknown")
      : "unknown";

  const rawServices =
    typeof payload === "object" && payload !== null
      ? "services" in payload && Array.isArray(payload.services)
        ? payload.services
        : "results" in payload && Array.isArray(payload.results)
          ? payload.results
          : []
      : [];

  const services = rawServices
    .map((service) => {
      if (typeof service !== "object" || service === null) {
        return null;
      }

      return {
        name:
          typeof service.name === "string" && service.name.trim().length > 0
            ? service.name
            : "Unknown service",
        type: typeof service.type === "string" ? service.type : "unknown",
        phone: typeof service.phone === "string" ? service.phone : null,
        lat: typeof service.lat === "number" ? service.lat : 0,
        lng: typeof service.lng === "number" ? service.lng : 0,
        distanceKm:
          typeof service.distanceKm === "number" ? service.distanceKm : Number.POSITIVE_INFINITY,
      } satisfies NearbyService;
    })
    .filter((service): service is NearbyService => service !== null)
    .sort((left, right) => left.distanceKm - right.distanceKm);

  return { services, source };
}

function formatSource(source: string): string {
  if (!source) {
    return "Unknown";
  }

  return source.charAt(0).toUpperCase() + source.slice(1);
}

function formatDistance(distanceKm: number): string {
  if (!Number.isFinite(distanceKm)) {
    return "Distance unavailable";
  }

  return `${distanceKm.toFixed(1)} km away`;
}

export default function NearbyServicesPage() {
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [services, setServices] = useState<NearbyService[]>([]);
  const [source, setSource] = useState("unknown");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filteredServices = services.filter((service) => {
    if (activeFilter === "all") {
      return true;
    }

    return service.type === activeFilter;
  });

  async function handleFindNearby() {
    setErrorMessage("");
    setServices([]);
    setSource("unknown");
    setActiveFilter("all");
    setViewState("loading-location");

    try {
      const location = await getLocation();

      setViewState("loading-services");

      const url = `/api/nearby?lat=${location.lat}&lng=${location.lng}&radius=5000`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("BACKEND_FETCH_FAILED");
      }

      const payload = (await response.json()) as unknown;
      const normalized = normalizeNearbyResponse(payload);

      setServices(normalized.services);
      setSource(normalized.source);
      setViewState("done");
    } catch (error) {
      if (error instanceof Error) {
        const locationErrors = new Set([
          "GEOLOCATION_UNSUPPORTED",
          "PERMISSION_DENIED",
          "POSITION_UNAVAILABLE",
          "TIMEOUT",
          "UNKNOWN_LOCATION_ERROR",
        ]);

        if (locationErrors.has(error.message)) {
          setErrorMessage(getLocationErrorMessage(error));
        } else {
          setErrorMessage(
            "Couldn't reach nearby services. You can still call the emergency numbers.",
          );
        }
      } else {
        setErrorMessage(
          "Couldn't reach nearby services. You can still call the emergency numbers.",
        );
      }

      setViewState("error");
    }
  }

  return (
    <main className="min-h-dvh bg-gray-950 px-4 py-6 text-white">
      <div className="mx-auto flex max-w-md flex-col gap-5">
        <Link
          href="/"
          className="inline-flex w-fit items-center text-sm font-medium text-gray-300 transition-colors hover:text-white"
        >
          ← Back
        </Link>

        <header className="rounded-3xl border border-gray-800 bg-gray-900/80 p-5 shadow-xl shadow-black/20">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">
            Nearby Services Finder
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
            Find help close to you
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-300">
            Tap below to find emergency services near you. Requires
            location access.
          </p>
        </header>

        <button
          type="button"
          onClick={handleFindNearby}
          disabled={
            viewState === "loading-location" || viewState === "loading-services"
          }
          className="min-h-[88px] rounded-3xl bg-red-600 px-6 py-5 text-left shadow-lg shadow-red-950/40 transition-colors hover:bg-red-500 active:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-800"
        >
          <span className="block text-xl font-black tracking-tight text-white">
            Find Nearby Help
          </span>
          <span className="mt-1 block text-sm font-medium text-red-100/90">
            Uses your phone&apos;s GPS to search within 5 km.
          </span>
        </button>

        {viewState === "loading-location" && (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 px-4 py-4 text-sm text-gray-200">
            Getting your location...
          </div>
        )}

        {viewState === "loading-services" && (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 px-4 py-4 text-sm text-gray-200">
            Searching for nearby services...
          </div>
        )}

        {viewState === "error" && (
          <section className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm font-medium leading-6 text-red-100">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={handleFindNearby}
              className="mt-4 min-h-11 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-950 transition-colors hover:bg-gray-100"
            >
              Try Again
            </button>
          </section>
        )}

        {viewState === "done" && services.length > 0 && (
          <section className="space-y-4">
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {FILTERS.map((filter) => {
                const isActive = filter.key === activeFilter;

                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setActiveFilter(filter.key)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? "border-red-500 bg-red-600 text-white"
                        : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600 hover:text-white"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              {filteredServices.length > 0 ? (
                filteredServices.map((service, index) => {
                  const typePresentation = getTypePresentation(service.type);

                  return (
                    <article
                      key={`${service.name}-${service.lat}-${service.lng}-${index}`}
                      className="rounded-3xl border border-gray-800 bg-gray-900 p-4 shadow-lg shadow-black/20"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="text-lg font-bold leading-6 text-white">
                            {typePresentation.emoji} {service.name}
                          </h2>
                          <p className="mt-2 text-sm text-gray-300">
                            {formatDistance(service.distanceKm)}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${typePresentation.badgeClassName}`}
                        >
                          {typePresentation.label}
                        </span>
                      </div>

                      {service.phone ? (
                        <a
                          href={`tel:${service.phone}`}
                          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500 active:bg-red-700"
                        >
                          Call {service.phone}
                        </a>
                      ) : (
                        <p className="mt-4 text-sm font-medium text-gray-400">
                          No number
                        </p>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-gray-800 bg-gray-900 px-4 py-5 text-sm leading-6 text-gray-300">
                  No services found within 5km. Use the emergency dialer above.
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <span className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-300">
                Data source: {formatSource(source)}
              </span>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}