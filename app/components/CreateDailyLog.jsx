'use client';

import { useState } from 'react';
import { createDailyLog } from '@/lib/dailySubmit';

const DailyLogForm = ({ userId }) => {
  const [journal, setJournal] = useState('');
  const [totalTimeFocussed, settotalTimeFocussed] = useState(0);
  const [timeTable, setTimeTable] = useState({});
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting log for user:', userId); // Debugging

    try {
      const log = await createDailyLog(
        userId,
        journal,
        totalTimeFocussed,
        timeTable
      );
      setMessage('Log saved successfully!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={journal}
        onChange={(e) => setJournal(e.target.value)}
        placeholder="Write your journal..."
      />
      <input
        type="number"
        value={totalTimeFocussed}
        onChange={(e) => settotalTimeFocussed(Number(e.target.value))}
        placeholder="Total focused time (minutes)"
      />
      {/* Add a UI for timetable input */}
      <button type="submit">Save Log</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default DailyLogForm;
