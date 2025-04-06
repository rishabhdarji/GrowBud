const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
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
  const startTime = Date.now();
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
  
const apiTime = (Date.now() - startTime) / 1000;
console.log(`OpenAI API call completed in ${apiTime} seconds`);
  // Save the full response to a file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const responseFile = path.join(__dirname, '..', 'logs', `openai_response_${timestamp}.json`);
  
  // Create logs directory if it doesn't exist
  const logsDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  // Save the response to a file
  fs.writeFileSync(
    responseFile, 
    JSON.stringify(response, null, 2)
  );
  console.log(`Full OpenAI response saved to: ${responseFile}`);
  
  // Log the complete response to console
  console.log("COMPLETE OPENAI RESPONSE:");
  console.log(JSON.stringify(response, null, 2));
  
  let rawContent = response.choices[0].message.content;
  // Remove markdown code block markers if present
  rawContent = rawContent.replace(/```json\s*/i, '').replace(/```/g, '').trim();
  
  console.log("Parsed content from OpenAI:");
  console.log(rawContent);
  
  let recommendations;
  try {
    recommendations = JSON.parse(rawContent);
    
    // Save the parsed recommendations to a separate file
    fs.writeFileSync(
      path.join(__dirname, '..', 'logs', `parsed_recommendations_${timestamp}.json`),
      JSON.stringify(recommendations, null, 2)
    );
  } catch (err) {
    console.error("Error parsing JSON from GPT response:", err);
    throw new Error("Failed to parse plant recommendations. Response was: " + rawContent);
  }
  return recommendations;
};
