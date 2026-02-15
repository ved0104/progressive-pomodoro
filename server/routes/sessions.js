const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// Save a session
router.post('/', async (req, res) => {
  try {
    const { focusDuration, breakDuration, date } = req.body;

    const session = new Session({
      focusDuration,
      breakDuration,
      date: date || new Date().toISOString().split('T')[0]
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ timestamp: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sessions for a specific date
router.get('/date/:date', async (req, res) => {
  try {
    const sessions = await Session.find({ date: req.params.date });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sessions for a date range
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const sessions = await Session.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete all sessions
router.delete('/', async (req, res) => {
  try {
    await Session.deleteMany({});
    res.json({ message: 'All sessions deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
