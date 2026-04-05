import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

export default function HabitsScreen({ navigation }) {
  // Logic Chọn ngày
  const [selectedDate, setSelectedDate] = useState('16');
  
  // Logic Tìm kiếm
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dữ liệu thói quen
  const [habits, setHabits] = useState([
    { id: '1', title: 'Uống nước', streak: '15 ngày liên tiếp', checked: true, icon: 'water-outline', color: '#2D9CDB' },
    { id: '2', title: 'Tập thể dục', streak: '8 ngày liên tiếp', checked: true, icon: 'barbell-outline', color: '#F2994A' },
    { id: '3', title: 'Ngồi thiền', streak: '4 ngày liên tiếp', checked: false, icon: 'leaf-outline', color: '#9B51E0' },
    { id: '4', title: 'Đọc sách', streak: '21 ngày liên tiếp', checked: false, icon: 'book-outline', color: '#27AE60' },
  ]);

  // Bộ lọc tìm kiếm
  const filteredHabits = habits.filter(habit => 
    habit.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, checked: !habit.checked } : habit
    ));
  };

  const handleAddHabit = () => {
    if (Platform.OS === 'web') {
      const newHabitName = window.prompt("Nhập tên thói quen mới:");
      if (newHabitName && newHabitName.trim() !== "") {
        setHabits([...habits, { id: Date.now().toString(), title: newHabitName, streak: '0 ngày', checked: false, icon: 'star-outline', color: '#EB5757' }]);
      }
    } else {
      Alert.prompt("Thêm thói quen", "Nhập tên thói quen mới của bạn:", [
        { text: "Hủy", style: "cancel" },
        { text: "Thêm", onPress: (text) => setHabits([...habits, { id: Date.now().toString(), title: text, streak: '0 ngày', checked: false, icon: 'star-outline', color: '#EB5757' }]) }
      ]);
    }
  };

  const completedCount = habits.filter(h => h.checked).length;
  const completionRate = habits.length === 0 ? 0 : Math.round((completedCount / habits.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER: Giữ nguyên UI, thêm ô Search */}
      <View style={[styles.header, { minHeight: 40 }]}>
        {isSearching ? (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', borderRadius: 10, paddingHorizontal: 10 }}>
            <Ionicons name="search" size={20} color="#888" />
            <TextInput 
              style={{ flex: 1, height: 40, marginLeft: 10, outlineStyle: 'none' }} 
              placeholder="Tìm thói quen..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => { setIsSearching(false); setSearchQuery(''); }}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
        <TouchableOpacity
          onPress={() => {
            if (navigation && navigation.getParent) {
              const parentNav = navigation.getParent();
              if (parentNav && parentNav.openDrawer) parentNav.openDrawer();
            }
          }}
        >
          <Ionicons name="menu-outline" size={28} color="#333" />
        </TouchableOpacity>
            <Text style={styles.headerTitle}>Habits</Text>
            <TouchableOpacity onPress={() => setIsSearching(true)}>
              <Ionicons name="search-outline" size={24} color="#333" />
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* CALENDAR: Khôi phục design gốc + Logic bấm chọn ngày */}
        <View style={styles.calendarStrip}>
          {['13', '14', '15', '16', '17'].map(day => (
            <TouchableOpacity 
              key={day} 
              style={[styles.dayItem, selectedDate === day && styles.activeDay]}
              onPress={() => setSelectedDate(day)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayText, selectedDate === day && styles.activeDayText]}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Thói quen ngày {selectedDate}</Text>
          <Text style={styles.viewAll}>Xem tất cả</Text>
        </View>

        {/* DANH SÁCH THÓI QUEN */}
        {filteredHabits.length > 0 ? (
          filteredHabits.map((habit) => (
            <TouchableOpacity 
              key={habit.id} 
              style={styles.card} 
              onPress={() => toggleHabit(habit.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBg, { backgroundColor: habit.color + '20' }]}>
                <Ionicons name={habit.icon} size={24} color={habit.color} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{habit.title}</Text>
                <Text style={styles.cardStreak}>{habit.streak}</Text>
              </View>
              <View style={[styles.checkbox, habit.checked && styles.checkedBox]}>
                {habit.checked && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>Không tìm thấy thói quen nào</Text>
        )}

        {/* THỐNG KÊ (HEATMAP): Khôi phục 100% code gốc */}
        <Text style={[styles.sectionTitle, { marginTop: 30, marginBottom: 15 }]}>Thống kê thói quen</Text>
        <View style={styles.statsCard}>
          <View style={styles.heatmap}>
             {[...Array(21)].map((_, i) => (
                <View key={i} style={[styles.heatBox, { opacity: Math.random() * 0.8 + 0.2 }]} />
             ))}
          </View>
          <Text style={styles.completionRate}>Tỷ lệ hoàn thành: {completionRate}%</Text>
        </View>

        <View style={{ height: 80 }} /> 
      </ScrollView>

      {/* FAB GỐC */}
      <TouchableOpacity style={styles.fab} onPress={handleAddHabit}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}