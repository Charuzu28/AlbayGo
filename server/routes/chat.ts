import express, { type Request, type Response } from "express";
import rateLimit from "express-rate-limit";

import { detectIntent } from "../utils/detectIntent.js";
import { handleEdit } from "../handlers/editHandler.js";
import { handleItinerary } from "../handlers/itineraryHandler.js";
import handleRoute from "../handlers/routeHandler.js";
import { getSmallTalkReply } from "../utils/smallTalk.js";
// import { aiNormalize } from "../utils/aiNormalize.js";

import type { SessionState, RouteOption } from "../types/chat.js";

const router = express.Router();
const sessions: Record<string, SessionState> = {};
const SESSION_TTL = 30 * 60 * 1000;

setInterval(() => {
  const now = Date.now();

  for (const id in sessions) {
    if (now - sessions[id].updatedAt > SESSION_TTL) {
      delete sessions[id];
    }
  }
}, 10 * 60 * 1000);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30
});

router.use(limiter);

router.post("/", async (req: Request, res: Response) => {
  const sessionId =
    (req.headers["x-session-id"] as string | undefined) ||
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.ip ||
    "anonymous";

  let { message } = req.body as { message?: unknown };

  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "No message received." });
  }

  sessions[sessionId] ||= {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pendingRoute: { from: null, to: null },
    lastRouteOptions: [],
    selectedRoute: null
  };

  const session = sessions[sessionId];
  session.updatedAt = Date.now();

  // const normalized = await aiNormalize(message);
  // if (normalized?.cleanedText) {
  //   message = normalized.cleanedText;
  // }

  if (session.lastRouteOptions.length > 0 && /best|which|recommend/i.test(message)) {
    const best: RouteOption =
      session.lastRouteOptions.find((route) =>
        route.vehicle.toLowerCase().includes("taxi")
      ) || session.lastRouteOptions[0];

    session.selectedRoute = best;

    return res.json({
      reply:
        `I recommend ${best.vehicle} if you're in a hurry.\n` +
        `Jeepneys are cheaper but slower.`,
      intent: "route",
      messageType: "route-followup",
      routeOptions: session.lastRouteOptions,
      selectedRoute: best
    });
  }

  if (/^why\??$/i.test(message) && session.selectedRoute) {
    return res.json({
      reply:
        session.selectedRoute.notes ||
        "That’s the most common route locals take.",
      intent: "route",
      messageType: "route-followup",
      routeOptions: session.lastRouteOptions,
      selectedRoute: session.selectedRoute
    });
  }

  const intent = detectIntent(message);

  const smallTalkReply = getSmallTalkReply(intent);

  if (smallTalkReply) {
    return res.json({
      reply: smallTalkReply,
      intent,
      messageType: "text"
    });
  }

  if (intent === "route" || session.lastIntent === "route") {
    return handleRoute({ session, message, res });
  }

  if (["itinerary", "extend-itinerary"].includes(intent)) {
    return handleItinerary({ session, intent, res });
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