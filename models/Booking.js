const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true,
  },
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
  },
  tourName: {
    type: String,
    required: [true, 'Please select a tour'],
  },
  date: {
    type: Date,
    required: [true, 'Please select a date'],
  },
  people: {
    type: Number,
    default: 1,
    min: [1, 'At least 1 person required'],
    max: [15, 'Maximum 15 people allowed'],
  },
  specialRequests: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid',
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

bookingSchema.index({ date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);