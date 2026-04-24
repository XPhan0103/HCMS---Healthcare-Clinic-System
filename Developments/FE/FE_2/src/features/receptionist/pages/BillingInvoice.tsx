import { useState } from 'react';
import { FileCheck, CreditCard, Receipt } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Table } from '../../../shared/components/Table';
import { Modal } from '../../../shared/components/Modal';

export default function BillingInvoice() {
  const [isPaid, setIsPaid] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const mockInvoice = {
    invoiceNo: 'INV-20260601-001',
    patientName: 'Nguyễn Bảo An',
    doctorName: 'BS. Minh',
    date: 'Jun 01, 2026',
    items: [
      { id: 1, name: 'Consultation Fee', qty: 1, price: 150000, total: 150000 },
      { id: 2, name: 'Amoxicillin 250mg', qty: 15, price: 5000, total: 75000 }
    ],
    total: 225000
  };

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setIsPaid(true);
      setLoading(false);
      setShowConfirm(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing & Invoice</h1>
          <p className="text-slate-500">Collect payment and issue receipt.</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 font-mono font-medium shadow-sm flex items-center gap-2">
          <Receipt size={18} className="text-slate-400" />
          {mockInvoice.invoiceNo}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Invoice Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Billed To</h2>
            <p className="text-lg font-bold text-slate-900">{mockInvoice.patientName}</p>
            <p className="text-slate-600 mt-1">Treated by: {mockInvoice.doctorName}</p>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Date</h2>
            <p className="font-medium text-slate-900">{mockInvoice.date}</p>
            <div className="mt-4">
              {isPaid ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                  <FileCheck size={16} /> PAID
                </span>
              ) : (
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-bold">
                  UNPAID
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="p-8">
          <table className="w-full text-left">
            <thead className="border-b border-slate-200 text-slate-500 text-sm">
              <tr>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium text-center">Qty</th>
                <th className="pb-3 font-medium text-right">Unit Price (VND)</th>
                <th className="pb-3 font-medium text-right">Amount (VND)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {mockInvoice.items.map(item => (
                <tr key={item.id}>
                  <td className="py-4 font-medium text-slate-900">{item.name}</td>
                  <td className="py-4 text-center">{item.qty}</td>
                  <td className="py-4 text-right">{item.price.toLocaleString()}</td>
                  <td className="py-4 text-right font-medium">{item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200">
                <td colSpan={3} className="py-6 text-right font-bold text-slate-900 text-lg">Total Amount</td>
                <td className="py-6 text-right font-bold text-slate-900 text-2xl text-orange-600">
                  {mockInvoice.total.toLocaleString()} ₫
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Actions */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
          <Button variant="outline" onClick={() => window.print()}>
            <Receipt className="mr-2" size={18} /> Print Invoice
          </Button>
          {!isPaid && (
            <Button 
              className="bg-green-600 hover:bg-green-700 px-8" 
              onClick={() => setShowConfirm(true)}
            >
              <CreditCard className="mr-2" size={18} /> Process Payment
            </Button>
          )}
        </div>
      </div>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Payment">
        <div className="space-y-4">
          <p className="text-slate-600">
            Confirm receiving payment of <strong className="text-slate-900">{mockInvoice.total.toLocaleString()} ₫</strong> from {mockInvoice.patientName}?
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handlePayment} isLoading={loading}>
              Confirm 1-Click Paid
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
