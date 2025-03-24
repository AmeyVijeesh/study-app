'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useDailyLog from '../hooks/useDailyLog';

const UpdateLogPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');
  const router = useRouter();

  const { log, loading, error, updateLog } = useDailyLog(userId, date);

  const [journal, setJournal] = useState('');
  const [totalTimeFocussed, setTotalTimeFocussed] = useState('');
  const [timeTable, setTimeTable] = useState('');

  useEffect(() => {
    if (log) {
      setJournal(log.journal || '');
      setTotalTimeFocussed(log.totalTimeFocussed || '');
      setTimeTable(JSON.stringify(log.timeTable || {}, null, 2));
    }
  }, [log]);

  const handleUpdate = async () => {
    await updateLog({
      journal,
      totalTimeFocussed,
      timeTable: JSON.parse(timeTable),
    });

    router.push('/'); // Redirect back after update
  };

  if (loading) return <h1>Loading...</h1>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Update Log for {date}</h2>

      <label>Journal:</label>
      <textarea value={journal} onChange={(e) => setJournal(e.target.value)} />

      <label>Focus Time (minutes):</label>
      <input
        type="number"
        value={totalTimeFocussed}
        onChange={(e) => setTotalTimeFocussed(e.target.value)}
      />

      <label>Timetable (JSON format):</label>
      <textarea
        value={timeTable}
        onChange={(e) => setTimeTable(e.target.value)}
      />

      <button onClick={handleUpdate}>Save Changes</button>
      <button onClick={() => router.push('/')}>Cancel</button>
    </div>
  );
};

export default UpdateLogPage;
