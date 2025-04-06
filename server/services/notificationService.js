// services/notificationService.js
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '..', 'serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const TOKENS_PATH = path.join(__dirname, '..', 'data', 'deviceTokens.json');

// Load registered tokens
function loadTokens() {
  try {
    return JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
  } catch {
    return [];
  }
}

// Save tokens back to disk
function saveTokens(tokens) {
  fs.writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2), 'utf8');
}

/**
 * Register a new FCM device token.
 */
function registerToken(token) {
  const tokens = loadTokens();
  if (!tokens.includes(token)) {
    tokens.push(token);
    saveTokens(tokens);
  }
}

/**
 * Send a notification to all registered devices.
 * @param {string} title 
 * @param {string} body 
 * @param {object} data  optional data payload
 */
async function sendNotification(title, body, data = {}) {
  const tokens = loadTokens();
  if (tokens.length === 0) return;

  const message = {
    notification: { title, body },
    data: { ...data },
    tokens
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log(`FCM: sent ${response.successCount}, failed ${response.failureCount}`);
  } catch (err) {
    console.error('FCM send error:', err);
  }
}

module.exports = { registerToken, sendNotification };
