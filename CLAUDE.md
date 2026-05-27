# RoadSoS — Project Context

## What we're building
A PWA for road accident emergency response in India. Helps users find
nearby hospitals/police/ambulance and call emergency numbers, works OFFLINE.

## Tech stack (DO NOT deviate)
- Frontend: Next.js + Tailwind + MapLibre GL JS, as a PWA (next-pwa + Workbox)
- Backend: FastAPI (Python) + httpx
- Data: OpenStreetMap Overpass API (free, offline base) + Ola Maps (online enrichment)
- Offline: Service Worker (app shell) + IndexedDB (via idb library) for data
- SMS: Fast2SMS (NOT Twilio)
- Hosting: Vercel (frontend) + Render (backend)

## CRITICAL RULES
- NEVER hardcode API keys. ALL keys go in .env (which is gitignored). Read from env vars.
- The shared "nearby service" object shape is: { name, type, phone, lat, lng }
- Use ONE shared getLocation() function — never reimplement geolocation.
- Nearby services fallback ladder: Ola/Google (online) -> OSM live -> cached OSM -> hardcoded numbers
- tel: and sms: links must work with zero internet (they ride cellular voice/SMS)

## India emergency numbers (hardcoded)
112 (unified), 108 (ambulance), 1073 (road accident), 1033 (highway),
100 (police), 101 (fire), 102 (medical)

## Common mistakes to AVOID

### Dialer / SMS
- Do NOT wrap tel: or sms: links in JavaScript onClick handlers. Plain <a href="tel:112"> only. JS handlers can break the native dialer and the offline-over-cellular behavior.
- Do NOT use Twilio. Trial accounts can only message verified numbers and will fail in our demo. Use Fast2SMS only.

### Location
- Do NOT call navigator.geolocation directly inside feature files. ALWAYS import and use the shared getLocation() function.
- Do NOT request location on page load without user interaction — browsers may block it. Trigger it from a button or after user consent.

### Nearby services / APIs
- Do NOT call the Overpass API on every keystroke, map pan, or render. Fetch once per area, then cache.
- Do NOT skip the fallback ladder. Code MUST handle: API failure → OSM live fallback → IndexedDB cache fallback → hardcoded numbers.
- Do NOT assume every OSM result has a name or phone field. Always use safe access (e.g., .get() in Python, optional chaining in JS) with sensible fallbacks.

### Offline / PWA
- Do NOT claim offline support without testing in real airplane mode on a real phone. Browser DevTools "offline" mode is not enough.
- Do NOT delete the old IndexedDB cache before the new fetch succeeds. Fetch first, then overwrite — otherwise a failed fetch leaves us with nothing.
- Do NOT cache Google Places API results to disk — their terms forbid it. Only OSM data is safe to cache.

### Secrets / Git
- Do NOT hardcode API keys anywhere in source files. ALL keys go in .env.local (frontend) or .env (backend), both gitignored.
- Do NOT commit .env files. Verify .gitignore includes them BEFORE the first commit.
- If a key is accidentally committed, ROTATE it immediately — deleting the line does not remove it from git history.

### Code structure
- Do NOT reimplement features that already exist. Check the codebase first.
- Do NOT change the shared "nearby service" object shape: { name, type, phone, lat, lng }. Other features depend on it.
- Do NOT add features that aren't in the current build step. One feature at a time.