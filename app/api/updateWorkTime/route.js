import DailyLog from '@/models/DailyLog';
import { getSession } from 'next-auth/react';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end(); // Allow only POST

  await connectToDatabase();
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { totalWorkTime } = req.body;
  const userId = session.user.id;
  const todayDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

  try {
    let dailyLog = await DailyLog.findOne({ userId, date: todayDate });

    if (dailyLog) {
      dailyLog.totalTimeFocussed += totalWorkTime;
    } else {
      dailyLog = new DailyLog({
        userId,
        date: todayDate,
        totalTimeFocussed: totalWorkTime,
      });
    }

    await dailyLog.save();

    res.status(200).json({ totalTimeWorked: dailyLog.totalTimeFocussed });
  } catch (error) {
    console.error('Error updating daily log:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
