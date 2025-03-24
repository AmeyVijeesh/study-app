import { authOptions } from '../api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import DailyLogForm from '../components/CreateDailyLog';

const DailyLog = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Please log in to access your daily log.</p>;
  }

  const userId = session.user.id;

  return (
    <>
      <div>
        <DailyLogForm userId={userId} />
      </div>
    </>
  );
};

export default DailyLog;
