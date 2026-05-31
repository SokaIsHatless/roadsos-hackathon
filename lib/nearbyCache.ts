import { openDB } from "idb";

export type NearbyService = {
  name: string;
  type: string;
  phone: string | null;
  lat: number;
  lng: number;
};

type CacheEntry = {
  key: string;
  lat: number;
  lng: number;
  radius: number;
  services: NearbyService[];
  cachedAt: number;
};

const DB_NAME = "roadsos-cache";
const STORE_NAME = "nearby";
const TTL_MS = 24 * 60 * 60 * 1000;

function locationKey(lat: number, lng: number, radius: number): string {
  return `${Math.round(lat * 100)}_${Math.round(lng * 100)}_${radius}`;
}

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    },
  });
}

export async function cacheNearby(
  lat: number,
  lng: number,
  radius: number,
  services: NearbyService[]
): Promise<void> {
  const db = await getDb();
  const entry: CacheEntry = {
    key: locationKey(lat, lng, radius),
    lat,
    lng,
    radius,
    services,
    cachedAt: Date.now(),
  };
  await db.put(STORE_NAME, entry);
}

export async function getCachedNearby(
  lat: number,
  lng: number,
  radius: number
): Promise<{ services: NearbyService[]; cachedAt: number } | null> {
  const db = await getDb();
  const entry = (await db.get(
    STORE_NAME,
    locationKey(lat, lng, radius)
  )) as CacheEntry | undefined;
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > TTL_MS) return null;
  return { services: entry.services, cachedAt: entry.cachedAt };
}

export async function getAnyCachedNearby(): Promise<{
  lat: number;
  lng: number;
  services: NearbyService[];
  cachedAt: number;
} | null> {
  const db = await getDb();
  const all = (await db.getAll(STORE_NAME)) as CacheEntry[];
  if (all.length === 0) return null;
  const latest = all.reduce((a, b) => (a.cachedAt > b.cachedAt ? a : b));
  return {
    lat: latest.lat,
    lng: latest.lng,
    services: latest.services,
    cachedAt: latest.cachedAt,
  };
}
