import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  totalWorkTime: { type: Number, default: 0 },
  totalStudyTime: {
    type: Map,
    of: Number,
    default: {},
  },
  streak: { type: Number, default: 0 },
  lastActivityDate: { type: String, default: null }, // Store date as 'YYYY-MM-DD'
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
