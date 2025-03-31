import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Subjects from '@/models/Subjects';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function DELETE(req, { params }) {
  console.log('DELETE request received with params:', params);

  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const subject = await Subjects.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!subject) {
      return NextResponse.json(
        { message: 'Subject not found' },
        { status: 404 }
      );
    }

    await Subjects.deleteOne({ _id: id });

    return NextResponse.json(
      { message: 'Subject deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
