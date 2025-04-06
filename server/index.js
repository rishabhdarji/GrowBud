require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const recommendRoute = require('./routes/recommend');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api', recommendRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));