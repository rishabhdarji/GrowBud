require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const os = require('os');
const fs = require('fs');
const path = require('path');

const recommendRoute = require('./routes/recommend');

// Function to get local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  
  // Log all available network interfaces
  console.log("Available network interfaces:");
  for (const name of Object.keys(interfaces)) {
    console.log(`Interface: ${name}`);
    for (const iface of interfaces[name]) {
      console.log(`  Family: ${iface.family}, Address: ${iface.address}, Internal: ${iface.internal}`);
    }
  }
  
  // Try to find the correct network interface
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over non-IPv4 and internal (loopback) addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // Fallback to localhost
}

const localIpAddress = getLocalIpAddress();

// Set up CORS to accept requests from any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase limit for base64 images
app.use(express.json({ limit: '50mb' }));

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log(`Client IP: ${req.ip}`);
  next();
});

app.use('/api', recommendRoute);

// Add a simple test endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running',
    endpoints: {
      '/api/recommend': 'POST - Send plant images for identification'
    }
  });
});

// Add an endpoint to test connectivity from mobile
app.get('/api/ping', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is reachable from your mobile device!',
    serverTime: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  console.log(`\n===== MOBILE DEVICE CONNECTION INFO =====`);
  console.log(`For mobile devices, use http://${localIpAddress}:${PORT}`);
  
  // List all possible IPs to try
  const interfaces = os.networkInterfaces();
  console.log(`\nAll possible IP addresses to try:`);
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`- http://${iface.address}:${PORT} (${name})`);
      }
    }
  }
  console.log(`\nTest the connection by visiting http://${localIpAddress}:${PORT}/api/ping on your mobile device`);
  console.log(`========================================\n`);
});
server.timeout = 120000; // Set timeout to 120 seconds