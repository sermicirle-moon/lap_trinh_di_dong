import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DateTimeSelector({ visible, onClose, onSaveSchedule, currentSchedule }) {
  const [activeTab, setActiveTab] = useState('date'); 

  const [startDate, setStartDate] = useState(currentSchedule?.startDate ? new Date(currentSchedule.startDate) : new Date());
  const [endDate, setEndDate] = useState(currentSchedule?.endDate ? new Date(currentSchedule.endDate) : new Date());
  const [startTime, setStartTime] = useState(currentSchedule?.startTime ? new Date(currentSchedule.startTime) : null);
  const [endTime, setEndTime] = useState(currentSchedule?.endTime ? new Date(currentSchedule.endTime) : null);
  const [isAllDay, setIsAllDay] = useState(currentSchedule?.isAllDay || false);

  const [pickerConfig, setPickerConfig] = useState(null); 

  if (!visible) return null;

  const setQuickDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setStartDate(d);
    setEndDate(d); 
  };

  const handleInlineDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setStartDate(selectedDate);
      setEndDate(selectedDate);
    }
  };

  const handleModalChange = (event, selectedValue) => {
    if (Platform.OS === 'android') setPickerConfig(null); 
    
    if (selectedValue && event.type !== 'dismissed') {
      if (pickerConfig.target === 'start') {
        if (pickerConfig.mode === 'date') setStartDate(selectedValue);
        if (pickerConfig.mode === 'time') {
          setStartTime(selectedValue);
          if (!endTime) { 
            const autoEnd = new Date(selectedValue);
            autoEnd.setHours(autoEnd.getHours() + 1);
            setEndTime(autoEnd);
          }
        }
      } else {
        if (pickerConfig.mode === 'date') setEndDate(selectedValue);
        if (pickerConfig.mode === 'time') setEndTime(selectedValue);
      }
    }
  };

  const handleSave = () => {
    onSaveSchedule({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      startTime: isAllDay ? null : (startTime ? startTime.toISOString() : null),
      endTime: isAllDay ? null : (endTime ? endTime.toISOString() : null),
      isAllDay
    });
    onClose();
  };

  const formatDate = (dateObj) => {
    return dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const formatTime = (dateObj) => {
    return dateObj ? dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : "--:--";
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      
      <View style={styles.container}>
        <View style={styles.tabsWrapper}>
          <TouchableOpacity style={[styles.tab, activeTab === 'date' && styles.activeTab]} onPress={() => setActiveTab('date')}>
            <Text style={[styles.tabText, activeTab === 'date' && styles.activeTabText]}>Ngày</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'duration' && styles.activeTab]} onPress={() => setActiveTab('duration')}>
            <Text style={[styles.tabText, activeTab === 'duration' && styles.activeTabText]}>Thời lượng</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'date' && (
          <View style={styles.tabContent}>
            <View style={styles.quickActionRow}>
              <TouchableOpacity style={styles.quickBtn} onPress={() => setQuickDate(0)}>
                <Ionicons name="today" size={18} color="#27AE60" />
                <Text style={[styles.quickBtnText, { color: '#27AE60' }]}>Hôm nay</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickBtn} onPress={() => setQuickDate(1)}>
                <Ionicons name="sunny" size={18} color="#F2994A" />
                <Text style={[styles.quickBtnText, { color: '#F2994A' }]}>Ngày mai</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inlineCalendarWrapper}>
              <DateTimePicker
                value={startDate}
                mode="date"
                display="inline" 
                onChange={handleInlineDateChange}
                themeVariant="light"
              />
            </View>
          </View>
        )}

        {activeTab === 'duration' && (
          <View style={styles.tabContent}>
            <View style={styles.durationRow}>
              <Text style={styles.durationLabel}>Bắt đầu</Text>
              <View style={styles.durationInputs}>
                <TouchableOpacity style={styles.inputBox} onPress={() => setPickerConfig({ mode: 'date', target: 'start' })}>
                  <Text style={styles.inputText}>{formatDate(startDate)}</Text>
                </TouchableOpacity>
                {!isAllDay && (
                  <TouchableOpacity style={styles.inputBox} onPress={() => setPickerConfig({ mode: 'time', target: 'start' })}>
                    <Text style={styles.inputText}>{formatTime(startTime)}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.durationRow}>
              <Text style={styles.durationLabel}>Kết thúc</Text>
              <View style={styles.durationInputs}>
                <TouchableOpacity style={styles.inputBox} onPress={() => setPickerConfig({ mode: 'date', target: 'end' })}>
                  <Text style={styles.inputText}>{formatDate(endDate)}</Text>
                </TouchableOpacity>
                {!isAllDay && (
                  <TouchableOpacity style={styles.inputBox} onPress={() => setPickerConfig({ mode: 'time', target: 'end' })}>
                    <Text style={styles.inputText}>{formatTime(endTime)}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Cả ngày</Text>
              <Switch 
                value={isAllDay} 
                onValueChange={setIsAllDay} 
                trackColor={{ false: "#E0E0E0", true: "#81C784" }}
                thumbColor={isAllDay ? "#27AE60" : "#F4F3F4"}
              />
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => { setStartTime(null); setEndTime(null); setIsAllDay(false); }} style={styles.clearBtn}>
            <Text style={styles.clearText}>Xóa giờ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HIỂN THỊ NATIVE PICKER TRÊN ANDROID */}
      {pickerConfig && Platform.OS === 'android' && (
        <DateTimePicker
          value={
            pickerConfig.mode === 'date' 
              ? (pickerConfig.target === 'start' ? startDate : endDate) 
              : (pickerConfig.target === 'start' && startTime ? startTime : (pickerConfig.target === 'end' && endTime ? endTime : new Date()))
          }
          mode={pickerConfig.mode}
          display="default"
          onChange={handleModalChange}
        />
      )}

      {/* 🚀 BẢN FIX DÀNH RIÊNG CHO iOS (ÉP BUNG SPINNER) */}
      {pickerConfig && Platform.OS === 'ios' && (
        <View style={styles.iosPickerContainer}>
          <View style={styles.iosPickerHeader}>
            <TouchableOpacity onPress={() => setPickerConfig(null)}>
              <Text style={styles.iosPickerDoneText}>Xong</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={
              pickerConfig.mode === 'date' 
                ? (pickerConfig.target === 'start' ? startDate : endDate) 
                : (pickerConfig.target === 'start' && startTime ? startTime : (pickerConfig.target === 'end' && endTime ? endTime : new Date()))
            }
            mode={pickerConfig.mode}
            display="spinner" // 👈 Ép bung thanh cuộn ra luôn
            onChange={handleModalChange}
            textColor="#000"
            style={{ width: '100%', height: 200, backgroundColor: '#FFF' }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 9999, elevation: 9999 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  container: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  tabsWrapper: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#888' },
  activeTabText: { color: '#333' },
  tabContent: { minHeight: 250 },
  quickActionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 15 },
  quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  quickBtnText: { marginLeft: 8, fontSize: 14, fontWeight: 'bold' },
  inlineCalendarWrapper: { backgroundColor: '#FFF', borderRadius: 15, overflow: 'hidden' },
  durationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  durationLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  durationInputs: { flexDirection: 'row', gap: 10 },
  inputBox: { backgroundColor: '#F9FAFB', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', minWidth: 90, alignItems: 'center' },
  inputText: { fontSize: 14, color: '#333', fontWeight: '500' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 20 },
  switchLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25 },
  clearBtn: { padding: 10 },
  clearText: { color: '#999', fontSize: 14, fontWeight: '600' },
  saveBtn: { backgroundColor: '#2D9CDB', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 },
  saveBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  // Style cho bộ chọn iOS
  iosPickerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E0E0E0', zIndex: 10000 },
  iosPickerHeader: { flexDirection: 'row', justifyContent: 'flex-end', padding: 15, backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  iosPickerDoneText: { color: '#2D9CDB', fontSize: 16, fontWeight: 'bold' },
});