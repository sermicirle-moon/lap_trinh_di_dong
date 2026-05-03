import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dbApi } from '../../services/dbAPI';

const FocusStatsScreen = ({ onBack }) => {
  const [period, setPeriod] = useState('week');
  const [stats, setStats] = useState({
    totalSeconds: 0,
    dailySeconds: 0,
    sessionsCount: 0,
    pausesCount: 0,
    categorySeconds: { Work: 0, Study: 0, Personal: 0 },
    recentSessions: []
  });

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    const sessions = await dbApi.getFocusSessions();
    const now = new Date();
    let filtered = [];

    if (period === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = sessions.filter(s => new Date(s.startTime) >= weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = sessions.filter(s => new Date(s.startTime) >= monthAgo);
    } else {
      filtered = sessions;
    }

    const totalSec = filtered.reduce((sum, s) => sum + s.duration, 0);
    const dailySec = filtered.length ? totalSec / filtered.length : 0;
    const pauses = filtered.reduce((sum, s) => sum + (s.pausesCount || 0), 0);
    const categorySec = { Work: 0, Study: 0, Personal: 0 };
    filtered.forEach(s => { if (categorySec[s.category] !== undefined) categorySec[s.category] += s.duration; });
    const recent = [...filtered].sort((a,b) => new Date(b.startTime) - new Date(a.startTime)).slice(0,5);

    setStats({
      totalSeconds: totalSec,
      dailySeconds: dailySec,
      sessionsCount: filtered.length,
      pausesCount: pauses,
      categorySeconds: categorySec,
      recentSessions: recent
    });
  };

  const formatDuration = (sec) => {
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor(sec / 60);
    const remainSec = sec % 60;
    if (hours > 0) {
        if (mins === 0 && remainSec === 0) return `${hours}h`;
        if (remainSec === 0) return `${hours}h ${mins}m`;
        return `${hours}h ${mins}m ${remainSec}s`;
    }
    if (mins === 0) return `${remainSec}s`;
    if (remainSec === 0) return `${mins}m`;
    return `${mins}m ${remainSec}s`;
  };

  // Phần trăm dựa trên 120 phút = 7200 giây
  const getPercent = (sec) => {
    const percent = (sec / 7200) * 100;
    return percent.toFixed(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Focus Stats</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.tabContainer}>
        {['day', 'week', 'month'].map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, period === tab && styles.activeTab]} onPress={() => setPeriod(tab)}>
            <Text style={[styles.tabText, period === tab && styles.activeTabText]}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL FOCUSED TIME</Text>
            <Text style={styles.statValue}>{formatDuration(stats.totalSeconds)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>SESSIONS</Text>
            <Text style={styles.statValue}>{stats.sessionsCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PAUSES</Text>
            <Text style={styles.statValue}>{stats.pausesCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>DAILY RATE</Text>
            <Text style={styles.statValue}>{(stats.dailySeconds/1).toFixed(2)} s</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Category Distribution (based on 120 min goal)</Text>
        {Object.entries(stats.categorySeconds).map(([cat, sec]) => (
          <View key={cat} style={styles.categoryRow}>
            <Text style={styles.categoryName}>{cat}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(100, getPercent(sec))}%`, backgroundColor: cat === 'Work' ? '#2D9CDB' : cat === 'Study' ? '#F2994A' : '#27AE60' }]} />
            </View>
            <Text style={styles.percent}>{getPercent(sec)}%</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        {stats.recentSessions.map(s => (
          <View key={s.id} style={styles.recentItem}>
            <View>
              <Text style={styles.recentTitle}>{s.category}</Text>
              <Text style={styles.recentDate}>{new Date(s.startTime).toLocaleString()}</Text>
            </View>
            <Text style={styles.recentDuration}>{formatDuration(s.duration)}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  backButton: { padding: 5 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#E3F2FD', borderRadius: 10, margin: 20, padding: 5 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#FFF' },
  tabText: { color: '#888' }, activeTabText: { color: '#2D9CDB', fontWeight: 'bold' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  statCard: { width: '48%', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 15, alignItems: 'center', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  statLabel: { fontSize: 12, color: '#888' }, statValue: { fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', margin: 20, marginBottom: 10 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  categoryName: { width: 80, fontSize: 14, fontWeight: '500' },
  progressBar: { flex: 1, height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, marginHorizontal: 10 },
  progressFill: { height: 8, borderRadius: 4 },
  percent: { width: 45, textAlign: 'right', fontSize: 14, color: '#666' },
  recentItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 15, marginHorizontal: 20, marginBottom: 10, borderRadius: 12 },
  recentTitle: { fontWeight: 'bold' }, recentDate: { fontSize: 12, color: '#888', marginTop: 4 }, recentDuration: { fontWeight: 'bold', color: '#2D9CDB' }
});

export default FocusStatsScreen;