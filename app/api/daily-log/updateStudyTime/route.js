import { NextResponse } from 'next/server';
import DailyLog from '@/models/DailyLog';
import User from '@/models/User';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { userId, date, subjectId, timeSpent } = await req.json();

    if (!userId || !date || !subjectId || !timeSpent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find or create the daily log entry
    let dailyLog = await DailyLog.findOne({ userId, date });

    if (!dailyLog) {
      dailyLog = new DailyLog({ userId, date, studySessions: [] });
    }

    // Check if the subject already exists in studySessions
    const subjectIndex = dailyLog.studySessions.findIndex(
      (session) => session.subjectId.toString() === subjectId
    );

    if (subjectIndex > -1) {
      dailyLog.studySessions[subjectIndex].timeSpent += timeSpent;
    } else {
      dailyLog.studySessions.push({
        subjectId: new ObjectId(subjectId),
        timeSpent,
      });
    }

    await dailyLog.save();

    // Update total study time for the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update total study time for the specific subject
    const prevTime = user.totalStudyTime.get(subjectId) || 0;
    user.totalStudyTime.set(subjectId, prevTime + timeSpent);

    await user.save();

    return NextResponse.json({ message: 'Study time updated successfully' });
  } catch (error) {
    console.error('Error updating study time:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
