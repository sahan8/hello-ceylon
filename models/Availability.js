const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required'],
    unique: true,
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'blocked', 'pending'],
    default: 'available',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Availability || mongoose.model('Availability', availabilitySchema);