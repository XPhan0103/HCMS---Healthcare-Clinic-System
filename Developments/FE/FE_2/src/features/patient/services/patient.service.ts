import apiClient from '@/shared/services/api.client';
import type { PageResponse } from '@/shared/types/api.types';
import type { Patient, PatientRequest } from '../types/patient.types';

const PREFIX = '/patients';

export const patientService = {
  // 1. Fetch Danh sách phân trang
  // Triệt để dùng Generic <PageResponse<Patient>> để Axios infer (suy luận) đúng data type
  getAll: (page = 0, size = 20) => {
    return apiClient.get<unknown, PageResponse<Patient>>(`${PREFIX}?page=${page}&size=${size}`);
  },
  
  // 2. Lấy thông tin Chi tiết Bệnh nhi
  getById: (id: number) => {
    return apiClient.get<unknown, Patient>(`${PREFIX}/${id}`);
  },
  
  // 3. Tạo mới Profile
  create: (data: PatientRequest) => {
    return apiClient.post<unknown, Patient>(PREFIX, data);
  },
  
  // 4. Cập nhật Profile
  update: (id: number, data: PatientRequest) => {
    return apiClient.put<unknown, Patient>(`${PREFIX}/${id}`, data);
  }
};
