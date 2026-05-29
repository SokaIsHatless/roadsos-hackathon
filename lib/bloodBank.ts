// MOCK DATA — replace getNearbyBloodBanks() with a real eRaktKosh API call (via API Setu) later.
// Keep the same return type (BloodBank[]) so the UI doesn't need changes.
//
// To swap in the real API:
//   1. Replace the MOCK_BANKS array and getNearbyBloodBanks() body with a fetch to:
//      https://api.apisetu.gov.in/eraktkosh/v1/... (check API Setu docs for the exact endpoint)
//   2. Map the API response fields to the BloodBank type below.
//   3. The eRaktKosh API accepts lat/lng to filter nearby banks — pass them through.
//   4. Haversine / sorting may already be done server-side; remove local sort if so.
//   5. All exported types stay the same — no UI changes needed.

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

export type BloodBank = {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  lastUpdated: string;
  stock: Record<BloodGroup, number>;
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const MOCK_BANKS: Omit<BloodBank, "distanceKm">[] = [
  {
    id: "cmc-cbe",
    name: "Coimbatore Medical College Blood Bank",
    address: "Avanashi Road, Peelamedu, Coimbatore – 641014",
    phone: "04222301393",
    lat: 11.0168,
    lng: 76.9558,
    lastUpdated: "2026-05-27T08:00:00Z",
    stock: {
      "A+": 24, "A-": 3, "B+": 18, "B-": 0,
      "O+": 30, "O-": 5, "AB+": 8, "AB-": 0,
    },
  },
  {
    id: "psg-bb",
    name: "PSG Hospitals Blood Centre",
    address: "Peelamedu, Coimbatore – 641004",
    phone: "04224570170",
    lat: 11.025,
    lng: 76.949,
    lastUpdated: "2026-05-27T06:30:00Z",
    stock: {
      "A+": 12, "A-": 0, "B+": 9, "B-": 2,
      "O+": 20, "O-": 0, "AB+": 5, "AB-": 1,
    },
  },
  {
    id: "kmch-bb",
    name: "KMCH Blood Bank",
    address: "Kovai Medical Center, Avanashi Road, Coimbatore – 641014",
    phone: "04222668800",
    lat: 11.009,
    lng: 76.935,
    lastUpdated: "2026-05-26T14:00:00Z",
    stock: {
      "A+": 0, "A-": 1, "B+": 14, "B-": 0,
      "O+": 22, "O-": 3, "AB+": 0, "AB-": 0,
    },
  },
  {
    id: "srh-bb",
    name: "Sri Ramakrishna Hospital Blood Bank",
    address: "395 Sarojini Naidu Road, Sidhapudur, Coimbatore – 641044",
    phone: "04224500000",
    lat: 11.038,
    lng: 77.007,
    lastUpdated: "2026-05-27T09:00:00Z",
    stock: {
      "A+": 16, "A-": 2, "B+": 11, "B-": 0,
      "O+": 14, "O-": 0, "AB+": 3, "AB-": 1,
    },
  },
  {
    id: "ganga-bb",
    name: "Ganga Hospital Blood Bank",
    address: "313 Mettupalayam Road, Coimbatore – 641043",
    phone: "04222485000",
    lat: 11.003,
    lng: 76.962,
    lastUpdated: "2026-05-25T11:00:00Z",
    stock: {
      "A+": 7, "A-": 0, "B+": 5, "B-": 0,
      "O+": 10, "O-": 1, "AB+": 2, "AB-": 0,
    },
  },
  {
    id: "esih-bb",
    name: "ESI Hospital Blood Bank",
    address: "Trichy Road, Singanallur, Coimbatore – 641005",
    phone: "04222574000",
    lat: 10.996,
    lng: 77.001,
    lastUpdated: "2026-05-26T07:00:00Z",
    stock: {
      "A+": 5, "A-": 0, "B+": 8, "B-": 1,
      "O+": 12, "O-": 0, "AB+": 0, "AB-": 0,
    },
  },
];

export async function getNearbyBloodBanks(lat: number, lng: number): Promise<BloodBank[]> {
  return MOCK_BANKS
    .map((b) => ({
      ...b,
      distanceKm: parseFloat(haversineKm(lat, lng, b.lat, b.lng).toFixed(1)),
    }))
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
}
