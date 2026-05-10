import React, { useMemo } from 'react';
import { Task, TaskStatus } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { MoreVertical, MessageSquare, Paperclip, Calendar } from 'lucide-react';

interface KanbanProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

interface KanbanColumnProps {
  key?: React.Key;
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (t: Task) => void;
}

const KanbanColumn = ({ title, status, tasks, onTaskClick }: KanbanColumnProps) => {
  return (
    <div className="flex-1 min-w-[300px] flex flex-col gap-4 bg-slate-100/30 rounded-xl p-3 border border-slate-200/60">
      <div className="flex items-center justify-between mb-1 px-1">
        <div className="flex items-center gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full", STATUS_COLORS[status].dot)}></div>
          <h3 className="font-bold text-[10px] text-slate-500 tracking-wider uppercase">{title}</h3>
          <Badge variant="secondary" className="text-[10px] bg-slate-200/50 text-slate-600 border-none font-bold h-4 min-w-[18px] flex items-center justify-center p-0">
            {tasks.length}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-3 min-h-[500px]">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => onTaskClick(task)}
              className="group cursor-pointer active:scale-95 transition-transform"
            >
              <Card className={cn(
                "border-none shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4",
                STATUS_COLORS[task.status].border.replace('border-', 'border-l-')
              )}>
                <CardContent className="p-3.5 space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge className={cn("text-[8px] font-extrabold px-1.5 h-3.5 border-none uppercase tracking-tighter", PRIORITY_COLORS[task.priority].bg, PRIORITY_COLORS[task.priority].text)}>
                      {task.priority}
                    </Badge>
                    <span className="text-[9px] font-mono font-bold text-slate-400">{task.code}</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[13px] font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-2">{task.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">{task.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[10px] font-bold">{format(parseISO(task.expectedEndDate), 'dd/MM')}</span>
                    </div>
                    <div className="flex -space-x-1.5">
                       <div className="w-5 h-5 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
                        {task.primaryExecutor.substring(0, 1)}
                       </div>
                       {task.coExecutor && (
                         <div className="w-5 h-5 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-600 font-mono">
                          {task.coExecutor.substring(0, 1)}
                         </div>
                       )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const Kanban = ({ tasks, onTaskClick }: KanbanProps) => {
  const columns: { title: string, status: TaskStatus }[] = [
    { title: 'CHƯA THỰC HIỆN', status: 'Chưa thực hiện' },
    { title: 'ĐANG THỰC HIỆN', status: 'Đang thực hiện' },
    { title: 'CHỜ PHẢN HỒI', status: 'Chờ phản hồi' },
    { title: 'HOÀN THÀNH', status: 'Hoàn thành' },
  ];

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 -mx-8 px-8 scrollbar-hide animate-in fade-in duration-700">
      {columns.map(col => (
        <KanbanColumn 
          key={col.status} 
          title={col.title} 
          status={col.status} 
          tasks={tasks.filter(t => t.status === col.status)}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  );
};
