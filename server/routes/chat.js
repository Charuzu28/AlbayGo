import express from 'express';
import Place from '../models/Place.js';
import Route from '../models/Route.js';
import { aiNormalize } from '../utils/aiNormalize.js';
import { aiExplainRoute } from "../utils/aiExplainRoute.js";

const router = express.Router();
const sessions = {};

const KNOWN_PLACES = [
    "airport",
    "legazpi",
    "daraga",
    "terminal",
    "legazpi port",
    "sm legazpi"
];

function normalizeKey(key){
    return key?.trim().toLowerCase();
}

function detectIntent(message){
    const text = message.toLowerCase();

    if (/how do i get|how to go|from .* to /.test(text)) return "route";
    if (/food|eat|delicacy|restaurant/.test(text)) return "food";
    if (/hotel|stay|lodge|motel/.test(text)) return "stay";
    if (/tourist|spot|landmark|attraction|mayon/.test(text)) return "tourist";
    if (/near|around|nearby/.test(text)) return "nearby";
    if (/what should i do|itinerary|plan/.test(text)) return "itinerary";
    if (/recommend|suggest|best/.test(text)) return "recommend";
    if (/why|explain/.test(text)) return "why";
    if (/jeep|tricycle|van|bus/.test(text)) return "transport";

    return "unknown";
}

function extractPlaces(message){
    const text = message.toLowerCase();
    return KNOWN_PLACES.find(p => text.includes(p)) || null;
}

router.post('/', async (req, res) => {
    try {
        const sessionId = req.ip;
        sessions[sessionId] ||= {};
        const session = sessions[sessionId];

        session.pendingRoute ||= {};

        let { message } = req.body;
        if (!message) {
            return res.status(400).json({ reply: "No message received." });
        }

        let intent = detectIntent(message);
        let resolvedPlace = extractPlaces(message);

        // Run AI cleanup ONLY if place not detected
        if (!resolvedPlace) {
            const ai = await aiNormalize(message);
            if (ai?.cleanedText) {
                message = ai.cleanedText;
                intent = detectIntent(message);
                resolvedPlace = extractPlaces(message);
            }
        }

        if (resolvedPlace) {
            session.lastPlaceKey = normalizeKey(resolvedPlace);
        }

        /* ---------------- ROUTE INTENT ---------------- */

        if ( intent === "route" || (session.lastIntent === "route" && (session.pendingRoute.to || session.pendingRoute.from))) {
            intent = "route";
            session.lastIntent = "route";

            if (resolvedPlace) {
                if (!session.pendingRoute.to) session.pendingRoute.to = resolvedPlace;
                else if (!session.pendingRoute.from) session.pendingRoute.from = resolvedPlace;
            }

            if (!session.pendingRoute.to) {
                return res.json({ reply: "Where are you heading?" });
            }

            if (!session.pendingRoute.from) {
                return res.json({ reply: "Where are you coming from?" });
            }

            const from = normalizeKey(session.pendingRoute.from);
            const to = normalizeKey(session.pendingRoute.to);

            if (from === to) {
                delete session.pendingRoute;
                return res.json({ reply: "You're already there." });
            }

            const routes = await Route.find({ fromKey: from, toKey: to });

            delete session.pendingRoute;

            if (!routes.length) {
                return res.json({
                    reply: `I don’t have an exact route yet. Jeepneys and tricycles are common—ask the driver to take you to ${to}.`
                });
            }

            
            
            const r = routes[0];
            const routeData = {
                from: r.from,
                to: r.to,
                vehicle: r.vehicle,
                via: r.via,
                fare: r.fare,
                notes: r.notes
            };
            session.lastRoute = routeData;
            session.lastIntent = "route";
            
            return res.json({
            reply: `Ride a ${r.vehicle}.
                    From: ${r.from}
                    To: ${r.to}
                    Via: ${r.via?.join(", ") || "Direct route"}
                    Fare: ${r.fare}`
                    });

        }

        

        /* ---------------- WHY INTENT ---------------- */
        if (intent === "why" && session.lastRoute) {
            const explanation = await aiExplainRoute(session.lastRoute);

            return res.json({
                reply: explanation || 
                "This route is commonly used by locals and matches available transport data."
            });
        }


        /* ---------------- ITINERARY ---------------- */

        if (intent === "itinerary") {
            session.lastIntent = "itinerary";

            const timeOfDay =
                /morning/.test(message) ? "morning" :
                /afternoon/.test(message) ? "afternoon" :
                /evening|night/.test(message) ? "evening" :
                null;

            const query = { intent: "tourist" };
            if (timeOfDay) query.bestTime = timeOfDay;

            const places = await Place.find(query).limit(5);

            const location = session.lastPlaceKey || "Legazpi";

            return res.json({
                reply:
                `Here’s a ${timeOfDay || "1-day"} itinerary in ${location}:\n\n` +
                places.map(p => `• ${p.name} (${p.bestTime})`).join("\n")
            });
        }

        /* ---------------- NEARBY ---------------- */

        if (intent === "nearby") {
            if (!session.lastPlaceKey) {
                return res.json({ reply: "Which place are you currently in?" });
            }

            const place = await Place.findOne({
                name: new RegExp(`^${session.lastPlaceKey}$`, "i")
            });


            if (!place?.nearby?.length) {
                return res.json({ reply: "I don’t have nearby data for that place yet." });
            }

            return res.json({
                reply: `Nearby places:\n• ${place.nearby.join("\n• ")}`
            });
        }

        /* ---------------- RECOMMEND ---------------- */

        if (intent === "recommend") {
            const category =
                /food|eat/.test(message) ? "food" :
                /historic|heritage/.test(message) ? "heritage" :
                null;

            const query = category
                ? { intent: "tourist", category }
                : { intent: "tourist" };

            const places = await Place.find(query).limit(3);

            return res.json({
                reply: places.map(p =>
                `• ${p.name}\n${p.description}\nTip: ${p.tips?.[0] || "—"}`
                ).join("\n\n")
            });
        }


        /* ---------------- PLACE INTENTS ---------------- */

        const placeIntents = ["food", "stay", "tourist"];

        if (placeIntents.includes(intent)) {
            const places = await Place.find({ intent }).limit(2);

            if (!places.length) {
                return res.json({
                    reply: "I can help with food, places to stay, tourist spots, and transport."
                });
            }

            return res.json({
                reply: places.map(p => `• ${p.name}\n${p.description}`).join("\n\n")
            });
        }

        return res.json({
            reply: "I can help with routes, food, stays, tourist spots, and itineraries in Albay."
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
