"use client";

import { useState } from "react";
import Link from "next/link";
import {
  firstAidScenarios,
  type FirstAidScenario,
  type FirstAidStep,
} from "@/lib/firstAidScenarios";

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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StepsList({ steps }: { steps: FirstAidStep[] }) {
  return (
    <ol className="flex flex-col gap-2 mt-3">
      {steps.map((step, i) => (
        <li key={i} className="flex flex-col gap-1.5">
          <div className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 mt-0.5">
              {i + 1}
            </span>
            <p className="text-base text-gray-100 leading-snug">{step.text}</p>
          </div>
          {step.warning && (
            <div className="ml-9 px-3 py-2 rounded-r-lg border-l-2 border-red-500 bg-red-950/60 text-red-300 text-sm leading-snug">
              {step.warning}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

function extractEmergencyNumbers(callIf: string): string[] {
  const matches = callIf.match(/\b(108|112)\b/g);
  return matches ? [...new Set(matches)] : [];
}

function CallIfBanner({ callIf }: { callIf: string }) {
  const numbers = extractEmergencyNumbers(callIf);

  const parts = callIf.split(/\b(108|112)\b/);

  return (
    <div className="mt-4 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700">
      <p className="text-sm font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">
        When to call
      </p>
      <p className="text-sm text-gray-200 leading-relaxed">
        {parts.map((part, i) =>
          part === "108" || part === "112" ? (
            <a
              key={i}
              href={`tel:${part}`}
              className="font-black text-red-400 underline underline-offset-2"
            >
              {part}
            </a>
          ) : (
            part
          )
        )}
      </p>
      {numbers.length > 0 && (
        <div className="flex gap-2 mt-3">
          {numbers.map((num) => (
            <a
              key={num}
              href={`tel:${num}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 active:bg-red-800 text-white text-sm font-bold transition-colors"
              aria-label={`Call ${num}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-4 h-4 shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Call {num}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ScenarioCard({
  scenario,
  open,
  onToggle,
}: {
  scenario: FirstAidScenario;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-4 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0" aria-hidden="true">
            {scenario.emoji}
          </span>
          <div className="min-w-0">
            <div className="text-lg font-bold text-white leading-tight">
              {scenario.title}
            </div>
            <div className="text-sm text-gray-400 mt-0.5 leading-snug">
              {scenario.summary}
            </div>
          </div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3">
          <StepsList steps={scenario.steps} />
          <CallIfBanner callIf={scenario.callIf} />
        </div>
      )}
    </div>
  );
}

export default function FirstAidPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

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

      <header className="mb-5">
        <h1 className="text-2xl font-black tracking-tight text-white">
          First Aid <span className="text-red-500">Guide</span>
        </h1>
        <p className="mt-1.5 text-gray-400 text-sm leading-relaxed">
          Quick reference for common road accident emergencies. Tap a scenario
          to see step-by-step instructions. Always call{" "}
          <a href="tel:108" className="text-red-400 font-semibold">
            108
          </a>{" "}
          or{" "}
          <a href="tel:112" className="text-red-400 font-semibold">
            112
          </a>{" "}
          for serious cases.
        </p>
      </header>

      <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-950 border border-red-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm text-red-300 leading-relaxed">
          If you are <strong className="text-red-200">NOT trained</strong>,
          focus on calling{" "}
          <a href="tel:108" className="font-black underline underline-offset-2">
            108
          </a>
          /
          <a href="tel:112" className="font-black underline underline-offset-2">
            112
          </a>{" "}
          and keeping the victim safe and conscious. These are reference
          guidelines, not professional medical advice.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {firstAidScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            open={openId === scenario.id}
            onToggle={() => toggle(scenario.id)}
          />
        ))}
      </div>
    </main>
  );
}
