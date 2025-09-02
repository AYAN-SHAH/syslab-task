import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);

