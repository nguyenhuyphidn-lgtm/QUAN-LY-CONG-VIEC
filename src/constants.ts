import { TaskStatus, Priority } from './types';

export const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string; dot: string; border: string }> = {
  'Chưa thực hiện': { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400', border: 'border-slate-300' },
  'Đang thực hiện': { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500', border: 'border-blue-500' },
  'Chờ phản hồi': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500', border: 'border-amber-400' },
  'Tạm dừng': { bg: 'bg-zinc-100', text: 'text-zinc-600', dot: 'bg-zinc-400', border: 'border-zinc-300' },
  'Hoàn thành': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500', border: 'border-emerald-500' },
  'Trễ hạn': { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500', border: 'border-rose-500' },
};

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string }> = {
  'Cao': { bg: 'bg-rose-500/10', text: 'text-rose-600' },
  'Trung bình': { bg: 'bg-amber-500/10', text: 'text-amber-600' },
  'Thấp': { bg: 'bg-blue-500/10', text: 'text-blue-600' },
};
