import { BaseEntity } from '@/shared/types/api.types';
import { Patient } from '@/features/patient/types/patient.types';

// Các trạng thái của một cuộc hẹn khám (WF-01)
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

// Data Model ánh xạ Entity APPOINTMENT
export interface Appointment extends BaseEntity {
  patientId: number;
  doctorId?: number; // Optional nếu phòng khám chỉ có 1 bác sĩ mặc định
  appointmentTime: string; // ISO String format
  status: AppointmentStatus;
  notes?: string;
  
  // Thông tin nested nếu Backend sử dụng join / eager loading
  patient?: Patient;
}

// Request Data Transfer Object dùng để Booking (Online hoặc Offline)
export interface AppointmentRequest {
  patientId: number;
  doctorId?: number;
  appointmentTime: string; // ISO String format
  notes?: string;
}
