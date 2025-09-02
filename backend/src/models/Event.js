import mongoose from 'mongoose';

// Event documents store UTC datetime alongside original timezone
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    // Store in UTC ISO string
    dateUtc: { type: Date, required: true },
    timezone: { type: String, required: true },
    imageUrl: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);

