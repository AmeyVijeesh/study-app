'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';
import Subjects from '../components/Subjects';
import WeeklyStudyGraph from '@/app/components/WeeklyGraph';

import dynamic from 'next/dynamic';

const LazyWeeklyStudyGraph = dynamic(
  () => import('@/app/components/WeeklyGraph'),
  {
    ssr: false, // Ensure it's only loaded on the client
    loading: () => <p>Loading graph...</p>, // Optional loading indicator
  }
);

const Dashboard = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();
  const [totalStudyTime, setTotalStudyTime] = useState({});
  const [avgTimeWorked, setAvgTimeWorked] = useState(0);
  const [highestTimeWorked, setHighestTimeWorked] = useState(0);
  const [lowestTimeWorked, setLowestTimeWorked] = useState(0);

  const today = new Date().toLocaleDateString('en-CA');

  const todayLog = logs.find((log) => log.date === today);
  const todayTimeWorked = todayLog ? todayLog.totalTimeFocussed : 0;
  const sessionsToday = todayLog ? todayLog.sessionsToday : 0;
  const logDates = new Set(logs.map((log) => log.date));

  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard'); // ✅ Get everything from one API
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();

        setUserData(data);
        setLogs(data.logs || []);
        setTotalStudyTime(data.totalStudyTime || {});
        setAvgTimeWorked(data.averageTimeWorked);
        setHighestTimeWorked(data.highestTimeWorkedLog);
        setLowestTimeWorked(data.lowestTimeWorkedLog);
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
      <p>Sessions Today: {sessionsToday}</p>

      <br />
      <p>Avg time so far: {avgTimeWorked}mins</p>
      <p>
        Highest: {highestTimeWorked ? highestTimeWorked.totalTimeFocussed : 0}{' '}
        mins, at {highestTimeWorked ? highestTimeWorked.date : 'N/A'}
      </p>
      <p>
        Lowest: {lowestTimeWorked ? lowestTimeWorked.totalTimeFocussed : 0}min,
        at {lowestTimeWorked ? lowestTimeWorked.date : 'N/A'}
      </p>

      <Subjects />

      <h3>Total Time Spent Per Subject</h3>
      <ul>
        {Object.entries(totalStudyTime).map(([subjectName, time]) => (
          <li key={subjectName}>
            {subjectName} - {time} minutes
          </li>
        ))}
      </ul>
      <LazyWeeklyStudyGraph />

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
