import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

export default function HabitsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="menu-outline" size={28} color="#333" />
        <Text style={styles.headerTitle}>Habits</Text>
        <Ionicons name="search-outline" size={24} color="#333" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.calendarStrip}>
          {['12', '13', '14', '15'].map(day => (
            <View key={day} style={styles.dayItem}><Text style={styles.dayText}>{day}</Text></View>
          ))}
          <View style={[styles.dayItem, styles.activeDay]}>
            <Text style={styles.activeDayText}>16</Text>
          </View>
          <View style={styles.dayItem}><Text style={styles.dayText}>17</Text></View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>

        <HabitCard icon="water-outline" color="#2D9CDB" title="Drink Water" streak="15 days streak" checked={true} />
        <HabitCard icon="barbell-outline" color="#F2994A" title="Exercise" streak="8 days streak" checked={true} />
        <HabitCard icon="leaf-outline" color="#9B51E0" title="Meditate" streak="4 days streak" checked={false} />
        <HabitCard icon="book-outline" color="#27AE60" title="Read Book" streak="21 days streak" checked={false} />

        <Text style={[styles.sectionTitle, { marginTop: 30, marginBottom: 15 }]}>Habit Statistics</Text>
        <View style={styles.statsCard}>
          <View style={styles.heatmap}>
             {[...Array(21)].map((_, i) => (
                <View key={i} style={[styles.heatBox, { opacity: Math.random() * 0.8 + 0.2 }]} />
             ))}
          </View>
          <Text style={styles.completionRate}>Completion Rate: 84%</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Component con
const HabitCard = ({ icon, color, title, streak, checked }) => (
  <View style={styles.card}>
    <View style={[styles.iconBg, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardStreak}>{streak}</Text>
    </View>
    <View style={[styles.checkbox, checked && styles.checkedBox]}>
      {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
    </View>
  </View>
);