const KNOWN_PLACES = [
    "airport",
    "sm legazpi",
    "legazpi",
    "daraga",
    "terminal",
    "legazpi port",
    
];

export function extractPlaces(message) {
    const text = message.toLowerCase();
    return KNOWN_PLACES.filter(p => text.includes(p));
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
