// services/openaiService.js
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function getRecommendations(imageBase64, location, climate, userType) {
  // build a plain string for location
  const locText = location.city
    ? location.city
    : `${location.lat}, ${location.lon}`;

  const prompt = `
You are an expert gardening assistant. A user has uploaded a photo of their space along with their location and lifestyle.  
Based on the image, the location (${locText}), climate (Temp: ${climate.temperature}°C, Humidity: ${climate.humidity || 'N/A'}%, Condition: ${climate.condition}, Wind Speed: ${climate.wind_speed} m/s), and the fact that they are a ${userType}, recommend exactly three beginner-friendly plants.

For each plant, include:
- name  
- scientificName  
- description (one paragraph)  
- careInstructions (one paragraph)  
- benefits (an array of 3–5 bullet strings)

Return your answer as valid JSON with a top‑level key "recommendations" whose value is an array of these three plant objects. Do not include any explanatory text outside the JSON.
`;

  console.log("Calling OpenAI API for detailed plant recommendations...");
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
        ]
      }
    ],
    max_tokens: 800,
  });
  console.log("OpenAI API call successful!");

  let raw = response.choices[0].message.content.trim();
  raw = raw.replace(/^```json\s*/i, '').replace(/```$/g, '').trim();

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.recommendations) || parsed.recommendations.length !== 3) {
      throw new Error("Expected 'recommendations' array of length 3");
    }
    return parsed;
  } catch (err) {
    console.error("Failed to parse JSON from GPT:", err, "\nRaw response was:", raw);
    throw new Error("Invalid JSON from GPT: " + err.message);
  }
};
