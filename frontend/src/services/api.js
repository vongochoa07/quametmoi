import axios from 'axios';

// Cấu hình base URL cho API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 giây timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

/**
 * Gửi ảnh để nhận diện côn trùng
 * @param {File} imageFile - File ảnh cần phân tích
 * @returns {Promise} - Kết quả nhận diện
 */
export const predictInsect = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gửi ảnh để phân tích:', error);
    throw new Error('Không thể phân tích ảnh. Vui lòng thử lại.');
  }
};

/**
 * Lấy danh sách tất cả côn trùng
 * @returns {Promise} - Danh sách côn trùng
 */
export const getInsects = async () => {
  try {
    const response = await api.get('/insects');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải danh sách côn trùng:', error);
    throw new Error('Không thể tải danh sách côn trùng.');
  }
};

/**
 * Lấy thông tin chi tiết của một loài côn trùng
 * @param {string} insectId - ID của côn trùng
 * @returns {Promise} - Thông tin côn trùng
 */
export const getInsectInfo = async (insectId) => {
  try {
    const response = await api.get(`/insects/${insectId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải thông tin côn trùng:', error);
    throw new Error('Không thể tải thông tin côn trùng.');
  }
};

/**
 * Kiểm tra trạng thái API
 * @returns {Promise} - Trạng thái API
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái API:', error);
    throw new Error('API không khả dụng.');
  }
};

/**
 * Lấy thông tin cơ bản của API
 * @returns {Promise} - Thông tin API
 */
export const getApiInfo = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải thông tin API:', error);
    throw new Error('Không thể kết nối đến API.');
  }
};

export default api;
