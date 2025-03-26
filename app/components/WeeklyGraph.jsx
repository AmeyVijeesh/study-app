'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const WeeklyStudyGraph = () => {
  const [studyData, setStudyData] = useState([]);
  const today = new Date().toLocaleDateString('en-CA');

  const [startDate, setStartDate] = useState('21-04-2025');
  const [endDate, setEndDate] = useState(today);

  const fetchStudyData = async () => {
    if (!startDate || !endDate) return;

    try {
      const res = await fetch(
        `/api/graphs?startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) throw new Error('Failed to fetch study data');
      const data = await res.json();
      setStudyData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudyData();
  }, [startDate, endDate]);

  return (
    <div>
      <h2>Study Time Graph</h2>

      {/* Date Pickers */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={studyData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="timeStudied" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyStudyGraph;
