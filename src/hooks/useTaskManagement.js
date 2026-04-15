import { useState, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // 👈 IMPORT QUAN TRỌNG

export const useTaskManagement = (listId) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. TẢI DỮ LIỆU
  const fetchTasks = useCallback(async () => {
    if (!listId) return;
    setIsLoading(true);
    try {
      const data = await taskService.getTasksByList(listId);
      // Sắp xếp: Mới nhất lên đầu
      const sortedData = (data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTasks(sortedData);
    } catch (error) {
      console.error("Lỗi lấy tasks:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách công việc.");
    } finally {
      setIsLoading(false);
    }
  }, [listId]);

  // 👈 TỰ ĐỘNG RELOAD KHI MỞ MÀN HÌNH NÀY
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  // 2. TẠO MỚI (Optimistic UI)
  const createTask = async (taskData) => {
    const newTask = {
      id: "task_" + Date.now().toString(),
      listId: listId,
      title: taskData.title,
      isCompleted: false,
      priority: taskData.priority || 0,
      tags: taskData.tags || [],
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update UI ngay lập tức
    setTasks(prev => [newTask, ...prev]);

    try {
      await taskService.createTask(newTask);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu công việc!");
      fetchTasks(); // Rollback nếu lỗi
    }
  };

  // 3. CẬP NHẬT (Toggle Hoàn thành, Đổi tên, Đổi cờ...)
  const updateTask = async (taskId, updates) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = { 
      ...taskToUpdate, 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };

    // Update UI
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

    try {
      await taskService.updateTask(taskId, updatedTask);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật công việc!");
      fetchTasks(); // Rollback
    }
  };

  // Hàm tiện ích: Tick/Untick nhanh
  const toggleTaskStatus = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) updateTask(taskId, { isCompleted: !task.isCompleted });
  };

  // 4. XÓA TASK
  const deleteTask = async (taskId) => {
    // Update UI
    setTasks(prev => prev.filter(t => t.id !== taskId));

    try {
      await taskService.deleteTask(taskId);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa công việc!");
      fetchTasks(); // Rollback
    }
  };

  // PHÂN LOẠI DATA ĐỂ RENDER THÀNH CÁC SECTION (Chưa làm / Đã làm)
  const activeTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  return {
    tasks,
    activeTasks,
    completedTasks,
    isLoading,
    fetchTasks,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask
  };
};