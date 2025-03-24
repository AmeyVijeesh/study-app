'use client';

import { useState, useEffect } from 'react';

const useDailyLog = (userId, date) => {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('useDailyLog hook called with:', { userId, date });

  useEffect(() => {
    if (!userId || !date) {
      console.log('Exiting useEffect: Missing userId or date');
      setLoading(false);
      return;
    }

    console.log('Inside useEffect, about to call fetchLog');

    const fetchLog = async () => {
      try {
        setLoading(true);
        console.log(`Fetching log for: userId=${userId}, date=${date}`);

        const res = await fetch(`/api/daily-log?userId=${userId}&date=${date}`);
        console.log('API response received');

        const data = await res.json();
        console.log('API response JSON:', data);

        if (!res.ok) throw new Error(data.message);

        setLog(data);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [userId, date]);

  const updateLog = async (updatedFields) => {
    try {
      const res = await fetch('/api/daily-log', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, date, ...updatedFields }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setLog(data); // Update state with new log data
    } catch (err) {
      setError(err.message);
    }
  };

  return { log, loading, error, updateLog };
};

export default useDailyLog;
