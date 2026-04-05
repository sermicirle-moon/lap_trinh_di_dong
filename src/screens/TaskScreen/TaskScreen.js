import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, 
  SectionList, Modal, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Bảng màu Priority chuẩn của TickTick
const PRIORITY_COLORS = {
  0: '#828282', // Không có (Xám)
  1: '#2D9CDB', // Thấp (Xanh)
  3: '#F2994A', // Trung bình (Cam)
  5: '#EB5757', // Cao (Đỏ)
};

export default function TaskScreen({ route, navigation }) {
  // 1. HỨNG DỮ LIỆU TỪ SIDEBAR TRUYỀN SANG
  const listTitle = route.params?.listTitle || "Hôm nay";
  const initialTasks = route.params?.tasks || [];

  // 2. QUẢN LÝ STATE
  const [tasks, setTasks] = useState(initialTasks);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  
  // State cho Form tạo Task mới
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskContent, setNewTaskContent] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState(0);
  const [newTaskTag, setNewTaskTag] = useState(''); // MỚI: State cho Thẻ (Tag)

  // Cập nhật lại danh sách nếu bấm sang List khác ở Sidebar
  useEffect(() => {
    setTasks(route.params?.tasks || []);
  }, [route.params?.tasks]);

  // 3. LOGIC XỬ LÝ DỮ LIỆU
  // Tách Task thành 2 nhóm: Chưa làm & Đã xong (Giống hệt TickTick)
  const activeTasks = tasks.filter(t => t.status !== 2);
  const completedTasks = tasks.filter(t => t.status === 2);

  const sections = [
    { title: '', data: activeTasks },
    ...(completedTasks.length > 0 ? [{ title: 'Đã hoàn thành', data: completedTasks }] : [])
  ];

  // Tick hoàn thành / Bỏ hoàn thành task
  const toggleTaskStatus = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, status: task.status === 2 ? 0 : 2 };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // Lưu Task mới
  const handleSaveTask = () => {
    if (newTaskTitle.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      content: newTaskContent,
      priority: newTaskPriority,
      status: 0,
      dueDate: new Date().toISOString(),
      // Lấy tag người dùng nhập, nếu có thì cho vào mảng, không thì mảng rỗng
      tags: newTaskTag.trim() !== '' ? [newTaskTag.trim()] : [] 
    };

    setTasks([newTask, ...tasks]);

    // Reset form
    setNewTaskTitle('');
    setNewTaskContent('');
    setNewTaskPriority(0);
    setNewTaskTag('');
    setAddModalVisible(false);
  };

  // 4. GIAO DIỆN TỪNG DÒNG (Item & Header)
  const renderTaskItem = ({ item }) => {
    const isCompleted = item.status === 2;
    const priorityColor = PRIORITY_COLORS[item.priority] || PRIORITY_COLORS[0];

    return (
      <TouchableOpacity style={[styles.taskItem, isCompleted && styles.taskItemCompleted]} activeOpacity={0.7}>
        <TouchableOpacity onPress={() => toggleTaskStatus(item.id)} style={styles.checkboxContainer}>
          <Ionicons 
            name={isCompleted ? "checkmark-circle" : "ellipse-outline"} 
            size={26} 
            color={isCompleted ? "#A0A0A0" : priorityColor} 
          />
        </TouchableOpacity>

        <View style={styles.taskDetails}>
          <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}>
            {item.title}
          </Text>
          
          {item.content ? (
             <Text style={[styles.taskContent, isCompleted && styles.taskTitleCompleted]} numberOfLines={1}>
               {item.content}
             </Text>
          ) : null}

          <View style={styles.taskMeta}>
            {item.tags && item.tags.length > 0 && (
              <View style={[styles.tagBadge, isCompleted && { backgroundColor: '#F0F0F0' }]}>
                <Text style={[styles.tagText, isCompleted && { color: '#A0A0A0' }]}>{item.tags[0]}</Text>
              </View>
            )}
            {item.dueDate && (
              <Text style={[styles.dateText, isCompleted && { color: '#C0C0C0' }]}>
                {new Date(item.dueDate).toLocaleDateString('vi-VN')}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
<<<<<<< HEAD
        {/* Nút Hamburger mở Sidebar */}
        <TouchableOpacity
          onPress={() => {
            const parentNav = navigation.getParent ? navigation.getParent() : null;
            if (parentNav && parentNav.openDrawer) parentNav.openDrawer();
          }}
          style={styles.iconBtn}
        >
=======
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconBtn}>
>>>>>>> cd5926a3660153efaef749e618ec245ccd03660c
          <Ionicons name="menu-outline" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{listTitle}</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* DANH SÁCH TASK DÙNG SECTION LIST */}
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="clipboard-outline" size={60} color="#D1D5DB" />
          <Text style={styles.emptyText}>Chưa có công việc nào.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskItem}
          renderSectionHeader={({ section: { title } }) => (
            title ? <Text style={styles.sectionHeader}>{title}</Text> : null
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      {/* NÚT THÊM TASK NỔI */}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={() => setAddModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* MODAL THÊM TASK */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setAddModalVisible(false)} />
          
          <View style={styles.addBottomSheet}>
            <TextInput
              style={styles.inputTitle}
              placeholder="Chuẩn bị làm gì?"
              autoFocus
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            <TextInput
              style={styles.inputContent}
              placeholder="Mô tả công việc..."
              value={newTaskContent}
              onChangeText={setNewTaskContent}
              multiline
            />

            {/* MỚI: Ô nhập Thẻ (Tag) */}
            <View style={styles.tagInputContainer}>
              <Ionicons name="pricetag-outline" size={18} color="#828282" />
              <TextInput
                style={styles.inputTag}
                placeholder="Thêm thẻ (VD: UI/UX)"
                value={newTaskTag}
                onChangeText={setNewTaskTag}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.addActions}>
              <View style={styles.prioritySelector}>
                <TouchableOpacity onPress={() => setNewTaskPriority(0)}><Ionicons name="flag" size={24} color={newTaskPriority === 0 ? PRIORITY_COLORS[0] : '#E0E0E0'} /></TouchableOpacity>
                <TouchableOpacity onPress={() => setNewTaskPriority(1)}><Ionicons name="flag" size={24} color={newTaskPriority === 1 ? PRIORITY_COLORS[1] : '#E0E0E0'} /></TouchableOpacity>
                <TouchableOpacity onPress={() => setNewTaskPriority(3)}><Ionicons name="flag" size={24} color={newTaskPriority === 3 ? PRIORITY_COLORS[3] : '#E0E0E0'} /></TouchableOpacity>
                <TouchableOpacity onPress={() => setNewTaskPriority(5)}><Ionicons name="flag" size={24} color={newTaskPriority === 5 ? PRIORITY_COLORS[5] : '#E0E0E0'} /></TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.saveBtn, !newTaskTitle.trim() && { opacity: 0.5 }]} 
                onPress={handleSaveTask}
                disabled={!newTaskTitle.trim()}
              >
                <Ionicons name="arrow-up" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  iconBtn: { padding: 5 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 10, fontSize: 16, color: '#999' },
  
  // Style cho Section Header (Chữ "Đã hoàn thành")
  sectionHeader: { backgroundColor: '#F9FAFB', paddingHorizontal: 15, paddingVertical: 8, fontSize: 13, fontWeight: 'bold', color: '#6B7280', marginTop: 10 },
  
  // Style cho Task
  taskItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F6F7F9', backgroundColor: '#FFF' },
  taskItemCompleted: { backgroundColor: '#FAFAFA' }, // Làm mờ nền khi đã xong
  checkboxContainer: { marginRight: 15, justifyContent: 'flex-start', paddingTop: 2 },
  taskDetails: { flex: 1 },
  taskTitle: { fontSize: 16, color: '#333', fontWeight: '500' },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: '#A0A0A0' },
  taskContent: { fontSize: 13, color: '#666', marginTop: 3 },
  taskMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  tagBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginRight: 10 },
  tagText: { fontSize: 11, color: '#2D9CDB', fontWeight: 'bold' },
  dateText: { fontSize: 12, color: '#999' },

  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#5C7CFA', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },

  // Form Thêm Task
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  addBottomSheet: { backgroundColor: '#FFF', padding: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  inputTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  inputContent: { fontSize: 15, color: '#666', marginBottom: 15, maxHeight: 100 },
  tagInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, marginBottom: 15 },
  inputTag: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 15 },
  addActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prioritySelector: { flexDirection: 'row', gap: 15 },
  saveBtn: { backgroundColor: '#5C7CFA', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});