import { apiClient } from './apiClient';

export const taskService = {
  getTasksByList: (listId) => {
    return apiClient(`/tasks?listId=${listId}`);
  },

  getAllTasks: () => apiClient('/tasks'),

  createTask: (newTask) => apiClient('/tasks', 'POST', newTask),

  updateTask: (taskId, updatedData) => apiClient(`/tasks/${taskId}`, 'PUT', updatedData),

  deleteTask: (taskId) => apiClient(`/tasks/${taskId}`, 'DELETE'),
};