import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIORITY_COLORS = { 0: '#828282', 1: '#2D9CDB', 3: '#F2994A', 5: '#EB5757' };

export default function TaskContextMenu({ 
  visible, task, onClose, onUpdate, onSoftDelete, onHardDelete, onAddSubtask, availableTags, availableLists 
}) {
  const [viewMode, setViewMode] = useState('main');

  if (!task) return null;

  const handleUpdate = (updates) => {
    onUpdate(task.id, updates);
    onClose();
    setViewMode('main');
  };

  if (task.isTrashed) {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
          <View style={styles.menuContainer} onStartShouldSetResponder={() => true}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="#666" /></TouchableOpacity>
              <Text style={styles.taskName} numberOfLines={1}>{task.title}</Text>
            </View>
            <View style={styles.listOptions}>
              <TouchableOpacity style={styles.optionRow} onPress={() => handleUpdate({ isTrashed: false })}>
                <Ionicons name="refresh-circle-outline" size={24} color="#27AE60" />
                <Text style={[styles.optionText, { color: '#27AE60', fontWeight: 'bold' }]}>Khôi phục công việc</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.optionRow, styles.deleteRow]} onPress={() => { onHardDelete(task.id); onClose(); }}>
                <Ionicons name="trash" size={24} color="#EB5757" />
                <Text style={[styles.optionText, { color: '#EB5757', fontWeight: 'bold' }]}>Xóa vĩnh viễn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.menuContainer} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => viewMode === 'main' ? onClose() : setViewMode('main')}>
              <Ionicons name={viewMode === 'main' ? "close" : "arrow-back"} size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.taskName} numberOfLines={1}>{task.title}</Text>
          </View>

          {viewMode === 'main' && (
            <View>
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickBtn} onPress={() => handleUpdate({ isPinned: !task.isPinned })}>
                  <Ionicons name={task.isPinned ? "pin" : "pin-outline"} size={22} color={task.isPinned ? "#2D9CDB" : "#666"} />
                  <Text style={styles.quickText}>{task.isPinned ? "Bỏ ghim" : "Ghim"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickBtn} onPress={() => setViewMode('priority')}>
                  <Ionicons name="flag" size={22} color={PRIORITY_COLORS[task.priority]} />
                  <Text style={styles.quickText}>Ưu tiên</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickBtn} onPress={() => setViewMode('move')}>
                  <Ionicons name="list-outline" size={22} color="#666" />
                  <Text style={styles.quickText}>Chuyển</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickBtn} onPress={() => setViewMode('tags')}>
                  <Ionicons name="pricetag-outline" size={22} color="#666" />
                  <Text style={styles.quickText}>Thẻ</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.listOptions}>
                {/* 🚀 ĐÃ BỎ ĐIỀU KIỆN !task.parentId -> MỌI TASK ĐỀU CÓ THỂ ĐẺ CON */}
                <TouchableOpacity style={styles.optionRow} onPress={() => { onClose(); onAddSubtask(task); }}>
                  <Ionicons name="git-merge-outline" size={22} color="#2D9CDB" />
                  <Text style={[styles.optionText, { color: '#2D9CDB' }]}>Thêm công việc con</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionRow} onPress={() => handleUpdate({ isWontDo: !task.isWontDo, isCompleted: false })}>
                  <Ionicons name="close-circle-outline" size={22} color="#828282" />
                  <Text style={styles.optionText}>{task.isWontDo ? "Làm lại việc này" : "Đánh dấu Không làm"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.optionRow, styles.deleteRow]} onPress={() => { onSoftDelete(task.id); onClose(); }}>
                  <Ionicons name="trash-outline" size={22} color="#EB5757" />
                  <Text style={[styles.optionText, { color: '#EB5757' }]}>Xóa (Chuyển vào thùng rác)</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {viewMode === 'priority' && (
            <View style={styles.subContainer}>
              <Text style={styles.subTitle}>Mức độ ưu tiên</Text>
              {[5, 3, 1, 0].map(p => (
                <TouchableOpacity key={p} style={styles.subOption} onPress={() => handleUpdate({ priority: p })}>
                  <Ionicons name="flag" size={20} color={PRIORITY_COLORS[p]} />
                  <Text style={styles.subOptionText}>Mức {p === 5 ? 'Cao' : p === 3 ? 'Trung bình' : p === 1 ? 'Thấp' : 'Không có'}</Text>
                  {task.priority === p && <Ionicons name="checkmark" size={20} color="#2D9CDB" />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {viewMode === 'tags' && (
            <View style={styles.subContainer}>
              <Text style={styles.subTitle}>Thẻ phân loại</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                {availableTags.map(tag => {
                  const isSelected = task.tags?.includes(tag.title);
                  return (
                    <TouchableOpacity key={tag.id} style={styles.subOption} onPress={() => {
                        const newTags = isSelected ? task.tags.filter(t => t !== tag.title) : [...(task.tags || []), tag.title];
                        handleUpdate({ tags: newTags });
                    }}>
                      <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
                      <Text style={styles.subOptionText}>{tag.title}</Text>
                      {isSelected && <Ionicons name="checkmark" size={20} color="#2D9CDB" />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {viewMode === 'move' && (
            <View style={styles.subContainer}>
              <Text style={styles.subTitle}>Di chuyển tới danh sách</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                {availableLists.map(list => (
                  <TouchableOpacity key={list.id} style={styles.subOption} onPress={() => handleUpdate({ listId: list.id })}>
                    <Ionicons name={list.icon || "list"} size={20} color={list.color || "#2D9CDB"} />
                    <Text style={styles.subOptionText}>{list.title}</Text>
                    {task.listId === list.id && <Ionicons name="checkmark" size={20} color="#2D9CDB" />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  menuContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  taskName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 15, flex: 1 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, backgroundColor: '#F9FAFB', borderRadius: 15, padding: 15 },
  quickBtn: { alignItems: 'center', flex: 1 },
  quickText: { fontSize: 11, color: '#666', marginTop: 5 },
  listOptions: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 10 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  optionText: { fontSize: 16, color: '#333', marginLeft: 15 },
  subContainer: { paddingBottom: 10 },
  subTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', marginBottom: 15, textTransform: 'uppercase' },
  subOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  subOptionText: { flex: 1, fontSize: 16, color: '#333', marginLeft: 15 },
  tagDot: { width: 12, height: 12, borderRadius: 6 },
});