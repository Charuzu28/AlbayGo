export type LatLngTuple = [number, number];

export interface PlaceRegistryItem {
  key: string;
  name: string;
  aliases: string[];
  coords: LatLngTuple;
  verified: boolean;
}

export interface PlacesApiResponse {
  places: PlaceRegistryItem[];
}