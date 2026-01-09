import Route from "../models/Route.js";
import { normalizeKey } from "../utils/normalizeKey.js";

export async function handleRoute({ session, resolvedPlace, res }) {
    session.lastIntent = "route";
    session.pendingRoute ||= {};

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

    delete session.pendingRoute;

    if (from === to) {
        return res.json({ reply: "You're already there." });
    }

    const routes = await Route.find({ fromKey: from, toKey: to });

    if (!routes.length) {
        session.lastRoute = { from, to };
        return res.json({
            reply: `There’s no fixed route data, but locals usually take a jeepney or tricycle. Just tell the driver you’re going to ${to}.`
        });
    }

    const r = routes[0];
    session.lastRoute = r;

    return res.json({
        reply:
        `🚍 Ride a ${r.vehicle}
• From: ${r.from}
• To: ${r.to}
• Via: ${r.via?.join(", ") || "Direct"}
• Fare: ${r.fare}`
    });
}
