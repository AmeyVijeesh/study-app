import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <h1>fuck off</h1>;
  }

  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email });

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Total Work Time: {(user.totalWorkTime / 60).toFixed(2)} hrs</p>
    </div>
  );
}
