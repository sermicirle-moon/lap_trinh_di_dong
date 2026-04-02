import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer'; // THÊM DÒNG NÀY
import { Ionicons } from '@expo/vector-icons';

// Import màn hình
import MatrixScreen from '../Screens/MatrixScreen/MatrixScreen';
import FocusScreen from '../Screens/FocusScreen/FocusScreen';
import StatsScreen from '../Screens/StatsScreen/StatsScreen';
import TaskScreen from '../Screens/TaskScreen/TaskScreen';

// Import Sidebar tự custom của bạn
import CustomDrawer from '../Components/CustomDrawer';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator(); // THÊM DÒNG NÀY

// --- PHẦN 1: GÓI GỌN THANH BOTTOM TAB VÀ MODAL VÀO MỘT FUNCTION ---
function BottomTabGroup() {
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Task') iconName = focused ? 'checkmark-done' : 'checkmark-done-outline';
            else if (route.name === 'Focus') iconName = focused ? 'timer' : 'timer-outline';
            else if (route.name === 'Stats') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            else if (route.name === 'More') iconName = focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2D9CDB',
          tabBarInactiveTintColor: '#A0A0A0',
          tabBarStyle: { paddingBottom: 5, height: 60 },
        })}
      >
        <Tab.Screen name="Task" component={TaskScreen} options={{ title: 'Công việc' }} />
        <Tab.Screen name="Focus" component={FocusScreen} options={{ title: 'Tập trung' }} />
        <Tab.Screen name="Stats" component={StatsScreen} options={{ title: 'Thống kê' }} />

        <Tab.Screen 
          name="More" 
          component={View} 
          options={{ title: 'Thêm' }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault(); 
              setMoreMenuVisible(true); 
            },
          })}
        />
      </Tab.Navigator>

      {/* Modal hiện bảng Menu (Giữ nguyên của bạn) */}
      <Modal visible={isMoreMenuVisible} transparent={true} animationType="slide" onRequestClose={() => setMoreMenuVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMoreMenuVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.menuContainer}>
            <View style={styles.dragHandle} />
            <Text style={styles.menuHeader}>Chức năng khác</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => setMoreMenuVisible(false)}>
              <Ionicons name="leaf-outline" size={24} color="#2D9CDB" />
              <Text style={styles.menuText}>Thói quen (Habits)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setMoreMenuVisible(false)}>
              <Ionicons name="folder-outline" size={24} color="#2D9CDB" />
              <Text style={styles.menuText}>Quản lý Dự án</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setMoreMenuVisible(false)}>
              <Ionicons name="settings-outline" size={24} color="#2D9CDB" />
              <Text style={styles.menuText}>Cài đặt hệ thống</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// --- PHẦN 2: LẤY DRAWER BỌC RA NGOÀI CÙNG ---
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />} // Gắn giao diện Sidebar của bạn vào
        screenOptions={{
          headerShown: false, // Ẩn header mặc định
          swipeEnabled: false, // Tắt vuốt mở Sidebar ở mọi nơi (chỉ cho phép mở bằng nút Hamburger ở TaskScreen)
          drawerStyle: { width: '85%' },
        }}
      >
        {/* Đưa toàn bộ cụm BottomTab ở trên vào làm màn hình của Drawer */}
        <Drawer.Screen name="MainTabs" component={BottomTabGroup} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// --- PHẦN 3: STYLES CHO MODAL ---
const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  menuContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  dragHandle: { width: 40, height: 5, backgroundColor: '#D1D5DB', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  menuHeader: { fontSize: 14, fontWeight: 'bold', color: '#888', textTransform: 'uppercase', marginBottom: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuText: { fontSize: 16, color: '#333', marginLeft: 15 }
});