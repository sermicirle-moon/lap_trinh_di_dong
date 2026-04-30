import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, 
  KeyboardAvoidingView, Platform, ScrollView, SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimeSelector from './DateTimeSelector';
import { dbApi } from '../../services/dbAPI';

const PRIORITY_COLORS = { 0: '#828282', 1: '#2D9CDB', 3: '#F2994A', 5: '#EB5757' };

export default function TaskDetailModal({ visible, task, onClose, onUpdateTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [tags, setTags] = useState([]);
  const [schedule, setSchedule] = useState(null);
  
  // 🚀 STATE MỚI: QUẢN LÝ DI CHUYỂN LIST
  const [currentListId, setCurrentListId] = useState('');
  const [selectableLists, setSelectableLists] = useState([]);
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    if (visible && task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 0);
      setIsCompleted(task.isCompleted || false);
      setTags(task.tags || []);
      setCurrentListId(task.listId || 'inbox'); //
      
      if (task.startDate || task.dueDate) {
        setSchedule({
          startDate: task.startDate || task.dueDate,
          endDate: task.endDate || task.dueDate,
          startTime: task.startTime || null,
          endTime: task.endTime || null,
          isAllDay: task.isAllDay || false
        });
      } else {
        setSchedule(null);
      }

      // Kéo Tags
      dbApi.getTags().then(data => setAvailableTags(data || []));

      // 🚀 KÉO DANH SÁCH HỢP LỆ ĐỂ DI CHUYỂN
      loadSelectableLists();
    }
  }, [visible, task]);

  const loadSelectableLists = async () => {
    try {
      const foldersData = await dbApi.getFolders(); //
      const lists = [{ id: 'inbox', title: 'Hộp thư đến', icon: 'mail', color: '#2D9CDB' }];

      (foldersData || []).forEach(item => {
        if (item.isFolder) {
          // Lấy các list con trong folder
          if (item.lists) {
            item.lists.forEach(l => lists.push({ ...l, folderTitle: item.title }));
          }
        } else {
          // Danh sách độc lập
          lists.push(item);
        }
      });
      setSelectableLists(lists);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    }
  };

  const handleCloseAndSave = () => {
    if (!task) return;
    
    onUpdateTask(task.id, {
      title: title.trim() || task.title,
      description: description.trim(),
      priority,
      isCompleted,
      tags,
      listId: currentListId, // 🚀 LƯU THAY ĐỔI DANH SÁCH
      dueDate: schedule?.startDate || null,
      startDate: schedule?.startDate || null,
      endDate: schedule?.endDate || null,
      startTime: schedule?.startTime || null,
      endTime: schedule?.endTime || null,
      isAllDay: schedule?.isAllDay || false,
    });
    
    setShowMoveMenu(false);
    onClose();
  };

  const getListName = () => {
    const found = selectableLists.find(l => l.id === currentListId);
    return found ? found.title : "Hộp thư đến";
  };

  if (!task) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleCloseAndSave}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : null}>
          
          <View style={styles.header}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsCompleted(!isCompleted)}>
              <Ionicons name={isCompleted ? "checkbox" : "square-outline"} size={28} color={isCompleted ? "#A0A0A0" : PRIORITY_COLORS[priority]} />
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setPriority(priority === 5 ? 0 : priority === 0 ? 1 : priority === 1 ? 3 : 5)}>
                <Ionicons name="flag" size={24} color={PRIORITY_COLORS[priority]} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.doneBtn} onPress={handleCloseAndSave}>
                <Text style={styles.doneBtnText}>Xong</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <TextInput style={[styles.titleInput, isCompleted && styles.completedText]} value={title} onChangeText={setTitle} placeholder="Chuẩn bị làm gì đó..." multiline />
            <TextInput style={styles.descInput} value={description} onChangeText={setDescription} placeholder="Thêm mô tả..." placeholderTextColor="#A0A0A0" multiline />

            <View style={styles.divider} />
            
            {/* 🚀 CHỨC NĂNG DI CHUYỂN LIST MỚI */}
            <TouchableOpacity style={styles.metaRow} onPress={() => setShowMoveMenu(!showMoveMenu)}>
              <Ionicons name="list-outline" size={22} color="#888" />
              <View style={styles.listSelectorContent}>
                <Text style={styles.metaText}>{getListName()}</Text>
                <Ionicons name="chevron-forward" size={16} color="#CCC" />
              </View>
            </TouchableOpacity>

            {/* Menu chọn List hiện ra ngay bên dưới */}
            {showMoveMenu && (
              <View style={styles.moveListPicker}>
                {selectableLists.map((l) => (
                  <TouchableOpacity 
                    key={l.id} 
                    style={[styles.listOption, currentListId === l.id && styles.listOptionSelected]}
                    onPress={() => { setCurrentListId(l.id); setShowMoveMenu(false); }}
                  >
                    <Ionicons name={l.icon || "list"} size={18} color={l.color || "#2D9CDB"} />
                    <Text style={[styles.listOptionText, currentListId === l.id && {fontWeight: 'bold'}]}>
                      {l.title} {l.folderTitle ? `(${l.folderTitle})` : ''}
                    </Text>
                    {currentListId === l.id && <Ionicons name="checkmark" size={18} color="#2D9CDB" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity style={styles.metaRow} onPress={() => setShowDateMenu(true)}>
              <Ionicons name="calendar-outline" size={22} color={schedule ? "#2D9CDB" : "#888"} />
              <Text style={[styles.metaText, schedule && { color: '#2D9CDB', fontWeight: 'bold' }]}>{schedule ? "Sửa ngày giờ" : "Thêm ngày giờ"}</Text>
            </TouchableOpacity>

            <View style={styles.tagsSection}>
              <View style={styles.metaRow}>
                <Ionicons name="pricetag-outline" size={22} color="#888" />
                <Text style={styles.metaText}>Thẻ</Text>
              </View>
              <View style={styles.tagsList}>
                {tags.map((tag, idx) => (
                  <View key={idx} style={styles.activeTag}>
                    <Text style={styles.activeTagText}>{tag}</Text>
                    <TouchableOpacity onPress={() => setTags(tags.filter(t => t !== tag))}><Ionicons name="close" size={14} color="#FFF" /></TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addTagBtn} onPress={() => setShowTagMenu(!showTagMenu)}>
                  <Ionicons name="add" size={16} color="#666" /><Text style={styles.addTagBtnText}>Thêm thẻ</Text>
                </TouchableOpacity>
              </View>
              {showTagMenu && (
                <View style={styles.tagPickerBox}>
                  {availableTags.map(tag => (
                    <TouchableOpacity key={tag.id} style={[styles.tagOption, tags.includes(tag.title) && { borderColor: tag.color }]} onPress={() => setTags(tags.includes(tag.title) ? tags.filter(t => t !== tag.title) : [...tags, tag.title])}>
                      <View style={[styles.tagDot, { backgroundColor: tag.color }]} /><Text style={styles.tagOptionText}>{tag.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <DateTimeSelector visible={showDateMenu} currentSchedule={schedule} onClose={() => setShowDateMenu(false)} onSaveSchedule={(newSchedule) => setSchedule(newSchedule)} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  keyboardView: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  checkboxContainer: { padding: 5 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBtn: { padding: 5 },
  doneBtn: { backgroundColor: '#F0F8FF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  doneBtnText: { color: '#2D9CDB', fontWeight: 'bold', fontSize: 16 },
  content: { flex: 1, padding: 20 },
  titleInput: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  completedText: { textDecorationLine: 'line-through', color: '#A0A0A0' },
  descInput: { fontSize: 16, color: '#666', minHeight: 80, textAlignVertical: 'top' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  metaText: { fontSize: 16, color: '#333', marginLeft: 12, flex: 1 },
  listSelectorContent: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 0 },
  
  // Style cho Move List Picker
  moveListPicker: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 10, marginBottom: 20, marginLeft: 34, borderWidth: 1, borderColor: '#F0F0F0' },
  listOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 8 },
  listOptionSelected: { backgroundColor: '#E3F2FD' },
  listOptionText: { flex: 1, fontSize: 15, color: '#444', marginLeft: 12 },

  tagsSection: { marginTop: 10 },
  tagsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingLeft: 34 },
  activeTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  activeTagText: { color: '#FFF', fontSize: 13, fontWeight: '600', marginRight: 5 },
  addTagBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  addTagBtnText: { color: '#666', fontSize: 13, marginLeft: 4 },
  tagPickerBox: { marginTop: 15, marginLeft: 34, padding: 15, backgroundColor: '#FAFBFF', borderRadius: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tagOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0' },
  tagDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  tagOptionText: { fontSize: 14, color: '#333' },
});