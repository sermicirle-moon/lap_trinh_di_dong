import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../services/apiClient';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: fullName }),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.accessToken);
        await AsyncStorage.setItem('userId', data.user.id.toString());
        await AsyncStorage.setItem('userEmail', email);
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainApp' }],
        });
        } else {
        Alert.alert('Đăng ký thất bại', data.message || 'Email đã tồn tại');
      }
    } catch (error) {
      Alert.alert('Lỗi kết nối', 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="people-outline" size={80} color="#2D9CDB" />
          </View>
          <Text style={styles.title}>Join Us</Text>
          <Text style={styles.subtitle}>Fill in your details to get started</Text>

          {/* Ô nhập Name và Email */}
          <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          
          {/* Ô nhập Mật khẩu (Có bọc con mắt) */}
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.passwordInput} 
              placeholder="Password" 
              secureTextEntry={!showPassword} 
              value={password} 
              onChangeText={setPassword} 
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#888" 
              />
            </TouchableOpacity>
          </View>

          {/* Ô Xác nhận Mật khẩu (Có bọc con mắt) */}
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.passwordInput} 
              placeholder="Confirm Password" 
              secureTextEntry={!showConfirmPassword} 
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#888" 
              />
            </TouchableOpacity>
          </View>

          {/* Đã xóa checkbox agree */}

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerText}>Sign Up</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Already have an account? <Text style={{ fontWeight: 'bold' }}>Log In</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFF' },
  keyboard: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 30, paddingVertical: 40 },
  headerIconContainer: { alignItems: 'center' }, // Để căn giữa cái icon to
  title: { fontSize: 32, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 30, textAlign: 'center' },
  
  // Style cho ô nhập chữ bình thường
  input: { width: '100%', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, marginBottom: 15, backgroundColor: '#FFF' },
  
  // Style MỚI cho khung bọc Mật khẩu (Viền bọc ngoài)
  passwordContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    backgroundColor: '#FFF' 
  },
  
  // Style MỚI cho ô nhập text mật khẩu (Không có viền, tự đẩy con mắt sang phải)
  passwordInput: { 
    flex: 1, 
    paddingVertical: 12,
  },

  registerButton: { width: '100%', backgroundColor: '#2D9CDB', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  registerText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  loginText: { marginTop: 20, textAlign: 'center', color: '#2D9CDB', fontSize: 14 }
});