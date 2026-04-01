import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles'; // Dòng này sẽ tự động tìm file styles.js ở phía trên

export default function FocusScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={24} color="#333" />
        <Text style={styles.headerTitle}>Focus</Text>
        <Ionicons name="bar-chart-outline" size={24} color="#333" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Deep Work</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>■ Design Sprint</Text>
        </View>

        <View style={styles.timerContainer}>
          <View style={styles.timerCircle}>
            <Text style={styles.timeText}>25:00</Text>
            <Text style={styles.subText}>STAY FOCUSED</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton}>
          <Ionicons name="play" size={20} color="#fff" />
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>

        <View style={styles.optionsContainer}>
          <View style={styles.optionItem}>
            <Ionicons name="time-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Duration</Text>
          </View>
          <View style={styles.optionItem}>
            <Ionicons name="musical-notes-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Ambient</Text>
          </View>
          <View style={styles.optionItem}>
            <Ionicons name="cafe-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Break</Text>
          </View>
        </View>

        <Text style={styles.quote}>"Focus on being productive instead of busy."</Text>
      </View>
    </SafeAreaView>
  );
}