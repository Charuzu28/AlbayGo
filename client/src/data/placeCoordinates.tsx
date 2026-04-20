import type { PlaceRegistryItem, LatLngTuple } from "../types/place";

export interface NearestPlaceResult {
  key: string;
  name: string;
  coords: LatLngTuple;
  distanceKm: number;
  verified: boolean;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function getPlaceByName(
  places: PlaceRegistryItem[],
  placeName?: string | null
): PlaceRegistryItem | null {
  if (!placeName) return null;

  const normalizedInput = normalizeText(placeName);

  for (const place of places) {
    const matchesName = normalizeText(place.name) === normalizedInput;
    const matchesAlias = place.aliases.some(
      (alias) => normalizeText(alias) === normalizedInput
    );

    if (matchesName || matchesAlias) {
      return place;
    }
  }

  return null;
}

export function getPlaceCoordinates(
  places: PlaceRegistryItem[],
  placeName?: string | null
): LatLngTuple | null {
  return getPlaceByName(places, placeName)?.coords ?? null;
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function getDistanceKm(from: LatLngTuple, to: LatLngTuple): number {
  const earthRadiusKm = 6371;

  const dLat = toRadians(to[0] - from[0]);
  const dLng = toRadians(to[1] - from[1]);

  const lat1 = toRadians(from[0]);
  const lat2 = toRadians(to[0]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

export function findNearestKnownPlace(
  places: PlaceRegistryItem[],
  point: LatLngTuple
): NearestPlaceResult | null {
  if (places.length === 0) return null;

  let nearest: NearestPlaceResult | null = null;

  for (const place of places) {
    const distanceKm = getDistanceKm(point, place.coords);

    if (!nearest || distanceKm < nearest.distanceKm) {
      nearest = {
        key: place.key,
        name: place.name,
        coords: place.coords,
        distanceKm,
        verified: place.verified,
      };
    }
  }

  return nearest;
}