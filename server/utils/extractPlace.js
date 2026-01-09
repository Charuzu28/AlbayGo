const KNOWN_PLACES = [
    "airport",
    "legazpi",
    "daraga",
    "terminal",
    "legazpi port",
    "sm legazpi"
];

export function extractPlaces(message){
    const text = message.toLowerCase();
    return KNOWN_PLACES.find(p => text.includes(p)) || null;
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
