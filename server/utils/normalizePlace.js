import levenshtein from 'fast-levenshtein'

const KNOWN_PLACES = [
  "airport",
  "daraga airport",
  "sm legazpi",
  "legazpi terminal",
  "daraga",
  "legazpi boulevard"
];

export function normalizePlace(input) {
    if(!input) return null;

    input = input.toLowerCase().trim();

    let bestMatch = null;
    let bestScore = Infinity;

    for(const place of KNOWN_PLACES){
      const score = levenshtein.get(input, place);
      if(score < bestScore){
        bestScore = score;
        bestMatch = place;
      }
    }

    if(bestScore > 4) return input;

    return bestMatch;
}