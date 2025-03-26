import { NextResponse } from 'next/server';
import DailyLog from '@/models/DailyLog';
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
      // Update existing subject study time
      dailyLog.studySessions[subjectIndex].timeSpent += timeSpent;
    } else {
      console.log('Subject ID being sent:', subjectId);

      dailyLog.studySessions.push({
        subjectId: new ObjectId(subjectId),
        timeSpent,
      });
    }

    await dailyLog.save();
    return NextResponse.json({ message: 'Study time updated successfully' });
  } catch (error) {
    console.error('Error updating study time:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
