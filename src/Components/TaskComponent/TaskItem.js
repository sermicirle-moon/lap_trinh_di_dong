import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIORITY_COLORS = { 0: '#828282', 1: '#2D9CDB', 3: '#F2994A', 5: '#EB5757' };

export default function TaskItem({ task, onToggle, onPressItem }) {
  const isCompleted = task.status === 2;
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS[0];

  return (
    <View style={[styles.taskItem, isCompleted && styles.taskItemCompleted]}>
      {/* Nút Checkbox Ô VUÔNG */}
      <TouchableOpacity onPress={() => onToggle(task.id)} style={styles.checkboxContainer}>
        <Ionicons 
          name={isCompleted ? "checkbox" : "square-outline"} 
          size={24} 
          color={isCompleted ? "#A0A0A0" : priorityColor} 
        />
      </TouchableOpacity>

      {/* Thân Task */}
      <TouchableOpacity 
        style={styles.taskDetails} 
        activeOpacity={0.7}
        onPress={() => onPressItem(task)}
      >
        <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}>
          {task.title}
        </Text>
        
        <View style={styles.taskMeta}>
          {task.tags && task.tags.length > 0 && task.tags.map((tag, index) => (
            <View key={index} style={[styles.tagBadge, isCompleted && { backgroundColor: '#F0F0F0' }]}>
              <Text style={[styles.tagText, isCompleted && { color: '#A0A0A0' }]}>{tag}</Text>
            </View>
          ))}
          {task.dueDate && (
            <Text style={[styles.dateText, isCompleted && { color: '#C0C0C0' }]}>
              {new Date(task.dueDate).toLocaleDateString('vi-VN')}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  taskItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F6F7F9', backgroundColor: '#FFF' },
  taskItemCompleted: { backgroundColor: '#FAFAFA' },
  checkboxContainer: { marginRight: 15, justifyContent: 'flex-start', paddingTop: 2 },
  taskDetails: { flex: 1, justifyContent: 'center' },
  taskTitle: { fontSize: 16, color: '#333', fontWeight: '400' },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: '#A0A0A0' },
  taskMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, flexWrap: 'wrap', gap: 5 },
  tagBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  tagText: { fontSize: 11, color: '#2D9CDB', fontWeight: 'bold' },
  dateText: { fontSize: 12, color: '#999' },
});