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

  // Fetch logs within the date range
  const logs = await DailyLog.find({
    userId: session.user.id,
    date: startDate && endDate ? { $gte: startDate, $lte: endDate } : undefined,
  })
    .sort({ date: 1 })
    .populate('studySessions.subjectId', 'name');

  // Fetch all logs (for full-time calculation)
  const allLogs = await DailyLog.find({ userId: session.user.id }).populate(
    'studySessions.subjectId',
    'name'
  );

  // Daily study time
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

  // Function to compute total study time per subject
  const calculateTotalStudyTime = (logs) => {
    const totalStudyTime = {};
    logs.forEach((log) => {
      log.studySessions.forEach((session) => {
        if (!session.subjectId) return;
        const subjectName = session.subjectId.name;

        if (!totalStudyTime[subjectName]) {
          totalStudyTime[subjectName] = 0;
        }
        totalStudyTime[subjectName] += session.timeSpent;
      });
    });
    return Object.entries(totalStudyTime).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Pie chart data
  const subjectData = calculateTotalStudyTime(logs); // Filtered by date range
  const fullSubjectData = calculateTotalStudyTime(allLogs); // Full total time

  return new Response(
    JSON.stringify({ studyData, subjectData, fullSubjectData }),
    {
      status: 200,
    }
  );
}
