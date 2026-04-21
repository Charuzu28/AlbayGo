import { PLACE_REGISTRY } from "../data/placeRegistery.js";
function toRadians(value) {
    return (value * Math.PI) / 180;
}
function getDistanceKm(from, to) {
    const earthRadiusKm = 6371;
    const dLat = toRadians(to[0] - from[0]);
    const dLng = toRadians(to[1] - from[1]);
    const lat1 = toRadians(from[0]);
    const lat2 = toRadians(to[0]);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}
export function findNearbyPlaces(coords, options) {
    const { category, limit = 5, maxDistanceKm = 5 } = options || {};
    return PLACE_REGISTRY
        .filter((place) => !category || place.category === category)
        .map((place) => ({
        ...place,
        distanceKm: getDistanceKm(coords, place.coords),
    }))
        .filter((place) => place.distanceKm <= maxDistanceKm)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, limit);
}
