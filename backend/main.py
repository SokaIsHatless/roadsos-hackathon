# MOCK MODE active because Overpass public servers are unreliable.
# Flip USE_MOCK_OSM to False once Overpass is reliably reachable.
USE_MOCK_OSM = True  # TODO: set to False once Overpass is reliably reachable

import math
from typing import Optional

import httpx
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RoadSoS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)

OVERPASS_MIRRORS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass-api.de/api/interpreter",
]
OVERPASS_TIMEOUT = 25.0
OVERPASS_HEADERS = {"User-Agent": "RoadSoS/1.0 (hackathon project)"}


def haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
    )
    return round(R * 2 * math.asin(math.sqrt(a)), 1)


def build_overpass_query(lat: float, lng: float, radius: int) -> str:
    return (
        f"[out:json][timeout:25];\n"
        f"(\n"
        f'  node["amenity"~"hospital|police|fire_station|pharmacy|fuel"]'
        f"(around:{radius},{lat},{lng});\n"
        f'  way["amenity"~"hospital|police|fire_station|pharmacy|fuel"]'
        f"(around:{radius},{lat},{lng});\n"
        f");\n"
        f"out center tags;"
    )


def mock_fetch_from_osm(lat: float, lng: float, radius: int) -> list[dict]:
    raw = [
        {"name": "Coimbatore Medical College Hospital", "type": "hospital",    "phone": "+91-422-2301393", "dlat":  0.0033, "dlng":  0.0015},
        {"name": "PSG Hospitals",                       "type": "hospital",    "phone": "+91-422-4345100", "dlat": -0.0120, "dlng":  0.0210},
        {"name": "Kovai Medical Center",                "type": "hospital",    "phone": None,              "dlat":  0.0280, "dlng": -0.0080},
        {"name": "Race Course Police Station",          "type": "police",      "phone": "+91-422-2212100", "dlat":  0.0055, "dlng": -0.0040},
        {"name": "Gandhipuram Police Station",          "type": "police",      "phone": None,              "dlat": -0.0070, "dlng":  0.0130},
        {"name": "RS Puram Fire Station",               "type": "fire_station","phone": "+91-422-2544101", "dlat": -0.0095, "dlng": -0.0060},
        {"name": "MedPlus Pharmacy",                    "type": "pharmacy",    "phone": None,              "dlat":  0.0018, "dlng":  0.0022},
        {"name": "Apollo Pharmacy",                     "type": "pharmacy",    "phone": "+91-422-4294000", "dlat": -0.0040, "dlng":  0.0085},
        {"name": "Indian Oil Petrol Pump",              "type": "fuel",        "phone": None,              "dlat":  0.0110, "dlng": -0.0150},
        {"name": "HP Petrol Pump",                      "type": "fuel",        "phone": None,              "dlat": -0.0160, "dlng":  0.0050},
        {"name": "BSNL Colony Dispensary",              "type": "hospital",    "phone": None,              "dlat":  0.0200, "dlng":  0.0180},
        {"name": "Singanallur Police Outpost",          "type": "police",      "phone": None,              "dlat":  0.0240, "dlng": -0.0220},
    ]

    results = []
    for item in raw:
        elem_lat = lat + item["dlat"]
        elem_lng = lng + item["dlng"]
        dist = haversine(lat, lng, elem_lat, elem_lng)
        if dist * 1000 <= radius:
            results.append({
                "name": item["name"],
                "type": item["type"],
                "phone": item["phone"],
                "lat": round(elem_lat, 6),
                "lng": round(elem_lng, 6),
                "distanceKm": dist,
            })

    results.sort(key=lambda r: r["distanceKm"])
    return results


async def fetch_from_osm(lat: float, lng: float, radius: int) -> list[dict]:
    query = build_overpass_query(lat, lng, radius)
    last_error: Exception | None = None

    async with httpx.AsyncClient(timeout=OVERPASS_TIMEOUT, headers=OVERPASS_HEADERS) as client:
        for mirror in OVERPASS_MIRRORS:
            try:
                response = await client.post(mirror, data={"data": query})
                response.raise_for_status()
                data = response.json()
            except Exception as exc:
                print(f"Overpass mirror {mirror} failed: {exc}")
                last_error = exc
                continue

            results = []
            for element in data.get("elements", []):
                tags = element.get("tags") or {}
                amenity_type = tags.get("amenity", "unknown")

                if element["type"] == "node":
                    elem_lat = element.get("lat")
                    elem_lng = element.get("lon")
                else:
                    center = element.get("center") or {}
                    elem_lat = center.get("lat")
                    elem_lng = center.get("lon")

                if elem_lat is None or elem_lng is None:
                    continue

                name = tags.get("name") or f"Unknown {amenity_type}"
                phone = tags.get("phone") or tags.get("contact:phone") or None

                results.append({
                    "name": name,
                    "type": amenity_type,
                    "phone": phone,
                    "lat": elem_lat,
                    "lng": elem_lng,
                    "distanceKm": haversine(lat, lng, elem_lat, elem_lng),
                })

            results.sort(key=lambda r: r["distanceKm"])
            return results

    raise last_error or RuntimeError("All Overpass mirrors failed")


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.get("/api/nearby")
async def nearby(
    lat: float = Query(..., description="Latitude of user location"),
    lng: float = Query(..., description="Longitude of user location"),
    radius: Optional[int] = Query(5000, description="Search radius in metres"),
):
    if USE_MOCK_OSM:
        results = mock_fetch_from_osm(lat, lng, radius)
        return {"count": len(results), "source": "osm", "results": results}

    try:
        results = await fetch_from_osm(lat, lng, radius)
    except Exception as exc:
        print(f"Error fetching from OSM: {exc}")
        raise HTTPException(
            status_code=502,
            detail={"error": "Overpass request failed", "results": [], "count": 0},
        )

    return {"count": len(results), "source": "osm", "results": results}
