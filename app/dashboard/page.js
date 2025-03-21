import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <h1>fuck off</h1>;
  }

  return <h1>Welcome, {session.user.name}!</h1>;
}
