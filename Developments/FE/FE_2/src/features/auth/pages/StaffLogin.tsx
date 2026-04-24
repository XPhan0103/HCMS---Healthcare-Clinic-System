import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock } from 'lucide-react';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { useAuthStore } from '../../../app/store/authStore';
import api from '../../../shared/services/api';

export default function StaffLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setStaffAuth = useAuthStore((state) => state.setStaffAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { username, password });
      const { token, username: userId, fullName, role } = res.data.data;

      setStaffAuth(token, { userId, fullName, role });

      if (role === 'RECEPTIONIST') {
        navigate('/receptionist/dashboard');
      } else if (role === 'DOCTOR') {
        navigate('/doctor/queue');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (!err.response) {
        // Mock fallback if BE is down
        const mockRole = username.toLowerCase().includes('dr') ? 'DOCTOR' : 'RECEPTIONIST';
        setStaffAuth('mock-token-123', { userId: username, fullName: 'Mock Staff', role: mockRole });
        navigate(mockRole === 'DOCTOR' ? '/doctor/queue' : '/receptionist/dashboard');
        return;
      }
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl shadow-2xl p-8 sm:p-10 border border-slate-700 relative overflow-hidden animate-fade-in-up">
        {/* Background Decal */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-blue-500/20 blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 rounded-full bg-purple-500/20 blur-[80px] pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-slate-700 text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-slate-600">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Staff Portal Access</h1>
          <p className="text-slate-400 text-sm">Healthcare Clinic Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded text-sm text-center">{error}</div>}

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Staff Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 shadow-lg shadow-blue-900/20" isLoading={loading}>
            Secure Login
          </Button>

          <div className="text-center mt-6">
            <a href="/" className="text-sm text-slate-500 hover:text-white transition-colors">
              Return to Parent Portal
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
