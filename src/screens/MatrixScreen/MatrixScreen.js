import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

export default function MatrixScreen() {
  // 1. Quản lý trạng thái (State)
  const [inputText, setInputText] = useState(''); // Lưu chữ người dùng đang gõ
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Sửa lỗi giao diện', type: 'Do First', completed: false },
    { id: '2', text: 'Học React Native', type: 'Schedule', completed: false },
    { id: '3', text: 'Kiểm tra email', type: 'Delegate', completed: true },
  ]);

  // 2. Hàm Thêm công việc
  const handleAddTask = (type) => {
    if (inputText.trim() === '') {
      const msg = "Vui lòng nhập nội dung công việc trước khi thêm!";
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Lỗi", msg);
      return;
    }

    // Tạo một công việc mới
    const newTask = {
      id: Date.now().toString(), // Tạo ID ngẫu nhiên bằng thời gian thực
      text: inputText,
      type: type,
      completed: false
    };

    setTasks([...tasks, newTask]); // Cập nhật danh sách mới
    setInputText(''); // Xóa trắng ô nhập
  };

  // 3. Hàm Đánh dấu Hoàn thành / Chưa hoàn thành
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // 4. Hàm Xóa công việc
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // 5. Khối giao diện tái sử dụng cho từng Phân vùng (Quadrant)
  const MatrixBox = ({ title, subtitle, color, type }) => {
    // Lọc ra các công việc thuộc về phân vùng này
    const boxTasks = tasks.filter(task => task.type === type);

    return (
      <View style={[styles.box, { borderLeftColor: color }]}>
        <View style={styles.boxHeader}>
          <View>
            <Text style={[styles.boxTitle, { color }]}>{title}</Text>
            <Text style={[styles.boxSubtitle, { color }]}>{subtitle}</Text>
          </View>
          {/* Nút bấm để thêm công việc vào vùng này */}
          <TouchableOpacity onPress={() => handleAddTask(type)}>
            <Ionicons name="add-circle" size={32} color={color} />
          </TouchableOpacity>
        </View>

        {/* Danh sách công việc của vùng này */}
        {boxTasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <TouchableOpacity 
              style={[styles.radio, task.completed && { backgroundColor: color, borderColor: color }]} 
              onPress={() => toggleTask(task.id)}
            >
              {task.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
            </TouchableOpacity>
            
            <Text style={[styles.taskText, task.completed && styles.taskCompleted]}>
              {task.text}
            </Text>

            <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteTask(task.id)}>
              <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Eisenhower Matrix</Text>

      {/* Ô nhập công việc mới */}
      <View style={styles.inputContainer}>
        <Ionicons name="pencil-outline" size={20} color="#888" />
        <TextInput 
          style={styles.input}
          placeholder="Nhập công việc mới..."
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor="#888"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Gọi 4 phân vùng và truyền tham số `type` để lọc dữ liệu */}
        <MatrixBox title="Do First" subtitle="Gấp & Quan trọng" color="#FF4B4B" type="Do First" />
        <MatrixBox title="Schedule" subtitle="Quan trọng, Không gấp" color="#2D9CDB" type="Schedule" />
        <MatrixBox title="Delegate" subtitle="Gấp, Không quan trọng" color="#F2C94C" type="Delegate" />
        <MatrixBox title="Eliminate" subtitle="Không gấp, Không quan trọng" color="#9E9E9E" type="Eliminate" />
      </ScrollView>
    </SafeAreaView>
  );
}