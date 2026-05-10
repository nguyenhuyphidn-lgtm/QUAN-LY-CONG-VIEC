import React, { useMemo } from 'react';
import { Task } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';
import { cn } from '@/lib/utils';

export const ReportsView = ({ tasks }: { tasks: Task[] }) => {
  const statusSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(t => {
      counts[t.status] = (counts[t.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name as any]?.dot.replace('bg-', '#') || '#000'
    }));
  }, [tasks]);

  const prioritySummary = useMemo(() => {
    const priorities: Record<string, number> = {};
    tasks.forEach(t => {
      priorities[t.priority] = (priorities[t.priority] || 0) + 1;
    });
    return Object.entries(priorities).map(([name, value]) => ({
      name,
      value,
      color: name === 'Cao' ? '#f43f5e' : (name === 'Trung bình' ? '#fbbf24' : '#3b82f6')
    }));
  }, [tasks]);

  const executorPerformance = useMemo(() => {
    const performance: Record<string, { name: string, completed: number, active: number }> = {};
    tasks.forEach(t => {
      if (!performance[t.primaryExecutor]) {
        performance[t.primaryExecutor] = { name: t.primaryExecutor, completed: 0, active: 0 };
      }
      if (t.status === 'Hoàn thành') {
        performance[t.primaryExecutor].completed++;
      } else {
        performance[t.primaryExecutor].active++;
      }
    });
    return Object.values(performance).sort((a, b) => (b.completed + b.active) - (a.completed + a.active));
  }, [tasks]);

  // Transform hex-like Tailwind classes to real hex for Recharts
  const TW_COLORS = {
    '#slate-400': '#94a3b8',
    '#blue-500': '#3b82f6',
    '#amber-500': '#f59e0b',
    '#zinc-400': '#a1a1aa',
    '#emerald-500': '#10b981',
    '#rose-500': '#f43f5e',
  };

  const getRealColor = (name: string) => {
    const raw = STATUS_COLORS[name as any]?.dot.replace('bg-', '#') || '#94a3b8';
    return (TW_COLORS as any)[raw] || raw;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Báo cáo hiệu suất</h2>
        <p className="text-xs text-slate-500 font-medium">Thống kê chi tiết và phân tích tiến độ công việc hệ thống.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Trạng thái công việc</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusSummary}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRealColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Độ ưu tiên</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prioritySummary}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '10px' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {prioritySummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-slate-900 border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-blue-400">Tóm tắt con số</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
             <div className="flex justify-between items-end border-b border-slate-800 pb-3">
               <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hoàn thành</p>
                  <p className="text-2xl font-bold text-white">{tasks.filter(t => t.status === 'Hoàn thành').length}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Tỷ lệ</p>
                  <p className="text-sm font-bold text-emerald-500">
                    {Math.round((tasks.filter(t => t.status === 'Hoàn thành').length / tasks.length) * 100) || 0}%
                  </p>
               </div>
             </div>
             <div className="flex justify-between items-end border-b border-slate-800 pb-3">
               <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Trễ hạn</p>
                  <p className="text-2xl font-bold text-rose-500">{tasks.filter(t => t.status === 'Trễ hạn').length}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-rose-500/50 font-bold uppercase tracking-wider">Cần xử lý</p>
                  <p className="text-sm font-bold text-rose-500/70">Khẩn cấp</p>
               </div>
             </div>
             <div className="flex justify-between items-end">
               <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tổng nhân sự</p>
                  <p className="text-2xl font-bold text-white">{new Set(tasks.map(t => t.primaryExecutor)).size}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Trung bình</p>
                  <p className="text-sm font-bold text-blue-400">
                    {(tasks.length / new Set(tasks.map(t => t.primaryExecutor)).size).toFixed(1)} CV/người
                  </p>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Hiệu suất nhân sự</h4>
        </div>
        <CardContent className="h-[400px] p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={executorPerformance} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" axisLine={false} tickLine={false} style={{ fontSize: '10px' }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: 'bold' }} width={100} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="completed" name="Hoàn thành" fill="#10b981" radius={[0, 4, 4, 0]} stackId="a" barSize={20} />
              <Bar dataKey="active" name="Đang thực hiện" fill="#3b82f6" radius={[0, 4, 4, 0]} stackId="a" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
