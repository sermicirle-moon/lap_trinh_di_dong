import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../services/apiClient';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
        Alert.alert('Đăng nhập thất bại', data.message || 'Sai email hoặc mật khẩu');
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
        <View style={styles.content}>
          <Ionicons name="rocket-outline" size={80} color="#2D9CDB" />
          <Text style={styles.title}>OrganizeMe</Text>
          <Text style={styles.subtitle}>Manage your tasks effortlessly</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mật khẩu"
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

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Log In</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Don't have an account? <Text style={{ fontWeight: 'bold' }}>Sign Up Free</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFF' },
  keyboard: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  title: { fontSize: 32, fontWeight: 'bold', marginTop: 20, color: '#333' },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 40, textAlign: 'center' },
  
  // Style cho ô Email
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
  
  loginButton: { width: '100%', backgroundColor: '#2D9CDB', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  loginText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  registerText: { marginTop: 20, color: '#2D9CDB', fontSize: 14 }
});