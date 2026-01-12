import Route from "../models/Route.js";

export default async function handleRoute({ session, message, resolvedPlace, res }) {
    session.pendingRoute ||= {};
    session.lastIntent = "route";

    function normalizePlace(place) {
        if (!place) return null;

        // If array, pick the most specific (longest)
        if (Array.isArray(place)) {
            return place.sort((a, b) => b.length - a.length)[0];
    }

    return place;
    }

    const place = normalizePlace(resolvedPlace);

    function isMoreSpecific(newPlace, oldPlace) {
        if (!oldPlace) return true;
        return newPlace.length > oldPlace.length;
        }

        console.log("---- ROUTE HANDLER ----");
        console.log("MESSAGE:", message);
        console.log("RESOLVED PLACE:", resolvedPlace);
        console.log("PENDING BEFORE:", session.pendingRoute);

    // Try to fill route slots
    if (place) {
        if (/from/.test(message)) {
            if (isMoreSpecific(place, session.pendingRoute.from)) {
            session.pendingRoute.from = place;
            }
        } else if (/to/.test(message)) {
            if (isMoreSpecific(place, session.pendingRoute.to)) {
            session.pendingRoute.to = place;
            }
        } else if (!session.pendingRoute.to) {
            session.pendingRoute.to = place;
        } else if (!session.pendingRoute.from) {
            session.pendingRoute.from = place;
        }
        console.log("PENDING ROUTE:", session.pendingRoute);
    }
    // Ask for missing info
    if (!session.pendingRoute.to) {
        return res.json({ reply: "Where are you heading?" });
    }

    if (!session.pendingRoute.from) {
        return res.json({ reply: "Where are you coming from?" });
    }

    const fromKey = session.pendingRoute.from.trim().toLowerCase();
    const toKey = session.pendingRoute.to.trim().toLowerCase();
    
    if (fromKey === toKey) {
        session.pendingRoute = {};
        return res.json({ reply: "You’re already there." });
    }

    const routes = await Route.find({ fromKey, toKey });

    // Fallback route
    if (!routes.length) {
        session.lastRoute = {
            from: fromKey,
            to: toKey,
            vehicle: "jeepney or tricycle",
            notes: "Common local transport"
        };

        return res.json({
            reply:
                `There’s no fixed route data yet.\n` +
                `Locals usually take a jeepney or tricycle.\n` +
                `Just tell the driver you're going to ${toKey}.`
        });
    }

    const r = routes[0];

    session.lastRoute = {
        from: r.from,
        to: r.to,
        vehicle: r.vehicle,
        via: r.via,
        fare: r.fare,
        notes: r.notes
    };

    session.pendingRoute ||= {};
    console.log("FROM:", fromKey);
    console.log("TO:", toKey);
    console.log("ROUTES FOUND:", routes.length);

    return res.json({
        reply:
            `🚍 Ride a ${r.vehicle}\n` +
            `• From: ${r.from}\n` +
            `• To: ${r.to}\n` +
            `• Via: ${r.via?.join(", ") || "Direct"}\n` +
            `• Fare: ${r.fare}`
    });
}

