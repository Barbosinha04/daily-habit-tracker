import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProgressDonutProps {
  current: number;
  target: number;
}

export const ProgressDonut: React.FC<ProgressDonutProps> = ({ current, target }) => {
  const percentage = Math.min((current / target) * 100, 100);
  const data = [
    { name: 'Completed', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];

  return (
    <div className="relative h-[180px] w-[180px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={80}
            startAngle={90}
            endAngle={450}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="url(#orangeGradientDonut)" />
            <Cell fill="#18181b" />
          </Pie>
          <defs>
            <linearGradient id="orangeGradientDonut" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white">{Math.round(percentage)}%</span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Meta</span>
      </div>
    </div>
  );
};
