import express from 'express';
import Place from '../models/Place.js';
import Route from '../models/Route.js';

const sessions = {};
const router = express.Router();

function detectIntent(message){
    const text = message.toLowerCase();

    if(text.includes("how do i get") || text.includes("how to go") || text.match(/from .* to /)){
        return "route";
    }

    if(text.includes('food') || text.includes('eat') || text.includes('delicacy') || text.includes('restaurant')){
        return "food";
    }

    if(text.includes('hotel') || text.includes('stay') || text.includes('lodge') || text.includes('motel')){
        return "stay";
    }

    if(text.includes('tourist') || text.includes('spot') || text.includes('mayon') || text.includes('scenery')){
        return "tourist";
    }

        if(text.includes('jeep') || text.includes('tricycle') || text.includes('van') || text.includes('bus')){
        return "transport";
    }
    
    return "unknown";
}

function extractPlaces(message){
    const text = message.toLowerCase();
    
    // First try exact match (fast)
    let exactMatch = KNOWN_PLACES.find(place => text.includes(place));
    if (exactMatch) return exactMatch;
    
    // Split message into words for fuzzy matching
    const words = text.split(/\s+/);
    
    let bestMatch = null;
    let bestScore = 0;
    
    // Check each word against each place
    for(const word of words){
        for(const place of KNOWN_PLACES){
            const score = similarity(word, place);
            if(score > bestScore && score > 0.7){ 
                bestScore = score;
                bestMatch = place;
            }
        }
    }
    
    return bestMatch;
}

function similarity(a,b){
    a = a.toLowerCase();
    b = b.toLowerCase();

    if(a === b) return 1;

    let longer = a.length > b.length ? a : b;
    let shorter = a.length > b.length ? b : a;

    const longerLength = longer.length;
    if(longerLength === 0) return 1;

    let same = 0;
    for(let i = 0; i < shorter.length; i++){
        if(longer.includes(shorter[i])) same ++;
    }
    
    return same / longerLength

}

const KNOWN_PLACES =[
    "airport",
    "legazpi",
    "daraga",
    "terminal",
    "legazpi port",
    "sm legazpi"
];
function normalizeKey(key){
    return key?.trim().toLowerCase()
}


router.post('/', async (req, res) => {
    try {
        const sessionId = req.ip;
        // Ensure session exists
        sessions[sessionId] ||= {};
        const session = sessions[sessionId];

        // Eensure memory exists
        session.pendingRoute ||= {};
        const { message } = req.body;
        if(!message){
            return res.status(400).json({reply: "No message received!."});
        }
        
        let intent = detectIntent(message);

        let resolvedPlaces = extractPlaces(message);
        let destination = null;
        let from = null;

         if (session.pendingRoute.to || session.pendingRoute.from) {
         intent = "route";
        }
        
        if (intent === "route" && resolvedPlaces) {
            if (!session.pendingRoute.to) {
                session.pendingRoute.to = resolvedPlaces;
            } else if (!session.pendingRoute.from) {
                session.pendingRoute.from = resolvedPlaces;
            }
        }

      
        console.log("INTENT:", intent, "SESSION:", session.pendingRoute);

        let reply = "";
        
        //INTENT FOR ROUTE
        if(intent === "route"){
            if (!session.pendingRoute.to) {
                return res.json({
                reply: "Where are you heading? (airport, terminal, daraga, etc.)"
                });
            }

            if (!session.pendingRoute.from) {
                return res.json({
                    reply: "Where are you coming from? (terminal, daraga, legazpi, etc.)"
                });
            }



            from = normalizeKey(session.pendingRoute.from);
            destination = normalizeKey(session.pendingRoute.to);
            // FOR DEBUGGING
            console.log("🔍 SEARCHING:", { fromKey: from, toKey: destination });
            const allRoutes = await Route.find({});
            console.log("📊 ALL ROUTES IN DB:", allRoutes.map(r => ({
                from: r.fromKey,
                to: r.toKey,
                fromMatch: r.fromKey === from,
                toMatch: r.toKey === destination
            })));

            if (normalizeKey(from) === normalizeKey(destination)) {
                return res.json({
                    reply: "You're already there 🙂"
                });
            }


            const routes = await Route.find({
                fromKey: from,
                toKey: destination
            });

             // Add this: FOR DEBUGGING
            console.log("📍 FOUND:", routes.length, "routes");

            if (!routes.length) {
                const sameOriginRoutes = await Route.find({
                    fromKey: from
                }).limit(3);

                const sameDestinationRoutes = await Route.find({
                    toKey: destination
                }).limit(3);

                if(sameOriginRoutes.length){
                    const vehicles = [...new Set(sameOriginRoutes.map(r => r.vehicle))];
                    delete session.pendingRoute;
                return res.json({
                reply: `I don't have a saved route for that yet.\n\n From ${from}, people usually ride,:\n• ${vehicles.join('\n')}\n\nYou can ask the driver to take you to ${destination}`
                });
                }

                if(sameDestinationRoutes.length){
                    const vehicles = [...new Set(sameDestinationRoutes.map(r => r.vehicle))];
                    delete session.pendingRoute;
                    return res.json({
                reply: `I don't have a saved route for that yet.\n\n People going to ${destination} often use:\n• ${vehicles}`
                });
                }
                delete session.pendingRoute;
                return res.json({
                    reply: "I don’t have route data for that yet, but jeepneys and tricycles are common around Albay. You can ask the driver directly."
                });
                
            }

            if(routes.length > 1){
                reply = "I found multiple ways to get there:\n\n";

                routes.forEach((r, index) => {
                    reply += `${index + 1}. ${r.vehicle} — ${r.notes || "Standard route"}\n`
                })
                reply += "\nWhich one do you want? (Reply with the number)";
  
                return res.json({ reply });
            }


            const r = routes[0];
            delete session.pendingRoute;
            return res.json({ reply: `Ride a ${r.vehicle}.
            From: ${r.from}
            To: ${r.to}
            Via: ${Array.isArray(r.via) && r.via.length ? r.via.join(", ") : "Direct Route"}
            Fare: ${r.fare}
            Notes: ${r.notes}
            `});
            
        }
        
        //INTENT FOR PLACES
        const places = await Place.find({ intent }).limit(2);
        
        if(!places.length) {
            return res.json({
                reply: "I can help with transport, food, places to stay, and tourist spots in Albay."
            });
        }
        
        if (intent === "food") {
            reply += "Do you want local food or a specific restaurant?";
        }
        
        if (intent === "stay") {
            reply += "What’s your budget per night?";
        }

        if (intent === "tourist") {
            reply += "Which place are you planning to visit?";
        }
        if (intent === "transport") {
            reply += "Tell me where you’re going, and I’ll suggest what to ride.";
        }
        
        
        reply += places.map(p => {
            let info = `\n\n• ${p.name} \n ${p.description}`;
            if(p.fare) info += `\nFare: ${p.fare}`;
            if(p.location) info += `\nLocation: ${p.location}`;
            return info;
        }).join("\n\n");

        res.json({reply});

    } catch (error) {
        res.status(500).json({error: "Internal server error", details: error.message});
    }
    }
)

export default router;