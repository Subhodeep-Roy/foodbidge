const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'FoodBridge Backend API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🟢 FoodBridge Backend Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
