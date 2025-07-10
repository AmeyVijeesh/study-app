'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#A28FEF',
  '#FF66B2',
];

const WeeklyStudyGraph = () => {
  const [studyData, setStudyData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [totalTimeData, setTotalTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useMemo or compute dates only once
  const today = new Date().toLocaleDateString('en-CA');
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const defaultStartDate = oneWeekAgo.toLocaleDateString('en-CA');

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(today);

  const fetchStudyData = useCallback(async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/graphs?startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add cache control for production
          cache: 'no-store',
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Add validation for data structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format received');
      }

      // Ensure arrays exist and are valid
      setStudyData(Array.isArray(data.studyData) ? data.studyData : []);
      setSubjectData(
        Array.isArray(data.todaySubjectData) ? data.todaySubjectData : []
      );
      setTotalTimeData(
        Array.isArray(data.fullSubjectData) ? data.fullSubjectData : []
      );
    } catch (err) {
      console.error('Error fetching study data:', err);
      setError(err.message);
      // Set empty arrays on error to prevent crashes
      setStudyData([]);
      setSubjectData([]);
      setTotalTimeData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchStudyData();
  }, [fetchStudyData]);

  // Add loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Loading study data...</p>
      </div>
    );
  }

  // Add error state
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
        <p>Error loading data: {error}</p>
        <button onClick={fetchStudyData} style={{ marginTop: '10px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="chartText" style={{ textAlign: 'center' }}>
        Subject-wise Time Distribution
      </h1>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '10px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <label className="chartText">
          Start Date:
          <input
            type="date"
            value={startDate}
            className="chartInput"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="chartText">
          End Date:
          <input
            type="date"
            value={endDate}
            className="chartInput"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {/* Pie Chart 1 */}
        <div style={{ textAlign: 'center' }}>
          {subjectData && subjectData.length > 0 ? (
            <ResponsiveContainer width={350} height={300}>
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {subjectData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                width: 350,
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
              }}
            >
              Awww. Didn't study yet? Get started now.
            </div>
          )}

          <div className="chartText">Time Distribution for Today</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          {totalTimeData && totalTimeData.length > 0 ? (
            <ResponsiveContainer width={400} height={300}>
              <PieChart>
                <Pie
                  data={totalTimeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {totalTimeData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                width: 400,
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
              }}
            >
              No study data available
            </div>
          )}
          <div className="chartText">Time Distribution (All time)</div>
        </div>
      </div>
      <h1 className="chartText">Stats this Week</h1>
      <div>
        {studyData && studyData.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height={350}
            style={{ marginTop: '10%' }}
          >
            <BarChart data={studyData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="timeStudied" fill="#0053b6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: 350,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
            }}
          >
            No study data for this week
          </div>
        )}
        <div className="chartText">Time Distribution for this Week</div>
      </div>
    </div>
  );
};

export default WeeklyStudyGraph;
