import React, { useMemo } from 'react';
import { Task, TaskStatus } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CheckCircle2, Clock, AlertCircle, PlayCircle, PauseCircle, LayoutGrid } from 'lucide-react';
import { STATUS_COLORS } from '../constants';
import { Badge } from '@/components/ui/badge';
import { format, isAfter, addDays, parseISO } from 'date-fns';

interface DashboardProps {
  tasks: Task[];
}

const StatCard = ({ title, value, textColorClass }: { title: string, value: number, textColorClass: string }) => (
  <Card className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{title}</p>
    <h3 className={cn("text-2xl font-bold tracking-tight", textColorClass)}>{value}</h3>
  </Card>
);

import { cn } from '@/lib/utils';

export const Dashboard = ({ tasks }: DashboardProps) => {
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      notStarted: tasks.filter(t => t.status === 'Chưa thực hiện').length,
      inProgress: tasks.filter(t => t.status === 'Đang thực hiện').length,
      completed: tasks.filter(t => t.status === 'Hoàn thành').length,
      overdue: tasks.filter(t => t.status === 'Trễ hạn').length,
    };
  }, [tasks]);

  const statusData = useMemo(() => {
    const statuses: TaskStatus[] = ['Chưa thực hiện', 'Đang thực hiện', 'Chờ phản hồi', 'Tạm dừng', 'Hoàn thành', 'Trễ hạn'];
    return statuses.map(s => ({
      name: s,
      value: tasks.filter(t => t.status === s).length,
      color: STATUS_COLORS[s].dot.replace('bg-', '#').replace('slate-400', '94a3b8').replace('blue-500', '3b82f6').replace('amber-500', 'f59e0b').replace('zinc-400', 'a1a1aa').replace('emerald-500', '10b981').replace('rose-500', 'f43f5e')
    })).filter(d => d.value > 0);
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter(t => t.status !== 'Hoàn thành')
      .sort((a, b) => parseISO(a.expectedEndDate).getTime() - parseISO(b.expectedEndDate).getTime())
      .slice(0, 5);
  }, [tasks]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-xs text-slate-500 font-medium">Chào mừng trở lại, đây là tiến độ công việc hôm nay.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Tổng công việc" value={stats.total} textColorClass="text-slate-900" />
        <StatCard title="Đang thực hiện" value={stats.inProgress} textColorClass="text-blue-600" />
        <StatCard title="Hoàn thành" value={stats.completed} textColorClass="text-emerald-600" />
        <StatCard title="Trễ hạn" value={stats.overdue} textColorClass="text-rose-600" />
        <StatCard title="Chưa thực hiện" value={stats.notStarted} textColorClass="text-slate-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <h4 className="text-sm font-bold text-slate-900">Tiến độ công việc gần đây</h4>
          </div>
          <div className="flex-1 min-h-[300px] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 sticky top-0">
                <tr>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mã</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Công việc</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hạn định</th>
                  <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingTasks.map(task => (
                  <tr key={task.id} className={cn(
                    "hover:bg-slate-50/50 transition-colors border-l-4",
                    STATUS_COLORS[task.status].border.replace('border-', 'border-l-')
                  )}>
                    <td className="px-4 py-3 text-[11px] font-mono font-bold text-slate-400">{task.code}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold text-slate-900">{task.title}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{task.primaryExecutor}</div>
                    </td>
                    <td className="px-4 py-3 text-[11px] font-bold text-slate-600">
                      {format(parseISO(task.expectedEndDate), 'dd/MM')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                        STATUS_COLORS[task.status].bg,
                        STATUS_COLORS[task.status].text
                      )}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="border border-slate-200 shadow-sm p-4">
            <h4 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider text-center">Phân bổ trạng thái</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2 px-2">
              {statusData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-[10px] font-medium">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="bg-slate-900 p-5 rounded-xl shadow-lg border border-slate-800">
            <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-widest">Cảnh báo khẩn cấp</h4>
            <div className="space-y-4">
              {tasks.filter(t => t.status === 'Trễ hạn').slice(0, 2).map(t => (
                <div key={t.id} className="bg-slate-800/50 p-3 rounded-lg border-l-2 border-rose-500">
                  <p className="text-[10px] text-rose-400 font-bold mb-1 uppercase tracking-tighter">QUÁ HẠN CRITICAL</p>
                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">{t.code}: {t.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
