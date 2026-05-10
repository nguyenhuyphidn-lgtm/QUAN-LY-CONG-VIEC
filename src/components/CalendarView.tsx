import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STATUS_COLORS } from '../constants';
import { cn } from '@/lib/utils';

export const CalendarView = ({ tasks, onTaskClick }: { tasks: Task[], onTaskClick: (task: Task) => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarGrid = useMemo(() => {
    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [startDate, endDate]);

  const getDayTasks = (day: Date) => {
    return tasks.filter(task => isSameDay(parseISO(task.expectedEndDate), day));
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Lịch công việc</h2>
          <p className="text-xs text-slate-500 font-medium">Theo dõi thời hạn và kế hoạch công việc theo tháng.</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-bold px-4 min-w-[140px] text-center uppercase tracking-wider text-slate-700">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="flex-1 border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
            <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1">
          {calendarGrid.map((day, idx) => {
            const dayTasks = getDayTasks(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div 
                key={idx} 
                className={cn(
                  "min-h-[100px] border-r border-b border-slate-100 p-2 flex flex-col gap-1 transition-colors hover:bg-slate-50/30",
                  !isCurrentMonth && "bg-slate-50/20",
                  idx % 7 === 6 && "border-r-0"
                )}
              >
                <span className={cn(
                  "text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full self-end",
                  isToday ? "bg-blue-600 text-white shadow-md shadow-blue-200" : (isCurrentMonth ? "text-slate-600" : "text-slate-300")
                )}>
                  {format(day, 'd')}
                </span>
                <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                  {dayTasks.map(task => (
                    <div 
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[9px] font-bold truncate cursor-pointer transition-transform active:scale-95 border-l-2",
                        STATUS_COLORS[task.status].bg,
                        STATUS_COLORS[task.status].text,
                        STATUS_COLORS[task.status].border.replace('border-', 'border-l-')
                      )}
                    >
                      {task.code}: {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
