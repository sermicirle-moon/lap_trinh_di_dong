import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert,ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { dbApi } from '../../services/dbAPI'; // Đảm bảo đúng đường dẫn
import ChangePasswordScreen from './ChangePasswordScreen';
export default function SettingsScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userId = await AsyncStorage.getItem('userId');
    // Giả sử bạn có api lấy thông tin user theo ID
    const res = await dbApi.getUsers(); // Hoặc viết thêm hàm getUserById
    const user = res.find(u => u.id == userId);
    setUserData(user);
    setLoading(false);
  };

const handleLogout = async () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có muốn đăng xuất không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log("Đang đăng xuất...");
              // 1. Xóa dữ liệu quan trọng
              await AsyncStorage.multiRemove(['userToken', 'userId']);
              
              // 2. Sử dụng reset để xóa lịch sử các trang trước đó
              // Nếu dùng navigate('Login') người dùng vẫn có thể bấm Back quay lại
             const rootNav = navigation.getParent()?.getParent();
            if (rootNav) {
              rootNav.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                })
              );
            } else {
              // Fallback nếu không lấy được
              navigation.replace('Login');
            }
            } catch (e) {
              console.log("Lỗi đăng xuất:", e);
              Alert.alert("Lỗi", "Không thể xóa dữ liệu phiên đăng nhập.");
            }
          } 
        },
      ]
    );
  };
    if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D9CDB" />
      </View>
    );
  }
  

  const MenuItem = ({ icon, title, onPress, color = "#333" }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Profile */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: userData?.avatar || 'https://via.placeholder.com/150' }} 
            style={styles.avatar} 
          />
          <Text style={styles.userName}>{userData?.name || 'Người dùng'}</Text>
          <Text style={styles.userEmail}>{userData?.email}</Text>
          <Text style={styles.userHome}><Ionicons name="location-outline" /> {userData?.hometown || 'Chưa cập nhật'}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <MenuItem 
            icon="person-outline" 
            title="Thông tin cá nhân" 
            color="#2D9CDB"
            onPress={() => navigation.navigate('Profile')} 
          />
          <MenuItem 
            icon="lock-closed-outline" 
            title="Đổi mật khẩu" 
            color="#F2994A"
            onPress={() => navigation.navigate('ChangePassword')} 
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Ứng dụng</Text>
          <MenuItem 
            icon="document-text-outline" 
            title="Điều khoản dịch vụ" 
            color="#27AE60" 
            onPress={() => navigation.navigate('TermsOfService')} 
          />
          <MenuItem 
            icon="shield-checkmark-outline" 
            title="Quyền riêng tư" 
            color="#9B51E0" 
            onPress={() => navigation.navigate('PrivacyPolicy')} 
          />
          <MenuItem 
            icon="log-out-outline" 
            title="Đăng xuất" 
            color="#EB5757" 
            onPress={handleLogout} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }, // Thêm style này
  profileHeader: { alignItems: 'center', padding: 30, backgroundColor: '#FFF', marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, borderWidth: 3, borderColor: '#2D9CDB' }, // Đã sửa lỗi chính tả borderWidth
  userName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 14, color: '#888', marginTop: 5 },
  userHome: { fontSize: 14, color: '#555', marginTop: 5 },
  menuSection: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#AAA', marginBottom: 10, textTransform: 'uppercase' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { fontSize: 16, color: '#333', fontWeight: '500' },
});