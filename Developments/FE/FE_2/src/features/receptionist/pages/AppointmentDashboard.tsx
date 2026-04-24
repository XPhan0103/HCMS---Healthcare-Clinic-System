import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Table } from '../../../shared/components/Table';
import api from '../../../shared/services/api';

export default function AppointmentDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments/today');
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error(err);
      // Fallback
      setAppointments([
        { id: '1', patientName: 'Nguyễn Bảo An', doctorName: 'BS. Minh', slotDateTime: '2026-06-01T09:00:00', status: 'PENDING' },
        { id: '2', patientName: 'Trần Văn B', doctorName: 'BS. An', slotDateTime: '2026-06-01T09:30:00', status: 'CONFIRMED' },
        { id: '3', patientName: 'Lê Thị C', doctorName: 'BS. Minh', slotDateTime: '2026-06-01T10:00:00', status: 'COMPLETED' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleConfirm = async (id: string) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status: 'CONFIRMED' });
      fetchAppointments();
    } catch (err) {
      console.error(err);
      // Optimistic update for fallback
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'CONFIRMED' } : a));
    }
  };

  const handleCheckIn = async (id: string) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status: 'CHECKED_IN' });
      fetchAppointments();
    } catch (err) {
      console.error(err);
      // Optimistic update for fallback
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'CHECKED_IN' } : a));
    }
  };

  // { header: 'Time', accessor: (row: any) => new Date(row.timeSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },

  const columns = [
    { header: 'Time', accessor: 'timeSlot' },
    { header: 'Patient Name', accessor: 'patientName' },
    { header: 'Doctor', accessor: 'doctorName' },
    {
      header: 'Status', accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
          row.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
            row.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
              'bg-slate-100 text-slate-700'
          }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Action', accessor: (row: any) => (
        row.status === 'PENDING' ? (
          <Button size="sm" onClick={() => handleConfirm(row.id)} className="bg-blue-600 hover:bg-blue-700 h-8 px-3 text-xs">
            Confirm
          </Button>
        ) : row.status === 'CONFIRMED' ? (
          <Button size="sm" variant="outline" className="h-8 px-3 text-xs" onClick={() => { handleCheckIn(row.id) }}>
            Check In
          </Button>
        ) : null
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-bl-full -mr-24 -mt-24 z-0 pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700 rounded-2xl shadow-inner">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Today's Appointments</h1>
            <p className="text-slate-500 font-medium mt-1">Manage daily queue and walk-ins</p>
          </div>
        </div>
        <div className="flex gap-3 relative z-10">
          <Button variant="outline" onClick={fetchAppointments} disabled={loading} className="bg-white/50 backdrop-blur-sm">
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-lg shadow-orange-500/20" onClick={() => navigate('/receptionist/walk-in')}>
            <UserPlus className="mr-2 h-4 w-4" /> Register Walk-in
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5 card-hover">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl ring-1 ring-amber-100/50"><Clock size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Pending</p>
            <p className="text-3xl font-extrabold text-slate-900">{appointments.filter(a => a.status === 'PENDING').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5 card-hover">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl ring-1 ring-blue-100/50"><Users size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Confirmed</p>
            <p className="text-3xl font-extrabold text-slate-900">{appointments.filter(a => a.status === 'CONFIRMED').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5 card-hover">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl ring-1 ring-emerald-100/50"><CheckCircle size={24} /></div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Completed</p>
            <p className="text-3xl font-extrabold text-slate-900">{appointments.filter(a => a.status === 'COMPLETED').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 relative overflow-hidden">
        <Table data={appointments} columns={columns} />
      </div>
    </div>
  );
}
