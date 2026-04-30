import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIORITY_COLORS = { 0: '#828282', 1: '#2D9CDB', 3: '#F2994A', 5: '#EB5757' };

// 🚀 THÊM BIẾN level ĐỂ XÁC ĐỊNH CHIỀU SÂU CỦA ĐỆ QUY (Mặc định = 0)
export default function TaskItem({ task, onToggle, onPressItem, onLongPress, level = 0 }) {
  const isCompleted = task.isCompleted; 
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS[0];
  
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  // Tính toán độ thụt lề dựa vào level
  const indentPadding = level * 30;

  const renderDate = () => {
    if (!task.dueDate) return null;
    const d = new Date(task.dueDate);
    const today = new Date(); today.setHours(0,0,0,0);
    const isOverdue = d < today && !isCompleted;
    return (
      <Text style={[styles.dateText, isOverdue && { color: '#EB5757', fontWeight: 'bold' }, isCompleted && { color: '#C0C0C0' }]}>
        {d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
      </Text>
    );
  };

  return (
    <View>
      <View style={[
        styles.taskItem, 
        isCompleted && styles.taskItemCompleted, 
        level > 0 && { paddingLeft: 15 + indentPadding, borderBottomWidth: 0, backgroundColor: '#FAFBFF' }
      ]}>
        
        {hasSubtasks ? (
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={{ paddingRight: 5, justifyContent: 'center' }}>
            <Ionicons name={isExpanded ? "chevron-down" : "chevron-forward"} size={18} color="#888" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: level > 0 ? 0 : 23 }} /> 
        )}

        <TouchableOpacity onPress={() => onToggle(task.id)} style={styles.checkboxContainer}>
          <Ionicons name={isCompleted ? "checkbox" : "square-outline"} size={level > 0 ? 20 : 24} color={isCompleted ? "#A0A0A0" : priorityColor} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.taskDetails} activeOpacity={0.7}
          onPress={() => onPressItem(task)} onLongPress={() => onLongPress(task)} delayLongPress={400}
        >
          <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted, level > 0 && { fontSize: 15 }]}>
            {task.isPinned && level === 0 && <Ionicons name="pin" size={14} color="#2D9CDB" />}{task.isPinned && level === 0 && " "}
            {task.title}
          </Text>
          
          <View style={styles.taskMeta}>
            {task.tags && task.tags.length > 0 && task.tags.map((tag, index) => (
              <View key={index} style={[styles.tagBadge, isCompleted && { backgroundColor: '#F0F0F0' }]}>
                <Text style={[styles.tagText, isCompleted && { color: '#A0A0A0' }]}>{tag}</Text>
              </View>
            ))}
            {renderDate()}
          </View>
        </TouchableOpacity>
      </View>

      {/* 🚀 ĐỆ QUY TĂNG DẦN LEVEL CHO CON CHÁU NẾU MỞ RỘNG */}
      {isExpanded && hasSubtasks && (
        <View style={styles.subtasksContainer}>
          {task.subtasks.map(sub => (
            <TaskItem 
              key={sub.id} 
              task={sub} 
              level={level + 1} // Ép đời sau lùi vào sâu hơn
              onToggle={onToggle} 
              onPressItem={onPressItem} 
              onLongPress={onLongPress}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  taskItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F6F7F9', backgroundColor: '#FFF' },
  taskItemCompleted: { backgroundColor: '#FAFAFA' },
  subtasksContainer: { borderBottomWidth: 1, borderBottomColor: '#F6F7F9' },
  checkboxContainer: { marginRight: 12, justifyContent: 'flex-start', paddingTop: 2 },
  taskDetails: { flex: 1, justifyContent: 'center' },
  taskTitle: { fontSize: 16, color: '#333', fontWeight: '500' },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: '#A0A0A0' },
  taskMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8, flexWrap: 'wrap', gap: 8 },
  tagBadge: { backgroundColor: '#F0F8FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  tagText: { fontSize: 11, color: '#2D9CDB', fontWeight: '600' },
  dateText: { fontSize: 12, color: '#888' },
});