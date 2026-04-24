import { create } from 'zustand';
import { patientService } from '../services/patient.service';
import type { Patient, PatientRequest } from '../types/patient.types';
import type { PageResponse } from '@/shared/types/api.types';

interface PatientState {
  patients: Patient[];
  pageData: PageResponse<Patient> | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPatients: (page?: number, size?: number) => Promise<void>;
  createPatient: (data: PatientRequest) => Promise<void>;
}

// Cấu hình Zustand Centralized Store cho Patient Context
export const usePatientStore = create<PatientState>((set) => ({
  patients: [],
  pageData: null,
  loading: false,
  error: null,

  fetchPatients: async (page = 0, size = 20) => {
    set({ loading: true, error: null });
    try {
      // Do Interceptor Unwrap đã triệt tiêu lớp response.data, 
      // result trả về lúc này 100% khớp với model Generic.
      const data = await patientService.getAll(page, size);
      
      set({ 
        patients: data.content, 
        pageData: data,
        loading: false 
      });
    } catch (err: any) {
      set({ loading: false, error: err?.message || 'Có lỗi xảy ra khi tải danh sách bệnh nhi.' });
    }
  },

  createPatient: async (data: PatientRequest) => {
    set({ loading: true, error: null });
    try {
      const newPatient = await patientService.create(data);
      // Lạc quan (Optimistic Update) đưa dữ liệu vừa tạo chèn luôn vào Store để UI ăn ngay lập tức thay vì Fetch Call lại
      set((state) => ({ 
        patients: [newPatient, ...state.patients],
        loading: false 
      }));
    } catch (err: any) {
      set({ loading: false, error: err?.message || 'Có lỗi khi hệ thống tiến hành khởi tạo bệnh nhi.' });
      throw err; // Vứt Exception lên trên để Component chặn lại bắn Toast UI nếu cần
    }
  }
}));
