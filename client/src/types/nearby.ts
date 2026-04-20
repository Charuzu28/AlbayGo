import type { LatLngTuple } from "./place";

export interface NearbyPlaceItem {
  key: string;
  name: string;
  aliases: string[];
  coords: LatLngTuple;
  verified: boolean;
  category: "transport" | "tourist" | "food" | "stay";
  description?: string;
  distanceKm: number;
}

export interface NearbyPlacesResponse {
  places: NearbyPlaceItem[];
}