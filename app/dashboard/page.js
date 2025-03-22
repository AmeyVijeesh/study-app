import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import Pomodoro from '@/models/Pomodoro';
import { connectToDatabase } from '@/lib/mongodb';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <h1>fuck off</h1>;
  }

  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return <h1>User not found</h1>;
  }

  // Find the Pomodoro data for this specific user
  const pomodoroData = await Pomodoro.findOne({ userId: user._id });

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>
        Pomodoro Work Time:{' '}
        {pomodoroData ? (pomodoroData.totalTimeWorked / 60).toFixed(2) : ''} hrs
      </p>
    </div>
  );
}
