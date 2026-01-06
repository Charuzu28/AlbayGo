import fetch from 'node-fetch';

export async function aiRefineItinerary(itineraryData){
    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
            method: "POST",
            headers: {
                "Authorization" : `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                temperature: 0.3,
                messages: [{
                    role: "system",
                    content: `
You are a tourist itinerary assistant.
ONLY rephrase and organize the provided places.
Do NOT add locations.
Do NOT add activities.
Keep it short, clear, and practical.
`
                },
                {
                role: "user",
                content: JSON.stringify(itineraryData)
                }
            ]    
         })
        });

        const data = await res.json();
        return data?.choices?.[0]?.message?.content;
    } catch (error) {
        console.error("AI itinerary error: ", error.message);
        return null;
    }
}