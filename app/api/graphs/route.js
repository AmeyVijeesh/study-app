import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import DailyLog from '@/models/DailyLog';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    await connectToDatabase();

    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Validate dates
    if (!startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: 'Start date and end date are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validate date format
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return new Response(JSON.stringify({ error: 'Invalid date format' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const userId = session.user.id;

    // Use Promise.all to run queries in parallel for better performance
    const [logs, allLogs, todayLog] = await Promise.all([
      DailyLog.find({
        userId: userId,
        date: { $gte: startDate, $lte: endDate },
      })
        .sort({ date: 1 })
        .populate('studySessions.subjectId', 'name')
        .lean(), // Use lean() for better performance

      DailyLog.find({ userId: userId })
        .populate('studySessions.subjectId', 'name')
        .lean(),

      DailyLog.findOne({
        userId,
        date: new Date().toISOString().split('T')[0],
      })
        .populate('studySessions.subjectId', 'name')
        .lean(),
    ]);

    // Generate study data for the date range
    const studyData = [];
    let currentDate = new Date(startDate);
    const finalDate = new Date(endDate);

    while (currentDate <= finalDate) {
      const formattedDate = currentDate.toISOString().split('T')[0];
      const log = logs.find((l) => l.date === formattedDate);

      studyData.push({
        date: formattedDate,
        timeStudied: log ? log.totalTimeFocussed || 0 : 0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Helper function to calculate total study time
    const calculateTotalStudyTime = (logs) => {
      const totalStudyTime = {};

      if (!logs || !Array.isArray(logs)) {
        return [];
      }

      logs.forEach((log) => {
        if (!log.studySessions || !Array.isArray(log.studySessions)) {
          return;
        }

        log.studySessions.forEach((session) => {
          if (!session.subjectId || !session.subjectId.name) return;

          const subjectName = session.subjectId.name;
          totalStudyTime[subjectName] =
            (totalStudyTime[subjectName] || 0) + (session.timeSpent || 0);
        });
      });

      return Object.entries(totalStudyTime).map(([name, value]) => ({
        name,
        value,
      }));
    };

    const oneSubjectData = calculateTotalStudyTime(logs);
    const fullSubjectData = calculateTotalStudyTime(allLogs);
    const todaySubjectData = todayLog
      ? calculateTotalStudyTime([todayLog])
      : [];

    const responseData = {
      studyData: studyData || [],
      todaySubjectData: todaySubjectData || [],
      oneSubjectData: oneSubjectData || [],
      fullSubjectData: fullSubjectData || [],
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('API Error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
