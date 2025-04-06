// routes/notifications.js
const express = require('express');
const { registerToken } = require('../services/notificationService');
const router = express.Router();

// POST /api/register-token
router.post('/register-token', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'token is required' });
  registerToken(token);
  res.json({ message: 'Token registered' });
});

module.exports = router;
