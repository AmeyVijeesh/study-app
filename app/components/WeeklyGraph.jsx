'use client';

import { useEffect, useState } from 'react';
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
  const today = new Date().toLocaleDateString('en-CA');

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const defaultStartDate = oneWeekAgo.toLocaleDateString('en-CA');

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(today);

  const fetchStudyData = async () => {
    if (!startDate || !endDate) return;

    try {
      const res = await fetch(
        `/api/graphs?startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) throw new Error('Failed to fetch study data');
      const data = await res.json();
      setStudyData(data.studyData);
      setSubjectData(data.subjectData);
      setTotalTimeData(data.fullSubjectData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudyData();
  }, [startDate, endDate]);

  return (
    <div>
      <h2>Study Time Graphs</h2>

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

      {/* Bar Chart for Study Time */}
      <h3>Daily Study Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={studyData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="timeStudied" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>

      {/* Pie Chart for Subject Distribution */}
      <h3>Subject Time Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
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
      <ResponsiveContainer width="100%" height={300}>
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
    </div>
  );
};

export default WeeklyStudyGraph;
