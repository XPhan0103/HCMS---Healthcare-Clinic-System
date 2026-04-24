import { useState } from 'react';
import { FileText, Search, Pill, Stethoscope } from 'lucide-react';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Modal } from '../../../shared/components/Modal';

export default function ClinicalNotes() {
  const [selectedVisit, setSelectedVisit] = useState<any>(null);

  // Mock data for display
  const visits = [
    {
      id: 'v1',
      date: '2026-05-15',
      doctor: 'BS. Minh',
      symptoms: 'Sốt 38.5°C, ho khan',
      diagnosis: 'Upper Respiratory Tract Infection (J06.9)',
      aftercare: 'Uống nhiều nước. Tái khám sau 3 ngày nếu không giảm sốt.',
      prescription: [
        { name: 'Amoxicillin 250mg', dose: '1 tablet', freq: '3 times/day', duration: '5 days' },
        { name: 'Paracetamol 500mg', dose: '1 tablet', freq: 'When fever > 38.5°C', duration: '3 days' }
      ]
    },
    {
      id: 'v2',
      date: '2025-12-10',
      doctor: 'BS. An',
      symptoms: 'Nổi mẩn đỏ ở tay và ngực',
      diagnosis: 'Allergic contact dermatitis (L23.9)',
      aftercare: 'Tránh tiếp xúc với xà phòng lạ.',
      prescription: [
        { name: 'Cetirizine 10mg', dose: '1/2 tablet', freq: 'Once daily at night', duration: '7 days' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clinical Notes & Records</h1>
          <p className="text-slate-500">View past visit histories, diagnoses, and prescriptions.</p>
        </div>
        <div className="w-64">
          <Input 
            placeholder="Search by date or doctor..." 
            className="pl-10" 
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {visits.map((visit) => (
            <div key={visit.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-lg text-slate-900">{visit.diagnosis}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{visit.date}</span>
                </div>
                <p className="text-sm text-slate-500">Treated by: <strong className="text-slate-700">{visit.doctor}</strong></p>
                <p className="text-sm text-slate-500 mt-2 max-w-2xl line-clamp-1">Symptoms: {visit.symptoms}</p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setSelectedVisit(visit)}
                className="shrink-0"
              >
                <FileText className="mr-2 w-4 h-4" /> View Details
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedVisit}
        onClose={() => setSelectedVisit(null)}
        title={`Visit Record - ${selectedVisit?.date}`}
        className="max-w-2xl"
      >
        {selectedVisit && (
          <div className="space-y-6">
            {/* Clinical Info */}
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                <Stethoscope className="text-green-600 w-5 h-5" /> Clinical Diagnosis
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Doctor</p>
                  <p className="text-sm font-medium text-slate-900">{selectedVisit.doctor}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Reported Symptoms</p>
                  <p className="text-sm text-slate-700">{selectedVisit.symptoms}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Final Diagnosis</p>
                  <p className="text-sm font-medium text-red-600">{selectedVisit.diagnosis}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Aftercare Instructions</p>
                  <p className="text-sm text-slate-700">{selectedVisit.aftercare}</p>
                </div>
              </div>
            </div>

            {/* Prescription */}
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                <Pill className="text-green-600 w-5 h-5" /> E-Prescription
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="p-3 font-medium">Medication</th>
                      <th className="p-3 font-medium">Dosage</th>
                      <th className="p-3 font-medium">Frequency</th>
                      <th className="p-3 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedVisit.prescription.map((rx: any, idx: number) => (
                      <tr key={idx} className="bg-white">
                        <td className="p-3 font-medium text-slate-900">{rx.name}</td>
                        <td className="p-3 text-slate-600">{rx.dose}</td>
                        <td className="p-3 text-slate-600">{rx.freq}</td>
                        <td className="p-3 text-slate-600">{rx.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
