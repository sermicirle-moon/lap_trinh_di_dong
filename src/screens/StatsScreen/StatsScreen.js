import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

export default function StatsScreen() {
  const [activeTab, setActiveTab] = useState('week');

  const data = {
    week: {
      rate: '92%', tasks: '128', focus: '45h', chartTotal: '24 tasks',
      chartBars: [
        { day: 'T2', value: 40, taskCount: 8 }, { day: 'T3', value: 70, taskCount: 14 }, 
        { day: 'T4', value: 30, taskCount: 6 }, { day: 'T5', value: 90, taskCount: 18 }, 
        { day: 'T6', value: 60, taskCount: 12 }, { day: 'T7', value: 100, taskCount: 20 }, 
        { day: 'CN', value: 50, taskCount: 10 }
      ]
    },
    month: {
      rate: '88%', tasks: '452', focus: '180h', chartTotal: '112 tasks',
      chartBars: [
        { day: 'Tuần 1', value: 80, taskCount: 25 }, { day: 'Tuần 2', value: 60, taskCount: 18 }, 
        { day: 'Tuần 3', value: 90, taskCount: 30 }, { day: 'Tuần 4', value: 100, taskCount: 39 }
      ]
    }
  };

  const currentData = data[activeTab];

  const StatCard = ({ label, value }) => (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Thống kê</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* TABS */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'week' && styles.activeTab]} 
            onPress={() => setActiveTab('week')}
          >
            <Text style={[styles.tabText, activeTab === 'week' && styles.activeTabText]}>Tuần này</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'month' && styles.activeTab]} 
            onPress={() => setActiveTab('month')}
          >
            <Text style={[styles.tabText, activeTab === 'month' && styles.activeTabText]}>Tháng này</Text>
          </TouchableOpacity>
        </View>

        {/* 3 THẺ CHỈ SỐ GỐC */}
        <View style={styles.row}>
          <StatCard label="TỶ LỆ HT" value={currentData.rate} />
          <StatCard label="CÔNG VIỆC" value={currentData.tasks} />
          <StatCard label="GIỜ FOCUS" value={currentData.focus} />
        </View>

        {/* BIỂU ĐỒ BÁO CÁO GỐC (Có thêm text số lượng) */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>NĂNG SUẤT</Text>
          <Text style={styles.chartValue}>{currentData.chartTotal}</Text>
          
          <View style={styles.chartContainer}>
            <View style={styles.yAxis}>
              <Text style={styles.yAxisText}>100</Text>
              <Text style={styles.yAxisText}>50</Text>
              <Text style={styles.yAxisText}>0</Text>
            </View>

            <View style={styles.chartContent}>
              <View style={styles.gridLineContainer}>
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />
              </View>

              {currentData.chartBars.map((item, index) => (
                <View key={index} style={styles.barColumn}>
                  
                  {/* --- MỚI: Dòng chữ hiển thị số lượng task nằm ngay trên cột nền --- */}
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: item.value >= 100 ? '#2D9CDB' : '#A0A0A0', marginBottom: 4 }}>
                    {item.taskCount}
                  </Text>
                  
                  {/* Cột nền xám (Track) Gốc */}
                  <View style={styles.barTrack}>
                    {/* Cột màu hiển thị giá trị Gốc */}
                    <View style={[
                      styles.bar, 
                      { 
                        height: `${item.value}%`, 
                        backgroundColor: item.value >= 100 ? '#2D9CDB' : '#7BC6F2' 
                      }
                    ]} />
                  </View>
                  
                  <Text style={[styles.dayLabel, item.value >= 100 && styles.activeDayLabel]}>
                    {item.day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* HOẠT ĐỘNG GẦN ĐÂY: Khôi phục 100% */}
        <Text style={styles.recentTitle}>Hoạt động gần đây</Text>
        
        <View style={styles.activityItem}>
          <View style={[styles.activityIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="checkmark-done-outline" size={20} color="#2D9CDB" />
          </View>
          <Text style={styles.activityText}>Hoàn thành: Lên kế hoạch</Text>
          <Text style={styles.activityTime}>10 phút trước</Text>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.activityIcon, { backgroundColor: '#FFECEC' }]}>
            <Ionicons name="timer-outline" size={20} color="#FF4B4B" />
          </View>
          <Text style={styles.activityText}>Phiên Focus: 25 phút</Text>
          <Text style={styles.activityTime}>2 giờ trước</Text>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.activityIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="leaf-outline" size={20} color="#27AE60" />
          </View>
          <Text style={styles.activityText}>Thói quen: Uống nước</Text>
          <Text style={styles.activityTime}>3 giờ trước</Text>
        </View>

        <View style={{height: 50}} />
      </ScrollView>
    </SafeAreaView>
  );
}