import { authFetch, getUserId } from './apiClient';

export const dbApi = {
  // Folders
  getFolders: async () => {
    const res = await authFetch('/folders');
    return res.json();
  },
  createFolder: async (data) => {
    const userId = await getUserId();
    const res = await authFetch('/folders', {
      method: 'POST',
      body: JSON.stringify({ ...data, userId }),
    });
    return res.json();
  },
  updateFolder: async (id, updates) => {
    const res = await authFetch(`/folders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return res.json();
  },
  deleteFolder: async (id) => {
    return authFetch(`/folders/${id}`, { method: 'DELETE' });
  },

  // Tags
  getTags: async () => {
    const res = await authFetch('/tags');
    return res.json();
  },
  createTag: async (data) => {
    const userId = await getUserId();
    const res = await authFetch('/tags', {
      method: 'POST',
      body: JSON.stringify({ ...data, userId }),
    });
    return res.json();
  },
  updateTag: async (id, updates) => {
    const res = await authFetch(`/tags/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return res.json();
  },
  deleteTag: async (id) => {
    return authFetch(`/tags/${id}`, { method: 'DELETE' });
  },

  // SmartLists (không cần userId vì là computed, nhưng vẫn gửi token)
  getSmartLists: async () => {
    const res = await authFetch('/smartLists');
    return res.json();
  },

  // Tasks (nếu có)
  getTasks: async () => {
    const res = await authFetch('/tasks');
    return res.json();
  },
  createTask: async (data) => {
    const userId = await getUserId();
    const res = await authFetch('/tasks', {
      method: 'POST',
      body: JSON.stringify({ ...data, userId }),
    });
    return res.json();
  },
  updateTask: async (id, updates) => {
    const res = await authFetch(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return res.json();
  },
  deleteTask: async (id) => {
    return authFetch(`/tasks/${id}`, { method: 'DELETE' });
  }
};