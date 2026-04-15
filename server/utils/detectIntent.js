import { findPlaceMentions } from "./placeDictionary.js";

export function detectIntent(message = "") {
  const text = message.toLowerCase().trim();
  const mentionedPlaces = findPlaceMentions(text);

  const hasRoutePhrase =
    /\b(how do i get|how to get|how can i get|directions|route|commute|get to|go to|travel to)\b/i.test(
      text
    );

  const hasFromToPattern =
    /\bfrom\b.+\bto\b/i.test(text) || /\bto\b.+\bfrom\b/i.test(text);

  const hasTransportKeyword =
    /\b(jeep|jeepney|tricycle|taxi|van|bus)\b/i.test(text);

  const hasLooseRoutePrompt =
    hasRoutePhrase &&
    (/\bto\s+\w+/i.test(text) || /\bfrom\s+\w+/i.test(text));

  if (
    hasFromToPattern ||
    hasTransportKeyword ||
    (hasRoutePhrase && mentionedPlaces.length >= 1) ||
    hasLooseRoutePrompt
  ) {
    return "route";
  }

  if (/itinerary|plan|schedule/.test(text)) return "itinerary";
  if (/day 2|second day|another day|add a day/.test(text)) return "extend-itinerary";
  if (/remove|delete|skip/.test(text)) return "remove-place";
  if (/move|swap|reorder/.test(text)) return "move-place";
  if (/replace|change/.test(text)) return "replace-place";

  if (/food|eat|delicacy|restaurant/.test(text)) return "food";
  if (/hotel|stay|lodge|motel/.test(text)) return "stay";
  if (/tourist|spot|landmark|attraction|mayon/.test(text)) return "tourist";
  if (/near|around|nearby/.test(text)) return "nearby";
  if (/recommend|suggest|best/.test(text)) return "recommend";
  if (/why|explain/.test(text)) return "why";
  if (/that|there|it/.test(text)) return "context-followup";

  return "unknown";
}