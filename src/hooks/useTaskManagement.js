import { useState, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export const useTaskManagement = (listId) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. TẢI DỮ LIỆU & LỌC THÔNG MINH
  const fetchTasks = useCallback(async () => {
    if (!listId) return;
    setIsLoading(true);
    try {
      const isSmartFilter = ['all', 'inbox', 'today', 'next7', 'done', 'wont_do', 'trash'].includes(listId);
      // Smart filter thì kéo toàn bộ DB về để lọc, List thường thì gọi API lấy theo listId
      const data = isSmartFilter ? await taskService.getAllTasks() : await taskService.getTasksByList(listId);

      const today = new Date(); today.setHours(0, 0, 0, 0);
      const next7 = new Date(today); next7.setDate(next7.getDate() + 7);

      let filteredData = (data || []).filter(t => !t.isTrashed); // Bỏ qua thùng rác mặc định

      switch (listId) {
        case 'all':
          filteredData = filteredData.filter(t => !t.isWontDo && !t.isCompleted); break;
        case 'inbox':
          filteredData = filteredData.filter(t => t.listId === 'inbox' && !t.isWontDo && !t.isCompleted); break;
        case 'today':
          filteredData = filteredData.filter(t => {
            if (!t.dueDate || t.isCompleted || t.isWontDo) return false;
            const d = new Date(t.dueDate); d.setHours(0,0,0,0);
            return d <= today; // Gộp cả việc hôm nay & quá hạn
          });
          break;
        case 'next7':
          filteredData = filteredData.filter(t => {
            if (!t.dueDate || t.isCompleted || t.isWontDo) return false;
            const d = new Date(t.dueDate); d.setHours(0,0,0,0);
            return d >= today && d <= next7;
          });
          break;
        case 'done': filteredData = (data || []).filter(t => t.isCompleted && !t.isTrashed); break;
        case 'wont_do': filteredData = (data || []).filter(t => t.isWontDo && !t.isTrashed); break;
        case 'trash': filteredData = (data || []).filter(t => t.isTrashed); break;
        default:
          filteredData = filteredData.filter(t => !t.isWontDo && !t.isCompleted); break;
      }

      setTasks(filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Lỗi lấy tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [listId]);

  useFocusEffect(useCallback(() => { fetchTasks(); }, [fetchTasks]));

  // 2. NHÓM THEO THỜI GIAN
  const getGroupedTasks = () => {
    const groups = {
      overdue: { key: 'overdue', title: 'Quá hạn', data: [], color: '#EB5757' },
      today: { key: 'today', title: 'Hôm nay', data: [], color: '#2D9CDB' },
      tomorrow: { key: 'tomorrow', title: 'Ngày mai', data: [], color: '#F2994A' },
      upcoming: { key: 'upcoming', title: 'Sắp tới', data: [], color: '#27AE60' },
      noDate: { key: 'noDate', title: 'Không có ngày', data: [], color: '#828282' },
      completed: { key: 'completed', title: 'Đã hoàn thành', data: [], color: '#9B51E0' }
    };

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    tasks.forEach(task => {
      if (task.isCompleted || ['done', 'wont_do', 'trash'].includes(listId)) {
        groups.completed.data.push(task);
        return;
      }

      if (!task.dueDate) {
        groups.noDate.data.push(task);
      } else {
        const d = new Date(task.dueDate); d.setHours(0,0,0,0);
        if (d < today) groups.overdue.data.push(task);
        else if (d.getTime() === today.getTime()) groups.today.data.push(task);
        else if (d.getTime() === tomorrow.getTime()) groups.tomorrow.data.push(task);
        else groups.upcoming.data.push(task);
      }
    });

    return Object.values(groups).filter(g => g.data.length > 0);
  };

  // 3. TẠO MỚI CÔNG VIỆC
  const createTask = async (taskData) => {
    const newTask = {
      ...taskData,
      id: "task_" + Date.now().toString(),
      listId: ['all', 'today', 'next7'].includes(listId) ? 'inbox' : listId,
      dueDate: taskData.dueDate || taskData.startDate || null, // Đồng bộ ngày
      isCompleted: false, isTrashed: false, isWontDo: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTasks(prev => [newTask, ...prev]);
    try {
      await taskService.createTask(newTask);
      fetchTasks();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu công việc!");
      fetchTasks();
    }
  };

  // 4. CẬP NHẬT CÔNG VIỆC (FIX LỖI NẰM Ở ĐÂY)
  const updateTask = async (taskId, updates) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    // Đảm bảo lấy đúng trường dueDate thay vì startDate bị lạc
    const newDueDate = updates.dueDate !== undefined ? updates.dueDate : (updates.startDate !== undefined ? updates.startDate : taskToUpdate.dueDate);

    // Spread operator (...taskToUpdate) sẽ giữ lại userId, listId, không làm task biến mất
    const updatedTask = { 
      ...taskToUpdate, 
      ...updates, 
      dueDate: newDueDate,
      updatedAt: new Date().toISOString() 
    };

    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

    try {
      await taskService.updateTask(taskId, updatedTask);
      fetchTasks(); // 🚀 BẮT BUỘC gọi hàm này để task tự động nhảy sang nhóm khác hoặc list khác!
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật công việc!");
      fetchTasks(); 
    }
  };

  const toggleTaskStatus = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) updateTask(taskId, { isCompleted: !task.isCompleted });
  };

  const deleteTask = async (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa công việc!");
      fetchTasks();
    }
  };

  const softDeleteTask = (taskId) => updateTask(taskId, { isTrashed: true });

  return {
    tasks,
    groupedTasks: getGroupedTasks(), // Trả về nhóm để hiển thị SectionList
    isLoading,
    fetchTasks,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    softDeleteTask
  };
};