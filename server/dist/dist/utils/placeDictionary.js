import levenshtein from "fast-levenshtein";
import { PLACE_REGISTRY } from "../data/placeRegistery.js";
export const PLACE_DICTIONARY = PLACE_REGISTRY.map((place) => ({
    key: place.key,
    name: place.name,
    aliases: place.aliases,
}));
const ALIAS_INDEX = PLACE_DICTIONARY.flatMap((place) => place.aliases.map((alias) => ({
    key: place.key,
    name: place.name,
    alias: normalizeText(alias)
}))).sort((a, b) => b.alias.length - a.alias.length);
export function normalizeText(input = "") {
    return input
        .toLowerCase()
        .replace(/[^\w\s-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
export function getPlaceByKey(key) {
    return PLACE_DICTIONARY.find((place) => place.key === key) || null;
}
export function findPlaceMentions(input = "") {
    const text = normalizeText(input);
    if (!text)
        return [];
    const rawMatches = [];
    for (const entry of ALIAS_INDEX) {
        let startIndex = 0;
        while (true) {
            const foundAt = text.indexOf(entry.alias, startIndex);
            if (foundAt === -1)
                break;
            rawMatches.push({
                ...entry,
                start: foundAt,
                end: foundAt + entry.alias.length
            });
            startIndex = foundAt + entry.alias.length;
        }
    }
    rawMatches.sort((a, b) => a.start - b.start || b.alias.length - a.alias.length);
    const accepted = [];
    const seenKeys = new Set();
    for (const match of rawMatches) {
        if (seenKeys.has(match.key))
            continue;
        const overlaps = accepted.some((existing) => match.start < existing.end && match.end > existing.start);
        if (overlaps)
            continue;
        accepted.push(match);
        seenKeys.add(match.key);
    }
    return accepted
        .sort((a, b) => a.start - b.start)
        .map(({ key, name, alias, start, end }) => ({
        key,
        name,
        alias,
        start,
        end
    }));
}
function cleanPlaceSegment(segment = "") {
    return normalizeText(segment)
        .replace(/\b(please|pls|po|thanks|thank you|going|go|get|route|directions)\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
export function resolvePlaceSegment(segment = "") {
    const cleaned = cleanPlaceSegment(segment);
    if (!cleaned)
        return null;
    const exactMentions = findPlaceMentions(cleaned);
    if (exactMentions.length > 0) {
        return exactMentions[0].key;
    }
    let bestMatch = null;
    let bestScore = Infinity;
    for (const entry of ALIAS_INDEX) {
        const score = levenshtein.get(cleaned, entry.alias);
        if (score < bestScore) {
            bestScore = score;
            bestMatch = entry;
        }
    }
    if (bestMatch && bestScore <= 3) {
        return bestMatch.key;
    }
    return null;
}
