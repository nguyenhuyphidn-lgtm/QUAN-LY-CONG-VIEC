import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Priority } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  existingTask?: Task | null;
}

const INITIAL_TASK: Task = {
  id: '',
  code: '',
  title: '',
  description: '',
  category: '',
  assigner: 'Nguyễn Huy Phi',
  primaryExecutor: '',
  coExecutor: '',
  startDate: new Date().toISOString().split('T')[0],
  expectedEndDate: new Date().toISOString().split('T')[0],
  priority: 'Trung bình',
  status: 'Chưa thực hiện',
  progress: 0,
  notes: '',
  attachments: []
};

export const TaskForm = ({ isOpen, onClose, onSubmit, existingTask }: TaskFormProps) => {
  const [formData, setFormData] = useState<Task>(INITIAL_TASK);

  useEffect(() => {
    if (existingTask) {
      setFormData(existingTask);
    } else {
      setFormData({
        ...INITIAL_TASK,
        id: Math.random().toString(36).substr(2, 9),
        code: `TASK-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }
  }, [existingTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {existingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Mã công việc</Label>
              <Input 
                value={formData.code} 
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="bg-slate-50 border-slate-200"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Nhóm / Dự án</Label>
              <Input 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="VD: UI/UX, Backend..."
                className="border-slate-200"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">Tên công việc</Label>
            <Input 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Nhập tên đầu mục công việc"
              className="border-slate-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">Mô tả chi tiết</Label>
            <Input 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Nội dung công việc cần thực hiện..."
              className="border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Người thực hiện</Label>
              <Input 
                value={formData.primaryExecutor} 
                onChange={(e) => setFormData({...formData, primaryExecutor: e.target.value})}
                placeholder="Tên nhân viên chính"
                className="border-slate-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Người phối hợp</Label>
              <Input 
                value={formData.coExecutor} 
                onChange={(e) => setFormData({...formData, coExecutor: e.target.value})}
                placeholder="Tên nhân viên hỗ trợ"
                className="border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Ngày bắt đầu</Label>
              <Input 
                type="date"
                value={formData.startDate} 
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="border-slate-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Ngày kết thúc</Label>
              <Input 
                type="date"
                value={formData.expectedEndDate} 
                onChange={(e) => setFormData({...formData, expectedEndDate: e.target.value})}
                className="border-slate-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Tiến độ (%)</Label>
              <Input 
                type="number"
                min="0"
                max="100"
                value={formData.progress} 
                onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                className="border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Tình trạng</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val: TaskStatus) => setFormData({...formData, status: val})}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Chọn tình trạng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chưa thực hiện">Chưa thực hiện</SelectItem>
                  <SelectItem value="Đang thực hiện">Đang thực hiện</SelectItem>
                  <SelectItem value="Chờ phản hồi">Chờ phản hồi</SelectItem>
                  <SelectItem value="Tạm dừng">Tạm dừng</SelectItem>
                  <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                  <SelectItem value="Trễ hạn">Trễ hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Mức độ ưu tiên</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(val: Priority) => setFormData({...formData, priority: val})}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Chọn ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cao">Cao</SelectItem>
                  <SelectItem value="Trung bình">Trung bình</SelectItem>
                  <SelectItem value="Thấp">Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">Ghi chú</Label>
            <Input 
              value={formData.notes} 
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Ghi chú thêm nếu có..."
              className="border-slate-200"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 bg-slate-50 p-4 -mx-6 mt-6 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onClose} className="text-[11px] font-bold uppercase tracking-wider h-10 px-6 border-slate-300">
              Hủy bỏ
            </Button>
            <Button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white shadow-md text-[11px] font-bold uppercase tracking-wider h-10 px-6">
              {existingTask ? 'Cập nhật công việc' : 'Lưu công việc'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
