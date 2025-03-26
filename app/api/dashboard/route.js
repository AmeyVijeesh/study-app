import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import DailyLog from '@/models/DailyLog'; // Import the DailyLog model
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  await connectToDatabase();

  // Fetch user details
  const user = await User.findOne({ email: session.user.email }).select(
    'name email totalWorkTime'
  );

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    });
  }

  // Fetch user's logs sorted by date (latest first)
  const logs = await DailyLog.find({ userId: user._id })
    .sort({ date: -1 })
    .populate('studySessions.subjectId', 'name');
  // Aggregate total study time per subject
  const totalStudyTime = {};
  logs.forEach((log) => {
    log.studySessions.forEach((session) => {
      if (!session.subjectId) return; // Handle missing subjects
      const subjectName = session.subjectId.name; // Extract the subject name

      if (!totalStudyTime[subjectName]) {
        totalStudyTime[subjectName] = 0;
      }
      totalStudyTime[subjectName] += session.timeSpent;
    });
  });

  return new Response(
    JSON.stringify({
      name: user.name,
      email: user.email,
      totalWorkTime: user.totalWorkTime,
      logs, // Include logs in the response
      totalStudyTime, // Now includes total time studied per subject
    }),
    { status: 200 }
  );
}
