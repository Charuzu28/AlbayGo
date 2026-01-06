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
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `
You are a tourism assistant.
Fix typos and normalize place names.
Return JSON ONLY in this format:

{
  "cleanedText": "",
  "places": []
}

Do NOT add explanations.
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
