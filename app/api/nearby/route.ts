import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const backendBaseUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") ?? "5000";

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Missing lat or lng query parameter." },
      { status: 400 },
    );
  }

  const upstreamUrl = new URL("/api/nearby", backendBaseUrl);
  upstreamUrl.searchParams.set("lat", lat);
  upstreamUrl.searchParams.set("lng", lng);
  upstreamUrl.searchParams.set("radius", radius);

  try {
    const response = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const payload = await response.text();

    return new NextResponse(payload, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Couldn't reach nearby services. You can still call the emergency numbers.",
      },
      { status: 502 },
    );
  }
}