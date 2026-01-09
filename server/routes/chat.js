import express from 'express';

const router = express.Router();
const sessions = {};

router.post("/", async (req, res) => {
    const session = sessions[req.ip] ||= {};
    let { message } = req.body;

    const intent = detectIntent(message);
    const resolvedPlace = extractPlaces(message);

    if (intent === "route") {
        return handleRoute({ session, resolvedPlace, res });
    }

    if (["itinerary", "extend-itinerary"].includes(intent)) {
        return handleItinerary({ session, intent, res });
    }

    if (["remove-place", "replace-place"].includes(intent)) {
        return handleEdit({ session, intent, message, res });
    }

    return res.json({
        reply: "I can help you plan routes, itineraries, and places around Albay."
    });
});


export default router;
