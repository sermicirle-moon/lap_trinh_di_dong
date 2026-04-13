/**
 * useListManagement HOOK
 * Quản lý toàn bộ state của list, folder, tags (single source of truth)
 * Được sử dụng bởi CustomDrawer và các component khác
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { dbApi } from '../services/dbAPI';
import { listService } from '../services/ListService';

export const useListManagement = () => {
  // ===== STATE =====
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [smartLists, setSmartLists] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState({});

  // ===== LIFECYCLE =====
  useEffect(() => {
    fetchAllData();
  }, []);

  // ===== FETCH DATA =====
  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [foldersData, tagsData, smartListsData] = await Promise.all([
        dbApi.getFolders(),
        dbApi.getTags(),
        dbApi.getSmartLists(),
      ]);

      setFolders(foldersData || []);
      setTags(tagsData || []);
      setSmartLists(smartListsData || {});

      // Mở tất cả folders khi lần đầu load
      const initialExpanded = {};
      (foldersData || []).forEach(f => {
        if (f.isFolder) initialExpanded[f.id] = true;
      });
      setExpandedFolders(initialExpanded);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== FOLDER OPERATIONS =====

  const createFolder = useCallback(async (name, icon = 'folder-outline', color = '#828282') => {
    try {
      setIsLoading(true);
      const newFolder = await listService.createFolder(name, icon, color);
      setFolders(prev => [...prev, newFolder]);
      setExpandedFolders(prev => ({ ...prev, [newFolder.id]: true }));
      return newFolder;
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo folder.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFolder = useCallback(async (folderId, updates) => {
    try {
      setIsLoading(true);
      const updatedFolder = await listService.updateFolder(folderId, updates);
      setFolders(prev => prev.map(f => f.id === folderId ? updatedFolder : f));
      return updatedFolder;
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật folder.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteFolder = useCallback(async (folderId) => {
    try {
      setIsLoading(true);
      await listService.deleteFolder(folderId);
      setFolders(prev => prev.filter(f => f.id !== folderId));
      setExpandedFolders(prev => {
        const newState = { ...prev };
        delete newState[folderId];
        return newState;
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa folder.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== LIST OPERATIONS =====

  const createList = useCallback(async (name, color = '#2D9CDB', icon = 'list-outline') => {
    try {
      setIsLoading(true);
      const newList = await listService.createList(name, color, icon);
      setFolders(prev => [...prev, newList]);
      return newList;
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo danh sách.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createListInFolder = useCallback(async (folderId, name, color = '#2D9CDB') => {
    try {
      setIsLoading(true);
      const updatedFolder = await listService.createListInFolder(folderId, folders, name, color);
      setFolders(prev => prev.map(f => f.id === folderId ? updatedFolder : f));
      setExpandedFolders(prev => ({ ...prev, [folderId]: true }));
      return updatedFolder;
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo danh sách trong folder.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [folders]);

  const updateList = useCallback(async (listId, updates) => {
    try {
      setIsLoading(true);
      await listService.updateList(listId, folders, updates);
      // Refetch data để đảm bảo sync
      await fetchAllData();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật danh sách.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [folders, fetchAllData]);

  const deleteList = useCallback(async (listId) => {
    try {
      setIsLoading(true);
      await listService.deleteList(listId, folders);
      await fetchAllData();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa danh sách.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [folders, fetchAllData]);

  // ===== TAG OPERATIONS =====

  const createTag = useCallback(async (name, color = '#828282') => {
    try {
      setIsLoading(true);
      const newTag = await listService.createTag(name, color);
      setTags(prev => [...prev, newTag]);
      return newTag;
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo thẻ.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTag = useCallback(async (tagId, updates) => {
    try {
      setIsLoading(true);
      const updatedTag = await listService.updateTag(tagId, updates);
      setTags(prev => prev.map(t => t.id === tagId ? updatedTag : t));
      return updatedTag;
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật thẻ.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTag = useCallback(async (tagId) => {
    try {
      setIsLoading(true);
      await listService.deleteTag(tagId);
      setTags(prev => prev.filter(t => t.id !== tagId));
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa thẻ.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== UTILITY =====

  const toggleFolder = useCallback((folderId) => {
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  }, []);

  const findList = useCallback((listId) => {
    return listService.findListById(listId, folders);
  }, [folders]);

  const getAllTasks = useCallback(() => {
    return listService.getAllTasks(folders);
  }, [folders]);

  return {
    // State
    folders,
    tags,
    smartLists,
    isLoading,
    expandedFolders,

    // Folder operations
    createFolder,
    updateFolder,
    deleteFolder,

    // List operations
    createList,
    createListInFolder,
    updateList,
    deleteList,

    // Tag operations
    createTag,
    updateTag,
    deleteTag,

    // Utilities
    toggleFolder,
    findList,
    getAllTasks,
    fetchAllData,
  };
};
