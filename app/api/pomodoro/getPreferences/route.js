import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Pomodoro from '@/models/Pomodoro';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const preferences = await Pomodoro.findOne({ userId: session.user.id });
    if (!preferences) {
      return Response.json(
        { message: 'Preferences not found' },
        { status: 404 }
      );
    }

    return Response.json(preferences);
  } catch (error) {
    return Response.json(
      { message: 'Error fetching preferences', error },
      { status: 500 }
    );
  }
}
