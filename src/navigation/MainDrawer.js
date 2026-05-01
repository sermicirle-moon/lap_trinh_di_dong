import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import MatrixScreen from '../Screens/MatrixScreen/MatrixScreen';
import FocusScreen from '../Screens/FocusScreen/FocusScreen';
import StatsScreen from '../Screens/StatsScreen/StatsScreen';
import TaskScreen from '../Screens/TaskScreen/TaskScreen';
import HabitsScreen from '../Screens/HabitsScreen/HabitsScreen';
import SettingsScreen from '../Screens/SettingsScreen/SettingsScreen';
// 🚀 IMPORT CALENDAR SCREEN VÀO ĐÂY
import CalendarScreen from '../Screens/CalendarScreen/CalendarScreen'; 
import CustomDrawer from '../Components/CustomDrawer';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MoreMenuScreen({ navigation }) {
  return (
    <View style={styles.menuScreen}>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Habits')}>
        <Ionicons name="leaf-outline" size={28} color="#2D9CDB" />
        <Text style={styles.menuText}>Thói quen (Habits)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Matrix')}>
        <Ionicons name="folder-outline" size={28} color="#2D9CDB" />
        <Text style={styles.menuText}>Sắp xếp (Matrix)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
        <Ionicons name="settings-outline" size={28} color="#2D9CDB" />
        <Text style={styles.menuText}>Cài đặt hệ thống</Text>
      </TouchableOpacity>
    </View>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerTitle: 'Thêm' }}>
      <Stack.Screen name="MoreMenu" component={MoreMenuScreen} options={{ title: 'Chức năng khác' }} />
      <Stack.Screen name="Habits" component={HabitsScreen} options={{ title: 'Thói quen' }} />
      <Stack.Screen name="Matrix" component={MatrixScreen} options={{ title: 'Ma trận Eisenhower' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Cài đặt' }} />
    </Stack.Navigator>
  );
}

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          // 🚀 THÊM ICON CHO CALENDAR VÀ CẬP NHẬT CÁC TAB
          if (route.name === 'Task') iconName = focused ? 'checkmark-done' : 'checkmark-done-outline';
          else if (route.name === 'Calendar') iconName = focused ? 'calendar' : 'calendar-outline'; // Tab mới
          else if (route.name === 'Focus') iconName = focused ? 'timer' : 'timer-outline';
          // Tạm thời đưa Stats vào màn hình More để nhường chỗ cho Calendar nếu thanh tab bị chật (hoặc cứ để 5 tab tùy bạn)
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
      {/* 🚀 THÊM TAB CALENDAR VÀO ĐÂY (Nên để thứ 2 hoặc thứ 3) */}
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Lịch' }} />
      <Tab.Screen name="Focus" component={FocusScreen} options={{ title: 'Tập trung' }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ title: 'Thống kê' }} />
      <Tab.Screen name="More" component={MoreStack} options={{ title: 'Thêm' }} />
    </Tab.Navigator>
  );
}

export default function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
        drawerStyle: { width: '85%' },
      }}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabs} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  menuScreen: {
    flex: 1,
    backgroundColor: '#FAFBFF',
    padding: 20,
    paddingTop: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 20,
  },
});