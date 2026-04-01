import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { styles } from './styles';

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Statistics</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          <StatCard label="RATE" value="92%" />
          <StatCard label="TASKS" value="128" />
          <StatCard label="FOCUS" value="45h" />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>WEEKLY PRODUCTIVITY</Text>
          <Text style={styles.chartValue}>24 tasks</Text>
          <View style={styles.mockChart} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const StatCard = ({ label, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);