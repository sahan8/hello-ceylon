const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  alt: { type: String, required: true, trim: true, maxlength: 160 },
  contentType: { type: String, required: true, enum: ['image/jpeg', 'image/png', 'image/webp'] },
  data: { type: Buffer, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

galleryImageSchema.index({ createdAt: -1 });

module.exports = mongoose.models.GalleryImage || mongoose.model('GalleryImage', galleryImageSchema);
