const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const path = require('path');

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'FoodBridge Backend API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRoutes);

// Serve Frontend Production Build
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🟢 FoodBridge Backend Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
