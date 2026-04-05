import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TaskScreen({ navigation }) {
  return (
    // Dùng SafeAreaView để không bị lẹm vào "tai thỏ" (notch)
    <SafeAreaView style={styles.container}>
      
      {/* HEADER TÙY CHỈNH CHO MÀN HÌNH TASK */}
      <View style={styles.header}>
        {/* Nút Hamburger mở Sidebar */}
        <TouchableOpacity
          onPress={() => {
            const parentNav = navigation.getParent ? navigation.getParent() : null;
            if (parentNav && parentNav.openDrawer) parentNav.openDrawer();
          }}
          style={styles.iconBtn}
        >
          <Ionicons name="menu-outline" size={28} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Hôm nay</Text>
        
        {/* Nút dấu 3 chấm hoặc cài đặt bên góc phải (nếu cần) */}
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Nội dung danh sách task ở đây... */}
      <View style={styles.content}>
        <Text>Danh sách công việc của bạn...</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  iconBtn: { padding: 5 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});