import User from '@/models/User';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { userId } = await req.json();

    if (!userId)
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const today = new Date().toISOString().split('T')[0];

    if (user.lastActivityDate === today) {
      return NextResponse.json({ message: 'Streak already counted today' });
    }

    // Check if yesterday was the last activity date to maintain streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = user.streak;
    if (user.lastActivityDate === yesterdayStr) {
      newStreak += 1; // Continue streak
    } else {
      newStreak = 1; // Reset streak
    }

    user.streak = newStreak;
    user.lastActivityDate = today;
    await user.save();

    return NextResponse.json({ streak: newStreak });
  } catch (error) {
    console.error('Error updating streak:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId)
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ streak: user.streak });
  } catch (error) {
    console.error('Error fetching streak:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
