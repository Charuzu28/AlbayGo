export function detectIntent(message){
    // console.log("[detectIntent] RAW MESSAGE:", message);

    const text = message.toLowerCase();

    if (
        text.includes("how do i get") ||
        text.includes("how to get") ||
        text.includes("route") ||
        text.includes("directions") ||
        text.includes("from") ||
        text.includes("to")
    ) {
        // console.log("[detectIntent] MATCHED: route");
        return "route";
    }
    if (/food|eat|delicacy|restaurant/.test(text)) return "food";
    if (/hotel|stay|lodge|motel/.test(text)) return "stay";
    if (/tourist|spot|landmark|attraction|mayon/.test(text)) return "tourist";
    if (/near|around|nearby/.test(text)) return "nearby";
    if (/itinerary|plan|schedule/.test(text)) return "itinerary";
    if (/day 2|second day|another day|add a day/.test(text)) return "extend-itinerary";
    if (/recommend|suggest|best/.test(text)) return "recommend";
    if (/why|explain/.test(text)) return "why";
    if (/jeep|tricycle|van|bus/.test(text)) return "transport";
    if (/remove|delete|skip/.test(text)) return "remove-place";
    if (/move|swap|reorder/.test(text)) return "move-place";
    if (/replace|change/.test(text)) return "replace-place";
    if (/that|there|it/.test(text)) return "context-followup";

    return "unknown";
}
