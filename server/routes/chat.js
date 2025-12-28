import express from 'express';
import Place from '../models/Place.js';
import Route from '../models/Route.js';

const router = express.Router();

function detectIntent(message){
    const text = message.toLowerCase();

    if(text.includes('jeep') || text.includes('tricycle') || text.includes('airport') || text.includes('port')){
        return "transport";
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
    if(text.includes("how do i get") || text.includes("how to go") || (text.includes("from") && text.includes("to"))){
        return "route";
    }
    return "unknown";
}

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        if(!message){
            return res.status(400).json({reply: "No message received!."});
        }
        
        const intent = detectIntent(message);
        
        let reply = "";
        let routeReply = "";
        
        if(intent === "route"){
            const routes = await Route.find({
                $or: [
                    {from: new RegExp(message,"i")},
                    {to: new RegExp(message, "i")}
                ]
            }).limit(1)
            
            if(!routes.length){
                return res.json({
                    reply: "Tell me where you're coming from and where you're going."
                })
            }
            const r = routes[0];
            routeReply =`
            Ride a ${r.vehicle}.
            From: ${r.from}
            To: ${r.to}
            Via: ${r.via.join(", ")}
            Fare: ${r.fare}
            Notes: ${r.notes}
            `
            return res.json({ reply: routeReply });
        }
        
        
        const places = await Place.find({ intent }).limit(2);
        
        if(!places.length) {
            return res.json({
                reply: "I can help with transport, food, places to stay, and tourist spots in Albay."
            });
        }

        if (intent === "transport") {
            reply += "Tell me where you’re going, and I’ll suggest what to ride.";
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
        
        
        reply += places.map(p => {
            let info = `\n\n• ${p.name} \n ${p.description}`;
            if(p.fare) info += `\nFare: ${p.fare}`;
            if(p.location) info += `\nLocation: ${p.location}`;
            return info;
        }).join("\n\n");
        // REMOVE THIS? 
        reply += "\n\nTell me where you’re going, and I’ll suggest what to ride.";

        res.json({reply});

    } catch (error) {
        res.status(500).json({error: "Internal server error", details: error.message});
    }
    }
)

export default router;