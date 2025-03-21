import mongoose from 'mongoose';

const PomodoroSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workTime: { type: Number, default: 25 }, // Default 25 minutes
  shortBreakTime: { type: Number, default: 5 }, // Default 5 minutes
  longBreakTime: { type: Number, default: 15 }, // Default 15 minutes
});

export default mongoose.models.PomodoroSettings ||
  mongoose.model('PomodoroSettings', PomodoroSettingsSchema);
