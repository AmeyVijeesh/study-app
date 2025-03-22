import { connectToDatabase } from '@/lib/mongodb';
import DailyLog from '@/models/DailyLog';

export async function POST(req) {
  await connectToDatabase();

  const { userId, date, journal, totalTimeFocused, timeTable } =
    await req.json();

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
    totalTimeFocused,
    timetable,
  });
  return Response.json(newLog, { status: 201 });
}

export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');

  if (!userId || !date) {
    return Response.json(
      { message: 'Missing userId or date' },
      { status: 400 }
    );
  }

  const log = await DailyLog.findOne({ userId, date });
  if (!log) {
    return Response.json({ message: 'No log found' }, { status: 404 });
  }

  return Response.json(log);
}
