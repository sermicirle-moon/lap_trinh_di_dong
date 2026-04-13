// Trỏ vào Backend giả (json-server) đang chạy ở cổng 3000
const BASE_URL = 'http://localhost:3000'; 

export const apiClient = async (endpoint, method = 'GET', body = null) => {
  const config = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    return await response.json();
  } catch (error) {
    console.error("Lỗi API:", error);
    throw error;
  }
};