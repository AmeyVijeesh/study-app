import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import DailyLog from '@/models/DailyLog';
import { connectToDatabase } from '@/lib/mongodb';
import Subjects from '@/models/Subjects';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email }).select(
    'name email totalWorkTime'
  );

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    });
  }

  const logs = await DailyLog.find({ userId: user._id })
    .sort({ date: -1 })
    .populate('studySessions.subjectId', 'name');
  const validLogs = logs.filter(
    (log) =>
      log.totalTimeFocussed !== undefined && log.totalTimeFocussed !== null
  );

  const totalTimeWorked = validLogs.reduce(
    (sum, log) => sum + log.totalTimeFocussed,
    0
  );

  const averageTimeWorked =
    validLogs.length > 0 ? totalTimeWorked / validLogs.length : 0;
  let highestTimeWorkedLog = null;
  let lowestTimeWorkedLog = null;

  if (logs.length > 0) {
    highestTimeWorkedLog = logs[0];
    lowestTimeWorkedLog = logs[0];

    logs.forEach((log) => {
      if (
        log.totalTimeFocussed !== undefined &&
        log.totalTimeFocussed !== null
      ) {
        if (log.totalTimeFocussed > highestTimeWorkedLog.totalTimeFocussed) {
          highestTimeWorkedLog = log;
        }
        if (log.totalTimeFocussed < lowestTimeWorkedLog.totalTimeFocussed) {
          lowestTimeWorkedLog = log;
        }
      }
    });
  }

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

  return new Response(
    JSON.stringify({
      name: user.name,
      id: user._id,
      email: user.email,
      totalWorkTime: user.totalWorkTime,
      totalTimeWorked,
      totalStudyTime,
      averageTimeWorked,
      highestTimeWorkedLog,
      lowestTimeWorkedLog,
      logs,
    }),
    { status: 200 }
  );
}
