'use client';

import useDailyLog from '../hooks/useDailyLog';
const DailyLogDisplay = ({ userId }) => {
  const date = new Date().toISOString().split('T')[0]; // Get today's date
  const { log, loading, error } = useDailyLog(userId, date);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  function clcik() {
    console.log(log);
  }

  return (
    <div>
      <h2>Daily Log for {date}</h2>
      <p>
        <strong>Journal:</strong> {log?.journal || 'No entry'}
      </p>
      <p>
        <strong>Focus Time:</strong> {log?.totalTimeFocussed} minutes
      </p>
      <p>
        <strong>Timetable:</strong> {JSON.stringify(log?.timeTable)}
      </p>
      <button onClick={clcik}>clicsk</button>
    </div>
  );
};

export default DailyLogDisplay;
