import { authOptions } from '../api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import DisplayAllLogs from '../components/DisplayAllLogs';

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Please log in to access your daily log.</p>;
  }

  const userId = session.user.id;

  return (
    <>
      <h1>h1</h1>
      <DisplayAllLogs userId={userId} />
    </>
  );
};

export default Page;
