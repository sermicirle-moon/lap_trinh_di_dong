import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dbApi } from '../../services/dbAPI';
import FocusStatsScreen from './FocusStatsScreen';

export default function FocusScreen() {
  const [activeTab, setActiveTab] = useState('timer');
  // THÊM: Biến lưu tổng thời gian của phiên hiện tại (mặc định 25 phút)
  const [totalTime, setTotalTime] = useState(25 * 60); 
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pausesCount, setPausesCount] = useState(0);
  const [category, setCategory] = useState('Work');
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Lưu phiên hiện tại (SỬA: Dùng totalTime thay vì 25*60)
  const saveCurrentSession = async (completed = true) => {
    if (!startTimeRef.current) return;
    const duration = totalTime - timeLeft; 
    if (duration <= 0) return;
    try {
      await dbApi.createFocusSession({
        startTime: new Date(startTimeRef.current).toISOString(),
        endTime: new Date().toISOString(),
        duration,
        pausesCount,
        category,
        completed,
      });
    } catch (error) {
      console.error('Lỗi lưu phiên:', error);
    }
  };

  // Reset timer và lưu phiên nếu có dữ liệu
  const resetTimer = async () => {
    if (startTimeRef.current && (totalTime - timeLeft) > 0) {
      await saveCurrentSession(false); 
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(totalTime); // Đưa về thời gian gốc đã cài
    setPausesCount(0);
    startTimeRef.current = null;
  };

  const handleSessionComplete = async () => {
    if (startTimeRef.current && timeLeft === 0) {
      await saveCurrentSession(true);
      Alert.alert('Hoàn thành!', `Đã lưu phiên tập trung ${category}`);
    }
    resetTimer();
  };

  useEffect(() => {
    if (isRunning) {
      // SỬA: Dùng totalTime thay vì 25*60
      startTimeRef.current = Date.now() - (totalTime - timeLeft) * 1000;
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, totalTime]); // Thêm totalTime vào dependency

  useEffect(() => {
    return () => {
      if (startTimeRef.current && (totalTime - timeLeft) > 0) {
        saveCurrentSession(false);
      }
    };
  }, [totalTime]);

  const toggleTimer = () => {
    if (!isRunning && timeLeft === 0) resetTimer();
    setIsRunning(!isRunning);
    if (!isRunning && timeLeft > 0 && timeLeft < totalTime) {
      setPausesCount(prev => prev + 1);
    }
  };

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSettings = () => {
    if (Platform.OS === 'web') {
      const mins = window.prompt('Nhập số phút (vd: 10):', '25');
      if (mins && !isNaN(mins)) {
        const newTime = parseInt(mins) * 60;
        setTotalTime(newTime); // Cập nhật tổng thời gian
        setTimeLeft(newTime);
        setIsRunning(false);
      }
    } else {
      Alert.prompt(
        'Cài đặt thời gian',
        'Nhập số phút (1 - 120):',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Đặt',
            onPress: (mins) => {
              const num = parseInt(mins);
              if (!isNaN(num) && num >= 1 && num <= 120) {
                const newTime = num * 60;
                setTotalTime(newTime); // Cập nhật tổng thời gian
                setTimeLeft(newTime);
                setIsRunning(false);
              } else {
                Alert.alert('Lỗi', 'Vui lòng nhập số từ 1 đến 120');
              }
            }
          }
        ],
        'plain-text'
      );
    }
  };

  if (activeTab === 'stats') {
    return <FocusStatsScreen onBack={() => setActiveTab('timer')} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Focus</Text>
        <TouchableOpacity onPress={() => setActiveTab('stats')}>
          <Ionicons name="bar-chart-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Deep Work</Text>

        <View style={styles.categoryRow}>
          {['Work', 'Study', 'Personal'].map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBtn, category === cat && styles.categoryActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryText, category === cat && { color: '#FFF' }]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.pauseContainer}>
          <Text style={styles.pauseLabel}>Tạm dừng: {pausesCount} lần</Text>
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
          <TouchableOpacity style={styles.optionItem} onPress={resetTimer}>
            <Ionicons name="time-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem} onPress={() => {
            const breakTime = 10 * 60;
            setTotalTime(breakTime);
            setTimeLeft(breakTime);
          }}>
            <Ionicons name="cafe-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Break</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.quote}>"Focus on being productive instead of busy."</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', paddingTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A' },
  categoryRow: { flexDirection: 'row', marginVertical: 15 },
  categoryBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginHorizontal: 6, backgroundColor: '#F0F0F0' },
  categoryActive: { backgroundColor: '#2D9CDB' },
  categoryText: { fontWeight: '600', color: '#666' },
  pauseContainer: { marginBottom: 10 },
  pauseLabel: { fontSize: 16, color: '#888' },
  timerContainer: { marginVertical: 30 },
  timerCircle: { width: 250, height: 250, borderRadius: 125, borderWidth: 8, borderColor: '#2D9CDB', justifyContent: 'center', alignItems: 'center' },
  timeText: { fontSize: 50, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 12, color: '#888', marginTop: 5, letterSpacing: 1 },
  startButton: { flexDirection: 'row', backgroundColor: '#2D9CDB', paddingVertical: 15, paddingHorizontal: 60, borderRadius: 30, alignItems: 'center' },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '80%', marginTop: 30 },
  optionItem: { alignItems: 'center' },
  optionText: { color: '#666', fontSize: 12, marginTop: 5 },
  quote: { color: '#aaa', fontStyle: 'italic', marginTop: 40, fontSize: 12 }
});