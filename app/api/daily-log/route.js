import { connectToDatabase } from '@/lib/mongodb';
import DailyLog from '@/models/DailyLog';

export async function POST(req) {
  await connectToDatabase();

  const { userId, date, journal, totalTimeFocussed } = await req.json();

  const existingLog = await DailyLog.findOne({ userId, date });

  if (existingLog) {
    return Response.json(
      { message: 'Log already exists for today' },
      { status: 400 }
    );
  }

  const newLog = await DailyLog.create({
    userId,
    date,
    journal,
    totalTimeFocussed,
  });
  return Response.json(newLog, { status: 201 });
}

export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');

  if (!userId) {
    return Response.json({ message: 'Missing userId' }, { status: 400 });
  }

  if (date) {
    const log = await DailyLog.findOne({ userId, date });
    if (!log) {
      return Response.json({ message: 'No log found' }, { status: 404 });
    }
    return Response.json(log);
  }

  const logs = await DailyLog.find({ userId }).sort({ date: -1 });

  return Response.json({ logs });
}

export async function PATCH(req) {
  await connectToDatabase();

  const { userId, date, journal, totalTimeFocussed, timeTable } =
    await req.json();

  if (!userId || !date) {
    return Response.json(
      { message: 'Missing userId or date' },
      { status: 400 }
    );
  }

  const updatedLog = await DailyLog.findOneAndUpdate(
    { userId, date },
    { $set: { journal, totalTimeFocussed, timeTable } },
    { new: true }
  );

  if (!updatedLog) {
    return Response.json({ message: 'Log not found' }, { status: 404 });
  }

  return Response.json(updatedLog);
}
