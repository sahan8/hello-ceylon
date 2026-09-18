import mongoose from 'mongoose';
import Tour from '../models/Tour.js';
import packages from '../data/packageCatalog.js';

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required.');

await mongoose.connect(process.env.MONGODB_URI);
for (const item of packages) {
  await Tour.findOneAndUpdate({ name: item.name }, { ...item, isActive: true }, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log(`Seeded: ${item.name}`);
}
await mongoose.disconnect();
