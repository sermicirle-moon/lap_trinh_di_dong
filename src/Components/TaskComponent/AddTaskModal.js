import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Bảng màu Priority (Không, Thấp, Trung bình, Cao)
const PRIORITY_COLORS = { 0: '#828282', 1: '#2D9CDB', 3: '#F2994A', 5: '#EB5757' };
const PRIORITY_LABELS = { 1: 'ƯU TIÊN THẤP', 3: 'ƯU TIÊN TRUNG BÌNH', 5: 'ƯU TIÊN CAO' };
const SUGGESTED_TAGS = ['UI/UX', 'Coding', 'Học tập', 'Cá nhân'];

export default function AddTaskModal({ isVisible, onClose, onSave, currentListTitle }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState(0);
  const [newTaskTags, setNewTaskTags] = useState([]); 
  
  // Trạng thái bật/tắt các menu chọn
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);

  // Thêm / Xóa Tag
  const toggleTagSelection = (tag) => {
    if (newTaskTags.includes(tag)) {
      setNewTaskTags(newTaskTags.filter(t => t !== tag));
    } else {
      setNewTaskTags([...newTaskTags, tag]);
    }
  };

  // Nút Submit
  const handlePressSave = () => {
    if (newTaskTitle.trim() === '') return;

    onSave({
      title: newTaskTitle,
      priority: newTaskPriority,
      tags: newTaskTags,
    });

    // Xóa trắng form sau khi gửi
    setNewTaskTitle('');
    setNewTaskPriority(0);
    setNewTaskTags([]);
    setShowPriorityMenu(false);
    setShowTagMenu(false);
  };

  const handleClose = () => {
    setShowPriorityMenu(false);
    setShowTagMenu(false);
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Vùng tối bên trên để bấm tắt */}
        <TouchableOpacity style={{ flex: 1 }} onPress={handleClose} />
        
        <View style={styles.addBottomSheet}>
          {/* Thanh ngang giả lập hiệu ứng vuốt (Drag Handle) */}
          <View style={styles.dragHandle} />

          {/* Ô nhập liệu Tên Task (Chữ to, in đậm) */}
          <TextInput
            style={styles.inputTitle}
            placeholder="Bạn cần làm gì?"
            placeholderTextColor="#C0C0C0"
            autoFocus
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />

          {/* HÀNG READ-ONLY: Hiển thị List, Priority và Tags */}
          <View style={styles.metaRow}>
            {/* List hiện tại */}
            <View style={styles.readOnlyBadgeBorder}>
              <Ionicons name="browsers-outline" size={14} color="#333" style={{ marginRight: 6 }} />
              <Text style={styles.readOnlyBadgeTextDark}>{currentListTitle}</Text>
            </View>

            {/* Mức độ ưu tiên (Chỉ hiện nếu có chọn) */}
            {newTaskPriority > 0 && (
              <View style={[styles.readOnlyBadgeSolid, { backgroundColor: PRIORITY_COLORS[newTaskPriority] + '20' }]}>
                <Text style={[styles.readOnlyBadgeTextDark, { color: PRIORITY_COLORS[newTaskPriority] }]}>
                  {PRIORITY_LABELS[newTaskPriority]}
                </Text>
              </View>
            )}

            {/* Các Tag đã chọn */}
            {newTaskTags.map((tag, index) => (
              <View key={index} style={styles.readOnlyBadgeSolid}>
                <Text style={styles.readOnlyBadgeTextDark}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* KHUNG POPUP TÙY CHỌN (Nổi lên trên khi bấm icon) */}
          {showPriorityMenu && (
            <View style={styles.popupMenu}>
              {[0, 1, 3, 5].map(level => (
                <TouchableOpacity key={level} style={styles.popupItem} onPress={() => { setNewTaskPriority(level); setShowPriorityMenu(false); }}>
                  <Ionicons name="flag" size={24} color={PRIORITY_COLORS[level]} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {showTagMenu && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popupMenuTag}>
              {SUGGESTED_TAGS.map((tag, idx) => {
                const isSelected = newTaskTags.includes(tag);
                return (
                  <TouchableOpacity key={idx} style={[styles.tagSuggestion, isSelected && styles.tagSuggestionSelected]} onPress={() => toggleTagSelection(tag)}>
                    <Text style={[styles.tagSuggestionText, isSelected && styles.tagSuggestionTextSelected]}>{tag}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* HÀNG CÔNG CỤ VÀ NÚT SUBMIT */}
          <View style={styles.actionRow}>
            
            {/* Khóm icon gom lại vào 1 khối xám nhạt giống ảnh */}
            <View style={styles.toolsGroupWrapper}>
              <TouchableOpacity style={styles.toolIcon}>
                <Ionicons name="calendar-outline" size={22} color="#4F4F4F" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.toolIcon} onPress={() => { setShowPriorityMenu(!showPriorityMenu); setShowTagMenu(false); }}>
                <Ionicons name="flag" size={22} color={PRIORITY_COLORS[newTaskPriority]} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.toolIcon} onPress={() => { setShowTagMenu(!showTagMenu); setShowPriorityMenu(false); }}>
                <Ionicons name="pricetag" size={22} color={newTaskTags.length > 0 ? "#4F4F4F" : "#A0A0A0"} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.toolIcon}>
                <Ionicons name="folder-outline" size={22} color="#4F4F4F" />
              </TouchableOpacity>
            </View>

            {/* Nút Submit (Nhỏ gọn, vừa tay) */}
            <TouchableOpacity 
              style={[styles.saveBtn, !newTaskTitle.trim() && { opacity: 0.5, backgroundColor: '#E0E0E0' }]} 
              onPress={handlePressSave}
              disabled={!newTaskTitle.trim()}
            >
              <Ionicons name="arrow-up" size={24} color={newTaskTitle.trim() ? "#FFF" : "#A0A0A0"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  addBottomSheet: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingBottom: 25, paddingTop: 10, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  
  // Thanh gạt (Drag handle)
  dragHandle: { width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  
  // Chữ nhập to rõ
  inputTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 15, paddingVertical: 0 },
  
  // Hàng thông tin Read-only
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, flexWrap: 'wrap', gap: 8 },
  readOnlyBadgeBorder: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  readOnlyBadgeSolid: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  readOnlyBadgeTextDark: { fontSize: 11, fontWeight: 'bold', color: '#333', textTransform: 'uppercase' },

  // Hàng dưới cùng
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  // Khối xám nhạt chứa các icon
  toolsGroupWrapper: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 25, paddingHorizontal: 10, paddingVertical: 5, gap: 5 },
  toolIcon: { padding: 8 },
  
  // Nút gửi đã được thu nhỏ lại (Kích thước 44x44 chuẩn)
  saveBtn: { backgroundColor: '#4ADE80', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },

  // Menu nổi
  popupMenu: { position: 'absolute', bottom: 85, left: 20, backgroundColor: '#FFF', flexDirection: 'row', gap: 10, padding: 10, borderRadius: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  popupItem: { padding: 10, backgroundColor: '#F9FAFB', borderRadius: 10 },
  popupMenuTag: { position: 'absolute', bottom: 85, left: 20, right: 20, backgroundColor: '#FFF', flexDirection: 'row', padding: 12, borderRadius: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  tagSuggestion: { backgroundColor: '#F3F4F6', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 15, marginRight: 10 },
  tagSuggestionSelected: { backgroundColor: '#333' },
  tagSuggestionText: { color: '#666', fontSize: 13, fontWeight: '500' },
  tagSuggestionTextSelected: { color: '#FFF', fontWeight: 'bold' },
});