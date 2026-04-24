import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, ArrowRight, User } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import api from '../../../shared/services/api';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch today's appointments as an example
    const today = new Date().toISOString().split('T')[0];
    api.get(`/appointments/today?date=${today}`)
      .then(res => {
        const mapped = res.data.data.map((a: any) => ({
          id: a.id,
          doctorName: a.doctorName,
          date: a.appointmentDate,
          time: a.timeSlot,
          status: a.status
        }));
        setUpcomingAppointments(mapped);
      })
      .catch(err => {
        console.error('Failed to fetch appointments:', err);
        // Fallback mock
        setUpcomingAppointments([
          { id: 1, doctorName: 'BS. Minh', date: '2026-06-01', time: '09:00', status: 'CONFIRMED' }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);
  
  const pastVisits = [
    { id: 101, doctorName: 'BS. An', date: '2025-12-10', diagnosis: 'Viêm họng' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Welcome back! Manage your child's health records.</p>
        </div>
        <Button onClick={() => navigate('/parent/booking')} className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 shadow-emerald-500/20 text-white border-0 shadow-lg hover:shadow-emerald-500/40 transform transition hover:-translate-y-0.5">
          <Calendar className="mr-2" size={18} /> Book Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 card-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 z-0" />
          <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 relative z-10">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><Clock size={20} /></div> Upcoming Appointments
          </h2>
          
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4 relative z-10">
              {upcomingAppointments.map((appt) => (
                <div key={appt.id} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex justify-between items-center transition-all hover:border-emerald-200 hover:ring-1 hover:ring-emerald-100">
                  <div>
                    <p className="font-medium text-slate-900">{appt.doctorName}</p>
                    <p className="text-sm text-slate-500">{appt.date} at {appt.time}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No upcoming appointments.</p>
          )}
        </div>

        {/* Quick Actions / Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <User className="text-green-600" size={20} /> Patient Information
          </h2>
          <div className="p-4 rounded-lg bg-green-50/50 border border-green-100">
            <p className="text-slate-700"><strong>Name:</strong> Nguyễn Bảo An</p>
            <p className="text-slate-700"><strong>DOB:</strong> 2020-03-15</p>
            <p className="text-slate-700 mt-2">Make sure to keep the profile updated.</p>
          </div>
        </div>
      </div>

      {/* Past Visits */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <FileText className="text-green-600" size={20} /> Recent Visit History
          </h2>
          <button 
            onClick={() => navigate('/parent/records')}
            className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            View all records <ArrowRight size={16} />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {pastVisits.map((visit) => (
            <div key={visit.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-900">{visit.diagnosis}</p>
                <p className="text-sm text-slate-500">{visit.date} • {visit.doctorName}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/parent/records')}>
                View Notes
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
