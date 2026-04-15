import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, SectionList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// IMPORT 2 COMPONENT VỪA TẠO VÀO ĐÂY
import TaskItem from '../../Components/TaskComponent/TaskItem';
import AddTaskModal from '../../Components/TaskComponent/AddTaskModal';

const PRIORITY_COLORS = { 0: '#828282', 1: '#2D9CDB', 3: '#F2994A', 5: '#EB5757' };

export default function TaskScreen({ route, navigation }) {
  const listTitle = route.params?.listTitle || "Hộp thư đến";
  const [tasks, setTasks] = useState(route.params?.tasks || []);
  
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    setTasks(route.params?.tasks || []);
  }, [route.params?.tasks]);

  const activeTasks = tasks.filter(t => t.status !== 2);
  const completedTasks = tasks.filter(t => t.status === 2);
  const sections = [
    { title: '', data: activeTasks },
    ...(completedTasks.length > 0 ? [{ title: 'Đã hoàn thành', data: completedTasks }] : [])
  ];

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: task.status === 2 ? 0 : 2 } : task));
  };

  // Hàm HỨNG dữ liệu từ AddTaskModal gửi về
  const handleAddNewTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      content: '', 
      priority: taskData.priority,
      status: 0,
      dueDate: null, 
      tags: taskData.tags 
    };
    setTasks([newTask, ...tasks]);
    setAddModalVisible(false); // Thêm xong thì tự động đóng bảng
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Nút Hamburger mở Sidebar */}
        <TouchableOpacity
          onPress={() => {
            const parentNav = navigation.getParent ? navigation.getParent() : null;
            if (parentNav && parentNav.openDrawer) parentNav.openDrawer();
          }}
          style={styles.iconBtn}
        >

        

          <Ionicons name="menu-outline" size={28} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{listTitle}</Text>
        
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* DANH SÁCH TASK */}
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="clipboard-outline" size={60} color="#D1D5DB" />
          <Text style={styles.emptyText}>Chưa có công việc nào.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          // GỌI COMPONENT TASKITEM RA DÙNG CỰC KỲ GỌN NHẸ
          renderItem={({ item }) => (
            <TaskItem 
              task={item} 
              onToggle={toggleTaskStatus} 
              onPressItem={(task) => setSelectedTask(task)} 
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            title ? <Text style={styles.sectionHeader}>{title}</Text> : null
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      {/* NÚT THÊM (+) */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => setAddModalVisible(true)}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* GỌI COMPONENT ADDTASKMODAL VÀ TRUYỀN PROPS CHO NÓ */}
      <AddTaskModal 
        isVisible={isAddModalVisible}
        currentListTitle={listTitle}
        onClose={() => setAddModalVisible(false)}
        onSave={handleAddNewTask}
      />

      {/* MODAL CHI TIẾT TASK (Có thể tách thành Component thứ 3 sau này) */}
      <Modal visible={selectedTask !== null} animationType="fade" transparent>
        <View style={styles.detailModalOverlay}>
          <View style={styles.detailBox}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailHeaderTitle}>Chi tiết công việc</Text>
              <TouchableOpacity onPress={() => setSelectedTask(null)}><Ionicons name="close" size={24} color="#333" /></TouchableOpacity>
            </View>
            {selectedTask && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{selectedTask.title}</Text>
                <Text style={{ marginTop: 10, color: '#666' }}>{selectedTask.content || 'Không có mô tả.'}</Text>
                <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                  <Ionicons name="flag" size={18} color={PRIORITY_COLORS[selectedTask.priority]} />
                  <Text style={{ marginLeft: 5, color: '#666' }}>Mức độ: {selectedTask.priority}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
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
  sectionHeader: { backgroundColor: '#F9FAFB', paddingHorizontal: 15, paddingVertical: 8, fontSize: 13, fontWeight: 'bold', color: '#6B7280', marginTop: 10 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#5C7CFA', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  detailModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  detailBox: { width: '85%', backgroundColor: '#FFF', borderRadius: 12, padding: 20 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 10 },
  detailHeaderTitle: { fontSize: 16, fontWeight: 'bold', color: '#888' }
});