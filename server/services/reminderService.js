// services/reminderService.js
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { randomUUID } = require('crypto');
const { sendNotification } = require('./notificationService');


const DATA_PATH = path.join(__dirname, '..', 'data', 'reminders.json');
let reminders = [];

/**
 * Load reminders from disk into memory.
 */
function loadReminders() {
  try {
    reminders = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch {
    reminders = [];
  }
}

function loadPlants() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // If file missing or corrupted, start fresh
    return [];
  }
}


/**
 * Persist the in‑memory reminders array to disk.
 */
function saveReminders() {
  fs.writeFileSync(DATA_PATH, JSON.stringify(reminders, null, 2), 'utf8');
}

/**
 * Trigger a reminder: lookup plant name, send notification, then
 * remove one‑time reminders after firing.
 */
function triggerReminder(reminder) {
  const plants = loadPlants();
  const plant = plants.find(p => p.id === reminder.plantId);
  const plantName = plant ? plant.name : `Plant (${reminder.plantId})`;

  const title = reminder.type === 'water'
    ? `Time to Water ${plantName}`
    : `Time to Check ${plantName} Growth`;
  const body = reminder.type === 'water'
    ? `Please water your ${plantName} now.`
    : `Please upload a new photo of your ${plantName}.`;

  sendNotification(title, body, {
    plantId: reminder.plantId,
    reminderType: reminder.type
  });

  if (reminder.oneTime) {
    removeReminder(reminder.id);
  }
}

/**
 * Schedule a reminder: recurring via cron, or one‑time via setTimeout.
 */
function scheduleReminder(reminder) {
  if (reminder.oneTime) {
    const runAtMs = new Date(reminder.runAt).getTime();
    const delay = runAtMs - Date.now();
    if (delay > 0) {
      setTimeout(() => triggerReminder(reminder), delay);
    } else {
      triggerReminder(reminder);
    }
  } else {
    cron.schedule(reminder.cronExpr, () => triggerReminder(reminder));
  }
}

/**
 * Initialize reminders on server start.
 */
function initReminders() {
  loadReminders();
  reminders.forEach(scheduleReminder);
}

/**
 * Add a new reminder and schedule it immediately.
 * @param {{plantId:string, type:string, cronExpr?:string, oneTime?:boolean, runAt?:string}} opts
 */
function addReminder({ plantId, type, cronExpr, oneTime = false, runAt = null }) {
  const reminder = {
    id: randomUUID(),
    plantId,
    type,       // "water" or "photo"
    cronExpr,   // e.g. "0 9 */7 * *"
    oneTime,
    runAt       // ISO string for one‑time reminders
  };
  reminders.push(reminder);
  saveReminders();
  scheduleReminder(reminder);
  return reminder;
}

/**
 * Remove a reminder by its ID.
 */
function removeReminder(id) {
  reminders = reminders.filter(r => r.id !== id);
  saveReminders();
}

/**
 * Remove all one‑time watering reminders for a given plant.
 */
function removeOneTimeWateringReminders(plantId) {
  const before = reminders.length;
  reminders = reminders.filter(r =>
    !(r.plantId === plantId && r.type === 'water' && r.oneTime)
  );
  if (reminders.length !== before) {
    saveReminders();
  }
}

module.exports = {
  initReminders,
  addReminder,
  removeReminder,
  removeOneTimeWateringReminders
};
