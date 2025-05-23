const express = require('express');
const router = express.Router();
const getClimate = require('../services/climateService');
const getRecommendations = require('../services/openaiService');

router.get('/ping', (req, res) => {
    res.send("pong");
  });
  
router.post('/recommend', async (req, res) => {
    try {
      console.log("Calling /recommend api.......");
      const { image, location, userType } = req.body; // now includes userType
      console.log("variables assigned successfully!!!");
      const climate = await getClimate(location);
      console.log("Climate data fetched successfully!!!");
      const recommendations = await getRecommendations(image, location, climate, userType);
      console.log("Recommendations fetched successfully!!!", recommendations);
      
      // Ensure the response contains the recommendations array
      res.json({ recommendations: recommendations.recommendations });
      console.log("/recommend api call successful!!!");
    } catch (err) {
      console.error("Error in /recommend:", err);
      res.status(500).json({ error: err.message });
    }
  });

 
  
  module.exports = router;