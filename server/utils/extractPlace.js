const KNOWN_PLACES = [
    "airport",
    "sm legazpi",
    "legazpi",
    "daraga",
    "terminal",
    "legazpi port",
    "hoyop hoyopan cave",
    "seventy-six farm",
    "quitinday greenhills",
    "solong ecopark",
    "jovellar underground river",
    "mayon skyline view deck",
    "sumlang lake",
    "lignon hill",
    "daraga church",
    "cagsawa ruins park",
    
];

export function extractPlaces(message) {
    const text = message.toLowerCase();
    const matches = KNOWN_PLACES.filter(p => text.includes(p)).sort((a, b) => b.length - a.length);

    // console.log("[extractPlaces]");
    // console.log("TEXT:", text);
    // console.log("MATCHES:", matches);

    return matches;
}

export function extractPlaceFromItinerary(itinerary, message){
    const text = message.toLowerCase();

    for(const day of itinerary.days){
        for(const place of day.places){
            if(text.includes(place.name.toLowerCase())){
                return { place, day };
            }
        }
    }
    return null;
}
