import express from 'express';

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

        //fix the price and make it full information
        switch(intent){
            case "transport":
                reply = "You can ride a jeep or tricycle depending on your location. Fares usually start at ₱13.";
                break;
            case "food":
                reply = "Albay has great local food like sili ice cream, pili nut, and Bicol Express. Want recommendations?"
                break;
            case "stay":
                reply = "There are hotels and inns near Legazpi City and Daraga. What’s your budget?"
                break;
            case "tourist":
                reply = "Popular spots include Mayon Volcano, Cagsawa Ruins, and Sumlang Lake."
                break;
            default:
                reply = "I can help with transport, food, places to stay, and tourist spots in Albay."
            
        }
    
        res.json({reply});
        
    } catch (error) {
        res.status(500).json({error: "Internal server error", details: error.message});
    }
})

export default router;