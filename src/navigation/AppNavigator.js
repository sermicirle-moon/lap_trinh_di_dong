import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import từ các thư mục mới
import MatrixScreen from '../Screens/MatrixScreen/MatrixScreen';
import FocusScreen from '../Screens/FocusScreen/FocusScreen';
import StatsScreen from '../Screens/StatsScreen/StatsScreen';
import HabitsScreen from '../Screens/HabitsScreen/HabitsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Matrix') iconName = focused ? 'grid' : 'grid-outline';
            else if (route.name === 'Focus') iconName = focused ? 'timer' : 'timer-outline';
            else if (route.name === 'Stats') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            else if (route.name === 'Habits') iconName = focused ? 'leaf' : 'leaf-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2D9CDB',
          tabBarInactiveTintColor: '#A0A0A0',
          tabBarStyle: { paddingBottom: 5, height: 60 },
        })}
      >
        <Tab.Screen name="Matrix" component={MatrixScreen} />
        <Tab.Screen name="Focus" component={FocusScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Habits" component={HabitsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}