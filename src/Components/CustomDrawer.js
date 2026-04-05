import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Hoặc MaterialCommunityIcons tùy bạn đang dùng

const CustomDrawer = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  // Hàm hỗ trợ render từng dòng List
  const renderListItem = (iconName, title, count, color = "#666", isFolder = false, onPress = null) => (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
      <View style={styles.listLeft}>
        <Ionicons name={iconName} size={22} color={color} style={styles.listIcon} />
        <Text style={[styles.listTitle, isFolder && { fontWeight: 'bold' }]}>{title}</Text>
      </View>
      <View style={styles.listRight}>
        {count && <Text style={styles.listCount}>{count}</Text>}
        {isFolder && <Ionicons name="chevron-down-outline" size={16} color="#999" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* 1. Phần Header: Profile & Icons */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>JB</Text>
          </View>
          <Text style={styles.userName}>Joe Brown</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity><Ionicons name="search-outline" size={24} color="#FFF" style={styles.iconSpaced}/></TouchableOpacity>
          <TouchableOpacity><Ionicons name="notifications-outline" size={24} color="#FFF" style={styles.iconSpaced}/></TouchableOpacity>
          <TouchableOpacity><Ionicons name="settings-outline" size={24} color="#FFF" /></TouchableOpacity>
        </View>
      </View>

      {/* 2. Danh sách cuộn được */}
      <ScrollView style={styles.scrollArea}>
        {/* Smart Lists */}
        {renderListItem("calendar", "Today", "12", "#FF8A65")}
        {renderListItem("sunny", "Tomorrow", "2", "#FFB74D")}
        {renderListItem("calendar-outline", "Next 7 Days", "14", "#FFD54F")}
        {renderListItem("mail-unread", "Inbox", "13", "#FF8A65")}
        
        <View style={styles.divider} />

        {/* Folders & Lists */}
        {renderListItem("pricetag", "Tags", null, "#4FC3F7")}
        {renderListItem("folder", "Maths (2nd Year)", "4", "#666", true)}
        {renderListItem("folder", "Side Hustle", "6", "#666", true)}
        {renderListItem("folder", "Admin", "4", "#666", true)}
        
        {/* Giả lập list con bên trong Admin */}
        <View style={styles.subListContainer}>
          {renderListItem("list", "Housework", "1", "#999")}
          {renderListItem("list", "Shopping List", "3", "#999")}
        </View>

        {renderListItem("home", "Personal", "5", "#E57373")}
        {renderListItem("briefcase", "Work", "3", "#64B5F6", true)}
      </ScrollView>

      {/* 3. Phần Footer: Add List */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.addListBtn}>
          <Ionicons name="add" size={24} color="#666" />
          <Text style={styles.addListText}>Add List</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  // Header màu xanh của TickTick
  header: { 
    backgroundColor: '#5C7CFA', 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' 
  },
  avatarText: { fontWeight: 'bold', color: '#555' },
  userName: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  headerIcons: { flexDirection: 'row' },
  iconSpaced: { marginRight: 15 },
  
  // Danh sách
  scrollArea: { flex: 1, paddingTop: 10 },
  listItem: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingVertical: 12, paddingHorizontal: 20 
  },
  listLeft: { flexDirection: 'row', alignItems: 'center' },
  listIcon: { marginRight: 15 },
  listTitle: { fontSize: 16, color: '#333' },
  listRight: { flexDirection: 'row', alignItems: 'center' },
  listCount: { fontSize: 14, color: '#999', marginRight: 5 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10, marginHorizontal: 20 },
  subListContainer: { paddingLeft: 30 }, // Thụt lề cho list con
  
  // Footer
  footer: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F0F0F0' 
  },
  addListBtn: { flexDirection: 'row', alignItems: 'center' },
  addListText: { fontSize: 16, color: '#666', marginLeft: 10 },
});

export default CustomDrawer;