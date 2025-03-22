import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Pomodoro from '@/models/Pomodoro';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  console.log('API /updateWorkTime hit');

  const session = await getServerSession(authOptions);
  console.log('Session:', session);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  console.log('Connected to DB');

  try {
    const { totalWorkTime } = await req.json();
    const userId = session.user.id; // Assuming NextAuth gives you the user ID

    console.log(
      `Updating totalTimeWorked for userId: ${userId} by ${totalWorkTime} minutes`
    );

    const updatedSettings = await Pomodoro.findOneAndUpdate(
      { userId },
      { $inc: { totalTimeWorked: totalWorkTime } }, // Increment totalTimeWorked
      { new: true, upsert: true }
    );

    console.log('Updated PomodoroSettings:', updatedSettings);
    return NextResponse.json({
      message: 'Updated successfully',
      totalTimeWorked: updatedSettings.totalTimeWorked,
    });
  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error },
      { status: 500 }
    );
  }
}
