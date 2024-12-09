import mongoose from 'mongoose';

const userSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const UserSession = mongoose.models.UserSession || mongoose.model('UserSession', userSessionSchema);
