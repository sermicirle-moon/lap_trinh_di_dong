import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, Alert, Image, ScrollView, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; // 1. Import thư viện chọn ảnh
import { dbApi } from '../../services/dbAPI'; 

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hometown, setHometown] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (!id) return;
      setUserId(id);
      const user = await dbApi.getUserById(id); // Giả sử bạn có hàm này trong dbApi
      
      if (user) {
        setName(user.name || '');
        setEmail(user.email || ''); // Vẫn lấy email để hiển thị
        setPhone(user.phone || '');
        setHometown(user.hometown || '');
        setAvatar(user.avatar || 'https://ui-avatars.com/api/?name=User&background=random');
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // 2. Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Giảm chất lượng để chuỗi base64 không quá dài cho DB
      base64: true, // Lưu ảnh dưới dạng chuỗi nếu db là JSON
    });

    if (!result.canceled) {
      // Lưu dưới dạng data uri để hiển thị và lưu vào json-server
      setAvatar(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Họ tên không được để trống!");
      return;
    }
    try {
      setLoading(true);
      // Chỉ gửi những trường được phép sửa (không gửi email)
      await dbApi.updateUserProfile(userId, {
        name,
        phone,
        hometown,
        avatar
      });
      Alert.alert("Thành công", "Đã lưu thay đổi vào hệ thống!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu vào Database. Kiểm tra lại kết nối Server.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{flex:1}} size="large" color="#2D9CDB" />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
            <Ionicons name="camera" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email (Tài khoản)</Text>
          <TextInput 
            style={[styles.input, styles.disabledInput]} 
            value={email} 
            editable={false} // KHÔNG CHO SỬA
            selectTextOnFocus={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quê quán</Text>
          <TextInput style={styles.input} value={hometown} onChangeText={setHometown} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  saveText: { color: '#2D9CDB', fontWeight: 'bold', fontSize: 16 },
  content: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F0F0F0' },
  cameraIcon: { position: 'absolute', bottom: 0, right: '35%', backgroundColor: '#2D9CDB', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  input: { borderBottomWidth: 1, borderBottomColor: '#CCC', paddingVertical: 8, fontSize: 16, color: '#333' },
  disabledInput: { color: '#AAA', borderBottomColor: '#EEE' }
});