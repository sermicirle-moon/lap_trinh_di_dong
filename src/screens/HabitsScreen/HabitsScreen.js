import React, { useState, useEffect } from 'react';
import {View, Text, SafeAreaView, ScrollView, TouchableOpacity,
  TextInput, Alert, Platform, Modal, Switch} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { dbApi } from '../../services/dbAPI';
import { styles } from './styles';
import { CalendarProvider, ExpandableCalendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['vi'] = {
  monthNames: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
  monthNamesShort: ['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'],
  dayNames: ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'],
  dayNamesShort: ['CN','T2','T3','T4','T5','T6','T7'],
  today: "Hôm nay"
};
LocaleConfig.defaultLocale = 'vi';

/* ----- Helper: local date string (YYYY-MM-DD) ----- */
const getLocalDateString = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function HabitsScreen({ navigation }) {
  const todayStr = getLocalDateString(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Add/Edit modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitUnit, setNewHabitUnit] = useState('lần');
  const [newHabitTarget, setNewHabitTarget] = useState('1');
  const [newHabitRepeat, setNewHabitRepeat] = useState('daily');
  const [newHabitStartDate, setNewHabitStartDate] = useState(todayStr);
  const [newHabitEndDate, setNewHabitEndDate] = useState('');
  const [newHabitNoEnd, setNewHabitNoEnd] = useState(true);

  // Context menu (long press)
  const [contextVisible, setContextVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  // Date picker for start/end dates
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState('start');
  const [tempDate, setTempDate] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const calculateStreakForDate = (habitId, targetDateStr, completionsList) => {
    const habitCompletions = completionsList
      .filter((c) => c.habitId === habitId)
      .map((c) => c.date);

    // Nếu ngày đang chọn không có tick, chuỗi của ngày đó mặc định là 0
    if (!habitCompletions.includes(targetDateStr)) return 0;

    let streak = 0;
    let currentDate = new Date(targetDateStr);

    while (true) {
      const dateStr = getLocalDateString(currentDate);
      if (habitCompletions.includes(dateStr)) {
        streak++;
        // Lùi về 1 ngày trước đó
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // Đứt chuỗi thì dừng lại
        break;
      }
    }
    return streak;
  };

  const loadData = async () => {
    const [habitsData, completionsData] = await Promise.all([
      dbApi.getHabits(),
      dbApi.getHabitCompletions(),
    ]);

    // Recalculate streak for each habit based on actual completions
    const updatedHabits = [...habitsData];
    const updatePromises = [];
    for (let i = 0; i < updatedHabits.length; i++) {
      const habit = updatedHabits[i];
      const newStreak = calculateStreakForDate(habit.id, todayStr, completionsData);
      if (newStreak !== habit.streak) {
        updatePromises.push(dbApi.updateHabit(habit.id, { streak: newStreak }));
        updatedHabits[i] = { ...habit, streak: newStreak };
      }
    }
    if (updatePromises.length) await Promise.all(updatePromises);

    setHabits(updatedHabits);
    setCompletions(completionsData);
  };

  const isCompleted = (habitId, date) => {
    return completions.some((c) => c.habitId === habitId && c.date === date);
  };

  const toggleHabit = async (habitId) => {
    // Cho phép tick hôm nay và quá khứ, chặn tương lai
    if (selectedDate > todayStr) {
      Alert.alert('Thông báo', 'Bạn không thể đánh dấu thói quen cho ngày trong tương lai.');
      return;
    }

    const completed = isCompleted(habitId, selectedDate);
    let newCompletions = [...completions];

    if (completed) {
      const comp = completions.find(
        (c) => c.habitId === habitId && c.date === selectedDate
      );
      await dbApi.deleteHabitCompletion(comp.id);
      newCompletions = completions.filter((c) => c.id !== comp.id);
    } else {
      const newComp = await dbApi.addHabitCompletion({
        habitId,
        date: selectedDate,
      });
      newCompletions = [...completions, newComp];
    }

    // Cập nhật streak tổng (tính từ hôm nay) vào database để giữ thống kê chung
    const overallStreak = calculateStreakForDate(habitId, todayStr, newCompletions);
    await dbApi.updateHabit(habitId, { streak: overallStreak });

    setCompletions(newCompletions);
    setHabits(
      habits.map((h) =>
        h.id === habitId ? { ...h, streak: overallStreak } : h
      )
    );
  };

  // ----- Add / Edit habit -----
  const openAddModal = () => {
    setEditMode(false);
    setEditingHabit(null);
    setNewHabitName('');
    setNewHabitUnit('lần');
    setNewHabitTarget('1');
    setNewHabitRepeat('daily');
    setNewHabitStartDate(todayStr);
    setNewHabitEndDate('');
    setNewHabitNoEnd(true);
    setModalVisible(true);
  };

  const openEditModal = (habit) => {
    setEditMode(true);
    setEditingHabit(habit);
    setNewHabitName(habit.title);
    setNewHabitUnit(habit.unit || 'lần');
    setNewHabitTarget(String(habit.target || 1));
    setNewHabitRepeat(habit.repeatType || 'daily');
    setNewHabitStartDate(habit.startDate || todayStr);
    setNewHabitEndDate(habit.endDate || '');
    setNewHabitNoEnd(!habit.endDate);
    setModalVisible(true);
  };

  const handleSaveHabit = async () => {
    if (!newHabitName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên thói quen');
      return;
    }
    const habitData = {
      title: newHabitName.trim(),
      icon: 'star-outline',
      color: '#EB5757',
      streak: editMode ? editingHabit.streak : 0,
      unit: newHabitUnit,
      target: parseInt(newHabitTarget) || 1,
      repeatType: newHabitRepeat,
      startDate: newHabitStartDate,
      endDate: newHabitNoEnd ? null : newHabitEndDate || null,
    };
    try {
      if (editMode) {
        await dbApi.updateHabit(editingHabit.id, habitData);
      } else {
        await dbApi.createHabit(habitData);
      }
      setModalVisible(false);
      loadData();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu thói quen');
    }
  };

  const handleDeleteHabit = async () => {
    if (!selectedHabit) return;
    Alert.alert(
      'Xóa thói quen',
      `Bạn có chắc muốn xóa "${selectedHabit.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await dbApi.deleteHabit(selectedHabit.id);
              setContextVisible(false);
              loadData();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa thói quen');
            }
          },
        },
      ]
    );
  };

  // ----- Date picker handlers -----
  const handleStartDatePress = () => {
    setPickerTarget('start');
    setTempDate(newHabitStartDate ? new Date(newHabitStartDate) : new Date());
    setShowDatePicker(true);
  };

  const handleEndDatePress = () => {
    setPickerTarget('end');
    setTempDate(newHabitEndDate ? new Date(newHabitEndDate) : new Date());
    setShowDatePicker(true);
  };

  const onDatePicked = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate) {
      setTempDate(selectedDate);
      const dateStr = getLocalDateString(selectedDate);
      if (pickerTarget === 'start') {
        setNewHabitStartDate(dateStr);
      } else {
        setNewHabitEndDate(dateStr);
      }
    }
  };

  // ----- Rendering -----
  const filteredHabits = habits.filter((h) => {
    // 1. Lọc theo chữ tìm kiếm
    const matchSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Lọc theo thời gian (startDate và endDate)
    const isAfterStart = h.startDate ? selectedDate >= h.startDate : true;
    const isBeforeEnd = h.endDate ? selectedDate <= h.endDate : true;
    
    // Chỉ hiển thị nếu khớp từ khóa VÀ nằm trong khoảng thời gian hiệu lực
    return matchSearch && isAfterStart && isBeforeEnd;
  });
    
  const completedCount = filteredHabits.filter((h) =>
    isCompleted(h.id, selectedDate)
  ).length;
  const completionRate = filteredHabits.length
    ? Math.round((completedCount / filteredHabits.length) * 100)
    : 0;

  const getHabitDescription = (habit) => {
    let desc = `${habit.target} ${habit.unit}`;
    if (habit.repeatType === 'daily') desc += ' / ngày';
    else if (habit.repeatType === 'weekly') desc += ' / tuần';
    else if (habit.repeatType === 'monthly') desc += ' / tháng';
    return desc;
  };

  const isToday = selectedDate <= todayStr;
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with search */}
      <View style={styles.header}>
        {isSearching ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F0F2F5',
              borderRadius: 10,
              paddingHorizontal: 10,
            }}
          >
            <Ionicons name="search" size={20} color="#888" />
            <TextInput
              style={{ flex: 1, height: 40, marginLeft: 10 }}
              placeholder="Tìm thói quen..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => {
                setIsSearching(false);
                setSearchQuery('');
              }}
            >
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.getParent()?.openDrawer()}>
              <Ionicons name="menu-outline" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Habits</Text>
            <TouchableOpacity onPress={() => setIsSearching(true)}>
              <Ionicons name="search-outline" size={24} color="#333" />
            </TouchableOpacity>
          </>
        )}
      </View>
      {/* PHẦN LỊCH TUẦN MỚI THAY THẾ CHO CALENDAR STRIP */}
    <View style={{ height: 150 }}> 
      <CalendarProvider
        date={selectedDate}
        onDateChanged={(date) => setSelectedDate(date)}
        showTodayButton
        theme={{
          todayButtonTextColor: '#2D9CDB',
        }}
      >
        <ExpandableCalendar
          firstDay={1} // Bắt đầu từ Thứ 2
          horizontal={true}
          hideArrows={false} // Hiện mũi tên để chuyển tuần nhanh
          initialPosition={ExpandableCalendar.positions.CLOSED} // Mặc định chỉ hiện 1 hàng (tuần)
          disablePan={false} // Cho phép kéo xuống để xem cả tháng nếu muốn
          theme={{
            selectedDayBackgroundColor: '#2D9CDB',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#2D9CDB',
            dayTextColor: '#333',
            textDisabledColor: '#d9e1e8',
            dotColor: '#2D9CDB',
            arrowColor: '#2D9CDB',
            monthTextColor: '#333',
            textMonthFontWeight: 'bold',
          }}
        />
      </CalendarProvider>
    </View>
      <ScrollView style={styles.scroll}>
        {/* Calendar strip (5 days) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Thói quen ngày {selectedDate.slice(5)}
          </Text>
          <Text style={styles.viewAll}>Xem tất cả</Text>
        </View>

        {filteredHabits.map((habit) => {
          const completed = isCompleted(habit.id, selectedDate);
          
          // Đặt displayStreak vào TRONG NÀY
          const displayStreak = calculateStreakForDate(habit.id, selectedDate, completions);
          
          // canTick cho phép click nếu ngày đó <= hôm nay (để tick hoặc bỏ tick đều được)
          const canTick = selectedDate <= todayStr; 

          return (
            <TouchableOpacity
              key={habit.id}
              style={styles.card}
              // dùng canTick thay vì check !completed
              onPress={() => canTick && toggleHabit(habit.id)} 
              onLongPress={() => {
                setSelectedHabit(habit);
                setContextVisible(true);
              }}
              delayLongPress={300}
              activeOpacity={0.6}
            >
              <View
                style={[styles.iconBg, { backgroundColor: habit.color + '20' }]}
              >
                <Ionicons name={habit.icon} size={24} color={habit.color} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{habit.title}</Text>
                <Text style={styles.cardSubtitle}>
                  {getHabitDescription(habit)}
                </Text>
                <Text style={styles.cardStreak}>
                  {displayStreak} ngày liên tiếp
                </Text>
              </View>
              <View style={[styles.checkbox, completed && styles.checkedBox]}>
                {completed && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
            </TouchableOpacity>
          );
        })}

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Thống kê</Text>
        <View style={styles.statsCard}>
          <View style={styles.heatmap}>
            {[...Array(21)].map((_, i) => (
              <View key={i} style={[styles.heatBox, { opacity: Math.random() * 0.8 + 0.2 }]} />
            ))}
          </View>
          <Text style={styles.completionRate}>
            Tỷ lệ hoàn thành: {completionRate}%
          </Text>
        </View>
      </ScrollView>

      {/* FAB to add habit */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Context Menu Modal (Edit / Delete) */}
      <Modal visible={contextVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setContextVisible(false)}
        >
          <View style={styles.contextMenu}>
            <TouchableOpacity
              style={styles.contextMenuItem}
              onPress={() => {
                setContextVisible(false);
                openEditModal(selectedHabit);
              }}
            >
              <Ionicons name="pencil-outline" size={22} color="#333" />
              <Text style={styles.contextMenuText}>Sửa</Text>
            </TouchableOpacity>
            <View style={styles.contextDivider} />
            <TouchableOpacity
              style={[styles.contextMenuItem, styles.deleteItem]}
              onPress={handleDeleteHabit}
            >
              <Ionicons name="trash-outline" size={22} color="#EB5757" />
              <Text style={[styles.contextMenuText, { color: '#EB5757' }]}>
                Xóa
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add / Edit Habit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editMode ? 'Sửa thói quen' : 'Thêm thói quen mới'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Tên thói quen"
              value={newHabitName}
              onChangeText={setNewHabitName}
            />

            <View style={styles.modalRow}>
              <TextInput
                style={[styles.modalInput, { flex: 1, marginRight: 10 }]}
                placeholder="Số lượng"
                value={newHabitTarget}
                onChangeText={setNewHabitTarget}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.modalInput, { flex: 2 }]}
                placeholder="Đơn vị (lần, phút, km...)"
                value={newHabitUnit}
                onChangeText={setNewHabitUnit}
              />
            </View>

            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Lặp lại:</Text>
              <View style={styles.repeatOptions}>
                {['daily', 'weekly', 'monthly'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.repeatOption,
                      newHabitRepeat === type && styles.repeatOptionActive,
                    ]}
                    onPress={() => setNewHabitRepeat(type)}
                  >
                    <Text
                      style={[
                        styles.repeatOptionText,
                        newHabitRepeat === type && { color: '#FFF' },
                      ]}
                    >
                      {type === 'daily'
                        ? 'Hàng ngày'
                        : type === 'weekly'
                        ? 'Hàng tuần'
                        : 'Hàng tháng'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.modalLabel}>Ngày bắt đầu:</Text>
            <TouchableOpacity style={styles.modalInput} onPress={handleStartDatePress}>
              <Text>{newHabitStartDate}</Text>
            </TouchableOpacity>

            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Ngày kết thúc:</Text>
              <Switch value={newHabitNoEnd} onValueChange={setNewHabitNoEnd} />
              <Text style={{ marginLeft: 10 }}>Không có</Text>
            </View>
            {!newHabitNoEnd && (
              <TouchableOpacity style={styles.modalInput} onPress={handleEndDatePress}>
                <Text>{newHabitEndDate || 'Chọn ngày'}</Text>
              </TouchableOpacity>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false)
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveHabit}
              >
                <Text style={styles.saveButtonText}>
                  {editMode ? 'Cập nhật' : 'Thêm'}
                </Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && Platform.OS === 'ios' && (
              <View style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)', 
                justifyContent: 'center', alignItems: 'center',
                zIndex: 1000, borderRadius: 15
              }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 15, padding: 15, width: '100%', alignItems: 'center',transform: [{ scale: 0.9 }] }}>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="inline" // Lịch dạng lưới
                    onChange={onDatePicked}
                    themeVariant="light"
                  />
                  <TouchableOpacity 
                    style={{ backgroundColor: '#2D9CDB', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 15 }}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Xong</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 2. Lịch cho Android (Tự động popup bản native chuẩn) */}
            {showDatePicker && Platform.OS === 'android' && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="default"
                onChange={onDatePicked}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Global DateTimePicker for start/end date */}
      
    </SafeAreaView>
  );
}