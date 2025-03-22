import mongoose from 'mongoose';

const DailyLogSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: { type: String, required: true },
    journal: { type: String, default: '' },
    totalTimeFocussed: { type: Number, default: 0 },
    timeTable: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.DailyLog ||
  mongoose.model('DailyLog', DailyLogSchema);
