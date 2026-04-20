import { useEffect, useMemo } from "react";
import { usePlaces } from "../hooks/usePlaces";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useGeolocation } from "../hooks/useGeolocation";
import {
  findNearestKnownPlace,
  getPlaceCoordinates,
  type NearestPlaceResult,
} from "../data/placeCoordinates";
import type { LatLngTuple } from "../types/place";
import type { RouteOption } from "../types/chat";
import { useNearbyPlaces } from "../hooks/useNearbyPlaces";

const defaultCenter: LatLngTuple = [13.15014, 123.73436];

interface MapViewProps {
  selectedRoute?: RouteOption | null;
  onNearestPlaceDetected?: (place: NearestPlaceResult | null) => void;
}

function createPinIcon(label: string, bgColor: string) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 9999px;
        background: ${bgColor};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      ">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

const userIcon = createPinIcon("Y", "#FF69B4");
const fromIcon = createPinIcon("F", "#16a34a");
const toIcon = createPinIcon("T", "#dc2626");
const defaultIcon = createPinIcon("A", "#111827");

function FitMapToPoints({ points }: { points: LatLngTuple[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      map.setView(defaultCenter, 13);
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }

    map.fitBounds(points, { padding: [40, 40] });
  }, [map, points]);

  return null;
}

function MarkerLegend() {
  const items = [
    { label: "You", color: "#FF69B4" },
    { label: "From", color: "#16a34a" },
    { label: "To", color: "#dc2626" },
  ];

  return (
    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function MapView({
  selectedRoute = null,
  onNearestPlaceDetected,
}: MapViewProps) {
  const { places } = usePlaces();
  const { location, loading, error, getCurrentLocation } = useGeolocation();

  const userCoords: LatLngTuple | null = useMemo(() => {
    if (!location) return null;
    return [location.lat, location.lng];
  }, [location?.lat, location?.lng]);

  const nearestPlace = useMemo(() => {
    if (!userCoords) return null;
    return findNearestKnownPlace(places, userCoords);
  }, [places, userCoords]);

  useEffect(() => {
    onNearestPlaceDetected?.(nearestPlace);
  }, [nearestPlace, onNearestPlaceDetected]);

  const originCoords = useMemo(
    () => getPlaceCoordinates(places, selectedRoute?.from),
    [places, selectedRoute?.from]
  );

  const destinationCoords = useMemo(
    () => getPlaceCoordinates(places, selectedRoute?.to),
    [places, selectedRoute?.to]
  );

  const points: LatLngTuple[] = useMemo(
    () => [
      ...(userCoords ? [userCoords] : []),
      ...(originCoords ? [originCoords] : []),
      ...(destinationCoords ? [destinationCoords] : []),
    ],
    [userCoords, originCoords, destinationCoords]
  );

  const { places: nearbyTouristPlaces, loading: nearbyLoading } = useNearbyPlaces({
  lat: userCoords ? userCoords[0] : null,
  lng: userCoords ? userCoords[1] : null,
  category: "tourist",
});

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Getting location..." : "Use my location"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!error && userCoords && (
          <p className="text-sm text-gray-600">Location loaded successfully.</p>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">Nearby tourist spots</h3>

        {nearbyLoading && (
          <p className="mt-2 text-sm text-gray-500">Loading nearby places...</p>
        )}

        {!nearbyLoading && nearbyTouristPlaces.length === 0 && (
          <p className="mt-2 text-sm text-gray-500">No nearby tourist spots found yet.</p>
        )}

        {!nearbyLoading && nearbyTouristPlaces.length > 0 && (
          <ul className="mt-3 space-y-2">
            {nearbyTouristPlaces.map((place) => (
              <li key={place.key} className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">{place.name}</span>{" "}
                <span className="text-gray-500">
                  ({place.distanceKm.toFixed(1)} km)
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <MarkerLegend />

      {nearestPlace && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          Nearest known place:{" "}
          <span className="font-medium text-gray-900">{nearestPlace.name}</span>{" "}
          <span className="text-gray-500">
            ({nearestPlace.distanceKm.toFixed(1)} km away)
          </span>
        </div>
      )}

      <div className="h-80 w-full overflow-hidden rounded-2xl border border-gray-200">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitMapToPoints points={points} />

          {!userCoords && !originCoords && !destinationCoords && (
            <Marker position={defaultCenter} icon={defaultIcon}>
              <Popup>AlbayGo default map center</Popup>
            </Marker>
          )}

          {userCoords && (
            <Marker position={userCoords} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {originCoords && selectedRoute?.from && (
            <Marker position={originCoords} icon={fromIcon}>
              <Popup>From: {selectedRoute.from}</Popup>
            </Marker>
          )}

          {destinationCoords && selectedRoute?.to && (
            <Marker position={destinationCoords} icon={toIcon}>
              <Popup>To: {selectedRoute.to}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}