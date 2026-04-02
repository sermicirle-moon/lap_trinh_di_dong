import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles'; 

export default function FocusScreen() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Mặc định 25 phút
  const [isRunning, setIsRunning] = useState(false);

  // Vòng lặp đếm ngược thời gian
  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      Alert.alert("Hoàn thành!", "Hết giờ rồi!");
      setTimeLeft(25 * 60); // Reset về 25 phút
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Hàm format số giây thành dạng MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  // 1. Nút Settings (Đổi thời gian)
  const handleSettings = () => {
    if (Platform.OS === 'web') {
      // Cách hiển thị tạm thời trên Web (Vì web không hỗ trợ Alert nhiều nút)
      const choice = window.prompt("Nhập số phút bạn muốn (25, 15, hoặc 5):", "25");
      if (choice === "25") { setTimeLeft(25 * 60); setIsRunning(false); }
      else if (choice === "15") { setTimeLeft(15 * 60); setIsRunning(false); }
      else if (choice === "5") { setTimeLeft(5 * 60); setIsRunning(false); }
    } else {
      // Cách hiển thị cực đẹp trên App điện thoại (Expo Go)
      Alert.alert(
        "Cài đặt thời gian",
        "Chọn thời gian cho phiên tiếp theo:",
        [
          { text: "25 Phút", onPress: () => { setTimeLeft(25 * 60); setIsRunning(false); } },
          { text: "15 Phút", onPress: () => { setTimeLeft(15 * 60); setIsRunning(false); } },
          { text: "5 Phút", onPress: () => { setTimeLeft(5 * 60); setIsRunning(false); } },
          { text: "Hủy", style: "cancel" }
        ]
      );
    }
  };

  // 2. Nút Thống kê (Góc trên phải)
  const handleStats = () => {
    if (Platform.OS === 'web') {
      window.alert("Chuyển sang trang thống kê");
    } else {
      Alert.alert("Thông báo", "Chuyển sang trang thống kê");
    }
  };

  // 3. Nút Ambient (Phát nhạc)
  const handleAmbient = () => {
    if (Platform.OS === 'web') {
      window.alert("Đang phát triển");
    } else {
      Alert.alert("Thông báo", "Đang phát triển");
    }
  };

  // 4. Nút Break (Chuyển về 10 phút)
  const handleBreak = () => {
    setTimeLeft(10 * 60); // Đặt thời gian thành 10 phút (600 giây)
    setIsRunning(false);  // Tạm dừng đồng hồ để người dùng tự bấm Start
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Focus</Text>
        
        <TouchableOpacity onPress={handleStats}>
          <Ionicons name="bar-chart-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Deep Work</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>■ Design Sprint</Text>
        </View>

        <View style={styles.timerContainer}>
          <View style={styles.timerCircle}>
            <Text style={styles.timeText}>{formatTime()}</Text>
            <Text style={styles.subText}>{isRunning ? "STAY FOCUSED" : "READY?"}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.startButton, isRunning && { backgroundColor: '#FF6B6B' }]} 
          onPress={toggleTimer}
        >
          <Ionicons name={isRunning ? "pause" : "play"} size={20} color="#fff" />
          <Text style={styles.startButtonText}>{isRunning ? "PAUSE" : "START"}</Text>
        </TouchableOpacity>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem} onPress={() => { setTimeLeft(25*60); setIsRunning(false); }}>
            <Ionicons name="time-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem} onPress={handleAmbient}>
            <Ionicons name="musical-notes-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Ambient</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem} onPress={handleBreak}>
            <Ionicons name="cafe-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Break</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.quote}>"Focus on being productive instead of busy."</Text>
      </View>
    </SafeAreaView>
  );
}