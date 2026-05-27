# RoadSoS

One-tap access to India's emergency numbers — a mobile-first PWA for road accident emergency response.

## What it is

A single-page app showing India's road and general emergency numbers as tappable phone links. Tap any card to open your phone's native dialer. Works with zero internet — calls use the cellular voice channel.

## Emergency numbers

| Number | Service |
|--------|---------|
| **112** | Unified Emergency (Police · Fire · Ambulance) |
| 108 | Free Emergency Ambulance |
| 1073 | Road Accident Helpline |
| 1033 | NHAI National Highway Emergency |
| 100 | Police |
| 101 | Fire Brigade |
| 102 | Medical / Maternal Ambulance |

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Mobile-first PWA (service worker coming in a later step)

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for production

```bash
npm run build
npm start
```

## Testing on a real phone

1. Find your machine's local IP: run `ipconfig` and look for the IPv4 address (e.g. `192.168.1.42`)
2. Start the dev server bound to all interfaces:
   ```bash
   npm run dev -- --hostname 0.0.0.0
   ```
3. On your phone (same Wi-Fi), open `http://192.168.1.42:3000`
4. Tap the **112** card — your phone's native dialer should open with 112 pre-filled
5. Tap **Cancel** — do not accidentally call emergency services during testing
