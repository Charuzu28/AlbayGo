import Place from "../models/Place.js";
import { aiRefineItinerary } from "../utils/aiRefineItinerary.js";
function formatDay(day) {
    return `Day ${day.day} itinerary:\n\n${day.places.map((p) => `• ${p.name}`).join("\n")}`;
}
export async function handleItinerary({ session, intent, res }) {
    if (intent === "itinerary") {
        if (!session.itinerary) {
            const places = await Place.find({ intent: "tourist" }).limit(6);
            const day1 = {
                day: 1,
                places: places.slice(0, 3)
            };
            session.itinerary = {
                location: session.lastPlaceKey || "Legazpi",
                days: [day1]
            };
            return res.json({ reply: formatDay(day1) });
        }
        const currentItinerary = session.itinerary.days.map(formatDay).join("\n\n");
        return res.json({ reply: currentItinerary });
    }
    if (intent === "extend-itinerary") {
        if (!session.itinerary) {
            return res.json({
                reply: "Start an itinerary first, then I can add another day."
            });
        }
        const used = session.itinerary.days.flatMap((day) => day.places.map((place) => place._id));
        const newPlaces = await Place.find({
            intent: "tourist",
            _id: { $nin: used }
        }).limit(3);
        if (!newPlaces.length) {
            return res.json({
                reply: "I don’t have more places to add right now."
            });
        }
        const newDay = {
            day: session.itinerary.days.length + 1,
            places: newPlaces
        };
        session.itinerary.days.push(newDay);
        const refined = await aiRefineItinerary({
            day: newDay.day,
            location: session.itinerary.location,
            places: newDay.places.map((p) => ({ name: p.name }))
        });
        return res.json({
            reply: refined || formatDay(newDay)
        });
    }
    return res.json({
        reply: "I couldn’t process the itinerary request."
    });
}
