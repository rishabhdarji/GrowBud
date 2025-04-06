// services/reminderService.js
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { randomUUID } = require('crypto');
const { sendNotification } = require('./notificationService');

const DATA_PATH = path.join(__dirname, '..', 'data', 'reminders.json');
let reminders = [];

// Load reminders from disk
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

// Save reminders to disk
function saveReminders() {
  fs.writeFileSync(DATA_PATH, JSON.stringify(reminders, null, 2), 'utf8');
}

// Trigger callback for a reminder
function triggerReminder(reminder) {
  console.log(`🔔 Reminder (${reminder.type}) for plant ${reminder.plantId}`);
  // TODO: integrate with notification system (email, push, etc.)

   // Send a push notification via FCM
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

  // For one-time reminders, remove after triggering
  if (reminder.oneTime) {
    removeReminder(reminder.id);
  }
}

// Schedule a single reminder
function scheduleReminder(reminder) {
  if (reminder.oneTime) {
    // oneTime uses runAt timestamp
    const runAt = new Date(reminder.runAt).getTime();
    const delay = runAt - Date.now();
    if (delay > 0) {
      setTimeout(() => triggerReminder(reminder), delay);
    } else {
      // if past due, trigger immediately
      triggerReminder(reminder);
    }
  } else {
    // recurring via cron expression
    cron.schedule(reminder.cronExpr, () => triggerReminder(reminder));
  }
}

// Initialize on server start
function initReminders() {
  loadReminders();
  reminders.forEach(scheduleReminder);
}

// Add a new reminder
function addReminder({ plantId, type, cronExpr, oneTime = false, runAt = null }) {
  const reminder = {
    id: randomUUID(),
    plantId,
    type,       // "water" or "photo"
    cronExpr,   // e.g. "0 9 * * *" for daily at 9am
    oneTime,
    runAt       // ISO string for oneTime reminders
  };
  reminders.push(reminder);
  saveReminders();
  scheduleReminder(reminder);
  return reminder;
}
const firstRun = new Date(Date.now() + freq*24*60*60*1000).toISOString();
addReminder({
  plantId: plant.id,
  type: 'water',
  oneTime: true,
  runAt: firstRun
});

// Remove a reminder by id
function removeReminder(id) {
  reminders = reminders.filter(r => r.id !== id);
  saveReminders();
}

function removeOneTimeWateringReminders(plantId) {
    const before = reminders.length;
    reminders = reminders.filter(r => !(r.plantId === plantId && r.type === 'water' && r.oneTime));
    if (reminders.length !== before) {
      saveReminders();
    }
  }

  module.exports = {
    initReminders,
    addReminder,
    removeReminder,
    removeOneTimeWateringReminders,  // ← export it
  };

