import { connectToDatabase } from '@/lib/mongodb';
import DailyLog from '@/models/DailyLog';

export async function POST(req) {
  await connectToDatabase();
  console.log('Request Body:', req.body);

  const {
    userId,
    date,
    dayRating,
    academicRating,
    journal,
    victory,
    totalTimeFocussed,
    sessionsToday,
  } = await req.json();

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
    victory,
    dayRating,
    academicRating,
    journal,
    totalTimeFocussed,
    sessionsToday,
  });
  return Response.json(newLog, { status: 201 });
}

export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Missing userId' }), {
      status: 400,
    });
  }

  if (date) {
    const log = await DailyLog.findOne({ userId, date });
    if (!log) {
      return new Response(
        JSON.stringify({
          message: 'No log found. Create one?',
          createNew: true,
        }),
        { status: 200 }
      );
    }
    return new Response(JSON.stringify(log), { status: 200 });
  }

  return new Response(JSON.stringify({ message: 'Date is required' }), {
    status: 400,
  });
}

export async function PATCH(req) {
  await connectToDatabase();
  const {
    userId,
    date,
    victory,
    dayRating,
    academicRating,
    journal,
    totalTimeFocussed,
    sessionsToday,
    timeTable,
  } = await req.json();
  console.log('recijofdsa this: ' + academicRating);

  if (!userId || !date) {
    return Response.json(
      { message: 'Missing userId or date' },
      { status: 400 }
    );
  }

  const updatedLog = await DailyLog.findOneAndUpdate(
    { userId, date },
    {
      $set: {
        victory,
        journal,
        dayRating,
        academicRating,
        totalTimeFocussed,
        sessionsToday,
        timeTable,
      },
    },
    { new: true, upsert: true }
  );

  return Response.json(updatedLog);
}
