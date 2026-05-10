import { Task } from './types';
import { MOCK_TASKS } from './mock-data';

const STORAGE_KEY = 'workflow_manager_tasks';

export const StorageService = {
  getTasks: (): Task[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_TASKS));
      return MOCK_TASKS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return MOCK_TASKS;
    }
  },

  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  addTask: (task: Task) => {
    const tasks = StorageService.getTasks();
    const newTasks = [task, ...tasks];
    StorageService.saveTasks(newTasks);
    return newTasks;
  },

  updateTask: (task: Task) => {
    const tasks = StorageService.getTasks();
    const newTasks = tasks.map(t => t.id === task.id ? task : t);
    StorageService.saveTasks(newTasks);
    return newTasks;
  },

  deleteTask: (id: string) => {
    const tasks = StorageService.getTasks();
    const newTasks = tasks.filter(t => t.id !== id);
    StorageService.saveTasks(newTasks);
    return newTasks;
  }
};
