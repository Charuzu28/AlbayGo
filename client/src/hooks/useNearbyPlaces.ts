import { useEffect, useState } from "react";
import type { NearbyPlaceItem, NearbyPlacesResponse } from "../types/nearby";

interface UseNearbyPlacesOptions {
  lat: number | null;
  lng: number | null;
  category?: "transport" | "tourist" | "food" | "stay";
}

interface UseNearbyPlacesState {
  places: NearbyPlaceItem[];
  loading: boolean;
  error: string | null;
}

export function useNearbyPlaces({
  lat,
  lng,
  category,
}: UseNearbyPlacesOptions): UseNearbyPlacesState {
  const [places, setPlaces] = useState<NearbyPlaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === null || lng === null) {
      setPlaces([]);
      return;
    }

    const fetchNearby = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiBaseUrl =
          (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
          "http://localhost:5000";

        const params = new URLSearchParams({
          lat: String(lat),
          lng: String(lng),
        });

        if (category) {
          params.set("category", category);
        }

        const response = await fetch(
          `${apiBaseUrl.replace(/\/$/, "")}/api/nearby?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Failed to load nearby places: ${response.status}`);
        }

        const data: NearbyPlacesResponse = await response.json();
        setPlaces(data.places || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load nearby places.");
      } finally {
        setLoading(false);
      }
    };

    void fetchNearby();
  }, [lat, lng, category]);

  return { places, loading, error };
}