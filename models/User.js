import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String, default: null }, // Store password reset token
  resetPasswordExpires: { type: Date, default: null }, // Store token expiration time
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
