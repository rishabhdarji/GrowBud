const express = require('express');
const router = express.Router();
const getClimate = require('../services/climateService');
const getRecommendations = require('../services/openaiService');

router.post('/recommend', async (req, res) => {
    try {
      const { image, location, userType } = req.body; // now includes userType
  
      const climate = await getClimate(location);
      const recommendations = await getRecommendations(image, location, climate, userType);
  
      res.json({ recommendations });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  module.exports = router;