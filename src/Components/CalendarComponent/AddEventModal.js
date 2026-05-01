import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimeSelector from '../TaskComponent/DateTimeSelector';

export default function AddEventModal({ visible, onClose, onSave, prefilledSchedule }) {
  const [title, setTitle] = useState('');
  const [schedule, setSchedule] = useState(null);
  const [showDateMenu, setShowDateMenu] = useState(false);

  // 🚀 ĐÃ FIX: Nhận giờ cụ thể khi bấm từ lưới Lịch
  useEffect(() => {
    if (visible) setSchedule(prefilledSchedule || null);
  }, [visible, prefilledSchedule]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      title,
      startDate: schedule?.startDate || new Date().toISOString(),
      endDate: schedule?.endDate || new Date().toISOString(),
      // Nếu có schedule thì lấy đúng giá trị của nó (kể cả null), nếu chưa chọn gì mới lấy giờ hiện tại
      startTime: schedule ? schedule.startTime : new Date().toISOString(),
      endTime: schedule ? schedule.endTime : new Date().toISOString(),
      isAllDay: schedule ? schedule.isAllDay : false,
      isEvent: true, 
      listId: 'calendar_event' 
    });
    
    setTitle(''); 
    setSchedule(null);
    onClose();
  };

  const handleClose = () => { setTitle(''); setSchedule(null); onClose(); }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Tạo Sự Kiện (Event)</Text>
          <Text style={styles.sub}>Sự kiện sẽ chỉ xuất hiện trên Lịch.</Text>
          
          <TextInput 
            style={styles.input} placeholder="Tên sự kiện..." 
            value={title} onChangeText={setTitle} autoFocus
          />

          <TouchableOpacity style={styles.datePickerBtn} onPress={() => { Keyboard.dismiss(); setShowDateMenu(true); }}>
            <Ionicons name="calendar-outline" size={20} color={schedule ? "#2D9CDB" : "#666"} />
            <Text style={[styles.datePickerText, schedule && {color: '#2D9CDB', fontWeight: 'bold'}]}>
              {schedule ? "Đã chọn thời gian" : "Thiết lập thời gian"}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.row}>
            <TouchableOpacity style={styles.btnCancel} onPress={handleClose}><Text style={styles.txtCancel}>Hủy</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.btnSave, !title.trim() && {opacity: 0.5}]} onPress={handleSave} disabled={!title.trim()}>
              <Text style={styles.txtSave}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <DateTimeSelector visible={showDateMenu} currentSchedule={schedule} onClose={() => setShowDateMenu(false)} onSaveSchedule={setSchedule} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  box: { backgroundColor: '#FFF', width: '100%', borderRadius: 15, padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  sub: { fontSize: 13, color: '#666', marginBottom: 20, fontStyle: 'italic' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, fontSize: 16, paddingHorizontal: 15, paddingVertical: 12, marginBottom: 15 },
  datePickerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, marginBottom: 25 },
  datePickerText: { marginLeft: 10, color: '#666' },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15 },
  btnCancel: { padding: 10 },
  txtCancel: { color: '#888', fontWeight: 'bold' },
  btnSave: { backgroundColor: '#F2994A', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  txtSave: { color: '#FFF', fontWeight: 'bold' }
});