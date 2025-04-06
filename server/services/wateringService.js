// services/wateringService.js
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Ask GPT to recommend watering frequency (in days) for a given plant species.
 * Returns an integer ≥1.
 */
module.exports = async function getWateringFrequency(plantName) {
  const prompt = `
You are a plant care expert. For the indoor plant species "${plantName}", 
recommend a watering frequency in days suitable for a beginner. 
Return only an integer number of days (e.g. "7"), with no additional text.
`;

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 5,
  });

  const raw = resp.choices[0].message.content.trim();
  const days = parseInt(raw, 10);
  if (isNaN(days) || days < 1) {
    throw new Error(`Invalid watering frequency returned: "${raw}"`);
  }
  return days;
};
