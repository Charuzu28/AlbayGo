import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        if(!message){
            return res.status(400).json({reply: "No message received!."});
        }
    
        let reply = "I'm still learning about albay!";
    
        if(message.toLowerCase().includes('airport')){
            reply = "From Legazpi City, you can ride a jeep or tricycle going to BIA (Bicol International Airport).";
        }else if(message.toLowerCase().includes('sm legazpi')){
            reply = "SM Legazpi is accessible by jeepney bound for Legazpi City proper.";
        }
    
        res.json({reply});
        
    } catch (error) {
        res.status(500).json({error: "Internal server error", details: error.message});
    }
})

export default router;