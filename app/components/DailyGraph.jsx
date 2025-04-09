'use client';
import React, { useEffect, useState, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DailyGraph = ({ onLoad }) => {
  const [studyData, setStudyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderKey, setRenderKey] = useState(0); // Force re-render key
  const fetchAttempts = useRef(0);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    // Function to create dummy data if needed
    const createFallbackData = () => {
      const today = new Date();
      const dummyData = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dummyData.push({
          date: date.toISOString().split('T')[0],
          timeStudied: 0,
        });
      }

      return dummyData;
    };

    const fetchStudyData = async () => {
      try {
        fetchAttempts.current += 1;
        setLoading(true);

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const startDate = startOfWeek.toISOString().split('T')[0];
        const endDate = today.toISOString().split('T')[0];

        console.log(
          `Attempt ${fetchAttempts.current}: Fetching study data from ${startDate} to ${endDate}...`
        );

        const res = await fetch(
          `/api/graphs?startDate=${startDate}&endDate=${endDate}`,
          { cache: 'no-store' } // Disable caching to ensure fresh data
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status}`);
        }

        const data = await res.json();

        // Handle empty or invalid data
        if (!data || !data.studyData || data.studyData.length === 0) {
          console.warn('Empty or invalid data received, using fallback');
          setStudyData(createFallbackData());
        } else {
          const parsedData = Array.isArray(data.studyData)
            ? data.studyData
            : JSON.parse(JSON.stringify(data.studyData));

          setStudyData(parsedData);
          console.log('Fetched Data:', parsedData);
        }

        // Force component to re-render after data is set
        setTimeout(() => {
          setRenderKey((prev) => prev + 1);
          setLoading(false);

          // Notify parent component
          if (onLoad && typeof onLoad === 'function') {
            onLoad();
          }
        }, 50);
      } catch (error) {
        console.error('Error fetching study data:', error);
        setError(error.message);

        // For the first load, use fallback data instead of showing error
        if (fetchAttempts.current <= 2) {
          console.log('Using fallback data for first load');
          setStudyData(createFallbackData());

          // Try again after a delay
          setTimeout(() => {
            if (mounted.current) fetchStudyData();
          }, 3000);

          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    };

    // Initial delay before fetching data
    // This gives other components time to load first
    const initialDelay = fetchAttempts.current === 0 ? 800 : 100;
    const timer = setTimeout(() => {
      if (mounted.current) fetchStudyData();
    }, initialDelay);

    return () => {
      mounted.current = false;
      clearTimeout(timer);
    };
  }, [onLoad]);

  // Handle initial render before data loads
  if (loading && fetchAttempts.current <= 1) {
    return (
      <div className="loading-container" style={{ height: '300px' }}>
        <div>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="15"
              fill="none"
              stroke="#2a76a4"
              strokeWidth="3"
              strokeDasharray="70 30"
              style={{
                transformOrigin: 'center',
                animation: 'spin 1s linear infinite',
              }}
            />
          </svg>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p>Loading weekly study data...</p>
        </div>
      </div>
    );
  }

  // For errors after multiple attempts
  if (error && fetchAttempts.current > 2) {
    return (
      <div className="error-container">
        <p>Failed to load study data. Please try again later.</p>
        <button
          onClick={() => {
            fetchAttempts.current = 0;
            setError(null);
            setRenderKey((prev) => prev + 1);
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state - show placeholder chart
  if (!loading && (!studyData || studyData.length === 0)) {
    const emptyData = createFallbackData();
    return (
      <div className="daily-graph-wrapper" key={renderKey}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={emptyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(255, 255, 255, 0.2)"
            />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#ddd' }} />
            <YAxis tick={{ fontSize: 12, fill: '#ddd' }} />
            <Line
              type="monotone"
              dataKey="timeStudied"
              stroke="#2a76a4"
              strokeWidth={2}
            />
            <text x="50%" y="50%" textAnchor="middle" fill="#ddd">
              No study data available for this period
            </text>
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Render the actual chart
  return (
    <div className="daily-graph-wrapper" key={renderKey}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={studyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="rgba(255, 255, 255, 0.2)"
          />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#ddd' }}
            angle={-30}
            textAnchor="end"
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            label={{
              value: 'Minutes',
              angle: -90,
              position: 'insideLeft',
              fill: '#ddd',
              fontSize: 12,
            }}
            tick={{ fontSize: 12, fill: '#ddd' }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              color: '#fff',
              border: '1px solid #2a76a4',
            }}
            labelStyle={{ fontWeight: 'bold', color: '#009dff' }}
            cursor={{ stroke: '#2a76a4', strokeWidth: 1 }}
          />

          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a76a4" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#2a76a4" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Line
            type="monotone"
            dataKey="timeStudied"
            stroke="#2a76a4"
            strokeWidth={3}
            dot={{ r: 5, fill: '#2a76a4', stroke: '#fff', strokeWidth: 1 }}
            activeDot={{
              r: 8,
              fill: '#fff',
              stroke: '#2a76a4',
              strokeWidth: 2,
            }}
            strokeOpacity={0.9}
            fill="url(#lineGradient)"
          />
        </LineChart>
        <div
          style={{
            textAlign: 'center',
            marginTop: 5,
            color: '#ddd',
            fontSize: 14,
            zIndex: 9999,
          }}
        >
          Study Time (Minutes) Over the Week
        </div>
      </ResponsiveContainer>
    </div>
  );
};

// Helper function to create fallback data
const createFallbackData = () => {
  const today = new Date();
  const dummyData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dummyData.push({
      date: date.toISOString().split('T')[0],
      timeStudied: 0,
    });
  }

  return dummyData;
};

export default DailyGraph;
