import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, Priority } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ArrowUpDown, Filter, Plus, FileSpreadsheet, Pencil, Trash2 } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskTableProps {
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onExportExcel: () => void;
}

export const TaskTable = ({ tasks, onAddTask, onEditTask, onDeleteTask, onExportExcel }: TaskTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Task>('expectedEndDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             task.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             task.primaryExecutor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return 0;
      });
  }, [tasks, searchTerm, statusFilter, priorityFilter, sortField, sortDirection]);

  const toggleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Danh sách công việc</h2>
          <p className="text-sm text-slate-500">Quản lý và cập nhật tiến độ công việc hằng ngày.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onExportExcel} className="h-10 text-slate-600 border-slate-200">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Button size="sm" onClick={onAddTask} className="h-10 bg-slate-900 text-white hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            Thêm công việc
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Tìm theo mã, tên hoặc người thực hiện..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 border-slate-200 focus-visible:ring-slate-300"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-10 border-slate-200 text-xs font-semibold">
            <SelectValue placeholder="Tất cả tình trạng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tình trạng</SelectItem>
            <SelectItem value="Chưa thực hiện">Chưa thực hiện</SelectItem>
            <SelectItem value="Đang thực hiện">Đang thực hiện</SelectItem>
            <SelectItem value="Chờ phản hồi">Chờ phản hồi</SelectItem>
            <SelectItem value="Tạm dừng">Tạm dừng</SelectItem>
            <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
            <SelectItem value="Trễ hạn">Trễ hạn</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[150px] h-10 border-slate-200 text-xs font-semibold">
            <SelectValue placeholder="Tất cả ưu tiên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả ưu tiên</SelectItem>
            <SelectItem value="Cao">Cao</SelectItem>
            <SelectItem value="Trung bình">Trung bình</SelectItem>
            <SelectItem value="Thấp">Thấp</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPriorityFilter('all'); }} className="text-xs font-medium text-slate-500">
          Xóa lọc
        </Button>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[100px] text-[10px] font-bold uppercase tracking-wider text-slate-500 py-3">Mã</TableHead>
                <TableHead className="min-w-[200px] text-[10px] font-bold uppercase tracking-wider text-slate-500 py-3">Công việc</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 py-3 text-center">Người thực hiện</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 py-3">
                  <button onClick={() => toggleSort('expectedEndDate')} className="flex items-center gap-1 hover:text-slate-900 transition-colors uppercase">
                    Hạn định <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 py-3 text-center">Tình trạng</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 py-3 text-center">Tiến độ</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id} className={cn(
                    "group hover:bg-slate-50/80 transition-colors cursor-default border-l-4",
                    STATUS_COLORS[task.status].border.replace('border-', 'border-l-')
                  )}>
                    <td className="px-4 py-3 text-[11px] font-mono font-bold text-slate-400">{task.code}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-bold text-slate-900 leading-tight">{task.title}</div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">{task.category}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                          {task.primaryExecutor.substring(0, 1)}
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{task.primaryExecutor}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-xs font-bold",
                        task.status === 'Trễ hạn' ? "text-rose-600" : "text-slate-600"
                      )}>
                        {format(parseISO(task.expectedEndDate), 'dd/MM/yyyy')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide",
                        STATUS_COLORS[task.status].bg,
                        STATUS_COLORS[task.status].text
                      )}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
                        <Progress value={task.progress} className="h-1 bg-slate-100" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] p-1">
                          <DropdownMenuItem onClick={() => onEditTask(task)} className="text-[11px] font-bold uppercase tracking-tight">
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-[11px] font-bold uppercase tracking-tight text-rose-600 focus:text-rose-600">
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-400 text-xs italic font-medium">
                    Không tìm thấy công việc nào phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

import { Search } from 'lucide-react';
