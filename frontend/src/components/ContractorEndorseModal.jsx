import React, { useState } from 'react';
import { 
  PhoneCall, 
  CheckCircle2, 
  X, 
  Check, 
  Building, 
  Calendar, 
  IndianRupee, 
  Clock,
  Sparkles,
  Share2
} from 'lucide-react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export default function ContractorEndorseModal({ 
  entry, 
  worker, 
  isOpen, 
  onClose, 
  onEndorsed 
}) {
  const [contractorName, setContractorName] = useState(entry?.employer_name?.split('/')[0]?.trim() || 'Ramesh Contractor');
  const [contractorPhone, setContractorPhone] = useState(entry?.employer_phone || '9876543210');
  const [note, setNote] = useState('Payment and work hours verified on site.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !entry) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.endorseEntry({
        entry_id: entry.id,
        contractor_name: contractorName,
        contractor_phone: contractorPhone,
        is_approved: true,
        note: note
      });
      confetti({ particleCount: 50, spread: 60 });
      setSuccessMsg('Entry successfully endorsed! Status updated to VERIFIED.');
      setTimeout(() => {
        onEndorsed(res);
        onClose();
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to endorse');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Contractor 1-Click Endorsement
              </h3>
              <p className="text-xs text-slate-400">
                Simulated WhatsApp / SMS verification link sent to employer
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Work Slip Details to Confirm */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Worker: <strong className="text-slate-200">{worker?.name}</strong></span>
            <span>Date: <strong className="text-slate-200">{entry.date}</strong></span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Claimed Wage</span>
              <span className="text-lg font-black text-emerald-400">₹{entry.amount_paid}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Work Hours</span>
              <span className="text-sm font-bold text-slate-200">{entry.hours_worked} Hours</span>
            </div>
          </div>

          <div className="text-xs text-slate-300">
            <span>Trade / Site: <strong>{entry.skill_type}</strong> @ {entry.location}</span>
          </div>
        </div>

        {/* Contractor Confirmation Input */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Contractor / Builder Name:
            </label>
            <input
              type="text"
              value={contractorName}
              onChange={(e) => setContractorName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Contractor Mobile Number:
            </label>
            <input
              type="text"
              value={contractorPhone}
              onChange={(e) => setContractorPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold transition-all hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Attesting...' : 'Confirm & Endorse (ठेकेदार सत्यापन)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
