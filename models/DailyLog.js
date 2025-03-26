import mongoose from 'mongoose';

const DailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: { type: String, required: true },
    journal: { type: String, default: '' },
    totalTimeFocussed: { type: Number, default: 0 },
    sessionsToday: { type: Number, default: 0 },
    timeTable: { type: Object, default: {} },

    studySessions: [
      {
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        timeSpent: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.DailyLog ||
  mongoose.model('DailyLog', DailyLogSchema);
