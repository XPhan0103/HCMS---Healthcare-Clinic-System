import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import api from '../../../shared/services/api';

export default function ManageProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    heightCm: '',
    weightKg: '',
    bloodType: 'UNKNOWN',
    allergies: '',
    chronicConditions: '',
    vaccinationNotes: ''
  });

  useEffect(() => {
    // Mock load
    setFormData({
      heightCm: '95.5',
      weightKg: '14.2',
      bloodType: 'A',
      allergies: 'Penicillin',
      chronicConditions: 'Asthma',
      vaccinationNotes: 'BCG done. Missing MMR booster.'
    });
  }, [patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/patients/${patientId}`, {
        heightCm: parseFloat(formData.heightCm),
        weightKg: parseFloat(formData.weightKg),
        bloodType: formData.bloodType,
        allergies: formData.allergies,
        chronicConditions: formData.chronicConditions,
        vaccinationNotes: formData.vaccinationNotes
      });
      navigate(`/doctor/emr/${patientId}`);
    } catch (err: any) {
      console.error(err);
      if (!err.response) {
        // Fallback
        setTimeout(() => {
          setLoading(false);
          navigate(`/doctor/emr/${patientId}`);
        }, 500);
        return;
      }
      alert(err.response?.data?.message || 'Failed to update patient profile');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Patient Profile</h1>
        <p className="text-slate-500">Update medical alerts, stats, and vaccination notes.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <h3 className="font-semibold text-lg border-b pb-2">Physical Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input 
              type="number" 
              step="0.1" 
              label="Height (cm)" 
              value={formData.heightCm} 
              onChange={e => setFormData({...formData, heightCm: e.target.value})} 
            />
            <Input 
              type="number" 
              step="0.1" 
              label="Weight (kg)" 
              value={formData.weightKg} 
              onChange={e => setFormData({...formData, weightKg: e.target.value})} 
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Blood Type</label>
              <select 
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.bloodType}
                onChange={e => setFormData({...formData, bloodType: e.target.value})}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
                <option value="UNKNOWN">Unknown</option>
              </select>
            </div>
          </div>

          <h3 className="font-semibold text-lg border-b pb-2 pt-4">Medical Conditions</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Allergies</label>
              <Input 
                placeholder="e.g. Penicillin, Peanuts" 
                value={formData.allergies} 
                onChange={e => setFormData({...formData, allergies: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chronic Conditions</label>
              <Input 
                placeholder="e.g. Asthma, Diabetes" 
                value={formData.chronicConditions} 
                onChange={e => setFormData({...formData, chronicConditions: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vaccination Notes</label>
              <textarea 
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm min-h-[80px] focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.vaccinationNotes} 
                onChange={e => setFormData({...formData, vaccinationNotes: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" isLoading={loading}>
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
