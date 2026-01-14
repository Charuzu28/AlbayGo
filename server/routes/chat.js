import express from 'express';
import rateLimit from "express-rate-limit";

import { detectIntent } from "../utils/detectIntent.js";
import { extractPlaces } from "../utils/extractPlace.js";

import { handleEdit } from "../handlers/editHandler.js";
import { handleItinerary } from "../handlers/itineraryHandler.js";
import  handleRoute  from "../handlers/routeHandler.js";

import { aiNormalize } from '../utils/aiNormalize.js';

const router = express.Router();
const sessions = {};
const SESSION_TTL = 30 * 60 * 1000; 

setInterval(() => {
    const now = Date.now();

    for(const id in sessions){
        if(now - sessions[id].updatedAt > SESSION_TTL){
            delete sessions[id];
        }
    }
}, 10 * 60 * 1000)

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30
});

router.use(limiter);

router.post("/", async (req, res) => {
    const sessionId = req.ip;
    let { message } = req.body;
    const normalized = await aiNormalize(message);

    if(normalized?.cleanedText){
        message = normalized.cleanedText;
    }
    if (!message || typeof message !== "string") {
        return res.status(400).json({ reply: "No message received." });
    }

   

    sessions[sessionId] ||= {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        pendingRoute: {}
    };

    const session = sessions[sessionId];
    session.updatedAt = Date.now();

     if(message.toLowerCase() === 'why' && session.lastRoute){
        return res.json({
            reply: session.lastRoute.notes || "That’s the most common route locals take."
        })
    }

    const intent = detectIntent(message);
    const resolvedPlace = extractPlaces(message);

   if (intent === "route" || session.lastIntent === "route") {
        return handleRoute({ session, message, resolvedPlace, res });
    }
    if (["itinerary", "extend-itinerary"].includes(intent)) {
        return handleItinerary({ session, intent, message, res });
    }

    if (["remove-place", "replace-place", "move-place"].includes(intent)) {
        return handleEdit({ session, intent, message, res });
    }

    if (intent === "unknown") {
        return res.json({
            reply: "I didn’t quite get that. Try asking about routes or itineraries."
        });
    }

    return res.json({
        reply: "That feature isn’t available yet. Ask about routes or itineraries."
    });
});



export default router;
