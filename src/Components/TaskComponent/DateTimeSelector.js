import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DateSelectorMenu({ visible, onSelectDate }) {
  const [showNativePicker, setShowNativePicker] = useState(false);

  // Nếu không được gọi hiển thị thì ẩn đi
  if (!visible) return null;

  // Hàm tính toán ngày nhanh
  const setQuickDate = (daysOffset) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    onSelectDate(date.toISOString());
  };

  // Hàm hứng ngày từ bộ lịch điện thoại
  const handleNativeDateChange = (event, selectedDate) => {
    setShowNativePicker(false);
    if (selectedDate) {
      onSelectDate(selectedDate.toISOString());
    }
  };

  return (
    <View style={styles.container}>
      {/* 3 Nút Chọn Nhanh */}
      <TouchableOpacity style={styles.dateOptionBtn} onPress={() => setQuickDate(0)}>
        <Ionicons name="today" size={20} color="#27AE60" />
        <Text style={[styles.dateOptionText, { color: '#27AE60' }]}>Hôm nay</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.dateOptionBtn} onPress={() => setQuickDate(1)}>
        <Ionicons name="sunny" size={20} color="#F2994A" />
        <Text style={[styles.dateOptionText, { color: '#F2994A' }]}>Ngày mai</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.dateOptionBtn} onPress={() => setShowNativePicker(true)}>
        <Ionicons name="calendar" size={20} color="#2D9CDB" />
        <Text style={[styles.dateOptionText, { color: '#2D9CDB' }]}>Chọn ngày...</Text>
      </TouchableOpacity>

      {/* Lịch Native Ẩn Bên Dưới */}
      {showNativePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleNativeDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', 
    bottom: 85, 
    left: 20, 
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    gap: 10, 
    padding: 12, 
    borderRadius: 15, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 8
  },
  dateOptionBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9FAFB', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 10 
  },
  dateOptionText: { 
    marginLeft: 6, 
    fontSize: 13, 
    fontWeight: 'bold' 
  },
});