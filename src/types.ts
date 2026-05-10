export type TaskStatus = 'Chưa thực hiện' | 'Đang thực hiện' | 'Chờ phản hồi' | 'Tạm dừng' | 'Hoàn thành' | 'Trễ hạn';
export type Priority = 'Cao' | 'Trung bình' | 'Thấp';

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string; // Nhóm công việc / Dự án
  assigner: string; // Người giao việc
  primaryExecutor: string; // Người thực hiện chính
  coExecutor: string; // Người phối hợp
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  priority: Priority;
  status: TaskStatus;
  progress: number;
  notes: string;
  attachments: string[]; // URLs or filenames
}

export type UserRole = 'Admin' | 'Assigner' | 'Executor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}
