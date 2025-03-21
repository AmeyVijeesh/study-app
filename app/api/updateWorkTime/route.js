import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
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
    const email = session.user.email;
    console.log(`Updating totalWorkTime for ${email}:`, totalWorkTime);

    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { totalWorkTime } },
      { new: true, upsert: true }
    );

    console.log('Updated user:', user);
    return NextResponse.json({
      message: 'Updated successfully',
      totalWorkTime: user.totalWorkTime,
    });
  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error },
      { status: 500 }
    );
  }
}
