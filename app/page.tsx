import Link from "next/link";
import { emergencyNumbers } from "@/lib/emergencyNumbers";
import type { EmergencyNumber } from "@/lib/emergencyNumbers";

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

function MenuCard() {
  return (
    <details className="mb-4 rounded-2xl border border-gray-800 bg-gray-900 text-white group">
      <summary className="flex min-h-[80px] cursor-pointer list-none items-center justify-between px-5 py-4 marker:hidden">
        <div>
          <div className="text-lg font-bold">Menu</div>
          <div className="mt-1 text-sm text-gray-400">
            Open quick tools and nearby services
          </div>
        </div>
        <div className="text-2xl text-gray-400 transition-transform group-open:rotate-180">
          ▾
        </div>
      </summary>

      <div className="border-t border-gray-800 px-4 py-4">
        <Link
          href="/nearby"
          className="flex min-h-[72px] items-center justify-between rounded-2xl border border-gray-700 bg-gray-800 px-4 py-4 transition-colors hover:bg-gray-700 active:bg-gray-900"
        >
          <div>
            <div className="text-base font-semibold">Nearby Services</div>
            <div className="mt-1 text-sm text-gray-400">
              Find hospitals, police, and fire stations near you
            </div>
          </div>
          <div className="ml-4 text-2xl" aria-hidden="true">
            📍
          </div>
        </Link>
      </div>
    </details>
  );
}

export default function HomePage() {
  const primary = emergencyNumbers.find((n) => n.primary);
  const secondary = emergencyNumbers.filter((n) => !n.primary);

  return (
    <main className="flex flex-col min-h-dvh px-4 pt-8 pb-6 max-w-md mx-auto">
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

      <MenuCard />

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

      <footer className="mt-8 text-center text-xs text-gray-500 leading-relaxed">
        Works offline.{" "}
        <span className="text-gray-400">
          Calls use your phone&apos;s cellular network.
        </span>
      </footer>
    </main>
  );
}
