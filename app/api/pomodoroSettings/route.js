import { connectToDatabase } from '@/lib/mongodb';
import Pomodoro from '@/models/Pomodoro';

export async function handler(req, res) {
  if (req.method === 'POST') {
    await connectToDatabase();
    const { userId, workTime, shortBreakTime, longBreakTime } = req.body;

    try {
      let settings = await Pomodoro.findOne({ userId });

      if (settings) {
        settings.workTime = workTime;
        settings.shortBreakTime = shortBreakTime;
        settings.longBreakTime = longBreakTime;
      } else {
        settings = new PomodoroSettings({
          userId,
          workTime,
          shortBreakTime,
          longBreakTime,
        });
      }

      await settings.save();
      res.status(200).json({ success: true, settings });
    } catch {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const settings = await Pomodoro.findOne({ userId });
    if (!settings) {
      return NextResponse.json(
        { success: false, message: 'No settings found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
