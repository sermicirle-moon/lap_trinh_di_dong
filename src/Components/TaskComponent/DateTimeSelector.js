import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DateTimeSelector({ visible, onClose, onSaveSchedule, currentSchedule }) {
  // 🚀 ĐÃ FIX: Xác định rõ ràng đang ở Tab "Trong ngày" hay "Dài ngày"
  const [activeTab, setActiveTab] = useState('single'); 

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isAllDay, setIsAllDay] = useState(false);

  const [pickerConfig, setPickerConfig] = useState(null); 

  // 🚀 Đồng bộ dữ liệu cũ khi mở Modal
  useEffect(() => {
    if (visible) {
      const sDate = currentSchedule?.startDate ? new Date(currentSchedule.startDate) : new Date();
      const eDate = currentSchedule?.endDate ? new Date(currentSchedule.endDate) : new Date();
      
      setStartDate(sDate);
      setEndDate(eDate);
      setStartTime(currentSchedule?.startTime ? new Date(currentSchedule.startTime) : null);
      setEndTime(currentSchedule?.endTime ? new Date(currentSchedule.endTime) : null);
      setIsAllDay(currentSchedule?.isAllDay || false);

      // Nếu ngày bắt đầu khác ngày kết thúc -> Tự động chuyển sang Tab Dài Ngày
      const isMulti = sDate.toISOString().split('T')[0] !== eDate.toISOString().split('T')[0];
      setActiveTab(isMulti ? 'multi' : 'single');
    }
  }, [visible, currentSchedule]);

  if (!visible) return null;

  // Xử lý khi chọn lịch Inline ở Tab 1
  const handleInlineDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setStartDate(selectedDate);
      setEndDate(selectedDate); // Tab 1 ép buộc Start và End trùng nhau
    }
  };

  // Xử lý Modal chọn giờ/ngày (Native)
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

  // 🚀 LƯU DỮ LIỆU DỰA TRÊN TAB ĐANG ĐỨNG (Tránh nhầm lẫn)
  const handleSave = () => {
    let finalEndDate = endDate;

    // Nếu đứng ở Tab 1, ép buộc ngày kết thúc = ngày bắt đầu
    if (activeTab === 'single') {
      finalEndDate = startDate;
    } 
    // Nếu đứng ở Tab 2, kiểm tra tránh lỗi ngày kết thúc < ngày bắt đầu
    else if (activeTab === 'multi' && startDate > endDate) {
      finalEndDate = startDate;
    }

    onSaveSchedule({
      startDate: startDate.toISOString(),
      endDate: finalEndDate.toISOString(),
      startTime: isAllDay ? null : (startTime ? startTime.toISOString() : null),
      endTime: isAllDay ? null : (endTime ? endTime.toISOString() : null),
      isAllDay
    });
    onClose();
  };

  const formatDate = (dateObj) => dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formatTime = (dateObj) => dateObj ? dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : "--:--";

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      
      <View style={styles.container}>
        {/* 2 TAB RÕ RÀNG */}
        <View style={styles.tabsWrapper}>
          <TouchableOpacity style={[styles.tab, activeTab === 'single' && styles.activeTab]} onPress={() => setActiveTab('single')}>
            <Text style={[styles.tabText, activeTab === 'single' && styles.activeTabText]}>Trong ngày</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'multi' && styles.activeTab]} onPress={() => setActiveTab('multi')}>
            <Text style={[styles.tabText, activeTab === 'multi' && styles.activeTabText]}>Dài ngày</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
          
          {/* ================= TAB 1: TRONG NGÀY ================= */}
          {activeTab === 'single' && (
            <View>
              <View style={styles.inlineCalendarWrapper}>
                <DateTimePicker value={startDate} mode="date" display="inline" onChange={handleInlineDateChange} themeVariant="light" />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Cả ngày</Text>
                <Switch value={isAllDay} onValueChange={setIsAllDay} trackColor={{ false: "#E0E0E0", true: "#81C784" }} thumbColor={isAllDay ? "#27AE60" : "#F4F3F4"} />
              </View>

              {/* 🚀 LUÔN CÓ DURATION BÊN DƯỚI LỊCH */}
              {!isAllDay && (
                <View style={styles.durationRow}>
                  <Text style={styles.durationLabel}>Khung giờ</Text>
                  <View style={styles.durationInputs}>
                    <TouchableOpacity style={styles.inputBox} onPress={() => setPickerConfig({ mode: 'time', target: 'start' })}>
                      <Text style={styles.inputText}>{formatTime(startTime)}</Text>
                    </TouchableOpacity>
                    <Text style={styles.toText}>đến</Text>
                    <TouchableOpacity style={styles.inputBox} onPress={() => setPickerConfig({ mode: 'time', target: 'end' })}>
                      <Text style={styles.inputText}>{formatTime(endTime)}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ================= TAB 2: DÀI NGÀY ================= */}
          {activeTab === 'multi' && (
            <View style={{ paddingTop: 10 }}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Cả ngày</Text>
                <Switch value={isAllDay} onValueChange={setIsAllDay} trackColor={{ false: "#E0E0E0", true: "#81C784" }} thumbColor={isAllDay ? "#27AE60" : "#F4F3F4"} />
              </View>

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
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => { setStartTime(null); setEndTime(null); setIsAllDay(false); }} style={styles.clearBtn}>
            <Text style={styles.clearText}>Xóa giờ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* NATIVE PICKERS */}
      {pickerConfig && Platform.OS === 'android' && (
        <DateTimePicker
          value={
            pickerConfig.mode === 'date' 
              ? (pickerConfig.target === 'start' ? startDate : endDate) 
              : (pickerConfig.target === 'start' && startTime ? startTime : (pickerConfig.target === 'end' && endTime ? endTime : new Date()))
          }
          mode={pickerConfig.mode} display="default" onChange={handleModalChange}
        />
      )}

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
            mode={pickerConfig.mode} display="spinner" onChange={handleModalChange} textColor="#000"
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
  container: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20, maxHeight: '90%' },
  tabsWrapper: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 12, padding: 4, marginBottom: 15 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#888' },
  activeTabText: { color: '#333' },
  scrollContent: { maxHeight: 400 },
  inlineCalendarWrapper: { backgroundColor: '#FFF', borderRadius: 15, overflow: 'hidden', marginBottom: 10 },
  durationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  durationLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  durationInputs: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  inputBox: { backgroundColor: '#F9FAFB', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', minWidth: 90, alignItems: 'center' },
  inputText: { fontSize: 14, color: '#333', fontWeight: '500' },
  toText: { color: '#888', fontWeight: '500' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  switchLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  clearBtn: { padding: 10 },
  clearText: { color: '#999', fontSize: 14, fontWeight: '600' },
  saveBtn: { backgroundColor: '#2D9CDB', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 12 },
  saveBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  iosPickerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E0E0E0', zIndex: 10000 },
  iosPickerHeader: { flexDirection: 'row', justifyContent: 'flex-end', padding: 15, backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  iosPickerDoneText: { color: '#2D9CDB', fontSize: 16, fontWeight: 'bold' },
});