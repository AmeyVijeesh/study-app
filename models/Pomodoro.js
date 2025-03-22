import mongoose from 'mongoose';

const PomodoroSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workTime: { type: Number, default: 25 },
  shortBreakTime: { type: Number, default: 5 },
  longBreakTime: { type: Number, default: 15 },
  totalTimeWorked: { type: Number, default: 0 },
});

export default mongoose.models.PomodoroSettings ||
  mongoose.model('PomodoroSettings', PomodoroSettingsSchema);
