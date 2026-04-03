import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// LINK GITHUB CỦA BẠN CHỨA DỮ LIỆU
const GITHUB_URL = 'https://raw.githubusercontent.com/sermicirle-moon/nang-suat-ca-nhan-api/master/data.json';

// 1. DỮ LIỆU MẶC ĐỊNH (Smart Lists) - Dùng để lấy Icon và Title, còn Task sẽ lấy từ GitHub
const smartLists = [
  { id: 'inbox', icon: 'mail', title: 'Hộp thư đến', color: '#2D9CDB' },
  { id: 'today', icon: 'calendar', title: 'Hôm nay', color: '#27AE60' },
  { id: 'next7', icon: 'calendar-outline', title: '7 ngày tới', color: '#F2994A' },
  { id: 'done', icon: 'checkmark-done-circle', title: 'Đã hoàn thành', color: '#9B51E0' },
  { id: 'wontdo', icon: 'close-circle', title: 'Sẽ không làm', color: '#EB5757' },
  { id: 'trash', icon: 'trash', title: 'Thùng rác', color: '#828282' },
];

const CustomDrawer = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  // 2. QUẢN LÝ STATE
  const [folders, setFolders] = useState([]); // Khởi tạo mảng Thư mục
  const [smartListData, setSmartListData] = useState({}); // MỚI: State chứa data của các list mặc định
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState([{ id: 't1', title: 'Ưu tiên cao', color: '#EB5757' }]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // 3. TỰ ĐỘNG FETCH DỮ LIỆU TỪ GITHUB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GITHUB_URL);
        const data = await response.json();
        
        // Tách dữ liệu làm 2 phần dựa theo cấu trúc JSON mới
        setFolders(data.folders || []); 
        setSmartListData(data.smartLists || {}); 

      } catch (error) {
        console.error("Lỗi tải dữ liệu GitHub:", error);
      } finally {
        setIsLoading(false); // Tắt biểu tượng xoay xoay
      }
    };

    fetchData();
  }, []);

  // 4. LOGIC CHUYỂN TRANG KHI BẤM VÀO LIST
  const handleListPress = (list) => {
    navigation.navigate('MainTabs', {
      screen: 'Task',
      params: { 
        listTitle: list.title,
        tasks: list.tasks || [] // Gửi mảng task sang
      }
    });
    navigation.closeDrawer();
  };

  // LOGIC THÊM LIST (Chạy offline tạm thời trên máy)
  const addNewListToFolder = (folderId) => {
    const newFolders = folders.map(f => {
      if (f.id === folderId && f.isFolder) {
        return { 
          ...f, 
          lists: [...f.lists, { id: Date.now().toString(), title: 'List mới', tasks: [], color: '#2D9CDB' }] 
        };
      }
      return f;
    });
    setFolders(newFolders);
    setShowAddMenu(false);
  };

  const addNewTag = () => {
    setTags([...tags, { id: Date.now().toString(), title: 'Tag mới', color: '#2D9CDB' }]);
    setShowAddMenu(false);
  };

  // HÀM RENDER ITEM
  const renderItem = (icon, title, count, color, onPress, isSub = false) => (
    <TouchableOpacity key={title} style={[styles.item, isSub && { paddingLeft: 45 }]} onPress={onPress}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={[styles.itemText, isSub && { fontSize: 14, color: '#4F4F4F' }]}>{title}</Text>
      </View>
      {(count && count !== '0') ? <Text style={styles.itemCount}>{count}</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
         <Text style={styles.userName}>Năng Suất Cá Nhân</Text>
      </View>

      <ScrollView style={styles.content}>
        
        {/* ============================== */}
        {/* 1. RENDER SMART LISTS (MẶC ĐỊNH) */}
        {/* ============================== */}
        <Text style={styles.sectionTitle}>Mặc định</Text>
        {smartLists.map(l => {
          // Lấy mảng tasks từ JSON khớp với id (inbox, today...)
          const tasks = smartListData[l.id] || []; 
          // Đếm số lượng, nếu có thì in ra, không thì để rỗng
          const count = tasks.length > 0 ? tasks.length.toString() : ''; 

          return renderItem(
            l.icon, 
            l.title, 
            count, 
            l.color, 
            () => handleListPress({ title: l.title, tasks: tasks }) // Gói data gửi sang TaskScreen
          );
        })}

        <View style={styles.divider} />

        {/* ============================== */}
        {/* 2. RENDER FOLDERS & LISTS      */}
        {/* ============================== */}
        <Text style={styles.sectionTitle}>Danh sách & Thư mục</Text>
        
        {isLoading ? (
          <ActivityIndicator size="small" color="#2D9CDB" style={{ marginTop: 20 }} />
        ) : (
          folders.map(item => {
            if (item.isFolder) {
              return (
                <View key={item.id}>
                  {renderItem('folder-open', item.title, '', '#4F4F4F', () => {}, false)}
                  {item.lists && item.lists.map(list => {
                    const taskCount = list.tasks ? list.tasks.length.toString() : '0';
                    return renderItem('list-outline', list.title, taskCount, list.color || '#828282', () => handleListPress(list), true);
                  })}
                </View>
              );
            } else {
              const taskCount = item.tasks ? item.tasks.length.toString() : '0';
              return renderItem('list-outline', item.title, taskCount, item.color || '#828282', () => handleListPress(item), false);
            }
          })
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Thẻ (Tags)</Text>
        {tags.map(t => renderItem('pricetag-outline', t.title, '', t.color))}
      </ScrollView>

      {/* Footer Nút Cộng */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddMenu(true)}>
          <Ionicons name="add-circle" size={24} color="#2D9CDB" />
          <Text style={styles.addBtnText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={showAddMenu} transparent animationType="fade">
        <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowAddMenu(false)}>
          <View style={styles.menuPopUp}>
            <TouchableOpacity style={styles.menuOption} onPress={() => addNewListToFolder('f1')}>
              <Ionicons name="list" size={20} color="#333" />
              <Text style={styles.menuOptionText}>Thêm Danh sách (vào Dự án)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuOption} onPress={addNewTag}>
              <Ionicons name="pricetag" size={20} color="#333" />
              <Text style={styles.menuOptionText}>Thêm Thẻ mới</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { padding: 20, backgroundColor: '#2D9CDB' },
  userName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1 },
  sectionTitle: { fontSize: 12, color: '#828282', fontWeight: 'bold', marginLeft: 20, marginTop: 15, marginBottom: 5, textTransform: 'uppercase' },
  item: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemText: { marginLeft: 15, fontSize: 15, color: '#333' },
  itemCount: { fontSize: 12, color: '#828282' },
  divider: { height: 1, backgroundColor: '#F2F2F2', marginVertical: 10 },
  footer: { borderTopWidth: 1, borderTopColor: '#F2F2F2', padding: 15 },
  addBtn: { flexDirection: 'row', alignItems: 'center' },
  addBtnText: { marginLeft: 10, color: '#2D9CDB', fontWeight: 'bold' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  menuPopUp: { backgroundColor: '#FFF', borderRadius: 12, width: '80%', padding: 10 },
  menuOption: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  menuOptionText: { marginLeft: 15, fontSize: 16 }
});

export default CustomDrawer;