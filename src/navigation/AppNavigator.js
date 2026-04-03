import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native'; // <-- THÊM useNavigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // <-- THÊM STACK
import { Ionicons } from '@expo/vector-icons';

// Import màn hình
import MatrixScreen from '../Screens/MatrixScreen/MatrixScreen';
import FocusScreen from '../Screens/FocusScreen/FocusScreen';
import StatsScreen from '../Screens/StatsScreen/StatsScreen';
import TaskScreen from '../Screens/TaskScreen/TaskScreen';
import CustomDrawer from '../Components/CustomDrawer';

// Import các màn hình "Chức năng thêm" (Ví dụ)
import HabitsScreen from '../Screens/HabitsScreen/HabitsScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator(); // Khởi tạo Stack

// --- PHẦN 1: BOTTOM TAB VÀ MODAL ---
function BottomTabGroup() {
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const navigation = useNavigation(); // <-- Khởi tạo công cụ điều hướng

  // Hàm xử lý chung khi ấn vào một mục trong Modal
  const handleNavigate = (screenName) => {
    setMoreMenuVisible(false); // 1. Đóng Modal lại
    navigation.navigate(screenName); // 2. Lệnh chuyển sang trang mới
  };

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

      {/* BẢNG MODAL */}
      <Modal visible={isMoreMenuVisible} transparent={true} animationType="slide" onRequestClose={() => setMoreMenuVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMoreMenuVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.menuContainer}>
            <View style={styles.dragHandle} />
            <Text style={styles.menuHeader}>Chức năng khác</Text>
            
            {/* THAY ĐỔI Ở ĐÂY: Gắn sự kiện handleNavigate cùng tên màn hình đích */}
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('Habits')}>
              <Ionicons name="leaf-outline" size={24} color="#2D9CDB" />
              <Text style={styles.menuText}>Thói quen (Habits)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => setMoreMenuVisible(false)}>
              <Ionicons name="folder-outline" size={24} color="#2D9CDB" />
              <Text style={styles.menuText}>Quản lý Dự án</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('Settings')}>
              <Ionicons name="settings-outline" size={24} color="#2D9CDB" />
              <Text style={styles.menuText}>Cài đặt hệ thống</Text>
            </TouchableOpacity>
            
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// --- PHẦN 2: DRAWER BỌC BOTTOM TAB ---
function DrawerGroup() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false, swipeEnabled: false, drawerStyle: { width: '85%' } }}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabGroup} />
    </Drawer.Navigator>
  );
}

// --- PHẦN 3: STACK BỌC TẤT CẢ (Lớp ngoài cùng) ---
// Lý do: Các trang phụ như Cài đặt, Thói quen phải mở toàn màn hình, che mất cả thanh Bottom Tab.
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Màn hình chính (chứa Drawer và Tabs) */}
        <Stack.Screen name="Root" component={DrawerGroup} />
        
        {/* Các màn hình phụ bạn muốn điều hướng tới từ Modal */}
        <Stack.Screen name="Habits" component={HabitsScreen} />
        
      </Stack.Navigator>
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