require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initReminders } = require('./services/reminderService');
const notificationsRoute = require('./routes/notifications');
const app = express();

const recommendRoute = require('./routes/recommend');
const plantsRoute = require('./routes/plants');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()}  ←  ${req.method} ${req.originalUrl} from ${req.ip}`);
    next();
  });

app.use('/api/plants',plantsRoute);
app.use('/api', recommendRoute);
app.use('/api/notifications', notificationsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running at http://localhost:${PORT}`));