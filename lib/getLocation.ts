export type UserLocation = {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
};

export async function getLocation(options?: {
  timeout?: number;
  highAccuracy?: boolean;
  maximumAge?: number;
}): Promise<UserLocation> {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    throw new Error("GEOLOCATION_UNSUPPORTED");
  }

  const positionOptions: PositionOptions = {
    enableHighAccuracy: options?.highAccuracy ?? true,
    timeout: options?.timeout ?? 15000,
    maximumAge: options?.maximumAge ?? 0,
  };

  return new Promise<UserLocation>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (err: GeolocationPositionError) => {
        switch (err.code) {
          case 1:
            reject(new Error("PERMISSION_DENIED"));
            break;
          case 2:
            reject(new Error("POSITION_UNAVAILABLE"));
            break;
          case 3:
            reject(new Error("TIMEOUT"));
            break;
          default:
            reject(new Error("UNKNOWN_LOCATION_ERROR"));
        }
      },
      positionOptions,
    );
  });
}

export function getLocationErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    switch (err.message) {
      case "GEOLOCATION_UNSUPPORTED":
        return "Your browser doesn't support location.";
      case "PERMISSION_DENIED":
        return "Please allow location access to find nearby help.";
      case "POSITION_UNAVAILABLE":
        return "We couldn't get your location. Are you indoors?";
      case "TIMEOUT":
        return "Location request timed out. Please try again.";
      default:
        return "Something went wrong getting your location.";
    }
  }
  return "Something went wrong getting your location.";
}
