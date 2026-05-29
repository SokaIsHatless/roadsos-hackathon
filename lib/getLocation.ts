// TODO: replace with shared getLocation() — this is a temporary stub returning fixed Coimbatore coords.
export type Coords = { lat: number; lng: number };

export async function getLocation(): Promise<Coords> {
  return { lat: 11.0168, lng: 76.9558 };
}
