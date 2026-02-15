const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  focusDuration: {
    type: Number,
    required: true,
    description: 'Focus time in seconds'
  },
  breakDuration: {
    type: Number,
    required: true,
    description: 'Break time in seconds'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    description: 'When the session was completed'
  },
  date: {
    type: String,
    required: true,
    description: 'Session date in YYYY-MM-DD format'
  }
});

module.exports = mongoose.model('Session', sessionSchema);
