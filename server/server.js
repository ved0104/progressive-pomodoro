require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sessionsRouter = require('./routes/sessions');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pomodoro';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err.message);
  console.log('Running in offline mode - MongoDB not available');
});

// Routes
app.use('/api/sessions', sessionsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pomodoro backend is running' });
});

// Start server locally only
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Pomodoro backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
