import fetch  from "node-fetch";

export async function aiExplainRoute(routeData){
    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
            method: "POST",
            headers: {
                "Authorization" : `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{
                    role: "system",
                    content: `
You are a tourist guide.
Explain routes clearly and simply.
You MUST only use the provided data.
Do NOT add new steps or places.
No emojis. No opinions.`
                },
                {
                    role: "user",
                    content: JSON.stringify(routeData)
                }
            ],
            temperature: 0.2
            })
        });

        const data = await res.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("AI Explain Error: ", error.message);
        return null;
    }
}