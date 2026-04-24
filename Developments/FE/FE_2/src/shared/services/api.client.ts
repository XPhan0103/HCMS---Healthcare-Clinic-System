import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types/api.types';

// Khởi tạo Axios Instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Tự động móc JWT Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage (hoặc Zustand persist tùy implementation)
    const token = localStorage.getItem('access_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Unwrap ApiResponse<T> và xử lý 401 LOGOUT
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Unwrap cấu trúc ApiResponse<T> -> trả về thuần .data cho các hàm fetch (như yêu cầu L2)
    const resData = response.data;
    
    // Đảm bảo bóc đúng format nếu backend gửi đúng chuẩn Envelope
    if (resData && typeof resData === 'object' && 'code' in resData && 'data' in resData) {
      return resData.data; // Chỉ return T
    }
    
    return resData as any;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Trigger Log-out khi JWT hết hạn hoặc Invalid Access
      console.warn('⚡ [API Client] 401 Unauthorized detected. Triggering forced logout...');
      
      // Clear token
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      
      // Dispatch event để Zustand / AuthProvider / Router có thể lắng nghe và redirect user về /login
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
