import { Routes, Route } from 'react-router-dom';

// Layouts
import ParentLayout from '../layouts/ParentLayout';
import StaffLayout from '../layouts/StaffLayout';

// Parent Pages
import ParentLogin from '../../features/parent/pages/ParentLogin';
import ParentDashboard from '../../features/parent/pages/ParentDashboard';
import BookingPortal from '../../features/parent/pages/BookingPortal';
import AppointmentConfirmation from '../../features/parent/pages/AppointmentConfirmation';
import ClinicalNotes from '../../features/parent/pages/ClinicalNotes';

// Auth Staff
import StaffLogin from '../../features/auth/pages/StaffLogin';

// Receptionist Pages
import AppointmentDashboard from '../../features/receptionist/pages/AppointmentDashboard';
import RegisterWalkIn from '../../features/receptionist/pages/RegisterWalkIn';
import BillingInvoice from '../../features/receptionist/pages/BillingInvoice';

// Doctor Pages
import DoctorQueue from '../../features/doctor/pages/DoctorQueue';
import DoctorEMR from '../../features/doctor/pages/DoctorEMR';
import ManageProfile from '../../features/doctor/pages/ManageProfile';
import Consultation from '../../features/doctor/pages/Consultation';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<ParentLogin />} />
      <Route path="/staff/login" element={<StaffLogin />} />

      {/* Parent Portal */}
      <Route path="/parent" element={<ParentLayout />}>
        <Route path="dashboard" element={<ParentDashboard />} />
        <Route path="booking" element={<BookingPortal />} />
        <Route path="confirmation" element={<AppointmentConfirmation />} />
        <Route path="records" element={<ClinicalNotes />} />
      </Route>

      {/* Staff Portals (Receptionist & Doctor) */}
      <Route element={<StaffLayout />}>
        {/* Receptionist */}
        <Route path="/receptionist/dashboard" element={<AppointmentDashboard />} />
        <Route path="/receptionist/walk-in" element={<RegisterWalkIn />} />
        <Route path="/receptionist/billing" element={<BillingInvoice />} />

        {/* Doctor */}
        <Route path="/doctor/queue" element={<DoctorQueue />} />
        <Route path="/doctor/emr/:patientId" element={<DoctorEMR />} />
        <Route path="/doctor/profile/:patientId" element={<ManageProfile />} />
        <Route path="/doctor/consultation/:appointmentId" element={<Consultation />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
