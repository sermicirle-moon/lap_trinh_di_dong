import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { styles } from './styles';

export default function MatrixScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Eisenhower Matrix</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <MatrixBox title="Do First" subtitle="Urgent & Important" color="#FF4B4B" />
        <MatrixBox title="Schedule" subtitle="Important, Not Urgent" color="#2D9CDB" />
        <MatrixBox title="Delegate" subtitle="Urgent, Not Important" color="#F2C94C" />
        <MatrixBox title="Eliminate" subtitle="Not Urgent, Not Important" color="#9E9E9E" />
      </ScrollView>
    </SafeAreaView>
  );
}

const MatrixBox = ({ title, subtitle, color }) => (
  <View style={[styles.box, { borderLeftColor: color }]}>
    <View style={styles.boxHeader}>
      <Text style={[styles.boxTitle, { color }]}>{title}</Text>
      <Text style={[styles.boxSubtitle, { color }]}>{subtitle}</Text>
    </View>
    <View style={styles.taskItem}>
      <View style={styles.radio} />
      <Text style={styles.taskText}>Sample Task Example</Text>
    </View>
  </View>
);