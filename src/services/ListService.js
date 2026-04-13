/**
 * LIST MANAGEMENT SERVICE
 * Xử lý tất cả logic liên quan tới list, folder, tags (CRUD operations)
 * Tách biệt khỏi UI component để dễ kiểm tra và tái sử dụng
 */

import { dbApi } from './dbAPI';

export const listService = {
  // ===== FOLDER OPERATIONS =====

  /**
   * Tạo folder mới
   * @param {string} name - Tên folder
   * @param {string} icon - Biểu tượng folder (e.g., 'folder', 'folder-outline')
   * @param {string} color - Màu sắc (#hex format)
   * @returns {Promise}
   */
  createFolder: async (name, icon = 'folder-outline', color = '#828282') => {
    const newFolder = {
      id: `folder_${Date.now()}`,
      title: name.trim(),
      isFolder: true,
      icon,
      color,
      lists: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: Date.now(), // Dùng để sắp xếp
    };
    return dbApi.createFolder(newFolder);
  },

  /**
   * Cập nhật thông tin folder
   */
  updateFolder: async (folderId, updates) => {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return dbApi.updateFolder(folderId, updatedData);
  },

  /**
   * Xóa folder (cả các list bên trong)
   */
  deleteFolder: async (folderId) => {
    return dbApi.deleteFolder(folderId);
  },

  // ===== LIST OPERATIONS =====

  /**
   * Tạo list mới độc lập (không nằm trong folder)
   */
  createList: async (name, color = '#2D9CDB', icon = 'list-outline') => {
    const newList = {
      id: `list_${Date.now()}`,
      title: name.trim(),
      isFolder: false,
      icon,
      color,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: Date.now(),
    };
    return dbApi.createFolder(newList); // Reuse createFolder endpoint
  },

  /**
   * Tạo list con bên trong folder
   */
  createListInFolder: async (folderId, folders, name, color = '#2D9CDB') => {
    const parentFolder = folders.find(f => f.id === folderId);
    if (!parentFolder) throw new Error('Folder not found');

    const newList = {
      id: `list_${Date.now()}`,
      title: name.trim(),
      icon: 'list-outline',
      color,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedFolder = {
      ...parentFolder,
      lists: [...(parentFolder.lists || []), newList],
      updatedAt: new Date().toISOString(),
    };

    return dbApi.updateFolder(folderId, updatedFolder);
  },

  /**
   * Cập nhật list
   */
  updateList: async (listId, folders, updates) => {
    // Tìm list xem nó nằm ở đâu: top-level hay trong folder
    let parentFolder = null;
    let isTopLevel = false;

    const topLevelList = folders.find(f => f.id === listId && !f.isFolder);
    if (topLevelList) {
      isTopLevel = true;
      return dbApi.updateFolder(listId, { ...topLevelList, ...updates, updatedAt: new Date().toISOString() });
    }

    for (const folder of folders) {
      if (folder.isFolder && folder.lists) {
        const foundList = folder.lists.find(l => l.id === listId);
        if (foundList) {
          parentFolder = folder;
          break;
        }
      }
    }

    if (!parentFolder) throw new Error('List not found');

    const updatedLists = parentFolder.lists.map(l =>
      l.id === listId ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
    );

    return dbApi.updateFolder(parentFolder.id, { ...parentFolder, lists: updatedLists, updatedAt: new Date().toISOString() });
  },

  /**
   * Xóa list
   */
  deleteList: async (listId, folders) => {
    // Xóa top-level list
    const topLevelList = folders.find(f => f.id === listId && !f.isFolder);
    if (topLevelList) {
      return dbApi.deleteFolder(listId);
    }

    // Xóa list từ trong folder
    for (const folder of folders) {
      if (folder.isFolder && folder.lists) {
        const foundList = folder.lists.find(l => l.id === listId);
        if (foundList) {
          const updatedLists = folder.lists.filter(l => l.id !== listId);
          return dbApi.updateFolder(folder.id, { ...folder, lists: updatedLists, updatedAt: new Date().toISOString() });
        }
      }
    }

    throw new Error('List not found');
  },

  // ===== TAG OPERATIONS =====

  /**
   * Tạo tag mới
   */
  createTag: async (name, color = '#828282') => {
    const newTag = {
      id: `tag_${Date.now()}`,
      title: name.trim(),
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return dbApi.createTag(newTag);
  },

  /**
   * Cập nhật tag
   */
  updateTag: async (tagId, updates) => {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return dbApi.updateTag(tagId, updatedData);
  },

  /**
   * Xóa tag
   */
  deleteTag: async (tagId) => {
    return dbApi.deleteTag(tagId);
  },

  // ===== UTILITY FUNCTIONS =====

  /**
   * Sắp xếp folders và lists theo thứ tự
   */
  sortItems: (items) => {
    return items.sort((a, b) => (b.order || 0) - (a.order || 0));
  },

  /**
   * Tìm list theo ID (tìm cả trong folder)
   */
  findListById: (listId, folders) => {
    // Top-level
    const topLevel = folders.find(f => f.id === listId && !f.isFolder);
    if (topLevel) return topLevel;

    // Trong folder
    for (const folder of folders) {
      if (folder.lists) {
        const found = folder.lists.find(l => l.id === listId);
        if (found) return found;
      }
    }
    return null;
  },

  /**
   * Lấy tất cả tasks từ tất cả lists
   */
  getAllTasks: (folders) => {
    let allTasks = [];
    folders.forEach(item => {
      if (item.tasks) allTasks = [...allTasks, ...item.tasks];
      if (item.lists) {
        item.lists.forEach(list => {
          if (list.tasks) allTasks = [...allTasks, ...list.tasks];
        });
      }
    });
    return allTasks;
  },
};
