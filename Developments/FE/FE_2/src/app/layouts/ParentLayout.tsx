import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const ParentLayout = () => {
  const { logoutParent, parentToken } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if not logged in (simplified)
  // useEffect(() => { if (!parentToken) navigate('/'); }, [parentToken]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background ambient gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />

      <header className="sticky top-0 z-40 glass border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-xl flex items-center gap-2 tracking-tight">
            <span className="text-2xl drop-shadow-sm">👩‍👧</span> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500">HCMS Parent Portal</span>
          </div>
          <button 
            onClick={() => { logoutParent(); navigate('/'); }}
            className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-medium transition-colors bg-white/50 px-3 py-1.5 rounded-lg border border-slate-200/50 hover:border-red-200 hover:bg-red-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 animate-fade-in-up">
        <Outlet />
      </main>
    </div>
  );
};

export default ParentLayout;
