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
import FulltimeData from '../components/FulltimeData';

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
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <div style={{ width: '250px', flexShrink: 0, overflow: 'auto' }}>
          <Sidebar
            totalStudyTimeObj={totalStudyTime}
            avgTime={avgTimeWorked}
            highestTime={
              highestTimeWorked ? highestTimeWorked.totalTimeFocussed : 0
            }
            highestTimeDate={highestTimeWorked ? highestTimeWorked.date : 'N/A'}
            lowestTime={
              lowestTimeWorked ? lowestTimeWorked.totalTimeFocussed : 0
            }
            lowestTimeDate={lowestTimeWorked ? lowestTimeWorked.date : 'N/A'}
          />
        </div>

        <div
          className="dash-container"
          style={{
            flexGrow: 1,
            padding: '2rem',
            overflowY: 'auto',
            height: '100vh',
          }}
        >
          <UserIntro username={userData.name} />
          <DailyData
            totalTime={userData.totalWorkTime}
            timeToday={todayTimeWorked}
            sessionsToday={sessionsToday}
          />
          <div className="streakQuotes">
            <Streak userId={userData.id} />
            <Quotes />
          </div>
          <LazyWeeklyStudyGraph />
          <FulltimeData
            avgTime={avgTimeWorked}
            highestTime={highestTimeWorked}
            lowestTime={lowestTimeWorked}
          />
          <h2 className="calendar-title">Your Logs</h2>
          <div className="calendar-cont">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              formatDay={(locale, date) => date.getDate().toString()}
              tileClassName={({ date }) => {
                const formattedDate = date.toLocaleDateString('en-CA');
                const log = logs.find((log) => log.date === formattedDate);

                if (log) {
                  if (log.victory === true) return 'victory-day';
                  if (log.victory === false) return 'setback-day';
                  else return 'null-day';
                }
                return null;
              }}
              tileContent={({ date }) => {
                const formattedDate = date.toLocaleDateString('en-CA');
                const log = logs.find((log) => log.date === formattedDate);

                return log ? (
                  <div className="calendar-tile">
                    <span className="day-rating">{log.dayRating}</span>
                  </div>
                ) : null;
              }}
              onClickDay={handleDateClick}
              className="calendar"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
