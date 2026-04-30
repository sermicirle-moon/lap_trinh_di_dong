import { useState, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export const useTaskManagement = (listId) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 HÀM 1: ĐỆ QUY DỰNG CÂY THEO BỐI CẢNH (CONTEXT)
  const buildTree = (contextTasks, parentId) => {
    return contextTasks
      .filter(t => t.parentId === parentId)
      .map(t => ({
        ...t,
        subtasks: buildTree(contextTasks, t.id)
      }));
  };

  const fetchTasks = useCallback(async () => {
    if (!listId) return;
    setIsLoading(true);
    try {
      const isSmartFilter = ['all', 'inbox', 'today', 'next7', 'done', 'wont_do', 'trash'].includes(listId);
      const data = isSmartFilter ? await taskService.getAllTasks() : await taskService.getTasksByList(listId);
      const allData = data || [];

      let contextTasks = [];

      // 🚀 BƯỚC 1: LỌC DỮ LIỆU ĐÚNG VỚI MÀN HÌNH ĐANG XEM
      if (listId === 'trash') {
        contextTasks = allData.filter(t => t.isTrashed);
      } else if (listId === 'done') {
        contextTasks = allData.filter(t => t.isCompleted && !t.isTrashed);
      } else if (listId === 'wont_do') {
        contextTasks = allData.filter(t => t.isWontDo && !t.isTrashed);
      } else {
        // Các List đang Active (Hộp thư đến, Hôm nay, Tất cả...)
        let activeData = allData.filter(t => !t.isTrashed && !t.isCompleted && !t.isWontDo);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const next7 = new Date(today); next7.setDate(next7.getDate() + 7);

        switch (listId) {
          case 'all': contextTasks = activeData; break;
          case 'inbox': contextTasks = activeData.filter(t => t.listId === 'inbox'); break;
          case 'today':
            contextTasks = activeData.filter(t => {
              if (!t.dueDate) return false;
              const d = new Date(t.dueDate); d.setHours(0,0,0,0);
              return d <= today;
            });
            break;
          case 'next7':
            contextTasks = activeData.filter(t => {
              if (!t.dueDate) return false;
              const d = new Date(t.dueDate); d.setHours(0,0,0,0);
              return d >= today && d <= next7;
            });
            break;
          default: contextTasks = activeData; break;
        }
      }

      // 🚀 BƯỚC 2: XÁC ĐỊNH "CỤ TỔ" TRONG BỐI CẢNH NÀY
      // Một Task sẽ được làm Cụ Tổ hiển thị ở top-level nếu: Nó không có Cha, HOẶC Cha của nó đã bị văng khỏi list hiện tại (Ví dụ Cha active nhưng Con bị xóa)
      let topLevel = contextTasks.filter(t => !t.parentId || !contextTasks.some(p => p.id === t.parentId));

      // 🚀 BƯỚC 3: XẾP CON CHÁU VÀO ĐÚNG CỤ TỔ
      topLevel = topLevel.map(parent => ({
        ...parent,
        subtasks: buildTree(contextTasks, parent.id)
      }));

      setTasks(topLevel.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) { console.error("Lỗi:", error); } finally { setIsLoading(false); }
  }, [listId]);

  useFocusEffect(useCallback(() => { fetchTasks(); }, [fetchTasks]));

  const getGroupedTasks = () => {
    const groups = {
      overdue: { key: 'overdue', title: 'Quá hạn', data: [], color: '#EB5757' },
      today: { key: 'today', title: 'Hôm nay', data: [], color: '#2D9CDB' },
      tomorrow: { key: 'tomorrow', title: 'Ngày mai', data: [], color: '#F2994A' },
      upcoming: { key: 'upcoming', title: 'Sắp tới', data: [], color: '#27AE60' },
      noDate: { key: 'noDate', title: 'Không có ngày', data: [], color: '#828282' },
      completed: { key: 'completed', title: 'Đã hoàn thành', data: [], color: '#9B51E0' },
      wont_do: { key: 'wont_do', title: 'Không làm', data: [], color: '#828282' },
      trash: { key: 'trash', title: 'Thùng rác', data: [], color: '#EB5757' }
    };

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    tasks.forEach(task => {
      // Vì tasks truyền vào đây đã được filter từ fetchTasks, nên chỉ cần ném thẳng vào nhóm tương ứng của List đó
      if (listId === 'trash') { groups.trash.data.push(task); return; }
      if (listId === 'wont_do') { groups.wont_do.data.push(task); return; }
      if (listId === 'done') { groups.completed.data.push(task); return; }

      if (!task.dueDate) groups.noDate.data.push(task);
      else {
        const d = new Date(task.dueDate); d.setHours(0,0,0,0);
        if (d < today) groups.overdue.data.push(task);
        else if (d.getTime() === today.getTime()) groups.today.data.push(task);
        else if (d.getTime() === tomorrow.getTime()) groups.tomorrow.data.push(task);
        else groups.upcoming.data.push(task);
      }
    });

    return Object.values(groups).filter(g => g.data.length > 0);
  };

  const createTask = async (taskData) => {
    const newTask = {
      ...taskData,
      id: "task_" + Date.now().toString(),
      listId: taskData.parentId ? taskData.listId : (['all', 'today', 'next7'].includes(listId) ? 'inbox' : listId),
      dueDate: taskData.dueDate || taskData.startDate || null,
      isCompleted: false, isTrashed: false, isWontDo: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    try { await taskService.createTask(newTask); fetchTasks(); } catch (e) { fetchTasks(); }
  };

  //  HÀM 2: TÌM RA TOÀN BỘ GIA PHẢ BÊN DƯỚI ĐỂ XÓA/HOÀN THÀNH DÂY CHUYỀN
  const getAllDescendants = (parentId, allTasksList) => {
    let descendants = [];
    const children = allTasksList.filter(t => t.parentId === parentId);
    for (let child of children) {
      descendants.push(child);
      descendants = descendants.concat(getAllDescendants(child.id, allTasksList));
    }
    return descendants;
  };

  const cascadeUpdate = async (taskId, updates) => {
    try {
      const allData = await taskService.getAllTasks();
      const targetTask = allData.find(t => t.id === taskId);
      if (!targetTask) return;

      const newDueDate = updates.dueDate !== undefined ? updates.dueDate : (updates.startDate !== undefined ? updates.startDate : targetTask.dueDate);
      const updatedTask = { ...targetTask, ...updates, dueDate: newDueDate, updatedAt: new Date().toISOString() };
      
      await taskService.updateTask(taskId, updatedTask);

      // 🚀 ÁP DỤNG DÂY CHUYỀN XUỐNG ĐỜI CON CHÁU CHẮT
      const isStatusChange = updates.isCompleted !== undefined || updates.isTrashed !== undefined || updates.isWontDo !== undefined;
      if (isStatusChange) {
        const allDescendants = getAllDescendants(taskId, allData);
        // Dùng Promise.all để hệ thống xử lý nhanh và không bị nghẽn
        await Promise.all(allDescendants.map(child => 
          taskService.updateTask(child.id, { ...child, ...updates, updatedAt: new Date().toISOString() })
        ));
      }
      fetchTasks();
    } catch (e) { fetchTasks(); }
  };

  const updateTask = (taskId, updates) => cascadeUpdate(taskId, updates);

  const toggleTaskStatus = async (taskId) => {
    const allData = await taskService.getAllTasks();
    const task = allData.find(t => t.id === taskId);
    if (task && !task.isTrashed && !task.isWontDo) {
      cascadeUpdate(taskId, { isCompleted: !task.isCompleted });
    }
  };

  const softDeleteTask = (taskId) => cascadeUpdate(taskId, { isTrashed: true, isCompleted: false, isWontDo: false });
  
  // 🚀 HÀM 3: XÓA VĨNH VIỄN LÀ PHẢI XÓA SẠCH GIA PHẢ TRONG DATABASE
  const hardDeleteTask = async (taskId) => { 
    try { 
      const allData = await taskService.getAllTasks();
      const descendants = getAllDescendants(taskId, allData);
      
      await taskService.deleteTask(taskId); // Xóa cha
      // Xóa tất cả các đời con cháu
      await Promise.all(descendants.map(child => taskService.deleteTask(child.id)));
      
      fetchTasks(); 
    } catch (e) { Alert.alert("Lỗi", "Không thể xóa vĩnh viễn!"); } 
  };
  
  const emptyTrash = async () => {
    setIsLoading(true);
    try {
      const allData = await taskService.getAllTasks();
      const trashTasks = allData.filter(t => t.isTrashed);
      await Promise.all(trashTasks.map(t => taskService.deleteTask(t.id)));
      fetchTasks();
    } catch (error) { Alert.alert("Lỗi", "Không thể dọn rác"); }
    finally { setIsLoading(false); }
  };

  return { tasks, groupedTasks: getGroupedTasks(), isLoading, fetchTasks, createTask, updateTask, toggleTaskStatus, softDeleteTask, hardDeleteTask, emptyTrash };
};