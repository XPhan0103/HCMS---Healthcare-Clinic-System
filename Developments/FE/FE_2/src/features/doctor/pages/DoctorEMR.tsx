import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { FileText, Edit, History, AlertCircle, Droplets, HeartPulse } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Modal } from '../../../shared/components/Modal';
import api from '../../../shared/services/api';

export default function DoctorEMR() {
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const navigate = useNavigate();

  const [patient, setPatient] = useState<any>({
    id: patientId,
    fullName: 'Loading...',
    dob: '',
    gender: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    heightCm: 0,
    weightKg: 0
  });

  const [pastVisits, setPastVisits] = useState<any[]>([]);

  useEffect(() => {
    if (patientId) {
      // Fetch Patient Profile
      api.get(`/patients/${patientId}`)
        .then(res => setPatient(res.data.data))
        .catch(err => console.error('Failed to fetch patient:', err));

      // Fetch Patient History
      api.get(`/clinical/patients/${patientId}/history`)
        .then(res => {
          const history = res.data.data.map((v: any) => ({
            id: v.id,
            date: v.visitDate ? new Date(v.visitDate).toLocaleDateString() : '',
            diagnosis: v.diagnosis || 'Chưa chẩn đoán'
          }));
          setPastVisits(history);
        })
        .catch(err => {
          console.error('Failed to fetch history:', err);
          // Mock history fallback
          setPastVisits([
            { id: 'v1', date: '2025-12-10', diagnosis: 'Viêm họng', doctor: 'BS. An' },
            { id: 'v2', date: '2025-06-15', diagnosis: 'Sốt siêu vi', doctor: 'BS. Minh' }
          ]);
        });
    }
  }, [patientId]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 flex justify-between items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-bl-full -mr-32 -mt-32 z-0 pointer-events-none" />
        <div className="flex gap-6 items-center relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 rounded-3xl flex items-center justify-center text-4xl font-extrabold shadow-inner ring-4 ring-purple-50">
            BA
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{patient.fullName}</h1>
            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
              <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700"><strong>DOB:</strong> {patient.dob}</span>
              <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700"><strong>Gender:</strong> {patient.gender}</span>
              <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-mono"><strong>ID:</strong> #{patient.id}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 relative z-10">
          {appointmentId && (
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/20 w-48 text-white" onClick={() => navigate(`/doctor/consultation/${appointmentId}`)}>
              Record Visit Now
            </Button>
          )}
          <Button variant="outline" className="w-48 text-slate-700 border-slate-300 hover:bg-slate-50" onClick={() => navigate(`/doctor/profile/${patient.id}`)}>
            <Edit size={16} className="mr-2" /> Manage Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Vitals & Alerts */}
        <div className="space-y-6">
          <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-red-900">
            <h3 className="font-semibold flex items-center gap-2 mb-4 text-red-800">
              <AlertCircle size={20} /> Medical Alerts
            </h3>
            <div className="space-y-3">
              <div className="bg-white/60 p-3 rounded-lg border border-red-200">
                <p className="text-xs text-red-600 font-bold uppercase tracking-wide">Allergies</p>
                <p className="font-medium">{patient.allergies || 'None reported'}</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg border border-red-200">
                <p className="text-xs text-red-600 font-bold uppercase tracking-wide">Chronic Conditions</p>
                <p className="font-medium">{patient.chronicConditions || 'None reported'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <HeartPulse size={20} className="text-purple-600" /> Physical Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                <p className="text-slate-500 text-sm mb-1">Height</p>
                <p className="text-2xl font-bold text-slate-800">{patient.heightCm}<span className="text-base font-normal text-slate-500 ml-1">cm</span></p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                <p className="text-slate-500 text-sm mb-1">Weight</p>
                <p className="text-2xl font-bold text-slate-800">{patient.weightKg}<span className="text-base font-normal text-slate-500 ml-1">kg</span></p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
              <Droplets size={24} />
              <div>
                <p className="text-sm font-semibold">Blood Type</p>
                <p className="text-xl font-bold">{patient.bloodType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-lg">
              <History size={20} className="text-purple-600" /> Past Visit History
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {pastVisits.map((v, idx) => (
              <div key={idx} className="p-6 hover:bg-slate-50 transition-colors flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg text-slate-900 mb-1">{v.diagnosis}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs">{v.date}</span>
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <FileText size={16} className="mr-2" /> View Notes
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
