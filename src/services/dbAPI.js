import { authFetch, getUserId } from './apiClient';

export const dbApi = {
  // Folders
  getFolders: async () => {
    const res = await authFetch('/folders');
    const data = await res.json();
    return Array.isArray(data) ? data : [];

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
  },

  // ==================== FOCUS SESSIONS ====================
  getFocusSessions: async () => {
    const res = await authFetch('/focusSessions');
    return res.json();
  },
  createFocusSession: async (data) => {
    const userId = await getUserId();
    const res = await authFetch('/focusSessions', {
      method: 'POST',
      body: JSON.stringify({ ...data, userId })
    });
    return res.json();
  },
  updateFocusSession: async (id, updates) => {
    const res = await authFetch(`/focusSessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  // ==================== HABITS ====================
  getHabits: async () => {
    const res = await authFetch('/habits');
    return res.json();
  },
  createHabit: async (data) => {
    const userId = await getUserId();
    const res = await authFetch('/habits', {
      method: 'POST',
      body: JSON.stringify({ ...data, userId })
    });
    return res.json();
  },
  updateHabit: async (id, updates) => {
    const res = await authFetch(`/habits/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    return res.json();
  },
  deleteHabit: async (id) => {
    return authFetch(`/habits/${id}`, { method: 'DELETE' });
  },

  // ==================== HABIT COMPLETIONS ====================
  getHabitCompletions: async () => {
    const res = await authFetch('/habitCompletions');
    return res.json();
  },
  addHabitCompletion: async (data) => {
    const userId = await getUserId();
    const res = await authFetch('/habitCompletions', {
      method: 'POST',
      body: JSON.stringify({ ...data, userId })
    });
    return res.json();
  },
  deleteHabitCompletion: async (id) => {
    return authFetch(`/habitCompletions/${id}`, { method: 'DELETE' });
  },

  // ==================== MATRIX TASKS ====================
  getMatrixTasks: async () => {
    const res = await authFetch('/matrixTasks');
    return res.json();
  },
  createMatrixTask: async (data) => {
    const userId = await getUserId();
    const res = await authFetch('/matrixTasks', {
      method: 'POST',
      body: JSON.stringify({ ...data, userId })
    });
    return res.json();
  },
  updateMatrixTask: async (id, updates) => {
    const res = await authFetch(`/matrixTasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    return res.json();
  },
  deleteMatrixTask: async (id) => {
    return authFetch(`/matrixTasks/${id}`, { method: 'DELETE' });
  },
  // Profile
  getUsers: async () => {
    const res = await authFetch('/users');
    return res.json();
  },
  getUserById: async (userId) => {
    const res = await authFetch(`/users/${userId}`);
    return res.json();
  },
  updateUserProfile: async (userId, data) => {
    const res = await authFetch(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      throw new Error(`Server báo lỗi ${res.status}`);
    }
    return res.json();
  },
};