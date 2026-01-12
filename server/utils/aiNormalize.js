import fetch from "node-fetch";

export async function aiNormalize(message) {
  try {
    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `
You are a text normalizer.

Rules:
- ONLY fix spelling and casing.
- DO NOT add, infer, or replace place names.
- DO NOT introduce new locations.
- DO NOT add geography or context.
- DO NOT guess.

Return JSON ONLY:

{
  "cleanedText": ""
}
              `
            },
            { role: "user", content: message }
          ],
          temperature: 0
        })
      }
    );

    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);

  } catch (error) {
    console.error("GROQ AI Error:", error.message);
    return null;
  }
}
