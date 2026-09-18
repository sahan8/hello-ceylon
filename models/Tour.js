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
    min: [0, 'Price must be a positive number'],
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