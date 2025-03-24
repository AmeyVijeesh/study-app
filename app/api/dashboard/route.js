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
  const logs = await DailyLog.find({ userId: user._id }).sort({ date: -1 });

  return new Response(
    JSON.stringify({
      name: user.name,
      email: user.email,
      totalWorkTime: user.totalWorkTime,
      logs, // Include logs in the response
    }),
    { status: 200 }
  );
}
