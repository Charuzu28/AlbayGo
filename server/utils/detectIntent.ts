import { findPlaceMentions } from "./placeDictionary.js";
import type { Intent } from "../types/chat.js";

export function detectIntent(message: string = ""): Intent {
  const text = message.toLowerCase().trim();
  const mentionedPlaces = findPlaceMentions(text);

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/i.test(text)) {
    return "greeting";
  }

  if (/^(thanks|thank you|salamat|ty)\b/i.test(text)) {
    return "gratitude";
  }

  if (/^(bye|goodbye|see you|ingat)\b/i.test(text)) {
    return "farewell";
  }

  if (
    /\b(who are you|what can you do|help|what do you do|how can you help)\b/i.test(text)
  ) {
    return "capability";
  }

  const hasRoutePhrase =
    /\b(how do i get|how to get|how can i get|directions|route|commute|get to|go to|travel to)\b/i.test(
      text
    );

  const hasFromToPattern =
    /\bfrom\b.+\bto\b/i.test(text) || /\bto\b.+\bfrom\b/i.test(text);

  const hasTransportKeyword =
    /\b(jeep|jeepney|tricycle|taxi|van|bus)\b/i.test(text);

  if (
    hasFromToPattern ||
    hasTransportKeyword ||
    (hasRoutePhrase && mentionedPlaces.length >= 1)
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