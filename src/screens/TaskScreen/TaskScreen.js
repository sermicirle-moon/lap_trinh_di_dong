import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, SectionList, ActivityIndicator, LayoutAnimation, UIManager, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import TaskItem from '../../Components/TaskComponent/TaskItem';
import AddTaskModal from '../../Components/TaskComponent/AddTaskModal';
import TaskDetailModal from '../../Components/TaskComponent/TaskDetailModal'; 
import TaskContextMenu from '../../Components/TaskComponent/TaskContextMenu';

import { useTaskManagement } from '../../hooks/useTaskManagement';
import { dbApi } from '../../services/dbAPI';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TaskScreen({ route, navigation }) {
  const listTitle = route.params?.listTitle || "Tất cả";
  const listId = route.params?.listId || "all";

  const { groupedTasks, isLoading, createTask, updateTask, toggleTaskStatus, softDeleteTask } = useTaskManagement(listId);
  
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  
  // State quản lý Modal Chi tiết
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);

  // 🚀 State quản lý Context Menu (Menu Nhấn Giữ)
  const [selectedTaskForMenu, setSelectedTaskForMenu] = useState(null);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableLists, setAvailableLists] = useState([]);

  // Kéo danh sách Tags và Lists từ DB để nhúng vào Context Menu
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tags, folders] = await Promise.all([dbApi.getTags(), dbApi.getFolders()]);
        setAvailableTags(tags || []);
        
        const flatLists = [{ id: 'inbox', title: 'Hộp thư đến', icon: 'mail', color: '#2D9CDB' }];
        (folders || []).forEach(f => {
          if (f.isFolder) {
            (f.lists || []).forEach(l => flatLists.push({ ...l, folderTitle: f.title }));
          } else {
            flatLists.push(f);
          }
        });
        setAvailableLists(flatLists);
      } catch (error) {
        console.error("Lỗi tải data cho menu:", error);
      }
    };
    loadData();
  }, []);

  const toggleSection = (sectionKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const handleAddNewTask = async (taskData) => {
    await createTask(taskData);
    setAddModalVisible(false);
  };

  const handlePressTaskItem = (task) => {
    setSelectedTask(task);
    setDetailModalVisible(true);
  };

  const handleLongPressTaskItem = (task) => {
    setSelectedTaskForMenu(task);
    setMenuVisible(true);
  };

  const canCreateTask = !['done', 'wont_do', 'trash'].includes(listId);

  const renderSectionHeader = ({ section }) => (
    <TouchableOpacity style={styles.sectionHeader} activeOpacity={0.7} onPress={() => toggleSection(section.key)}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={collapsedSections[section.key] ? "chevron-forward" : "chevron-down"} size={18} color={section.color} style={{ marginRight: 8 }} />
        <Text style={[styles.sectionTitle, { color: section.color }]}>{section.title}</Text>
      </View>
      <Text style={styles.sectionCount}>{section.data.length}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.getParent()?.openDrawer()} style={styles.iconBtn}>
          <Ionicons name="menu-outline" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{listTitle}</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.emptyContainer}><ActivityIndicator size="large" color="#2D9CDB" /></View>
      ) : groupedTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="clipboard-outline" size={60} color="#D1D5DB" />
          <Text style={styles.emptyText}>Chưa có công việc nào.</Text>
        </View>
      ) : (
        <SectionList
          sections={groupedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item, section }) => {
            if (collapsedSections[section.key]) return null;
            return (
              <TaskItem 
                task={item} 
                onToggle={toggleTaskStatus} 
                onPressItem={() => handlePressTaskItem(item)} 
                onLongPress={() => handleLongPressTaskItem(item)}
              />
            );
          }}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={{ paddingBottom: 100 }}
          stickySectionHeadersEnabled={false}
        />
      )}

      {canCreateTask && (
        <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => setAddModalVisible(true)}>
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      )}

      {/* CÁC MODALS ĐIỀU KHIỂN */}
      <AddTaskModal 
        isVisible={isAddModalVisible} currentListTitle={listTitle}
        onClose={() => setAddModalVisible(false)} onSave={handleAddNewTask} 
      />

      <TaskDetailModal
        visible={isDetailModalVisible}
        task={selectedTask}
        onClose={() => setDetailModalVisible(false)}
        onUpdateTask={updateTask}
      />

      <TaskContextMenu
        visible={isMenuVisible}
        task={selectedTaskForMenu}
        availableTags={availableTags}
        availableLists={availableLists}
        onClose={() => setMenuVisible(false)}
        onUpdate={updateTask}
        onDelete={softDeleteTask}
      />

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
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#FAFBFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', marginTop: 10 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold' },
  sectionCount: { fontSize: 13, color: '#999', fontWeight: 'bold' },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#2D9CDB', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.2, shadowRadius: 5 },
});