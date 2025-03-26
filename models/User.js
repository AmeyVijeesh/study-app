import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  totalWorkTime: { type: Number, default: 0 },
  totalStudyTime: {
    type: Map,
    of: Number,
    default: {},
  },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
