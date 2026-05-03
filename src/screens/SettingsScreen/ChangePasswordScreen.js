import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PasswordInput = ({ label, value, onChange, isVisible, toggleVisible }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        secureTextEntry={!isVisible}
        placeholder="••••"
      />
      <TouchableOpacity onPress={toggleVisible} style={styles.eyeIcon}>
        <Ionicons name={isVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
      </TouchableOpacity>
    </View>
  </View>
);
export default function ChangePasswordScreen({ navigation }) {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  // Trạng thái ẩn hiện mật khẩu
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = () => {
    if (newPass !== confirmPass) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }
    // Gọi API update ở đây
    Alert.alert("Thành công", "Mật khẩu đã được thay đổi.");
    navigation.goBack();
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <PasswordInput 
          label="Mật khẩu cũ" 
          value={oldPass} 
          onChange={setOldPass} 
          isVisible={showOld} 
          toggleVisible={() => setShowOld(!showOld)} 
        />
        <PasswordInput 
          label="Mật khẩu mới" 
          value={newPass} 
          onChange={setNewPass} 
          isVisible={showNew} 
          toggleVisible={() => setShowNew(!showNew)} 
        />
        <PasswordInput 
          label="Xác nhận mật khẩu mới" 
          value={confirmPass} 
          onChange={setConfirmPass} 
          isVisible={showConfirm} 
          toggleVisible={() => setShowConfirm(!showConfirm)} 
        />

        <TouchableOpacity style={styles.btnSave} onPress={handleChangePassword}>
          <Text style={styles.btnText}>Cập nhật mật khẩu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#555', marginBottom: 8, fontWeight: '500' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 15
  },
  input: { flex: 1, height: 50, fontSize: 16 },
  eyeIcon: { padding: 10 },
  btnSave: {
    backgroundColor: '#2D9CDB',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});