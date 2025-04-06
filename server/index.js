require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const recommendRoute = require('./routes/recommend');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()}  ←  ${req.method} ${req.originalUrl} from ${req.ip}`);
    next();
  });

app.use('/api', recommendRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running at http://localhost:${PORT}`));