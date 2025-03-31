import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import DailyLog from '@/models/DailyLog';
import { ObjectId } from 'mongodb'; // ✅ Import ObjectId
import mongoose from 'mongoose';

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

  let userId = session.user.id; // Keep it as a string

  // ✅ Use `userId` in both queries
  const logs = await DailyLog.find({
    userId: userId,
    date: startDate && endDate ? { $gte: startDate, $lte: endDate } : undefined,
  })
    .sort({ date: 1 })
    .populate('studySessions.subjectId', 'name');

  const allLogs = await DailyLog.find({ userId: userId }) // ✅ FIXED HERE
    .populate('studySessions.subjectId', 'name');

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
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const todayLog = await DailyLog.findOne({ userId, date: today }).populate(
    'studySessions.subjectId',
    'name'
  );

  let subjectData = [];

  if (todayLog) {
    subjectData = todayLog.studySessions.reduce((acc, session) => {
      if (!session.subjectId) return acc;
      const subjectName = session.subjectId.name;
      acc[subjectName] = (acc[subjectName] || 0) + session.timeSpent;
      return acc;
    }, {});
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

  const oneSubjectData = calculateTotalStudyTime(logs);
  const fullSubjectData = calculateTotalStudyTime(allLogs);
  const todaySubjectData = todayLog ? calculateTotalStudyTime([todayLog]) : [];

  return new Response(
    JSON.stringify({
      studyData,
      todaySubjectData,
      oneSubjectData,
      fullSubjectData,
    }),
    {
      status: 200,
    }
  );
}
