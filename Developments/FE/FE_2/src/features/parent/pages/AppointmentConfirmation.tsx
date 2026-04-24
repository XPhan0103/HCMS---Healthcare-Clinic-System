import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export default function AppointmentConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-emerald-100 max-w-md w-full text-center relative overflow-hidden animate-bounce-in">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-green-500" />
        
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-emerald-50">
          <CheckCircle className="text-emerald-600 w-12 h-12 animate-pulse" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
        <p className="text-slate-500 mb-8">
          Your appointment has been successfully created. We have sent a confirmation SMS to your registered phone number.
        </p>

        <div className="bg-green-50 rounded-lg p-4 mb-8 text-left border border-green-100">
          <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
            <Calendar size={18} /> Appointment Details
          </h3>
          <p className="text-sm text-green-800"><strong>Patient:</strong> Nguyễn Bảo An</p>
          <p className="text-sm text-green-800"><strong>Doctor:</strong> BS. Minh</p>
          <p className="text-sm text-green-800"><strong>Time:</strong> 09:00 AM - Jun 01, 2026</p>
        </div>

        <div className="space-y-3">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700" 
            onClick={() => navigate('/parent/dashboard')}
          >
            Go to Dashboard
          </Button>
          <Button 
            variant="outline" 
            className="w-full text-slate-600"
            onClick={() => navigate('/parent/records')}
          >
            View Medical Records <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
