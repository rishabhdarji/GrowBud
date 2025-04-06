// services/growthService.js
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analyze a new growth photo, taking into account the plant’s last growth entry.
 * @param {string} imageBase64  – the new follow‑up photo as base64
 * @param {object} plant        – the plant object loaded from disk, including plantedDate and growthLogs
 * @returns {Promise<{status:string, feedback:string}>}
 */
module.exports = async function analyzeGrowth(imageBase64, plant) {
  // Build a summary of the last check-in, if it exists
  let historyText = "This is the first growth check for this plant.";
  if (Array.isArray(plant.growthLogs) && plant.growthLogs.length > 0) {
    const last = plant.growthLogs[plant.growthLogs.length - 1];
    historyText = `On ${new Date(last.date).toLocaleDateString()}, the status was "${last.status}" with feedback: "${last.feedback}".`;
  }

  const prompt = `
You are a plant doctor. This plant is a ${plant.name}, planted on ${new Date(plant.plantedDate).toLocaleDateString()}.
${historyText}
A user has uploaded a new follow‑up photo. Analyze whether the plant is growing correctly, and give:
- status: one of ["healthy","attention","unhealthy"]
- feedback: a 2–3 sentence recommendation (e.g., adjust watering, light, check for pests)

Return exactly a JSON object:
{
  "status": "...",
  "feedback": "..."
}
with no extra text.
`;

  console.log("Calling OpenAI for growth analysis...");
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: prompt },
      { 
        role: "user", 
        content: {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
        }
      }
    ],
    max_tokens: 200
  });

  let raw = resp.choices[0].message.content.trim()
    .replace(/^```json\s*/i, '').replace(/```$/g, '').trim();

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Growth analysis parse error:", err, "\nRaw:", raw);
    throw new Error("Invalid JSON from growth analysis: " + err.message);
  }
};
