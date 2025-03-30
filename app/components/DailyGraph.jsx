import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DailyGraph = () => {
  const [studyData, setStudyData] = useState([]);

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the current week (Sunday)

        const startDate = startOfWeek.toISOString().split('T')[0];
        const endDate = today.toISOString().split('T')[0]; // Stop at today instead of Saturday

        const res = await fetch(
          `/api/graphs?startDate=${startDate}&endDate=${endDate}`
        );

        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setStudyData(data.studyData);
        console.log('Fetched Data:', data); // Check this in the browser console
      } catch (error) {
        console.error('Error fetching study data:', error);
      }
    };

    fetchStudyData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={studyData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {/* ✅ Subtle Grid Lines */}
        <CartesianGrid
          strokeDasharray="4 4"
          stroke="rgba(255, 255, 255, 0.2)"
        />

        {/* ✅ Improve X & Y Axis Fonts */}
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

        {/* ✅ Custom Tooltip for Better Readability */}
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            color: '#fff',
            border: '1px solid #2a76a4',
          }}
          labelStyle={{ fontWeight: 'bold', color: '#009dff' }}
          cursor={{ stroke: '#2a76a4', strokeWidth: 1 }}
        />

        {/* ✅ Line with Gradient Fill & Shadow Effect */}
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
          activeDot={{ r: 8, fill: '#fff', stroke: '#2a76a4', strokeWidth: 2 }}
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
  );
};

export default DailyGraph;
