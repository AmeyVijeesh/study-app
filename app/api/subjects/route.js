import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Subjects from '@/models/Subjects';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let otherSubject = await Subjects.findOne({
    userId: session.user.id,
    name: 'Other',
  });

  if (!otherSubject) {
    otherSubject = await Subjects.create({
      userId: session.user.id,
      name: 'Other',
    });
  }

  const subjects = await Subjects.find({ userId: session.user.id });

  return NextResponse.json(subjects, { status: 200 });
}

export async function POST(req) {
  await connectToDatabase();

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { name } = await req.json();
    if (!name.trim())
      return NextResponse.json(
        { message: 'Subject name is required' },
        { status: 400 }
      );

    const newSubject = await Subjects.create({
      userId: session.user.id, // Ensure subject is linked to the logged-in user
      name,
    });

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error },
      { status: 500 }
    );
  }
}
