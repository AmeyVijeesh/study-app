'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';
import Subjects from '../components/Subjects';

const Dashboard = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setUserData(data);
        setLogs(data.logs || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (!session) return <p>Please log in to view your dashboard.</p>;
  if (loading) return <h1>Loading...</h1>;

  const today = new Date().toLocaleDateString('en-CA');

  const todayLog = logs.find((log) => log.date === today);
  const todayTimeWorked = todayLog ? todayLog.totalTimeFocussed : 0;

  const logDates = new Set(logs.map((log) => log.date));

  const handleDateClick = (date) => {
    const formattedDate = date.toLocaleDateString('en-CA');
    router.push(
      `/daily-log-update?userId=${session.user.id}&date=${formattedDate}`
    );
  };

  return (
    <div>
      <h1>Welcome, {userData.name}!</h1>
      <p>Email: {userData.email}</p>
      <p>Total Work Time: {userData.totalWorkTime} mins</p>
      <p>Time Worked Today: {todayTimeWorked} mins</p>

      <Subjects />

      <h2>Your Logs</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={({ date }) => {
          const formattedDate = date.toLocaleDateString('en-CA');
          return logDates.has(formattedDate) ? 'log-available' : null;
        }}
        onClickDay={handleDateClick}
      />

      <style jsx global>{`
        .log-available {
          background-color: #4caf50 !important;
          color: white !important;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
