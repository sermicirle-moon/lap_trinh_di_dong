import { authFetch } from './apiClient';

export const taskService = {
  getTasksByList: (listId) => authFetch(`/tasks?listId=${listId}`).then(res => res.json()),

  getAllTasks: () => authFetch('/tasks').then(res => res.json()),

  createTask: (newTask) => authFetch('/tasks', { method: 'POST', body: JSON.stringify(newTask) }).then(res => res.json()),

  updateTask: (taskId, updatedData) => authFetch(`/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(updatedData) }).then(res => res.json()),

  deleteTask: (taskId) => authFetch(`/tasks/${taskId}`, { method: 'DELETE' }),
};