import { normalizeText, resolvePlaceSegment, findPlaceMentions } from "./placeDictionary.js";
function cleanRouteSegment(segment = "") {
    return normalizeText(segment)
        .replace(/\b(please|pls|po|thanks|thank you|via|using)\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
export function extractRouteSlots(message = "") {
    const text = normalizeText(message);
    const mentionedPlaces = findPlaceMentions(text).map((place) => place.key);
    let from = null;
    let to = null;
    const toFromMatch = text.match(/\bto\s+(.+?)\s+from\s+(.+)$/i);
    if (toFromMatch) {
        to = resolvePlaceSegment(cleanRouteSegment(toFromMatch[1]));
        from = resolvePlaceSegment(cleanRouteSegment(toFromMatch[2]));
        return { from, to, mentionedPlaces };
    }
    const fromToMatch = text.match(/\bfrom\s+(.+?)\s+to\s+(.+)$/i);
    if (fromToMatch) {
        from = resolvePlaceSegment(cleanRouteSegment(fromToMatch[1]));
        to = resolvePlaceSegment(cleanRouteSegment(fromToMatch[2]));
        return { from, to, mentionedPlaces };
    }
    const routeToMatch = text.match(/\b(?:how do i get|how to get|how can i get|directions|route|go|get|commute|travel)\b.*?\bto\s+(.+)$/i);
    if (routeToMatch) {
        to = resolvePlaceSegment(cleanRouteSegment(routeToMatch[1]));
    }
    const plainFromMatch = text.match(/\bfrom\s+(.+)$/i);
    if (plainFromMatch) {
        from = resolvePlaceSegment(cleanRouteSegment(plainFromMatch[1]));
    }
    return { from, to, mentionedPlaces };
}
