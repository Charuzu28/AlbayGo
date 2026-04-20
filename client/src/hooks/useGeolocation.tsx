import { useCallback, useState } from "react";

export interface Coordinates {
  lat: number;
  lng: number;
}

interface GeolocationState {
  location: Coordinates | null;
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => void;
}

export function useGeolocation(): GeolocationState {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (geoError) => {
        setError(geoError.message || "Unable to get your location.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
  };
}