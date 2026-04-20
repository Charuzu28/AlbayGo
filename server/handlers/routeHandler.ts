import type { Response } from "express";
import Route from "../models/Route.js";
import { extractRouteSlots } from "../utils/extractRouteSlots.js";
import { getPlaceByKey } from "../utils/placeDictionary.js";
import type { RouteOption, SessionState } from "../types/chat.js";

function buildFallbackRoute(fromKey: string, toKey: string): RouteOption {
  const fromPlace = getPlaceByKey(fromKey);
  const toPlace = getPlaceByKey(toKey);

  return {
    fromKey,
    toKey,
    from: fromPlace?.name ?? fromKey,
    to: toPlace?.name ?? toKey,
    vehicle: "Jeepney or tricycle",
    via: [],
    fare: "Ask the driver",
    notes: "No verified fixed route is stored yet. Ask the driver or locals for the latest route."
  };
}

function buildRouteReply(routeOptions: RouteOption[]): string {
  let reply = "Here are your options:\n\n";

  routeOptions.forEach((route, index) => {
    reply +=
      `Option ${index + 1}: ${route.vehicle}\n` +
      `• From: ${route.from}\n` +
      `• To: ${route.to}\n` +
      `• Via: ${route.via?.length ? route.via.join(", ") : "Direct"}\n` +
      `• Fare: ${route.fare || "Not available"}\n\n`;
  });

  return reply.trim();
}

interface HandleRouteArgs {
  session: SessionState;
  message: string;
  res: Response;
}

export default async function handleRoute({
  session,
  message,
  res
}: HandleRouteArgs): Promise<Response> {
  session.pendingRoute ||= { from: null, to: null };
  session.lastIntent = "route";

  const slots = extractRouteSlots(message);

  if (slots.from && slots.to) {
    session.pendingRoute = {
      from: slots.from,
      to: slots.to
    };
  } else {
    if (slots.to) {
      session.pendingRoute.to = slots.to;
    }

    if (slots.from) {
      session.pendingRoute.from = slots.from;
    }

    if (!slots.from && !slots.to && slots.mentionedPlaces.length === 1) {
      const singlePlace = slots.mentionedPlaces[0];

      if (!session.pendingRoute.to) {
        session.pendingRoute.to = singlePlace;
      } else if (!session.pendingRoute.from) {
        session.pendingRoute.from = singlePlace;
      }
    }

    if (
      !slots.from &&
      !slots.to &&
      slots.mentionedPlaces.length >= 2 &&
      !session.pendingRoute.from &&
      !session.pendingRoute.to
    ) {
      session.pendingRoute.from = slots.mentionedPlaces[0];
      session.pendingRoute.to = slots.mentionedPlaces[1];
    }
  }

  if (!session.pendingRoute.to) {
  return res.json({
    reply: "Where are you heading?",
    intent: "route",
    messageType: "missing-route-destination",
    routeOptions: [],
    selectedRoute: null,
  });
}

if (!session.pendingRoute.from) {
  return res.json({
    reply: "Where are you coming from?",
    intent: "route",
    messageType: "missing-route-origin",
    routeOptions: [],
    selectedRoute: null,
  });
}

  const fromKey = session.pendingRoute.from;
  const toKey = session.pendingRoute.to;

  if (fromKey === toKey) {
    session.pendingRoute = { from: null, to: null };
    return res.json({ reply: "You’re already there." });
  }

  const routeDocs = (await Route.find({ fromKey, toKey }).limit(3).lean()) as RouteOption[];

  const routeOptions = routeDocs.length
    ? routeDocs
    : [buildFallbackRoute(fromKey, toKey)];

  const selectedRoute = routeOptions[0];

  session.lastRouteOptions = routeOptions;
  session.selectedRoute = selectedRoute;
  session.pendingRoute = { from: null, to: null };
  session.lastIntent = null;

  return res.status(200).json({
    reply: buildRouteReply(routeOptions),
    intent: "route",
    messageType: "route-result",
    routeOptions,
    selectedRoute
  });
}