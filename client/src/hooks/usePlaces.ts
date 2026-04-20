import { useEffect, useState } from "react";
import type { PlaceRegistryItem, PlacesApiResponse } from "../types/place";

interface UsePlacesState {
  places: PlaceRegistryItem[];
  loading: boolean;
  error: string | null;
}

export function usePlaces(): UsePlacesState {
  const [places, setPlaces] = useState<PlaceRegistryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const apiBaseUrl =
          (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
          "http://localhost:5000";

        const response = await fetch(
          `${apiBaseUrl.replace(/\/$/, "")}/api/places`
        );

        if (!response.ok) {
          throw new Error(`Failed to load places: ${response.status}`);
        }

        const data: PlacesApiResponse = await response.json();
        setPlaces(data.places || []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load places.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchPlaces();
  }, []);

  return { places, loading, error };
}