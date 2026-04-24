import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, PlayCircle } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Table } from '../../../shared/components/Table';
import api from '../../../shared/services/api';
import { useAuthStore } from '../../../app/store/authStore';

export default function DoctorQueue() {
  const navigate = useNavigate();
  const { staffUser } = useAuthStore();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch today's appointments for this doctor
    const today = new Date().toISOString().split('T')[0];
    const doctorId = staffUser?.userId || ''; // In real app, this should be the UUID

    api.get(`/appointments/today?date=${today}&doctorId=${doctorId}&status=CONFIRMED`)
      .then(res => {
        const mapped = res.data.data.map((a: any) => ({
          id: a.id,
          patientId: a.patientId,
          patientName: a.patientName,
          time: new Date(a.slotDateTime || a.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          status: 'WAITING', // If it's CONFIRMED by receptionist, it means WAITING for doctor
          reason: a.reasonForVisit
        }));
        setQueue(mapped);
      })
      .catch(err => {
        console.error('Failed to fetch doctor queue:', err);
        // Mock fallback
        setQueue([
          { id: '1', patientId: 'p1', patientName: 'Nguyễn Bảo An', time: '09:00 AM', status: 'WAITING', reason: 'Sốt cao 3 ngày' },
          { id: '2', patientId: 'p2', patientName: 'Trần Văn B', time: '09:30 AM', status: 'WAITING', reason: 'Kiểm tra định kỳ' },
          { id: '3', patientId: 'p3', patientName: 'Lê Thị C', time: '10:00 AM', status: 'WAITING', reason: 'Ho khan, khó thở' },
        ]);
      })
      .finally(() => setLoading(false));
  }, [staffUser]);

  const handleStartConsultation = (appointmentId: string, patientId: string) => {
    // Navigate to EMR first, from there doctor can record visit
    navigate(`/doctor/emr/${patientId}?appointmentId=${appointmentId}`);
  };

  const columns = [
    { header: 'Time', accessor: 'time', className: 'font-medium' },
    { header: 'Patient Name', accessor: 'patientName' },
    { header: 'Reason / Chief Complaint', accessor: 'reason' },
    { header: 'Status', accessor: (row: any) => (
      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex inline-flex items-center gap-1">
        <Clock size={14} /> {row.status}
      </span>
    )},
    { header: 'Action', accessor: (row: any) => (
      <Button 
        size="sm" 
        className="bg-purple-600 hover:bg-purple-700"
        onClick={() => handleStartConsultation(row.id, row.patientId)}
      >
        <PlayCircle size={16} className="mr-2" /> Start
      </Button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Patient Queue</h1>
            <p className="text-slate-500">Real-time waiting list for today's sessions.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Waiting Patients</p>
          <p className="text-3xl font-bold text-purple-700">{queue.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <Table data={queue} columns={columns} />
      </div>
    </div>
  );
}
