import levenshtein from "fast-levenshtein";

export const PLACE_DICTIONARY = [
  {
    key: "airport",
    name: "Bicol International Airport",
    aliases: ["airport", "daraga airport", "bicol airport", "bicol international airport"]
  },
  {
    key: "sm-legazpi",
    name: "SM Legazpi",
    aliases: ["sm legazpi", "sm city legazpi"]
  },
  {
    key: "legazpi",
    name: "Legazpi",
    aliases: ["legazpi", "legazpi city"]
  },
  {
    key: "daraga",
    name: "Daraga",
    aliases: ["daraga"]
  },
  {
    key: "terminal",
    name: "Legazpi Terminal",
    aliases: ["terminal", "legazpi terminal"]
  },
  {
    key: "legazpi-port",
    name: "Legazpi Port",
    aliases: ["legazpi port", "port"]
  },
  {
    key: "legazpi-boulevard",
    name: "Legazpi Boulevard",
    aliases: ["legazpi boulevard", "boulevard"]
  },
  {
    key: "hoyop-hoyopan-cave",
    name: "Hoyop Hoyopan Cave",
    aliases: ["hoyop hoyopan cave"]
  },
  {
    key: "seventy-six-farm",
    name: "Seventy-Six Farm",
    aliases: ["seventy-six farm", "76 farm"]
  },
  {
    key: "quitinday-greenhills",
    name: "Quitinday Green Hills",
    aliases: ["quitinday greenhills", "quitinday green hills"]
  },
  {
    key: "solong-ecopark",
    name: "Solong EcoPark",
    aliases: ["solong ecopark", "solong eco park"]
  },
  {
    key: "jovellar-underground-river",
    name: "Jovellar Underground River",
    aliases: ["jovellar underground river"]
  },
  {
    key: "mayon-skyline-view-deck",
    name: "Mayon Skyline View Deck",
    aliases: ["mayon skyline view deck", "mayon skyline"]
  },
  {
    key: "sumlang-lake",
    name: "Sumlang Lake",
    aliases: ["sumlang lake"]
  },
  {
    key: "lignon-hill",
    name: "Ligñon Hill",
    aliases: ["lignon hill", "ligñon hill", "lignon"]
  },
  {
    key: "daraga-church",
    name: "Daraga Church",
    aliases: ["daraga church", "our lady of the gate parish"]
  },
  {
    key: "cagsawa-ruins-park",
    name: "Cagsawa Ruins Park",
    aliases: ["cagsawa ruins park", "cagsawa ruins"]
  }
];

const ALIAS_INDEX = PLACE_DICTIONARY.flatMap((place) =>
  place.aliases.map((alias) => ({
    key: place.key,
    name: place.name,
    alias: normalizeText(alias)
  }))
).sort((a, b) => b.alias.length - a.alias.length);

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
  if (!text) return [];

  const rawMatches = [];

  for (const entry of ALIAS_INDEX) {
    let startIndex = 0;

    while (true) {
      const foundAt = text.indexOf(entry.alias, startIndex);
      if (foundAt === -1) break;

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
    if (seenKeys.has(match.key)) continue;

    const overlaps = accepted.some(
      (existing) => match.start < existing.end && match.end > existing.start
    );

    if (overlaps) continue;

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
  if (!cleaned) return null;

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