import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'http://localhost:3000'; // thay bằng IP máy tính nếu test trên điện thoại

export const getToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export const getUserId = async () => {
  const id = await AsyncStorage.getItem('userId');
  return id ? parseInt(id) : null;
};

export const authFetch = async (url, options = {}) => {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
  if (response.status === 401) {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
  }
  return response;
};