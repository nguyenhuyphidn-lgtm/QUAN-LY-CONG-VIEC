import React from 'react';
import { LayoutDashboard, ListTodo, Calendar, BarChart3, Settings, LogOut, Search, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2 transition-all duration-200 group text-sm font-medium rounded-md",
      active 
        ? "bg-blue-600/20 border-l-2 border-blue-500 text-blue-400 rounded-r-md" 
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-blue-400" : "text-slate-400 group-hover:text-white")} />
    {label}
  </button>
);

export const Layout = ({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (t: string) => void }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">W</div>
            <span className="text-white font-bold text-lg tracking-tight">WorkFlow</span>
          </div>

          <nav className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={ListTodo} label="Danh sách công việc" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
            <SidebarItem icon={Calendar} label="Lịch công việc" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
            <SidebarItem icon={BarChart3} label="Báo cáo" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          </nav>
        </div>

        <div className="mt-auto p-4 space-y-1">
          <SidebarItem icon={Settings} label="Cài đặt" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <div className="mt-4 bg-slate-800 rounded-lg p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-400 text-slate-900 flex items-center justify-center font-bold text-xs uppercase">HP</div>
            <div className="overflow-hidden">
              <p className="text-xs text-white font-medium truncate">Nguyễn Huy Phi</p>
              <p className="text-[10px] text-slate-500 truncate">admin@bnc.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-w-0">
        {/* TopNav */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Tìm kiếm công việc..." 
                className="pl-10 h-10 bg-slate-50 border-slate-200 rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-blue-500 shadow-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-900">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
            </Button>
            
            <div className="h-4 w-[1px] bg-slate-200"></div>

            <Button className="bg-blue-900 text-white hover:bg-blue-800 shadow-md h-9 text-sm font-semibold rounded-lg">
              Thêm công việc
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
