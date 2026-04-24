import apiClient from '@/shared/services/api.client';
import type { PageResponse } from '@/shared/types/api.types';
import type { Patient, PatientRequest } from '../types/patient.types';

const PREFIX = '/patients';

export const patientService = {
  // 1. Fetch Danh sách -> Đổi thành Search theo số điện thoại vì backend chỉ có /search
  search: (phone: string) => {
    return apiClient.get<unknown, Patient[]>(`${PREFIX}/search?phone=${phone}`);
  },

  // 2. Lấy thông tin Chi tiết Bệnh nhi
  getById: (id: string | number) => {
    return apiClient.get<unknown, Patient>(`${PREFIX}/${id}`);
  },

  // 3. Tạo mới Profile
  create: (data: PatientRequest) => {
    return apiClient.post<unknown, Patient>(`${PREFIX}/create`, data);
  },

  // 4. Cập nhật Profile
  update: (id: string | number, data: PatientRequest) => {
    return apiClient.patch<unknown, Patient>(`${PREFIX}/${id}`, data);
  }
};
