import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimeSelector from './DateTimeSelector';
import { dbApi } from '../../services/dbAPI'; 

const PRIORITY_COLORS = { 0: '#828282', 1: '#2D9CDB', 3: '#F2994A', 5: '#EB5757' };
const PRIORITY_LABELS = { 1: 'ƯU TIÊN THẤP', 3: 'ƯU TIÊN TRUNG BÌNH', 5: 'ƯU TIÊN CAO' };

export default function AddTaskModal({ isVisible, onClose, onSave, currentListTitle, parentTaskForSubtask }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState(0);
  const [newTaskTags, setNewTaskTags] = useState([]); 
  const [schedule, setSchedule] = useState(null); 
  
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    if (isVisible) {
      dbApi.getTags().then(data => setAvailableTags(data || []));

      // NẾU LÀ TẠO TASK CON -> KẾ THỪA THUỘC TÍNH CỦA CHA
      if (parentTaskForSubtask) {
        setNewTaskPriority(parentTaskForSubtask.priority || 0);
        setNewTaskTags(parentTaskForSubtask.tags || []);
        if (parentTaskForSubtask.dueDate) {
          setSchedule({
            startDate: parentTaskForSubtask.dueDate,
            endDate: parentTaskForSubtask.dueDate,
            isAllDay: true 
          });
        }
      }
    }
  }, [isVisible, parentTaskForSubtask]);

  const toggleTagSelection = (tagTitle) => {
    if (newTaskTags.includes(tagTitle)) {
      setNewTaskTags(newTaskTags.filter(t => t !== tagTitle));
    } else {
      setNewTaskTags([...newTaskTags, tagTitle]);
    }
  };

  const handlePressSave = () => {
    if (newTaskTitle.trim() === '') return;
    Keyboard.dismiss();

    setTimeout(() => {
      onSave({
        title: newTaskTitle,
        priority: newTaskPriority,
        tags: newTaskTags,
        startDate: schedule?.startDate || null,
        dueDate: schedule?.startDate || null,
        endDate: schedule?.endDate || null,
        startTime: schedule?.startTime || null,
        endTime: schedule?.endTime || null,
        isAllDay: schedule?.isAllDay || false,
        // KÉO DATA TỪ CHA VÀO NẾU CÓ
        parentId: parentTaskForSubtask ? parentTaskForSubtask.id : null,
        listId: parentTaskForSubtask ? parentTaskForSubtask.listId : null,
      });

      setNewTaskTitle(''); setNewTaskPriority(0); setNewTaskTags([]); setSchedule(null);
      setShowPriorityMenu(false); setShowTagMenu(false); setShowDateMenu(false);
    }, 150);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setShowPriorityMenu(false); setShowTagMenu(false); setShowDateMenu(false);
    onClose();
  };

  const renderScheduleBadge = () => {
    if (!schedule) return null;
    const startD = new Date(schedule.startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    const endD = new Date(schedule.endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    let timeStr = '';
    if (!schedule.isAllDay && schedule.startTime) {
      const sTime = new Date(schedule.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
      const eTime = schedule.endTime ? new Date(schedule.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '';
      timeStr = ` ${sTime}${eTime ? ' - ' + eTime : ''}`;
    }
    return startD === endD ? `${startD}${timeStr}` : `${startD} - ${endD}`; 
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity style={{ flex: 1 }} onPress={handleClose} />
        
        <View style={styles.addBottomSheet}>
          <View style={styles.dragHandle} />

          <TextInput
            style={styles.inputTitle}
            placeholder={parentTaskForSubtask ? "Thêm công việc con..." : "Bạn cần làm gì?"}
            placeholderTextColor="#C0C0C0"
            autoFocus
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onFocus={() => { setShowPriorityMenu(false); setShowTagMenu(false); setShowDateMenu(false); }}
          />

          <View style={styles.metaRow}>
            <View style={styles.readOnlyBadgeBorder}>
              <Ionicons name={parentTaskForSubtask ? "git-merge-outline" : "browsers-outline"} size={14} color="#333" style={{ marginRight: 6 }} />
              <Text style={styles.readOnlyBadgeTextDark}>
                {parentTaskForSubtask ? `Thuộc: ${parentTaskForSubtask.title}` : currentListTitle}
              </Text>
            </View>

            {schedule && (
              <TouchableOpacity style={[styles.readOnlyBadgeSolid, { backgroundColor: '#E3F2FD' }]} onPress={() => setSchedule(null)}>
                <Ionicons name="calendar" size={14} color="#2D9CDB" style={{ marginRight: 4 }} />
                <Text style={[styles.readOnlyBadgeTextDark, { color: '#2D9CDB' }]}>{renderScheduleBadge()}</Text>
                <Ionicons name="close" size={12} color="#2D9CDB" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            )}

            {newTaskPriority > 0 && (
              <View style={[styles.readOnlyBadgeSolid, { backgroundColor: PRIORITY_COLORS[newTaskPriority] + '20' }]}>
                <Text style={[styles.readOnlyBadgeTextDark, { color: PRIORITY_COLORS[newTaskPriority] }]}>{PRIORITY_LABELS[newTaskPriority]}</Text>
              </View>
            )}

            {newTaskTags.map((tagTitle, index) => (
              <View key={index} style={styles.readOnlyBadgeSolid}>
                <Text style={styles.readOnlyBadgeTextDark}>{tagTitle}</Text>
              </View>
            ))}
          </View>

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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popupMenuTag} contentContainerStyle={{ alignItems: 'center' }}>
              {availableTags.length === 0 ? (
                <Text style={styles.emptyTagText}>Bạn chưa tạo Thẻ nào. Hãy tạo ở thanh Menu nhé.</Text>
              ) : (
                availableTags.map((tag) => (
                  <TouchableOpacity 
                    key={tag.id} 
                    style={[styles.tagSuggestion, newTaskTags.includes(tag.title) && { backgroundColor: tag.color || '#333' }, { borderColor: tag.color, borderWidth: 1 }]} 
                    onPress={() => toggleTagSelection(tag.title)}
                  >
                    <Text style={[styles.tagSuggestionText, newTaskTags.includes(tag.title) ? { color: '#FFF', fontWeight: 'bold' } : { color: tag.color }]}>{tag.title}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}

          <View style={styles.actionRow}>
            <View style={styles.toolsGroupWrapper}>
              <TouchableOpacity style={styles.toolIcon} onPress={() => { Keyboard.dismiss(); setShowDateMenu(true); setShowPriorityMenu(false); setShowTagMenu(false); }}>
                <Ionicons name="calendar-outline" size={22} color={schedule ? "#2D9CDB" : "#4F4F4F"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolIcon} onPress={() => { setShowPriorityMenu(!showPriorityMenu); setShowTagMenu(false); setShowDateMenu(false); }}>
                <Ionicons name="flag" size={22} color={PRIORITY_COLORS[newTaskPriority]} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolIcon} onPress={() => { setShowTagMenu(!showTagMenu); setShowPriorityMenu(false); setShowDateMenu(false); }}>
                <Ionicons name="pricetag" size={22} color={newTaskTags.length > 0 ? "#4F4F4F" : "#A0A0A0"} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.saveBtn, !newTaskTitle.trim() && { opacity: 0.5 }]} onPress={handlePressSave} disabled={!newTaskTitle.trim()}>
              <Ionicons name="arrow-up" size={24} color={newTaskTitle.trim() ? "#FFF" : "#A0A0A0"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <DateTimeSelector visible={showDateMenu} currentSchedule={schedule} onClose={() => setShowDateMenu(false)} onSaveSchedule={(newSchedule) => setSchedule(newSchedule)} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  addBottomSheet: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingBottom: 25, paddingTop: 10, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  dragHandle: { width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  inputTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 15, paddingVertical: 0 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, flexWrap: 'wrap', gap: 8 },
  readOnlyBadgeBorder: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  readOnlyBadgeSolid: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  readOnlyBadgeTextDark: { fontSize: 11, fontWeight: 'bold', color: '#333', textTransform: 'uppercase' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toolsGroupWrapper: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 25, paddingHorizontal: 10, paddingVertical: 5, gap: 5 },
  toolIcon: { padding: 8 },
  saveBtn: { backgroundColor: '#4ADE80', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  popupMenu: { position: 'absolute', bottom: 85, left: 20, backgroundColor: '#FFF', flexDirection: 'row', gap: 10, padding: 10, borderRadius: 15, elevation: 5 },
  popupItem: { padding: 10, backgroundColor: '#F9FAFB', borderRadius: 10 },
  popupMenuTag: { position: 'absolute', bottom: 85, left: 20, right: 20, backgroundColor: '#FFF', flexDirection: 'row', padding: 12, borderRadius: 15, elevation: 5 },
  tagSuggestion: { backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 15, marginRight: 10 },
  tagSuggestionText: { fontSize: 13, fontWeight: '600' },
  emptyTagText: { color: '#999', fontStyle: 'italic', paddingHorizontal: 10 },
});