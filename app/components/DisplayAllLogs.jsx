'use client';

import useAllDailyLogs from '../hooks/useAllLogs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DisplayAllLogs = ({ userId }) => {
  const { logs, loading, error } = useAllDailyLogs(userId);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (loading) return <h1>Loading...</h1>;
  if (error) return <p>Error: {error}</p>;

  const logDates = new Set(logs.map((log) => log.date));

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    if (logDates.has(formattedDate)) {
      router.push(`/daily-log-update?userId=${userId}&date=${formattedDate}`);
    } else {
      alert('No log for this date');
    }
  };

  return (
    <div>
      <div>
        <h2>Your Logs Calendar</h2>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={({ date }) => {
            const formattedDate = date.toISOString().split('T')[0];
            return logDates.has(formattedDate) ? 'log-available' : null;
          }}
          onClickDay={handleDateClick}
        />

        <style jsx global>{`
          .log-available {
            background-color: #4caf50 !important; /* Green highlight */
            color: white !important;
            border-radius: 50%;
          }
          .react-calendar__tile {
            padding: 10px;
          }
        `}</style>
      </div>
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
            <h4>{log.victory}</h4>
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
