import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Ensure correct path
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import DailyLog from '@/models/DailyLog';

export async function POST(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { totalWorkTime } = await req.json();
    const userId = session.user.id;
    const todayDate = new Date().toISOString().split('T')[0];

    // Update daily log
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

    // ✅ Update totalWorkTime in User model
    await User.findByIdAndUpdate(userId, { $inc: { totalWorkTime } });

    return NextResponse.json(
      { totalTimeWorked: dailyLog.totalTimeFocussed },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating work time:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
