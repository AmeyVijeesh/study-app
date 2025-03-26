import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import DailyLog from '@/models/DailyLog';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  await connectToDatabase();

  const url = new URL(req.url);
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');

  if (!startDate || !endDate) {
    return new Response(JSON.stringify({ error: 'Missing date parameters' }), {
      status: 400,
    });
  }

  const logs = await DailyLog.find({
    userId: session.user.id,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1 });

  const studyData = [];
  let currentDate = new Date(startDate);
  const finalDate = new Date(endDate);

  while (currentDate <= finalDate) {
    const formattedDate = currentDate.toISOString().split('T')[0];

    const log = logs.find((l) => l.date === formattedDate);
    studyData.push({
      date: formattedDate,
      timeStudied: log ? log.totalTimeFocussed : 0,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return new Response(JSON.stringify(studyData), { status: 200 });
}
