// File: app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import SWRegister from "./SWRegister";

export const metadata: Metadata = {
  title: "RoadSoS — India Emergency Numbers",
  description:
    "One-tap access to India's emergency numbers: 112, 108, 1073, 100, 101, 102, 1033. Works offline over cellular.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#dc2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className="bg-gray-950 text-white min-h-dvh"
        suppressHydrationWarning
      >
        <SWRegister />
        {children}
      </body>
    </html>
  );
}