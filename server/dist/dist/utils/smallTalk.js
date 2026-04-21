export function getSmallTalkReply(intent) {
    switch (intent) {
        case "greeting":
            return "Hi! I’m AlbayGo. I can help you find routes, tourist spots, restaurants, hotels, and itinerary ideas around Albay.";
        case "gratitude":
            return "You’re welcome. Ask me where you want to go in Albay, what places to visit, or help planning your trip.";
        case "capability":
            return "I can help you find routes around Albay, suggest tourist spots, restaurants, and hotels, and help you plan simple itineraries.";
        case "farewell":
            return "Take care. Come back anytime if you need help getting around Albay.";
        default:
            return null;
    }
}
