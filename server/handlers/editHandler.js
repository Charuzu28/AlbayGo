import Place from "../models/Place.js";
import { extractPlaceFromItinerary } from "../utils/extractPlace.js";
import { aiRefineItinerary } from "../utils/aiRefineItinerary.js";

export async function handleEdit({ session, intent, message, res }) {
    if (!session.itinerary) {
        return res.json({ reply: "You don’t have an itinerary yet." });
    }

    const target = extractPlaceFromItinerary(session.itinerary, message);
    if (!target) {
        return res.json({ reply: "I couldn’t find that place in your itinerary." });
    }

    if (intent === "remove-place") {
        target.day.places = target.day.places.filter(p => p.name !== target.place.name);
    }

    if (intent === "replace-place") {
        const alternative = await Place.findOne({
            intent: "tourist",
            _id: { $ne: target.place._id }
        });
        target.day.places = target.day.places.map(p =>
            p.name === target.place.name ? alternative : p
        );
    }

    const refined = await aiRefineItinerary({
        day: target.day.day,
        location: session.itinerary.location,
        places: target.day.places.map(p => ({ name: p.name }))
    });

    session.lastEditedPlace = target.place.name;

    return res.json({ reply: refined });
}
