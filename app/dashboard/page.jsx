'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import '@/styles/dashboard.css';
import Loader from '../components/Loader';

// Create an error boundary component
const ErrorBoundary = ({ children, fallback, componentName }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error state if children change
    setHasError(false);
  }, [children]);

  if (hasError) {
    return (
      <div className="error-boundary">
        <p>{fallback || `${componentName} failed to load. `}</p>
        <button onClick={() => setHasError(false)}>Retry</button>
      </div>
    );
  }

  return (
    <div
      onError={(error) => {
        console.error(`Error in ${componentName}:`, error);
        setHasError(true);
      }}
    >
      {children}
    </div>
  );
};

// Dynamically import components with error boundaries and controlled loading
const LazyUserIntro = dynamic(() => import('../components/UserIntro'), {
  ssr: false,
  loading: () => (
    <div className="component-placeholder">Loading user info...</div>
  ),
});

const LazySidebar = dynamic(() => import('../components/Sidebar'), {
  ssr: false,
  loading: () => (
    <div className="component-placeholder">Loading sidebar...</div>
  ),
});

const LazyDailyData = dynamic(() => import('../components/DailyData'), {
  ssr: false,
  loading: () => (
    <div className="component-placeholder">Loading daily data...</div>
  ),
});

const LazyDailyGraph = dynamic(() => import('../components/DailyGraph'), {
  ssr: false,
  loading: () => (
    <div className="component-placeholder">Loading daily graph...</div>
  ),
});

const LazyWeeklyStudyGraph = dynamic(
  () => import('@/app/components/WeeklyGraph'),
  {
    ssr: false,
    loading: () => (
      <div className="component-placeholder">Loading weekly graph...</div>
    ),
  }
);

const LazyStreak = dynamic(() => import('../components/Streak'), {
  ssr: false,
  loading: () => (
    <div className="component-placeholder">Loading streak data...</div>
  ),
});

const LazyQuotes = dynamic(() => import('../components/Quotes'), {
  ssr: false,
  loading: () => <div className="component-placeholder">Loading quotes...</div>,
});

const LazyFulltimeData = dynamic(() => import('../components/FulltimeData'), {
  ssr: false,
  loading: () => (
    <div className="component-placeholder">Loading statistics...</div>
  ),
});

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();
  const [totalStudyTime, setTotalStudyTime] = useState({});
  const [avgTimeWorked, setAvgTimeWorked] = useState(0);
  const [highestTimeWorked, setHighestTimeWorked] = useState(null);
  const [lowestTimeWorked, setLowestTimeWorked] = useState(null);

  // Component loading states
  const [sidebarLoaded, setSidebarLoaded] = useState(false);
  const [userIntroLoaded, setUserIntroLoaded] = useState(false);
  const [dailyDataLoaded, setDailyDataLoaded] = useState(false);
  const [dailyGraphLoaded, setDailyGraphLoaded] = useState(false);
  const [weeklyGraphLoaded, setWeeklyGraphLoaded] = useState(false);
  const [streakLoaded, setStreakLoaded] = useState(false);
  const [quotesLoaded, setQuotesLoaded] = useState(false);
  const [fulltimeDataLoaded, setFulltimeDataLoaded] = useState(false);

  // Check if we're on the client
  const isClient = typeof window !== 'undefined';
  const today = new Date().toLocaleDateString('en-CA');

  // Derived states with proper null checking
  const todayLog = logs.find((log) => log.date === today) || null;
  const todayTimeWorked = todayLog ? todayLog.totalTimeFocussed : 0;
  const sessionsToday = todayLog ? todayLog.sessionsToday : 0;

  // Function to load data with retry capability
  const fetchDashboardData = async (retryCount = 0) => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard');

      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }

      const data = await res.json();

      // Validate critical data exists
      if (!data || !data.logs) {
        throw new Error('Invalid data received from API');
      }

      // Set data with delay between each to avoid race conditions
      setUserData(data);
      await new Promise((resolve) => setTimeout(resolve, 50));

      setLogs(data.logs || []);
      await new Promise((resolve) => setTimeout(resolve, 50));

      setTotalStudyTime(data.totalStudyTime || {});
      await new Promise((resolve) => setTimeout(resolve, 50));

      setAvgTimeWorked(data.averageTimeWorked || 0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      setHighestTimeWorked(data.highestTimeWorkedLog || null);
      await new Promise((resolve) => setTimeout(resolve, 50));

      setLowestTimeWorked(data.lowestTimeWorkedLog || null);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);

      // Retry logic (max 3 attempts)
      if (retryCount < 3) {
        console.log(`Retrying fetch (attempt ${retryCount + 1})...`);
        setTimeout(
          () => fetchDashboardData(retryCount + 1),
          1000 * (retryCount + 1)
        );
      } else {
        setLoading(false);
        alert(
          'Error loading dashboard data. Please refresh the page to try again.'
        );
      }
    }
  };

  useEffect(() => {
    // Only fetch if we have a session and we're on the client
    if (status === 'loading' || !isClient) return;

    if (!session) {
      setLoading(false);
      return;
    }

    fetchDashboardData();

    // Add performance monitoring for debugging
    if (isClient && window.performance) {
      window.performance.mark('dashboard-start');
    }

    return () => {
      // Clean up performance monitoring
      if (isClient && window.performance) {
        window.performance.mark('dashboard-end');
        window.performance.measure(
          'dashboard-load-time',
          'dashboard-start',
          'dashboard-end'
        );
        console.log(
          'Dashboard load performance:',
          window.performance.getEntriesByName('dashboard-load-time')
        );
      }
    };
  }, [session, status, isClient]);

  // Handle auth loading state
  if (status === 'loading') return <Loader />;

  // Handle unauthenticated state
  if (!session) return <p>Please log in to view your dashboard.</p>;

  // Handle data loading state
  if (loading) return <Loader />;

  const handleDateClick = (date) => {
    const formattedDate = date.toLocaleDateString('en-CA');
    if (userData && userData.id) {
      router.push(
        `/daily-log-update?userId=${userData.id}&date=${formattedDate}`
      );
    } else {
      console.error('User ID not available for navigation');
      alert('Error navigating to log. Please try again.');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {userData && (
          <ErrorBoundary
            componentName="Sidebar"
            fallback="Failed to load sidebar. Please refresh."
          >
            <Suspense
              fallback={
                <div className="component-placeholder">Loading sidebar...</div>
              }
            >
              <div style={{ width: '250px', flexShrink: 0, overflow: 'auto' }}>
                <LazySidebar
                  totalStudyTimeObj={totalStudyTime}
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
                  lowestTimeDate={
                    lowestTimeWorked ? lowestTimeWorked.date : 'N/A'
                  }
                  onLoad={() => setSidebarLoaded(true)}
                />
              </div>
            </Suspense>
          </ErrorBoundary>
        )}

        <div
          className="dash-container"
          style={{
            flexGrow: 1,
            padding: '2rem',
            overflowY: 'auto',
            height: '100vh',
          }}
        >
          {userData && (
            <ErrorBoundary componentName="UserIntro">
              <LazyUserIntro
                username={userData.name}
                onLoad={() => setUserIntroLoaded(true)}
              />
            </ErrorBoundary>
          )}

          {userData && (
            <>
              <ErrorBoundary componentName="DailyData">
                <LazyDailyData
                  totalTime={userData.totalWorkTime}
                  timeToday={todayTimeWorked}
                  sessionsToday={sessionsToday}
                  onLoad={() => setDailyDataLoaded(true)}
                />
              </ErrorBoundary>

              <ErrorBoundary componentName="DailyGraph">
                <LazyDailyGraph onLoad={() => setDailyGraphLoaded(true)} />
              </ErrorBoundary>

              <div className="streakQuotes">
                <ErrorBoundary componentName="Streak">
                  <LazyStreak
                    userId={userData.id}
                    onLoad={() => setStreakLoaded(true)}
                  />
                </ErrorBoundary>

                <ErrorBoundary componentName="Quotes">
                  <LazyQuotes onLoad={() => setQuotesLoaded(true)} />
                </ErrorBoundary>
              </div>

              <ErrorBoundary componentName="WeeklyGraph">
                <LazyWeeklyStudyGraph
                  onLoad={() => setWeeklyGraphLoaded(true)}
                />
              </ErrorBoundary>

              <ErrorBoundary componentName="FulltimeData">
                <LazyFulltimeData
                  avgTime={avgTimeWorked}
                  highestTime={highestTimeWorked}
                  lowestTime={lowestTimeWorked}
                  onLoad={() => setFulltimeDataLoaded(true)}
                />
              </ErrorBoundary>

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
                      return 'null-day';
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
                  onClickDay={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (date <= today) {
                      handleDateClick(date);
                    } else {
                      alert("You can't log future dates!");
                    }
                  }}
                  className="calendar"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
