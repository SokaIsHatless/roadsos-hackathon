// app/good-samaritan/page.tsx

import Link from "next/link";

const protections = [
  {
    title: "You CANNOT be forced to reveal your identity",
    description:
      "Disclosure of your name and personal details is voluntary.",
  },
  {
    title: "You are protected from legal liability",
    description:
      "You cannot be held civilly or criminally liable for any injury or death, as long as you acted in good faith.",
  },
  {
    title: "Hospitals MUST treat the victim immediately",
    description:
      "Public and private hospitals cannot refuse emergency treatment or demand payment first.",
  },
  {
    title: "You cannot be detained",
    description:
      "Police or hospitals cannot detain you or force you to be a witness against your will.",
  },
  {
    title: "If you choose to be a witness, you'll be examined only ONCE",
    description:
      "You cannot be repeatedly harassed for questioning.",
  },
  {
    title: "You can leave immediately after handing over the victim",
    description:
      "After taking the victim to a hospital or handing them to authorities, you are free to go.",
  },
];

export default function GoodSamaritanPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-6 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm font-medium text-gray-300 transition hover:text-white"
        >
          ← Back
        </Link>

        <header className="mb-8">
          <h1 className="mb-3 text-3xl font-bold leading-tight sm:text-4xl">
            Your Rights as a Good Samaritan
          </h1>

          <p className="text-base leading-relaxed text-gray-300 sm:text-lg">
            If you stop to help a road accident victim in India, the law
            protects you. Know your rights.
          </p>
        </header>

        <section className="space-y-4">
          {protections.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-700 bg-gray-800 p-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="h-5 w-5 text-green-400"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <h2 className="text-base font-bold leading-snug sm:text-lg">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-base leading-relaxed text-gray-300">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-green-500/40 bg-green-500/10 p-5">
          <p className="text-base font-semibold leading-relaxed text-green-100 sm:text-lg">
            Show this screen to any official who questions your right to help.
            Helping save a life is your protected right under Section 134A of
            the Motor Vehicles Act.
          </p>
        </section>

        <footer className="mt-6">
          <p className="text-sm leading-relaxed text-gray-500">
            This is general information based on India&apos;s Good Samaritan Law
            (Supreme Court guidelines, 2016 and Motor Vehicles Act Section
            134A). It is not legal advice.
          </p>
        </footer>
      </div>
    </main>
  );
}