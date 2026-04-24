import apiClient from '@/shared/services/api.client';
import type { PageResponse } from '@/shared/types/api.types';
import type { Appointment, AppointmentRequest } from '../types/booking.types';

const PREFIX = '/appointments';

export const bookingService = {
  // Lấy lịch khám sắp tới (tùy chọn filter theo thời gian)
  getAll: (page = 0, size = 20, startDate?: string, endDate?: string) => {
    let url = `${PREFIX}?page=${page}&size=${size}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    
    return apiClient.get<unknown, PageResponse<Appointment>>(url);
  },
  
  // Chi tiết booking
  getById: (id: number) => {
    return apiClient.get<unknown, Appointment>(`${PREFIX}/${id}`);
  },
  
  // Đặt lịch khám mới (WF-01)
  createBooking: (data: AppointmentRequest) => {
    return apiClient.post<unknown, Appointment>(PREFIX, data);
  },
  
  // Lễ tân hoặc Bác sĩ cập nhật trạng thái (Confirm / Cancel)
  updateStatus: (id: number, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
    // Sử dụng PATCH vì chỉ update 1 field 
    return apiClient.patch<unknown, Appointment>(`${PREFIX}/${id}/status`, { status });
  }
};
