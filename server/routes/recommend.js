const express = require('express');
const router = express.Router();
const getClimate = require('../services/climateService');
const getRecommendations = require('../services/openaiService');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

router.post('/recommend', async (req, res) => {
    try {
        console.log("Received /api/recommend request");
        const startTime = Date.now();
  
        const { image, location, userType } = req.body;

        // Log the payload size
        console.log(`Payload size: ${JSON.stringify(req.body).length} bytes`);
        console.log(`Location: ${JSON.stringify(location)}`);
        console.log(`User Type: ${userType}`);      
      
        
        // Log the payload for debugging
        console.log(`Payload received: ${JSON.stringify(req.body, null, 2)}`);

        if (!image) {
            throw new Error("Image data is missing in the request.");
        }
        
        // Log request metadata to help with debugging
        console.log(`Image data received: ${image ? image.substring(0, 50) + '...' : 'none'} (${image ? image.length : 0} characters)`);
        console.log(`Location data: ${JSON.stringify(location)}`);
        console.log(`User type: ${userType}`);
        
        // Save the image data for debugging
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        fs.writeFileSync(
            path.join(logsDir, `request_payload_${timestamp}.json`),
            JSON.stringify({ 
                imageLength: image ? image.length : 0,
                location,
                userType
            }, null, 2)
        );

        // Get climate data
        console.log("Fetching climate data...");
        const climate = await getClimate(location);
        console.log(`Climate data received: ${JSON.stringify(climate)}`);
        
        // Get plant recommendations
        console.log("Calling OpenAI service for recommendations...");
        const recommendations = await getRecommendations(image, location, climate, userType);
        
        const processingTime = (Date.now() - startTime) / 1000;
        console.log(`Request completed in ${processingTime} seconds`);
        
        res.json({ 
            recommendations,
            processingTime: `${processingTime}s`
        });
    } catch (err) {
        console.error("Error in /api/recommend route:", err);
        res.status(500).json({ 
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});
  
module.exports = router;