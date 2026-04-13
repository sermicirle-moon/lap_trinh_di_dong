import { apiClient } from './apiClient';

export const dbApi = {
  // ===== FOLDERS & LISTS =====
  // GET
  getFolders: () => apiClient('/folders'),
  getFolderById: (folderId) => apiClient(`/folders/${folderId}`),
  
  // POST - Tạo Folder hoặc List độc lập (dùng chung endpoint)
  createFolder: (newFolder) => apiClient('/folders', 'POST', newFolder),
  
  // PUT - Cập nhật Folder, List, hoặc thêm/xóa list con trong folder
  updateFolder: (folderId, updatedData) => apiClient(`/folders/${folderId}`, 'PUT', updatedData),
  
  // DELETE - Xóa Folder hoặc List độc lập
  deleteFolder: (folderId) => apiClient(`/folders/${folderId}`, 'DELETE'),

  // ===== SMART LISTS =====
  getSmartLists: () => apiClient('/smartLists'),
  updateSmartList: (listId, updatedData) => apiClient(`/smartLists/${listId}`, 'PUT', updatedData),

  // ===== TAGS =====
  // GET
  getTags: () => apiClient('/tags'),
  getTagById: (tagId) => apiClient(`/tags/${tagId}`),
  
  // POST
  createTag: (newTag) => apiClient('/tags', 'POST', newTag),
  
  // PUT
  updateTag: (tagId, updatedData) => apiClient(`/tags/${tagId}`, 'PUT', updatedData),
  
  // DELETE
  deleteTag: (tagId) => apiClient(`/tags/${tagId}`, 'DELETE'),

  // ===== TASKS =====
  getTasks: () => apiClient('/tasks'),
  createTask: (newTask) => apiClient('/tasks', 'POST', newTask),
  updateTask: (taskId, updatedData) => apiClient(`/tasks/${taskId}`, 'PUT', updatedData),
  deleteTask: (taskId) => apiClient(`/tasks/${taskId}`, 'DELETE'),
};