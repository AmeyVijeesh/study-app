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
          <div className="chartText">Time Distribution (All time)</div>
        </div>

        {/* Pie Chart 2 */}
        <div style={{ textAlign: 'center' }}>
          <ResponsiveContainer width={350} height={300}>
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
          <div className="chartText">Time Distribution for Today</div>
        </div>
      </div>

      <ResponsiveContainer
        width="100%"
        height={350}
        style={{ marginTop: '10%' }}
      >
        <BarChart data={studyData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="timeStudied" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>

      {/* Pie Chart for Subject Distribution */}
    </div>
  );
};

export default WeeklyStudyGraph;
