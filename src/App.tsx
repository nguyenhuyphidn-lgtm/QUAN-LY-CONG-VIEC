import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TaskTable } from './components/TaskTable';
import { Kanban } from './components/Kanban';
import { TaskForm } from './components/TaskForm';
import { Task } from './types';
import { StorageService } from './storage';
import * as XLSX from 'xlsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTodo, Trello, Calendar as CalendarIcon, BarChart3 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(StorageService.getTasks());
  }, []);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      const updatedTasks = StorageService.deleteTask(id);
      setTasks(updatedTasks);
    }
  };

  const handleFormSubmit = (task: Task) => {
    let updatedTasks: Task[];
    if (editingTask) {
      updatedTasks = StorageService.updateTask(task);
    } else {
      updatedTasks = StorageService.addTask(task);
    }
    setTasks(updatedTasks);
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tasks.map(t => ({
      'Mã CV': t.code,
      'Tên công việc': t.title,
      'Mô tả': t.description,
      'Nhóm công việc': t.category,
      'Người giao': t.assigner,
      'Người thực hiện': t.primaryExecutor,
      'Người phối hợp': t.coExecutor,
      'Bắt đầu': t.startDate,
      'Kết thúc dự kiến': t.expectedEndDate,
      'Hoàn thành thực tế': t.actualEndDate || '',
      'Ưu tiên': t.priority,
      'Tình trạng': t.status,
      'Tiến độ %': t.progress,
      'Ghi chú': t.notes
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách công việc');
    XLSX.writeFile(wb, `Workflow_Tasks_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-[1600px] mx-auto">
        {activeTab === 'dashboard' && (
          <Dashboard tasks={tasks} />
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit mb-4">
              <button 
                onClick={() => setActiveTab('tasks')}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold transition-all"
              >
                <ListTodo className="w-4 h-4" />
                Dạng bảng
              </button>
              <button 
                onClick={() => setActiveTab('kanban')}
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-slate-500 hover:text-slate-900 text-xs font-bold transition-all"
              >
                <Trello className="w-4 h-4" />
                Kanban
              </button>
            </div>
            <TaskTable 
              tasks={tasks} 
              onAddTask={handleAddTask} 
              onEditTask={handleEditTask} 
              onDeleteTask={handleDeleteTask}
              onExportExcel={handleExportExcel}
            />
          </div>
        )}

        {activeTab === 'kanban' && (
          <div className="space-y-6">
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit mb-4">
              <button 
                onClick={() => setActiveTab('tasks')}
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-slate-500 hover:text-slate-900 text-xs font-bold transition-all"
              >
                <ListTodo className="w-4 h-4" />
                Dạng bảng
              </button>
              <button 
                onClick={() => setActiveTab('kanban')}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold transition-all"
              >
                <Trello className="w-4 h-4" />
                Kanban
              </button>
            </div>
            <Kanban tasks={tasks} onTaskClick={handleEditTask} />
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="h-[600px] flex items-center justify-center bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <CalendarIcon className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Tính năng Lịch đang phát triển</h3>
                <p className="text-sm text-slate-500">Chúng tôi đang hoàn thiện giao diện lịch trực quan hơn cho bạn.</p>
              </div>
            </div>
          </div>
        )}

         {activeTab === 'reports' && (
          <div className="h-[600px] flex items-center justify-center bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Báo cáo chi tiết</h3>
                <p className="text-sm text-slate-500">Tính năng phân tích hiệu suất theo tuần/tháng sắp ra mắt.</p>
              </div>
            </div>
          </div>
        )}

        <TaskForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={handleFormSubmit}
          existingTask={editingTask}
        />
      </div>
    </Layout>
  );
}



