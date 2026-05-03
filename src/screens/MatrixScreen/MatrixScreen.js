import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { dbApi } from '../../services/dbAPI';
import { styles } from './styles';
import TaskItem from '../../Components/TaskComponent/TaskItem';
import TaskContextMenu from '../../Components/TaskComponent/TaskContextMenu';

export default function MatrixScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedTaskForMenu, setSelectedTaskForMenu] = useState(null);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableLists, setAvailableLists] = useState([]);

  const loadTasks = async () => {
    try {
      const data = await dbApi.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Lỗi tải tasks:', error);
      Alert.alert('Lỗi', 'Không thể tải công việc');
    }
  };

  const loadMetadata = async () => {
    try {
      const [tags, folders] = await Promise.all([dbApi.getTags(), dbApi.getFolders()]);
      setAvailableTags(tags || []);
      const flatLists = [{ id: 'inbox', title: 'Hộp thư đến', icon: 'mail', color: '#2D9CDB' }];
      (folders || []).forEach(f => {
        if (f.isFolder) (f.lists || []).forEach(l => flatLists.push({ ...l, folderTitle: f.title }));
        else flatLists.push(f);
      });
      setAvailableLists(flatLists);
    } catch (error) {
      console.error('Lỗi tải metadata:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
      loadMetadata();
    }, [])
  );

  const handleAddTask = async (priority) => {
    if (!inputText.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung công việc');
      return;
    }
    const newTask = {
      id: `task_${Date.now()}`,
      title: inputText.trim(),
      priority,
      tags: [],
      dueDate: null,
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      isAllDay: false,
      isCompleted: false,
      isTrashed: false,
      isWontDo: false,
      listId: 'matrix', // chỉ hiển thị trong matrix, không xuất hiện ở Task
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await dbApi.createTask(newTask);
      setInputText('');
      await loadTasks();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm công việc');
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      await dbApi.updateTask(taskId, updates);
      await loadTasks();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật công việc');
    }
  };

  // Hàm toggle (hoàn thành/chưa hoàn thành)
  const toggleTaskStatus = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { isCompleted: !task.isCompleted });
    }
  };

  // Xóa mềm (chuyển vào thùng rác)
  const softDeleteTask = async (taskId) => {
    await updateTask(taskId, { isTrashed: true });
  };

  // Xóa vĩnh viễn
  const hardDeleteTask = async (taskId) => {
    Alert.alert(
      'Xóa vĩnh viễn',
      'Công việc sẽ bị xóa khỏi hệ thống, không thể khôi phục.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await dbApi.deleteTask(taskId);
              await loadTasks();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa vĩnh viễn');
            }
          },
        },
      ]
    );
  };

  // Lọc task theo priority, chưa bị xóa, và sắp xếp completed xuống cuối
  const getTasksByPriority = (priority) => {
    const filtered = tasks.filter(t => t.priority === priority && !t.isTrashed);
    return filtered.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  };

  const MatrixBox = ({ title, subtitle, color, priority }) => {
    const boxTasks = getTasksByPriority(priority);
    return (
      <View style={[styles.box, { borderLeftColor: color }]}>
        <View style={styles.boxHeader}>
          <View>
            <Text style={[styles.boxTitle, { color }]}>{title}</Text>
            <Text style={[styles.boxSubtitle, { color }]}>{subtitle}</Text>
          </View>
          <TouchableOpacity onPress={() => handleAddTask(priority)}>
            <Ionicons name="add-circle" size={32} color={color} />
          </TouchableOpacity>
        </View>
        {boxTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTaskStatus}
            onPressItem={() => {}} // không làm gì khi nhấn vào task
            onLongPress={() => {
              setSelectedTaskForMenu(task);
              setMenuVisible(true);
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eisenhower Matrix</Text>
        <TouchableOpacity onPress={() => navigation.getParent()?.openDrawer()}>
          <Ionicons name="menu-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="pencil-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Nhập công việc mới..."
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor="#888"
        />
      </View>
      <ScrollView style={styles.scroll}>
        <MatrixBox title="Do First" subtitle="Gấp & Quan trọng" color="#FF4B4B" priority={5} />
        <MatrixBox title="Schedule" subtitle="Quan trọng, Không gấp" color="#F2C94C" priority={3} />
        <MatrixBox title="Delegate" subtitle="Gấp, Không quan trọng" color="#2D9CDB" priority={1} />
        <MatrixBox title="Eliminate" subtitle="Không gấp, Không quan trọng" color="#9E9E9E" priority={0} />
      </ScrollView>
      <TaskContextMenu
        visible={isMenuVisible}
        task={selectedTaskForMenu}
        availableTags={availableTags}
        availableLists={availableLists}
        onClose={() => setMenuVisible(false)}
        onUpdate={updateTask}
        onSoftDelete={softDeleteTask}
        onHardDelete={hardDeleteTask}
        onAddSubtask={() => {}} // không cần subtask trong matrix
      />
    </SafeAreaView>
  );
}