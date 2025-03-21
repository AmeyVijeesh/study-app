import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Pomodoro from '@/models/Pomodoro';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const { workTime, shortBreakTime, longBreakTime } = await req.json();

  try {
    const updatedPreferences = await Pomodoro.findOneAndUpdate(
      { userId: session.user.id },
      { workTime, shortBreakTime, longBreakTime },
      { new: true, upsert: true }
    );

    return Response.json({
      message: 'Preferences updated',
      updatedPreferences,
    });
  } catch (error) {
    return Response.json(
      { message: 'Error updating preferences', error },
      { status: 500 }
    );
  }
}
