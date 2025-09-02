import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin' }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

