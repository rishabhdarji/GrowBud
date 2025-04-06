// services/growthService.js
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analyze a new growth photo, taking into account the plant’s last growth entry and watering history.
 * @param {string} imageBase64 - The new follow-up photo as base64.
 * @param {object} plant - The plant object loaded from disk, including plantedDate, growthLogs, and wateringFrequencyDays.
 * @returns {Promise<{status: string, feedback: string}>}
 */
module.exports = async function analyzeGrowth(imageBase64, plant) {
  // Build history text from growth logs (if any)
  let historyText = "This is the first growth check for this plant.";
  
  if (Array.isArray(plant.growthLogs) && plant.growthLogs.length > 0) {
    // Find the last watering event
    const wateringLogs = plant.growthLogs.filter(log => log.type === 'watering' && log.watered);
    let lastWateringText = "";
    if (wateringLogs.length > 0) {
      const lastWatering = wateringLogs[wateringLogs.length - 1];
      const lastWateringDate = new Date(lastWatering.date);
      const now = new Date();
      const diffMs = now - lastWateringDate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      lastWateringText = `It has been ${diffDays} day${diffDays === 1 ? '' : 's'} since the last watering (recommended every ${plant.wateringFrequencyDays || 'N/A'} days).`;
    }
    
    // Get the last growth log (if available)
    const growthLogs = plant.growthLogs.filter(log => log.type === 'growth');
    if (growthLogs.length > 0) {
      const lastGrowth = growthLogs[growthLogs.length - 1];
      historyText = `On ${new Date(lastGrowth.date).toLocaleDateString()}, the status was "${lastGrowth.status}" with feedback: "${lastGrowth.feedback}".`;
      if (lastWateringText) {
        historyText += " " + lastWateringText;
      }
    } else if (lastWateringText) {
      historyText = lastWateringText;
    }
  }

  const prompt = `
You are a plant doctor. This plant is a ${plant.name}, planted on ${new Date(plant.plantedDate).toLocaleDateString()}.
${historyText}
A user has uploaded a new follow-up photo. Analyze whether the plant is growing correctly and if its care is appropriate.
Provide:
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
    .replace(/^```json\s*/i, '')
    .replace(/```$/g, '')
    .trim();

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Growth analysis parse error:", err, "\nRaw:", raw);
    throw new Error("Invalid JSON from growth analysis: " + err.message);
  }
};
