import { create } from 'zustand';

interface StaffUser {
  userId: string;
  fullName: string;
  role: 'RECEPTIONIST' | 'DOCTOR';
}

interface AuthState {
  // Parent state
  parentToken: string | null;
  patientId: string | null;
  setParentAuth: (token: string, patientId: string) => void;
  logoutParent: () => void;

  // Staff state
  staffToken: string | null;
  staffUser: StaffUser | null;
  setStaffAuth: (token: string, user: StaffUser) => void;
  logoutStaff: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  parentToken: localStorage.getItem('parentToken'),
  patientId: localStorage.getItem('patientId'),
  setParentAuth: (token, patientId) => {
    localStorage.setItem('parentToken', token);
    localStorage.setItem('patientId', patientId);
    set({ parentToken: token, patientId });
  },
  logoutParent: () => {
    localStorage.removeItem('parentToken');
    localStorage.removeItem('patientId');
    set({ parentToken: null, patientId: null });
  },

  staffToken: localStorage.getItem('staffToken'),
  staffUser: localStorage.getItem('staffUser') ? JSON.parse(localStorage.getItem('staffUser') as string) : null,
  setStaffAuth: (token, user) => {
    localStorage.setItem('staffToken', token);
    localStorage.setItem('staffUser', JSON.stringify(user));
    set({ staffToken: token, staffUser: user });
  },
  logoutStaff: () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffUser');
    set({ staffToken: null, staffUser: null });
  },
}));
