import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import api from '../../../shared/services/api';

export default function RegisterWalkIn() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '',
    patientName: '',
    dob: '',
    gender: 'MALE',
    parentPhoneNumber: '',
    reasonForVisit: ''
  });

  useEffect(() => {
    api.get('/doctors').then(res => setDoctors(res.data.data)).catch(err => {
      setDoctors([{ id: '1', fullName: 'BS. Minh' }, { id: '2', fullName: 'BS. An' }]);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/appointments/walk-in', {
        doctorId: formData.doctorId,
        patient: {
          fullName: formData.patientName,
          dateOfBirth: formData.dob,
          gender: formData.gender,
          parentPhoneNumber: formData.parentPhoneNumber,
          reasonForVisit: formData.reasonForVisit
        }
      });
      navigate('/receptionist/dashboard');
    } catch (err: any) {
      console.error(err);
      if (!err.response) {
        // Fallback for UI
        navigate('/receptionist/dashboard');
        return;
      }
      alert(err.response?.data?.message || 'Failed to register walk-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Register Walk-in Patient</h1>
          <p className="text-slate-500">Quickly register and add a patient to the queue.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Child's Full Name" 
              placeholder="Nguyen Bao An" 
              required
              value={formData.patientName}
              onChange={e => setFormData({...formData, patientName: e.target.value})}
            />
            <Input 
              label="Parent Phone Number" 
              placeholder="0909123456" 
              required
              value={formData.parentPhoneNumber}
              onChange={e => setFormData({...formData, parentPhoneNumber: e.target.value})}
            />
            <Input 
              type="date" 
              label="Date of Birth" 
              required
              value={formData.dob}
              onChange={e => setFormData({...formData, dob: e.target.value})}
            />
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select 
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assign Doctor</label>
              <select 
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                required
                value={formData.doctorId}
                onChange={e => setFormData({...formData, doctorId: e.target.value})}
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.fullName}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Visit</label>
              <textarea 
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm min-h-[80px] focus:ring-2 focus:ring-orange-500 outline-none"
                required
                value={formData.reasonForVisit}
                onChange={e => setFormData({...formData, reasonForVisit: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => navigate('/receptionist/dashboard')}>Cancel</Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700" isLoading={loading}>
              Register & Check-in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
