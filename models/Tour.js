const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Tour description is required'],
    trim: true,
  },
  duration: {
    type: String,
    required: [true, 'Tour duration is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Tour price is required'],
    min: [0, 'Price cannot be negative'],
  },
  currency: {
    type: String,
    enum: ['LKR', 'USD'],
    default: 'USD',
  },
  priceOnRequest: {
    type: Boolean,
    default: false,
  },
  capacity: {
    type: Number,
    min: 1,
    max: 50,
    default: 3,
  },
  image: {
    type: String,
    trim: true,
  },
  locations: {
    type: [String],
    default: [],
  },
  highlights: {
    type: [String],
    default: [],
  },
  inclusions: {
    type: [String],
    default: [],
  },
  icon: {
    type: String,
    required: [true, 'Tour icon is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['city', 'nature', 'culture', 'transfer', 'custom'],
    default: 'custom',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

tourSchema.index({ category: 1 });
tourSchema.index({ isActive: 1 });

module.exports = mongoose.models.Tour || mongoose.model('Tour', tourSchema);
