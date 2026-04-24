import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const StaffLayout = () => {
  const { logoutStaff, staffUser } = useAuthStore();
  const navigate = useNavigate();

  const isDoctor = staffUser?.role === 'DOCTOR';
  const bgColor = isDoctor ? 'bg-purple-900' : 'bg-orange-950';
  const icon = isDoctor ? '👨‍⚕️' : '🏥';
  const title = isDoctor ? 'Doctor Portal' : 'Receptionist Portal';
  const textColor = isDoctor ? 'text-purple-300' : 'text-orange-300';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col relative overflow-hidden">
      {/* Background ambient gradients based on role */}
      {isDoctor ? (
        <div className="absolute top-0 right-0 w-1/2 h-[500px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      ) : (
        <div className="absolute top-0 right-0 w-1/2 h-[500px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />
      )}

      <header className={`${bgColor} text-white shadow-xl shadow-${isDoctor ? 'purple' : 'orange'}-900/20 relative z-40 border-b border-white/10 backdrop-blur-md bg-opacity-95`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-xl flex items-center gap-3 tracking-tight">
            <span className={`text-2xl drop-shadow-md ${textColor}`}>{icon}</span> 
            <span>HCMS <span className="font-normal opacity-80 pl-1">{title}</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-full border border-white/10">
              <span className={`w-2 h-2 rounded-full ${isDoctor ? 'bg-purple-400' : 'bg-orange-400'} animate-pulse`}></span>
              <span className="text-sm font-medium tracking-wide">Dr. {staffUser?.fullName || 'Staff'}</span>
            </div>
            <button 
              onClick={() => { logoutStaff(); navigate('/staff/login'); }}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-transparent hover:border-white/20"
            >
              <LogOut size={16} /> <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 animate-fade-in-up">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
