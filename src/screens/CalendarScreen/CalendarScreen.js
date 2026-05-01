import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, FlatList, Alert } from 'react-native';
// Lịch Danh Sách
import { CalendarProvider, ExpandableCalendar, LocaleConfig } from 'react-native-calendars';
// Lịch Lưới Giờ (Đổi tên thành BigCalendar để không trùng)
import { Calendar as BigCalendar } from 'react-native-big-calendar';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

import { useTaskManagement } from '../../hooks/useTaskManagement';
import { useCalendarData } from '../../hooks/useCalendarData';
import AddTaskModal from '../../Components/TaskComponent/AddTaskModal';
import TaskDetailModal from '../../Components/TaskComponent/TaskDetailModal';
import AddEventModal from '../../Components/CalendarComponent/AddEventModal'; 

LocaleConfig.locales['vi'] = {
  monthNames: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
  monthNamesShort: ['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'],
  dayNames: ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'],
  dayNamesShort: ['CN','T2','T3','T4','T5','T6','T7'],
  today: 'Hôm nay'
};
LocaleConfig.defaultLocale = 'vi';

export default function CalendarScreen({ navigation }) {
  const { tasks, updateTask, createTask, toggleTaskStatus, softDeleteTask } = useTaskManagement('calendar');
  const { itemsByDate, markedDates, mappedData } = useCalendarData(tasks);

  // 🚀 STATE CHUYỂN ĐỔI CHẾ ĐỘ ('agenda' hoặc 'grid')
  const [viewMode, setViewMode] = useState('agenda'); 
  
  // State quản lý ngày (Dùng string để sync cả 2 thư viện)
  const [currentDateStr, setCurrentDateStr] = useState(dayjs().format('YYYY-MM-DD'));
  const [gridMode, setGridMode] = useState('3days'); // Chế độ mặc định của lưới
  const [zoom, setZoom] = useState(1.5); 
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [tempSchedule, setTempSchedule] = useState(null); 
  const [showFabMenu, setShowFabMenu] = useState(false);

  // Đồng bộ vuốt Lưới Giờ
  const handleGridSwipeDate = (dates) => {
    const newDate = Array.isArray(dates) ? dates[0] : dates;
    if (newDate && !dayjs(currentDateStr).isSame(newDate, 'day')) {
      setCurrentDateStr(dayjs(newDate).format('YYYY-MM-DD')); 
    }
  };

  // Menu thao tác chung cho CẢ 2 CHẾ ĐỘ
  const handleItemPress = (item) => {
    const options = [
      { text: item.isCompleted ? "Bỏ hoàn thành" : "✅ Hoàn thành", onPress: () => toggleTaskStatus(item.id) },
      { text: "❌ Không làm nữa", onPress: () => updateTask(item.id, { isWontDo: true }) },
      { text: "🗑 Thùng rác", style: "destructive", onPress: () => softDeleteTask(item.id) },
      { text: "Sửa chi tiết", onPress: () => { setSelectedTask(item); setDetailModalOpen(true); } },
      { text: "Hủy", style: "cancel" }
    ];
    if (item.isEvent) options.splice(0, 2); 
    Alert.alert( item.title, item.isEvent ? "Sự kiện lịch:" : "Công việc cần làm:", options );
  };

  // Kéo thả (Chỉ áp dụng ở Lưới Giờ)
  const handleDragEvent = (event, newStart, newEnd) => {
    if (event.isEvent) return; 
    const isMultiDay = dayjs(event.endDate || event.dueDate).format('YYYY-MM-DD') !== dayjs(event.startDate || event.dueDate).format('YYYY-MM-DD');
    if (isMultiDay) {
      Alert.alert("Lỗi", "Không thể kéo thả công việc lặp nhiều ngày. Vui lòng bấm vào khối để sửa chi tiết.");
      return; 
    }
    updateTask(event.id, {
      startDate: newStart.toISOString(), dueDate: newStart.toISOString(),
      startTime: newStart.toISOString(), endTime: newEnd.toISOString()
    });
  };

  // Tạo nhanh ở Lưới Giờ
  const handlePressGridCell = (date) => {
    const sTime = dayjs(date);
    setTempSchedule({
      startDate: sTime.toDate(), endDate: sTime.toDate(),
      startTime: sTime.toDate(), endTime: sTime.add(1, 'hour').toDate()
    });
    Alert.alert("Tạo mới", `Tại thời gian: ${sTime.format('HH:mm - DD/MM')}`, [
      { text: "Công việc", onPress: () => setAddModalOpen(true) },
      { text: "Sự kiện", onPress: () => setEventModalOpen(true) },
      { text: "Hủy", style: "cancel", onPress: () => setTempSchedule(null) }
    ]);
  };

  // Giao diện render item cho Agenda
  const renderAgendaItem = ({ item }) => {
    const isCompleted = item.isCompleted;
    return (
      <TouchableOpacity style={[styles.agendaItem, isCompleted && { opacity: 0.6 }]} onPress={() => handleItemPress(item)} activeOpacity={0.7}>
        <TouchableOpacity style={styles.itemIconBox} onPress={() => !item.isEvent && toggleTaskStatus(item.id)}>
          {item.isEvent ? <Ionicons name="star" size={24} color="#F2994A" /> : <Ionicons name={isCompleted ? "checkmark-circle" : "ellipse-outline"} size={26} color={isCompleted ? "#A0A0A0" : item.color} />}
        </TouchableOpacity>
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, isCompleted && { textDecorationLine: 'line-through', color: '#A0A0A0' }]}>{item.title}</Text>
          <Text style={styles.itemTime}>
            {item.isEvent && item.startTime && item.endTime ? `${dayjs(item.startTime).format('HH:mm')} - ${dayjs(item.endTime).format('HH:mm')}` :
             item.isEvent ? "Sự kiện" : item.isAllDayOrNoTime ? "Cả ngày" :
             item.startTime && item.endTime ? `${dayjs(item.startTime).format('HH:mm')} - ${dayjs(item.endTime).format('HH:mm')}` : 
             item.startTime ? dayjs(item.startTime).format('HH:mm') : ""}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🚀 HEADER CÓ NÚT CHUYỂN ĐỔI (TOGGLE VIEW) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.getParent()?.openDrawer()} style={styles.iconBtn}>
          <Ionicons name="menu-outline" size={28} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{dayjs(currentDateStr).locale('vi').format('MMMM, YYYY')}</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.todayBtn} onPress={() => setCurrentDateStr(dayjs().format('YYYY-MM-DD'))}>
            <Text style={styles.todayText}>Hôm nay</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setViewMode(prev => prev === 'agenda' ? 'grid' : 'agenda')} style={styles.toggleBtn}>
            <Ionicons name={viewMode === 'agenda' ? "grid-outline" : "list"} size={26} color="#2D9CDB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* THANH ĐIỀU CHỈNH 3 NGÀY/ 7 NGÀY CHỈ HIỆN KHI Ở CHẾ ĐỘ LƯỚI */}
      {viewMode === 'grid' && (
        <View style={styles.modeSwitch}>
          <TouchableOpacity style={[styles.modeBtn, gridMode === 'day' && styles.modeActive]} onPress={() => setGridMode('day')}><Text style={[styles.modeText, gridMode === 'day' && styles.modeTextActive]}>1 Ngày</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.modeBtn, gridMode === '3days' && styles.modeActive]} onPress={() => setGridMode('3days')}><Text style={[styles.modeText, gridMode === '3days' && styles.modeTextActive]}>3 Ngày</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.modeBtn, gridMode === 'week' && styles.modeActive]} onPress={() => setGridMode('week')}><Text style={[styles.modeText, gridMode === 'week' && styles.modeTextActive]}>7 Ngày</Text></TouchableOpacity>
        </View>
      )}

      {/* KHU VỰC HIỂN THỊ LỊCH KÉP */}
      <View style={{ flex: 1 }}>
        {viewMode === 'agenda' ? (
          // CHẾ ĐỘ 1: DANH SÁCH (AGENDA)
          <CalendarProvider date={currentDateStr} onDateChanged={setCurrentDateStr} showTodayButton={false}>
            <ExpandableCalendar firstDay={1} markedDates={markedDates} theme={{ selectedDayBackgroundColor: '#2D9CDB', todayTextColor: '#2D9CDB', arrowColor: '#2D9CDB', dotColor: '#2D9CDB' }} />
            <FlatList
              data={itemsByDate[currentDateStr] || []} renderItem={renderAgendaItem} keyExtractor={(item, index) => item.id + index}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={<View style={styles.emptyContainer}><Ionicons name="cafe-outline" size={60} color="#E0E0E0" /><Text style={styles.emptyText}>Thảnh thơi! Không có lịch trình.</Text></View>}
            />
          </CalendarProvider>
        ) : (
          // CHẾ ĐỘ 2: LƯỚI GIỜ KÉO THẢ (GRID)
          <BigCalendar
            events={mappedData}
            height={600 * zoom} 
            mode={gridMode}
            date={dayjs(currentDateStr).toDate()}
            swipeEnabled={true}
            onChangeDate={handleGridSwipeDate} 
            onPressEvent={handleItemPress} 
            onPressCell={handlePressGridCell}
            onChangeEvent={handleDragEvent} 
            eventCellStyle={event => ({ backgroundColor: event.color, borderRadius: 6, opacity: 0.85, borderWidth: 1, borderColor: '#FFF' })}
          />
        )}
      </View>

      {/* TRỤC ZOOM CHỈ HIỆN Ở CHẾ ĐỘ LƯỚI */}
      {viewMode === 'grid' && (
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomBtn} onPress={() => setZoom(prev => Math.min(prev + 0.5, 3))} ><Ionicons name="add" size={24} color={zoom >= 3 ? "#CCC" : "#666"} /></TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity style={styles.zoomBtn} onPress={() => setZoom(prev => Math.max(prev - 0.5, 1))} ><Ionicons name="remove" size={24} color={zoom <= 1 ? "#CCC" : "#666"} /></TouchableOpacity>
        </View>
      )}

      {/* NÚT TẠO NHANH CHUNG CHO CẢ 2 CHẾ ĐỘ */}
      <View style={styles.fabContainer}>
        {showFabMenu && (
          <View style={styles.fabMenu}>
            <TouchableOpacity style={styles.fabSubBtn} onPress={() => { setShowFabMenu(false); setTempSchedule(null); setEventModalOpen(true); }}><Ionicons name="star" size={20} color="#FFF" /><Text style={styles.fabSubText}>Sự kiện</Text></TouchableOpacity>
            <TouchableOpacity style={styles.fabSubBtn} onPress={() => { setShowFabMenu(false); setTempSchedule(null); setAddModalOpen(true); }}><Ionicons name="checkmark-done" size={20} color="#FFF" /><Text style={styles.fabSubText}>Công việc</Text></TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.fabMain} activeOpacity={0.8} onPress={() => setShowFabMenu(!showFabMenu)}>
          <Ionicons name={showFabMenu ? "close" : "add"} size={32} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Truyền ngày đang chọn vào prefilledSchedule để khi bấm + nó tự điền ngày hiện tại */}
      <AddTaskModal isVisible={isAddModalOpen} currentListTitle="Lịch" prefilledSchedule={tempSchedule || { startDate: currentDateStr, endDate: currentDateStr }} onClose={() => setAddModalOpen(false)} onSave={createTask} />
      <TaskDetailModal visible={isDetailModalOpen} task={selectedTask} onClose={() => setDetailModalOpen(false)} onUpdateTask={updateTask} />
      <AddEventModal visible={isEventModalOpen} prefilledSchedule={tempSchedule || { startDate: currentDateStr, endDate: currentDateStr }} onClose={() => setEventModalOpen(false)} onSave={createTask} />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#FFF', zIndex: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', textTransform: 'capitalize' },
  iconBtn: { padding: 5 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  todayBtn: { backgroundColor: '#F0F8FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  todayText: { color: '#2D9CDB', fontWeight: 'bold' },
  toggleBtn: { marginLeft: 15, padding: 5 },
  
  modeSwitch: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 8, padding: 3, margin: 10 },
  modeBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 6 },
  modeActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 2 },
  modeText: { color: '#666', fontWeight: '500', fontSize: 13 },
  modeTextActive: { color: '#2D9CDB', fontWeight: 'bold' },

  listContent: { padding: 20, paddingBottom: 100 },
  agendaItem: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  itemIconBox: { marginRight: 15, justifyContent: 'center', alignItems: 'center' },
  itemContent: { flex: 1, justifyContent: 'center' },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  itemTime: { fontSize: 13, color: '#888' },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  emptyText: { marginTop: 15, fontSize: 15, color: '#A0A0A0' },

  zoomControls: { position: 'absolute', left: 15, bottom: 20, backgroundColor: '#FFF', borderRadius: 10, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, zIndex: 99 },
  zoomBtn: { paddingHorizontal: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  zoomDivider: { height: 1, backgroundColor: '#E0E0E0', width: '70%', alignSelf: 'center' },

  fabContainer: { position: 'absolute', right: 20, bottom: 20, alignItems: 'flex-end', zIndex: 99 },
  fabMenu: { marginBottom: 15, gap: 10 },
  fabSubBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, alignSelf: 'flex-end', shadowColor: '#000', shadowOpacity: 0.2, elevation: 4 },
  fabSubText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },
  fabMain: { backgroundColor: '#2D9CDB', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5 },
});