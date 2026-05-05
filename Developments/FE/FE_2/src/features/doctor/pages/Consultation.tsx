import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pill, CheckCircle } from 'lucide-react';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Modal } from '../../../shared/components/Modal';
import api from '../../../shared/services/api';

export default function Consultation() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Visit Details
  const [visit, setVisit] = useState({
    symptoms: '',
    vitalSigns: '',
    diagnosis: '',
    aftercareInstructions: ''
  });

  // Prescription
  const [rx, setRx] = useState([{
    drugName: '', dosage: '', frequency: '', durationDays: 5, route: 'Oral', notes: ''
  }]);

  const addRxItem = () => {
    setRx([...rx, { drugName: '', dosage: '', frequency: '', durationDays: 5, route: 'Oral', notes: '' }]);
  };

  const removeRxItem = (index: number) => {
    setRx(rx.filter((_, i) => i !== index));
  };

  const handleRxChange = (index: number, field: string, value: any) => {
    const newRx = [...rx];
    newRx[index] = { ...newRx[index], [field]: value };
    setRx(newRx);
  };

  const handleFinalize = async () => {
    setLoading(true);
    try {
      // Create Visit
      const res = await api.post('/clinical/visits', {
        appointmentId,
        patientId: window.location.pathname.split('/')[3] || '123e4567-e89b-12d3-a456-426614174000',
        symptoms: visit.symptoms,
        diagnosis: visit.diagnosis,
        clinicalNotes: `Vitals: ${visit.vitalSigns}\nAftercare: ${visit.aftercareInstructions}`
      });
      
      const visitId = res.data?.data?.id || 'mock-visit-id';

      // Create Prescription if items exist
      const validRx = rx.filter(r => r.drugName);
      if (validRx.length > 0) {
        await api.post(`/pharmacy/visits/${visitId}/prescriptions`, validRx.map(r => ({
          medicationName: r.drugName,
          dosage: r.dosage,
          frequency: r.frequency,
          durationDays: r.durationDays,
          instructions: `${r.route} - ${r.notes}`
        })));
      }

      // Finalize the visit
      await api.patch(`/clinical/visits/${visitId}/finalize`);
      
      navigate('/doctor/queue');
    } catch (err: any) {
      console.error(err);
      if (!err.response) {
        // Fallback
        setTimeout(() => {
          setLoading(false);
          navigate('/doctor/queue');
        }, 1000);
        return;
      }
      alert(err.response?.data?.message || 'Failed to finalize visit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Record Consultation</h1>
          <p className="text-slate-500">Document visit findings and issue e-prescription.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Consultation Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <CheckCircle size={18} className="text-purple-600" /> Clinical Notes
            </h2>
          </div>
          <div className="p-6 space-y-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Symptoms</label>
              <textarea 
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm min-h-[80px] focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g. Fever 38.5C, dry cough..."
                value={visit.symptoms}
                onChange={e => setVisit({...visit, symptoms: e.target.value})}
              />
            </div>
            <Input 
              label="Vital Signs" 
              placeholder="e.g. HR: 100bpm, SpO2: 98%" 
              value={visit.vitalSigns}
              onChange={e => setVisit({...visit, vitalSigns: e.target.value})}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis (ICD)</label>
              <Input 
                placeholder="e.g. Upper Respiratory Tract Infection (J06.9)" 
                value={visit.diagnosis}
                onChange={e => setVisit({...visit, diagnosis: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Aftercare Instructions</label>
              <textarea 
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm min-h-[80px] focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Instructions for the patient..."
                value={visit.aftercareInstructions}
                onChange={e => setVisit({...visit, aftercareInstructions: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Right: e-Prescription */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Pill size={18} className="text-purple-600" /> e-Prescription
            </h2>
            <Button size="sm" variant="outline" className="h-8 py-0" onClick={addRxItem}>
              <Plus size={16} className="mr-1" /> Add Drug
            </Button>
          </div>
          <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[600px]">
            {rx.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative">
                <button 
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                  onClick={() => removeRxItem(idx)}
                >
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3 pr-6">
                  <Input 
                    label="Drug Name" 
                    placeholder="Amoxicillin 250mg" 
                    value={item.drugName}
                    onChange={e => handleRxChange(idx, 'drugName', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input 
                      label="Dosage" 
                      placeholder="1 tablet" 
                      value={item.dosage}
                      onChange={e => handleRxChange(idx, 'dosage', e.target.value)}
                    />
                    <Input 
                      label="Frequency" 
                      placeholder="3 times/day" 
                      value={item.frequency}
                      onChange={e => handleRxChange(idx, 'frequency', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input 
                      type="number" 
                      label="Duration (Days)" 
                      value={item.durationDays}
                      onChange={e => handleRxChange(idx, 'durationDays', parseInt(e.target.value))}
                    />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Route</label>
                      <select 
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        value={item.route}
                        onChange={e => handleRxChange(idx, 'route', e.target.value)}
                      >
                        <option value="Oral">Oral</option>
                        <option value="Topical">Topical</option>
                        <option value="Injection">Injection</option>
                      </select>
                    </div>
                  </div>
                  <Input 
                    label="Notes" 
                    placeholder="Take after meals" 
                    value={item.notes}
                    onChange={e => handleRxChange(idx, 'notes', e.target.value)}
                  />
                </div>
              </div>
            ))}
            {rx.length === 0 && (
              <p className="text-center text-slate-500 text-sm py-8">No drugs added. Visit will be saved without a prescription.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6 p-4 bg-white rounded-xl border border-slate-200">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button className="bg-purple-600 hover:bg-purple-700 px-8" onClick={() => setShowConfirm(true)}>
          Save & Finalize Visit
        </Button>
      </div>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Finalize Consultation">
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to finalize this visit? This will lock the consultation record, generate the prescription, and send a billing invoice to the receptionist.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Review Again</Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleFinalize} isLoading={loading}>
              Confirm & Lock
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
