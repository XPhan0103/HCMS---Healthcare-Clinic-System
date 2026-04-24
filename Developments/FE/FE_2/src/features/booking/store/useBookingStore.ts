import { create } from 'zustand';
import { bookingService } from '../services/booking.service';
import type { Appointment, AppointmentRequest } from '../types/booking.types';
import type { PageResponse } from '@/shared/types/api.types';

interface BookingState {
  appointments: Appointment[];
  pageData: PageResponse<Appointment> | null;
  loading: boolean;
  error: string | null;
  
  fetchAppointments: (page?: number, size?: number, start?: string, end?: string) => Promise<void>;
  createBooking: (data: AppointmentRequest) => Promise<void>;
  confirmAppointment: (id: number) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  appointments: [],
  pageData: null,
  loading: false,
  error: null,

  fetchAppointments: async (page = 0, size = 20, start, end) => {
    set({ loading: true, error: null });
    try {
      const data = await bookingService.getAll(page, size, start, end);
      set({ 
        appointments: data.content, 
        pageData: data,
        loading: false 
      });
    } catch (err: any) {
      set({ loading: false, error: err?.message || 'Có lỗi khi tải danh sách lịch khám.' });
    }
  },

  createBooking: async (data: AppointmentRequest) => {
    set({ loading: true, error: null });
    try {
      const newAppointment = await bookingService.createBooking(data);
      // Cập nhật State tức thì (Optimistic) cho List
      set((state) => ({ 
        appointments: [...state.appointments, newAppointment].sort(
          (a, b) => new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime()
        ),
        loading: false 
      }));
    } catch (err: any) {
      set({ loading: false, error: err?.message || 'Không thể tạo cuốc hẹn khám.' });
      throw err;
    }
  },

  confirmAppointment: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const updated = await bookingService.updateStatus(id, 'CONFIRMED');
      // Tìm index và update tại chỗ thay vì Refresh
      set((state) => ({
        appointments: state.appointments.map(app => 
          app.id === id ? { ...app, status: 'CONFIRMED' as const } : app
        ),
        loading: false
      }));
    } catch (err: any) {
      set({ loading: false, error: err?.message || 'Lỗi khi xác nhận lịch khám.' });
      throw err;
    }
  }
}));
