'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';
import Subjects from '../components/Subjects';
import WeeklyStudyGraph from '@/app/components/WeeklyGraph';
import Sidebar from '../components/Sidebar';
import UserIntro from '../components/UserIntro';
import dynamic from 'next/dynamic';
import '@/styles/dashboard.css';
import DailyData from '../components/DailyData';
import DailyGraph from '../components/DailyGraph';
import Streak from '../components/Streak';
import Quotes from '../components/Quotes';

const LazyWeeklyStudyGraph = dynamic(
  () => import('@/app/components/WeeklyGraph'),
  {
    ssr: false,
    loading: () => <p>Loading graph...</p>,
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
        const res = await fetch('/api/dashboard');
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
    <>
      <div>
        <div
          style={{
            display: 'flex',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Sidebar
              avgTime={avgTimeWorked}
              highestTime={
                highestTimeWorked ? highestTimeWorked.totalTimeFocussed : 0
              }
              highestTimeDate={
                highestTimeWorked ? highestTimeWorked.date : 'N/A'
              }
              lowestTime={
                lowestTimeWorked ? lowestTimeWorked.totalTimeFocussed : 0
              }
              lowestTimeDate={lowestTimeWorked ? lowestTimeWorked.date : 'N/A'}
            />
          </div>

          <div className="dash-container" style={{ padding: '2rem' }}>
            <UserIntro username={userData.name} />
            <DailyData />
            <div className="streakQuotes">
              <Streak userId={userData.id} />
              <Quotes />
            </div>
            <LazyWeeklyStudyGraph />

            <div
              style={{
                height: '90vh',
                display: 'flex',
                alignItems: 'center',
              }}
            ></div>
            <p>Emails: {userData.email}</p>
            <p>Total Work Time: {userData.totalWorkTime} mins</p>
            <p>Time Worked Today: {todayTimeWorked} mins</p>
            <p>Sessions Today: {sessionsToday}</p>
            <br />
            <p>Avg time so far: {avgTimeWorked} mins</p>
            <p>
              Highest:{' '}
              {highestTimeWorked ? highestTimeWorked.totalTimeFocussed : 0}{' '}
              mins, at {highestTimeWorked ? highestTimeWorked.date : 'N/A'}
            </p>
            <p>
              Lowest:{' '}
              {lowestTimeWorked ? lowestTimeWorked.totalTimeFocussed : 0} min,
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;
