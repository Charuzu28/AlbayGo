import Place from "../models/Place.js";
import { aiRefineItinerary } from "../utils/aiRefineItinerary.js";

export async function handleItinerary({ session, intent, res }) {
    if (intent === "itinerary" && !session.itinerary) {
        const places = await Place.find({ intent: "tourist" }).limit(6);

        const day1 = { day: 1, places: places.slice(0, 3) };
        session.itinerary = {
            location: session.lastPlaceKey || "Legazpi",
            days: [day1]
        };

        return res.json({
            reply:
            `Day 1 itinerary:\n\n` +
            day1.places.map(p => `• ${p.name}`).join("\n")
        });
    }

    if (intent === "extend-itinerary") {
        const used = session.itinerary.days.flatMap(d => d.places.map(p => p._id));
        const newPlaces = await Place.find({
            intent: "tourist",
            _id: { $nin: used }
        }).limit(3);

        const newDay = {
            day: session.itinerary.days.length + 1,
            places: newPlaces
        };

        session.itinerary.days.push(newDay);

        const refined = await aiRefineItinerary({
            day: newDay.day,
            location: session.itinerary.location,
            places: newDay.places.map(p => ({ name: p.name }))
        });

        return res.json({ reply: refined });
    }
}
