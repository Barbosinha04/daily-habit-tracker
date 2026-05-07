import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ActivityChartProps {
  data?: { name: string; value: number; active: boolean }[];
}

const defaultData = [
  { name: 'Seg', value: 0, active: true },
  { name: 'Ter', value: 0, active: true },
  { name: 'Qua', value: 0, active: true },
  { name: 'Qui', value: 0, active: true },
  { name: 'Sex', value: 0, active: true },
];

export const ActivityChart: React.FC<ActivityChartProps> = ({ data = defaultData }) => {
  return (
    <div className="h-[200px] w-full bg-zinc-900/50 p-4 rounded-3xl border border-zinc-800">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={({ x, y, payload }) => {
              const item = data[payload.index];
              return (
                <text 
                  x={x} 
                  y={y + 15} 
                  fill={item?.value > 0 ? '#71717a' : '#27272a'} 
                  fontSize={12} 
                  textAnchor="middle"
                  className="font-bold"
                >
                  {payload.value}
                </text>
              );
            }} 
          />
          <YAxis hide domain={[0, 'dataMax + 1']} />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length && payload[0].value > 0) {
                return (
                  <div className="bg-zinc-800 border border-zinc-700 p-2 rounded-xl shadow-2xl">
                    <p className="text-white text-xs font-bold">{`${payload[0].value} execuções`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={32}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.value === 0 ? 'transparent' : 'url(#orangeGradient)'} 
                className="transition-all duration-500"
              />
            ))}
          </Bar>
          <defs>
            <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
