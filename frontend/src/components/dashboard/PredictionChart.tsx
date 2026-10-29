import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendItem, DistributionItem } from '../../types';

interface PredictionChartProps {
  trends: TrendItem[];
  distribution: DistributionItem[];
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ trends, distribution }) => {
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0D152A] border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="font-semibold text-slate-300 font-mono">{label}</p>
          <p className="text-[#F87171] font-semibold">Spam: {payload[0]?.value || 0}</p>
          <p className="text-[#22C7A9] font-semibold">Legitimate: {payload[1]?.value || 0}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trends Area Chart */}
      <div className="lg:col-span-2 cyber-card rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Prediction Activity Trends
            </h3>
            <p className="text-xs text-slate-400">
              Daily spam vs legitimate emails analyzed
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F87171] shadow-sm shadow-[#F87171]/50" /> Spam
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C7A9] shadow-sm shadow-[#22C7A9]/50" /> Legitimate
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          {trends.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs font-mono">
              No trend telemetry recorded yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spamGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F87171" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F87171" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="legitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C7A9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22C7A9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#8E9BB5', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#8E9BB5', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <Tooltip content={customTooltip} />
                <Area
                  type="monotone"
                  dataKey="spam"
                  stroke="#F87171"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#spamGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="legitimate"
                  stroke="#22C7A9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#legitGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Donut Chart: Class Distribution */}
      <div className="cyber-card rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Threat Distribution
          </h3>
          <p className="text-xs text-slate-400">
            Current ratio of analyzed emails
          </p>
        </div>

        <div className="h-52 w-full flex items-center justify-center my-2">
          {distribution.every((d) => d.value === 0) ? (
            <div className="text-center text-slate-500 text-xs">
              <p className="font-semibold text-slate-400">No predictions stored</p>
              <p className="text-[10px] mt-1 text-slate-500">Scan an email to populate analytics</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} emails`, name]}
                  contentStyle={{
                    backgroundColor: '#0D152A',
                    border: '1px solid #1E293B',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend */}
        <div className="space-y-2 pt-3 border-t border-slate-800/80">
          {distribution.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="font-bold text-white font-mono">
                {item.value} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
