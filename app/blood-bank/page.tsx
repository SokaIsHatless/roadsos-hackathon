"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getNearbyBloodBanks,
  type BloodBank,
  type BloodGroup,
} from "@/lib/bloodBank";
import { getLocation } from "@/lib/getLocation";

const ALL_BLOOD_GROUPS: BloodGroup[] = [
  "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-",
];

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

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function BloodDropIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0C19 10.5 12 2 12 2z" />
    </svg>
  );
}

function BackArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BloodBankCard({ bank }: { bank: BloodBank }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-bold leading-snug text-white">
          {bank.name}
        </h2>
        {bank.distanceKm != null && (
          <span className="text-xs text-red-400 font-semibold shrink-0 mt-0.5 whitespace-nowrap">
            {bank.distanceKm.toFixed(1)} km away
          </span>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
        {bank.address}
      </p>

      <a
        href={`tel:${bank.phone}`}
        className="flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 active:bg-red-800 text-white text-sm font-semibold transition-colors"
        aria-label={`Call ${bank.name} at ${bank.phone}`}
      >
        <PhoneIcon className="w-4 h-4 shrink-0" />
        {bank.phone}
      </a>

      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
          Blood stock (units)
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {ALL_BLOOD_GROUPS.map((group) => {
            const units = bank.stock[group];
            const available = units > 0;
            return (
              <div
                key={group}
                className={`flex flex-col items-center justify-center rounded-lg py-2 px-1 border text-center ${
                  available
                    ? "bg-green-950 border-green-800 text-green-300"
                    : "bg-gray-800 border-gray-700 text-gray-600"
                }`}
              >
                <span className="text-xs font-bold leading-none">{group}</span>
                <span className="text-xs mt-1 leading-none">
                  {available ? units : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-3">
        Last updated:{" "}
        {new Date(bank.lastUpdated).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
    </div>
  );
}

export default function BloodBankPage() {
  const [banks, setBanks] = useState<BloodBank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [filterGroup, setFilterGroup] = useState<BloodGroup | "">("");

  async function handleFind() {
    setLoading(true);
    setError(null);
    try {
      const coords = await getLocation();
      const result = await getNearbyBloodBanks(coords.lat, coords.lng);
      setBanks(result);
      setHasFetched(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not get your location. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const displayed =
    filterGroup ? banks.filter((b) => b.stock[filterGroup] > 0) : banks;

  return (
    <main className="flex flex-col min-h-dvh px-4 pt-6 pb-10 max-w-md mx-auto">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-6 self-start"
        aria-label="Back to home"
      >
        <BackArrowIcon className="w-4 h-4" />
        Back
      </Link>

      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BloodDropIcon className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-black tracking-tight text-white">
            Blood Bank <span className="text-red-500">Finder</span>
          </h1>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          Find nearby blood banks and check blood-group stock availability for
          emergencies.
        </p>
      </header>

      <button
        onClick={handleFind}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-red-900/40 transition-colors mb-6"
      >
        {loading ? (
          <>
            <SpinnerIcon className="w-5 h-5 animate-spin" />
            Locating…
          </>
        ) : (
          <>
            <BloodDropIcon className="w-5 h-5" />
            Find Blood Banks Near Me
          </>
        )}
      </button>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-950 border border-red-800 text-red-300 text-sm">
          {error}
        </div>
      )}

      {hasFetched && !loading && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <label
              htmlFor="blood-group-filter"
              className="text-sm text-gray-400 font-medium shrink-0"
            >
              Show banks with:
            </label>
            <select
              id="blood-group-filter"
              value={filterGroup}
              onChange={(e) =>
                setFilterGroup(e.target.value as BloodGroup | "")
              }
              className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All blood groups</option>
              {ALL_BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-xl bg-yellow-950 border border-yellow-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-yellow-400 leading-relaxed">
              Indicative data only — blood stock changes rapidly. Please call to
              confirm availability before visiting.
            </p>
          </div>

          {displayed.length === 0 ? (
            <p className="text-center text-gray-500 py-10 text-sm">
              {filterGroup
                ? `No nearby banks with ${filterGroup} in stock.`
                : "No blood banks found."}
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {displayed.map((bank) => (
                <BloodBankCard key={bank.id} bank={bank} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
