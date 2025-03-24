'use client';

import useAllDailyLogs from '../hooks/useAllLogs';
import { useRouter } from 'next/navigation';

const DisplayAllLogs = ({ userId }) => {
  const { logs, loading, error } = useAllDailyLogs(userId);
  const router = useRouter();

  if (loading) return <h1>Loading...</h1>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {logs.length > 0 ? (
        logs.map((log) => (
          <div
            key={log._id}
            style={{
              marginBottom: '20px',
              borderBottom: '1px solid #ccc',
              paddingBottom: '10px',
            }}
          >
            <h3>{log.date}</h3>
            <p>
              <strong>Journal:</strong> {log.journal || 'No entry'}
            </p>
            <p>
              <strong>Focus Time:</strong> {log.totalTimeFocussed} minutes
            </p>
            <p>
              <strong>Timetable:</strong>{' '}
              {JSON.stringify(log.timeTable) || 'No data'}
            </p>
            <button
              onClick={() =>
                router.push(
                  `/daily-log-update?userId=${userId}&date=${log.date}`
                )
              }
            >
              Update
            </button>
          </div>
        ))
      ) : (
        <p>No logs available</p>
      )}
    </div>
  );
};

export default DisplayAllLogs;
