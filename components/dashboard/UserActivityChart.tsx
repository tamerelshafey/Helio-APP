import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUIContext } from '../../context/UIContext';

const data = [
  { name: 'يناير', "مستخدمين جدد": 150, "إجمالي المستخدمين": 150 },
  { name: 'فبراير', "مستخدمين جدد": 120, "إجمالي المستخدمين": 270 },
  { name: 'مارس', "مستخدمين جدد": 200, "إجمالي المستخدمين": 470 },
  { name: 'أبريل', "مستخدمين جدد": 110, "إجمالي المستخدمين": 580 },
  { name: 'مايو', "مستخدمين جدد": 90, "إجمالي المستخدمين": 670 },
  { name: 'يونيو', "مستخدمين جدد": 100, "إجمالي المستخدمين": 770 },
  { name: 'يوليو', "مستخدمين جدد": 80, "إجمالي المستخدمين": 850 },
];

const UserActivityChart: React.FC = () => {
  const { isDarkMode } = useUIContext();

  const tooltipStyle = isDarkMode 
    ? { 
        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
        borderColor: '#334155',
        borderRadius: '0.5rem',
        color: '#fff'
      }
    : { 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        borderColor: '#e2e8f0',
        borderRadius: '0.5rem',
        color: '#0f172a'
      };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Line type="monotone" dataKey="إجمالي المستخدمين" stroke="#22d3ee" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="مستخدمين جدد" stroke="#c084fc" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserActivityChart;