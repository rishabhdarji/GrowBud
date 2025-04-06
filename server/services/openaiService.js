const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function getRecommendations(imageBase64, location, climate, userType) {
  const prompt = `
You are an expert gardening assistant. A user has uploaded a photo of their space along with their location and lifestyle information. Using the following data, recommend exactly 3 beginner-friendly plants. For each plant, provide only the plant name and a very short description (one sentence). Return your output as a JSON array of objects with keys "name" and "description". Do not include any additional text.

Location Data:
- Location: ${location.city || `${location.lat}, ${location.lon}`}
- Climate: Temperature ${climate.temperature}°C, Humidity ${climate.humidity ? climate.humidity + "%" : "N/A"}, Condition: ${climate.condition}, Wind Speed: ${climate.wind_speed} m/s

User Lifestyle:
- User Type: ${userType}

Image Analysis: Analyze the provided image for lighting, available space, and surface conditions.

Please provide your recommendations now.
  `;
  console.log("Calling OpenAI API with updated prompt for filtered recommendations...");
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",  // or the model you're using
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
        ]
      }
    ],
    max_tokens: 500,
  });
  console.log("OpenAI API call successful!!");
  
  let rawContent = response.choices[0].message.content;
  // Remove markdown code block markers if present
  rawContent = rawContent.replace(/```json\s*/i, '').replace(/```/g, '').trim();
  
  let recommendations;
  try {
    recommendations = JSON.parse(rawContent);
  } catch (err) {
    console.error("Error parsing JSON from GPT response:", err);
    throw new Error("Failed to parse plant recommendations. Response was: " + rawContent);
  }
  return recommendations;
};
