import { BaseEntity } from '@/shared/types/api.types';

// Data Model ánh xạ chính xác từ DB Entity / BE Response
export interface Patient extends BaseEntity {
  fullName: string;
  parentPhoneNumber: string;
  parentEmail: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  heightCm?: number;
  weightKg?: number;
  bloodType?: string;
  allergies?: string;
  chronicConditions?: string;
  vaccinationNotes?: string;
}

// Request Data Transfer Object dùng để Create/Update Form
export interface PatientRequest {
  fullName: string;
  parentPhoneNumber: string;
  parentEmail?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
}
