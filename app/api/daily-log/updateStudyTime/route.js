import { NextResponse } from 'next/server';
import DailyLog from '@/models/DailyLog';
import User from '@/models/User';
import Subjects from '@/models/Subjects';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { userId, date, subjectId, timeSpent } = await req.json();

    if (!userId || !date || !timeSpent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let actualSubjectId = subjectId;

    if (!subjectId) {
      let otherSubject = await Subject.findOne({ userId, name: 'Other' });

      if (!otherSubject) {
        otherSubject = await Subject.create({ userId, name: 'Other' });
      }

      actualSubjectId = otherSubject._id;
    }

    let dailyLog = await DailyLog.findOne({ userId, date });

    if (!dailyLog) {
      dailyLog = new DailyLog({ userId, date, studySessions: [] });
    }

    const subjectIndex = dailyLog.studySessions.findIndex(
      (session) => session.subjectId.toString() === actualSubjectId.toString()
    );

    if (subjectIndex > -1) {
      dailyLog.studySessions[subjectIndex].timeSpent += timeSpent;
    } else {
      dailyLog.studySessions.push({
        subjectId: new ObjectId(actualSubjectId),
        timeSpent,
      });
    }

    await dailyLog.save();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const prevTime = user.totalStudyTime.get(actualSubjectId.toString()) || 0;
    user.totalStudyTime.set(actualSubjectId.toString(), prevTime + timeSpent);

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
