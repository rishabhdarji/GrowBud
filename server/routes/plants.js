const express = require('express');
const fs = require('fs');
const path = require('path');
const analyzeGrowth = require('../services/growthService');
const getGrowthSchedule = require('../services/growthScheduleService');
const router = express.Router();
const { randomUUID } = require('crypto');

const DATA_PATH = path.join(__dirname, '..', 'data', 'plants.json');

// Helper to load the current plants array
function loadPlants() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // If file missing or corrupted, start fresh
    return [];
  }
}

// Helper to save the plants array back to disk
function savePlants(plants) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(plants, null, 2), 'utf8');
}

// GET /api/plants — returns all stored plants
router.get('/', (req, res) => {
  const plants = loadPlants();
  res.json({ plants });
});

// GET one plant by ID
router.get('/:id', (req, res) => {
    const plants = loadPlants();
    const plant = plants.find(p => p.id === req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.json({ plant });
  });

// POST /api/plants — add a new plant
router.post('/', (req, res) => {
  const { name , nickname ,description } = req.body;
  if (!name) {
    return res.status(400).json({ error: '"name" is required' });
  }

  const plant = {
    id: randomUUID(),
    name,
    nickname: nickname || '',
    description: description || ''
  };
  const plants = loadPlants();
  plants.push(plant);
  savePlants(plants);

  res.status(201).json({ message: 'Plant stored successfully', plant });
});

// PATCH update existing plant (only nickname)
router.patch('/:id', (req, res) => {
    const plants = loadPlants();
    const idx = plants.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Plant not found' });

    // Only update provided fields
    const { nickname} = req.body;
    if (typeof nickname !== 'string' || nickname.trim() === '') {
        return res.status(400).json({ error: '"nickname" must be a non-empty string' });
      }
      if (nickname.length > 30) {
        return res.status(400).json({ error: '"nickname" cannot exceed 30 characters' });
      }
    if (nickname != null) plants[idx].nickname = nickname;

    savePlants(plants);
    res.json({ plant: plants[idx] });
});

  // DELETE remove a plant
router.delete('/:id', (req, res) => {
    let plants = loadPlants();
    const initialLength = plants.length;
    plants = plants.filter(p => p.id !== req.params.id);
    if (plants.length === initialLength) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    savePlants(plants);
    res.json({ message: 'Plant deleted successfully' });
});

// PATCH /api/plants/:id/mark-planted — mark a plant as planted
router.patch('/:id/mark-planted', async (req, res) => {
    try {
      // 1) Load & find the plant
      const plants = loadPlants();
      const plant = plants.find(p => p.id === req.params.id);
      if (!plant) return res.status(404).json({ error: 'Plant not found' });
      if (plant.plantedDate) {
        return res.status(400).json({ error: 'Already marked as planted' });
      }
  
      // 2) Mark planted date & init logs
      plant.plantedDate = new Date().toISOString();
      plant.growthLogs = [];
  
      // 3) Determine watering frequency via GPT
      let freqDays;
      try {
        freqDays = await getWateringFrequency(plant.name);
      } catch (err) {
        console.error('Watering frequency error, defaulting to 7 days:', err);
        freqDays = 7;
      }
      plant.wateringFrequencyDays = freqDays;
  
      // 4) Persist this initial update
      savePlants(plants);
  
      // 5) Schedule watering reminders:
      // 5a) Recurring: every freqDays at 9 AM
      const cronExpr = `0 9 */${freqDays} * *`;
      addReminder({
        plantId: plant.id,
        type: 'water',
        cronExpr,
        oneTime: false
      });
      // 5b) First one‑time reminder: freqDays from now
      const firstRun = new Date(Date.now() + freqDays * 24*60*60*1000).toISOString();
      addReminder({
        plantId: plant.id,
        type: 'water',
        oneTime: true,
        runAt: firstRun
      });
  
      // 6) Generate growth milestones via GPT
      let schedule = [];
      try {
        schedule = await getGrowthSchedule(plant.name);
        plant.growthSchedule = schedule;
        savePlants(plants);
      } catch (err) {
        console.error('Growth schedule error:', err);
      }
  
      // 7) Schedule photo reminders at each milestone
      schedule.forEach(({ daysAfterPlanting }) => {
        const runAt = new Date(
          Date.parse(plant.plantedDate) + daysAfterPlanting * 24*60*60*1000
        ).toISOString();
        addReminder({
          plantId: plant.id,
          type: 'photo',
          oneTime: true,
          runAt
        });
      });
  
      // 8) Respond with the updated plant
      res.json({
        message: 'Plant marked planted; watering & growth reminders scheduled',
        plant
      });
  
    } catch (err) {
      console.error('Error in mark-planted:', err);
      res.status(500).json({ error: err.message });
    }
  });
// GET /api/plants/:id/growth — return all logs (watering + growth)
router.get('/:id/growth', (req, res) => {
    const plants = loadPlants();
    const plant = plants.find(p => p.id === req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.json({ growthLogs: plant.growthLogs || [] });
  });
  
  // POST a new growth photo & analysis
  router.post('/:id/growth', async (req, res) => {
    try {
      const { image } = req.body;
      const plants = loadPlants();
      const plant = plants.find(p => p.id === req.params.id);
      if (!plant) {
        return res.status(404).json({ error: 'Plant not found' });
      }
  
      // 1) Analyze the new growth photo
      const analysis = await analyzeGrowth(image, plant);
  
      // 2) Build the log entry
      const entry = {
        id: randomUUID(),
        date: new Date().toISOString(),
        type: 'growth',
        image,                // optional: store the base64
        status: analysis.status,
        feedback: analysis.feedback
      };
  
      // 3) Append to the plant's growthLogs and save
      plant.growthLogs = plant.growthLogs || [];
      plant.growthLogs.push(entry);
      savePlants(plants);
  
      // 4) If the plant needs attention, schedule a photo reminder in 24h
      if (analysis.status !== 'healthy') {
        const reminderTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        addReminder({
          plantId: plant.id,
          type: 'photo',
          oneTime: true,
          runAt: reminderTime.toISOString()
        });
      }
  
      // 5) Respond with the new entry
      res.status(201).json({ entry });
  
    } catch (err) {
      console.error("Error in /api/plants/:id/growth:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/plants/:id/watered — log a watering + reschedule reminder
  router.post('/:id/watered', (req, res) => {
    const plants = loadPlants();
    const idx = plants.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Plant not found' });
  
    const plant = plants[idx];
    plant.growthLogs = plant.growthLogs || [];
  
    // 1) Log the watering event
    const entry = {
      id: randomUUID(),
      date: new Date().toISOString(),
      type: 'watering',
      watered: true
    };
    plant.growthLogs.push(entry);
    savePlants(plants);
  
    // 2) Remove any existing one‑time water reminders for this plant
    removeOneTimeWateringReminders(plant.id);
  
    // 3) Schedule the next one‑time watering reminder
    const freq = plant.wateringFrequencyDays || 7;  // fallback if missing
    const nextRun = new Date(Date.now() + freq * 24 * 60 * 60 * 1000).toISOString();
    addReminder({
      plantId: plant.id,
      type: 'water',
      oneTime: true,
      runAt: nextRun
    });
  
    res.status(201).json({ entry });
  });

module.exports = router;