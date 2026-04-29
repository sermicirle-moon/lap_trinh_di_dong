import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ListManager from './ListManagement/ListManager';

export default function CustomDrawer({ navigation }) {
  const insets = useSafeAreaInsets();

  const handleSelectList = (list) => {
    navigation.navigate('MainTabs', {
      screen: 'Task',
      params: {
        listTitle: list.title,
        listId: list.id,
        tasks: list.tasks || [],
      },
    });
    navigation.closeDrawer();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Nâng Suất Cá Nhân</Text>
        <Text style={styles.appSubtitle}>Quản lý công việc & thói quen</Text>
      </View>

      {/* LIST MANAGER */}
      <ListManager
        onSelectList={handleSelectList}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  appSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
});