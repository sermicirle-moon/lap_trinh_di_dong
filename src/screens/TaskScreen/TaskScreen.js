import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, SectionList, ActivityIndicator, LayoutAnimation, UIManager, Platform, Alert } from 'react-native';
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

  const { groupedTasks, isLoading, createTask, updateTask, toggleTaskStatus, softDeleteTask, hardDeleteTask, emptyTrash } = useTaskManagement(listId);
  
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  
  const [parentTaskForSubtask, setParentTaskForSubtask] = useState(null);

  const [selectedTaskForMenu, setSelectedTaskForMenu] = useState(null);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableLists, setAvailableLists] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tags, folders] = await Promise.all([dbApi.getTags(), dbApi.getFolders()]);
        setAvailableTags(tags || []);
        
        const flatLists = [{ id: 'inbox', title: 'Hộp thư đến', icon: 'mail', color: '#2D9CDB' }];
        (folders || []).forEach(f => {
          if (f.isFolder) (f.lists || []).forEach(l => flatLists.push({ ...l, folderTitle: f.title }));
          else flatLists.push(f);
        });
        setAvailableLists(flatLists);
      } catch (error) { console.error("Lỗi:", error); }
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
    setParentTaskForSubtask(null); 
  };

  const handleEmptyTrash = () => {
    Alert.alert("Dọn sạch thùng rác?", "Toàn bộ công việc trong thùng rác sẽ bị xóa vĩnh viễn và không thể khôi phục.",
      [{ text: "Hủy", style: "cancel" }, { text: "Xóa tất cả", style: "destructive", onPress: emptyTrash }]
    );
  };

  const canCreateTask = !['done', 'wont_do', 'trash'].includes(listId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.getParent()?.openDrawer()} style={styles.iconBtn}>
          <Ionicons name="menu-outline" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{listTitle}</Text>
        
        {listId === 'trash' ? (
          <TouchableOpacity style={styles.iconBtn} onPress={handleEmptyTrash}>
            <Ionicons name="trash-bin-outline" size={26} color="#EB5757" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={24} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.emptyContainer}><ActivityIndicator size="large" color="#2D9CDB" /></View>
      ) : groupedTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name={listId === 'trash' ? "trash-outline" : "clipboard-outline"} size={60} color="#D1D5DB" />
          <Text style={styles.emptyText}>{listId === 'trash' ? 'Thùng rác trống.' : 'Chưa có công việc nào.'}</Text>
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
                // 🚀 ĐÃ SỬA LỖI Ở 2 DÒNG DƯỚI ĐÂY: Dùng biến (t) để hứng chính xác Task đang được bấm
                onPressItem={(t) => { setSelectedTask(t); setDetailModalVisible(true); }} 
                onLongPress={(t) => { setSelectedTaskForMenu(t); setMenuVisible(true); }}
              />
            );
          }}
          renderSectionHeader={({ section }) => (
            <TouchableOpacity style={styles.sectionHeader} activeOpacity={0.7} onPress={() => toggleSection(section.key)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={collapsedSections[section.key] ? "chevron-forward" : "chevron-down"} size={18} color={section.color} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionTitle, { color: section.color }]}>{section.title}</Text>
              </View>
              <Text style={styles.sectionCount}>{section.data.length}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          stickySectionHeadersEnabled={false}
        />
      )}

      {canCreateTask && (
        <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => { setParentTaskForSubtask(null); setAddModalVisible(true); }}>
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      )}

      <AddTaskModal 
        isVisible={isAddModalVisible} 
        currentListTitle={listTitle} 
        parentTaskForSubtask={parentTaskForSubtask} 
        onClose={() => { setAddModalVisible(false); setParentTaskForSubtask(null); }} 
        onSave={handleAddNewTask} 
      />
      
      <TaskDetailModal visible={isDetailModalVisible} task={selectedTask} onClose={() => setDetailModalVisible(false)} onUpdateTask={updateTask} />
      
      <TaskContextMenu
        visible={isMenuVisible} task={selectedTaskForMenu} availableTags={availableTags} availableLists={availableLists}
        onClose={() => setMenuVisible(false)} onUpdate={updateTask} 
        onSoftDelete={softDeleteTask} onHardDelete={hardDeleteTask} 
        onAddSubtask={(task) => { setParentTaskForSubtask(task); setAddModalVisible(true); }} 
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