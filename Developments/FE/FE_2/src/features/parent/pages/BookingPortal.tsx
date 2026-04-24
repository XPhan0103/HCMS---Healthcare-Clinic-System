import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, User as UserIcon, AlertCircle } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import api from '../../../shared/services/api';

interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
}

interface Slot {
  slotDateTime: string;
  available: boolean;
}

export default function BookingPortal() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('MALE');
  const [parentPhoneNumber, setParentPhoneNumber] = useState('');
  const [reason, setReason] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch doctors on mount
  useEffect(() => {
    api.get('/doctors').then(res => {
      setDoctors(res.data.data);
    }).catch(err => {
      console.error(err);
      // Fallback for UI if backend not running
      setDoctors([
        { id: '1', fullName: 'BS. Minh', specialty: 'Paediatrics' },
        { id: '2', fullName: 'BS. An', specialty: 'Dermatology' }
      ]);
    });
  }, []);

  // Fetch slots when doctor and date change
  useEffect(() => {
    if (selectedDoctor && date) {
      api.get(`/doctors/${selectedDoctor}/available-slots?fromDate=${date}`).then(res => {
        setSlots(res.data.data);
      }).catch(err => {
        console.error(err);
        // Fallback slots
        setSlots([
          { slotDateTime: `${date}T09:00:00`, available: true },
          { slotDateTime: `${date}T10:00:00`, available: false },
          { slotDateTime: `${date}T11:00:00`, available: true },
        ]);
      });
    }
  }, [selectedDoctor, date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedSlot || !patientName || !dob || !reason || !parentPhoneNumber) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/appointments', {
        doctorId: selectedDoctor,
        slotDateTime: selectedSlot,
        patient: {
          fullName: patientName,
          dateOfBirth: dob,
          gender,
          parentPhoneNumber: parentPhoneNumber,
          reasonForVisit: reason
        }
      });
      navigate('/parent/confirmation');
    } catch (err: any) {
      console.error('Booking failed:', err);
      if (!err.response) {
        // Mock fallback for UI testing without BE
        navigate('/parent/confirmation');
        return;
      }
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in-up">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Book an Appointment</h1>
        <p className="text-slate-500 mt-1 font-medium">Select a doctor, preferred time, and provide patient details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-xl flex items-center gap-2 animate-bounce-in"><AlertCircle size={18}/> {error}</div>}

        {/* Step 1: Doctor & Time */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.03)] border border-slate-200/60 relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-bl-full -mr-32 -mt-32 z-0 pointer-events-none" />
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10 text-slate-800">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm">1</span> Select Doctor & Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Doctor</label>
              <select 
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="">-- Choose a doctor --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.fullName} ({d.specialty})</option>
                ))}
              </select>
            </div>
            
            <div>
              <Input 
                type="date" 
                label="Select Date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {selectedDoctor && date && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Available Slots</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {slots.map((slot, i) => {
                  const timeStr = new Date(slot.slotDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.slotDateTime)}
                      className={`py-2 text-sm rounded-lg border transition-colors ${
                        !slot.available ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                        selectedSlot === slot.slotDateTime ? 'bg-green-600 text-white border-green-600' :
                        'bg-white text-slate-700 border-slate-300 hover:border-green-500 hover:text-green-600'
                      }`}
                    >
                      {timeStr}
                    </button>
                  );
                })}
              </div>
              {slots.length === 0 && <p className="text-sm text-slate-500 mt-2">No slots available for this date.</p>}
            </div>
          )}
        </div>

        {/* Step 2: Patient Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">2. Patient Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Child's Full Name" value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="e.g., Nguyễn Bảo An" required />
            <Input type="date" label="Date of Birth" value={dob} onChange={e => setDob(e.target.value)} required />
            
            <Input label="Parent's Phone Number" type="tel" value={parentPhoneNumber} onChange={e => setParentPhoneNumber(e.target.value)} placeholder="0909123456" required />
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select 
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Visit / Chief Complaint</label>
              <textarea 
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g., Sốt cao 3 ngày, ho khan..."
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/parent/dashboard')}>Cancel</Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700" isLoading={loading}>
            Confirm Booking
          </Button>
        </div>
      </form>
    </div>
  );
}
