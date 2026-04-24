import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { useAuthStore } from '../../../app/store/authStore';
import api from '../../../shared/services/api';

const ParentLogin = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setParentAuth = useAuthStore((state) => state.setParentAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username: phone, password });
      setParentAuth(res.data.data.token, res.data.data.username || 'none');
      navigate('/parent/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid phone number or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Animated ambient background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400/20 blur-[120px] animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/20 blur-[120px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 border border-white relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-700 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner ring-1 ring-emerald-200/50 transform transition hover:scale-105 hover:rotate-3">
            👩‍👧
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome to HCMS</h1>
          <p className="text-slate-500 font-medium">Parent Self-Service Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Phone Number" 
            placeholder="e.g., 0909123456" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoFocus
          />
          <Input 
            label="Password" 
            type="password"
            placeholder="Enter password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" isLoading={loading}>
            Login
          </Button>
          <div className="text-center">
            <a href="/staff/login" className="text-sm text-green-600 hover:underline">
              Are you a staff member? Login here.
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentLogin;
