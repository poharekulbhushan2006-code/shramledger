import React, { useState } from 'react';
import { 
  PlusCircle, 
  X, 
  IndianRupee, 
  Calendar, 
  Building, 
  Clock, 
  CreditCard,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { speakText } from '../utils/ttsHelper';

export default function AddEntryModal({ 
  worker, 
  isOpen, 
  onClose, 
  onEntryAdded 
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    employer_name: 'Shree Ram Construction / आर. के. शर्मा',
    employer_phone: '9876543210',
    skill_type: worker?.primary_trade || 'राजमिस्त्री / Mason',
    skill_category: 'skilled',
    location: `${worker?.city || 'Delhi NCR'}`,
    hours_worked: 8.0,
    amount_paid: 800.0,
    payment_mode: 'Cash',
    evidence_type: 'manual_entry',
    evidence_text: 'Manual direct worker entry'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const entryPayload = {
        ...formData,
        id: `WRK-MAN-${Date.now().toString().slice(-6)}`,
        worker_id: worker?.id || 'worker_ramesh'
      };
      const added = await api.addEntry(worker?.id || 'worker_ramesh', entryPayload);
      speakText(`₹${added.amount_paid} का काम लेजर में जोड़ा गया।`);
      onEntryAdded(added);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to add entry');
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
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Log New Work & Wage Entry
              </h3>
              <p className="text-xs text-slate-400">
                Manual entry with automatic statutory minimum wage validation
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-400 block mb-1">Wage Amount (₹):</label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  value={formData.amount_paid}
                  onChange={(e) => setFormData({ ...formData, amount_paid: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-400 block mb-1">Work Date:</label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-400 block mb-1">Hours Worked:</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.hours_worked}
                onChange={(e) => setFormData({ ...formData, hours_worked: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-400 block mb-1">Payment Mode:</label>
              <select
                value={formData.payment_mode}
                onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Cash">Cash (नकद)</option>
                <option value="UPI">UPI (PhonePe / GPay)</option>
                <option value="Bank Transfer">Bank Account Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-400 block mb-1">Employer / Contractor Name:</label>
            <input
              type="text"
              required
              value={formData.employer_name}
              onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-400 block mb-1">Skill / Trade:</label>
              <input
                type="text"
                required
                value={formData.skill_type}
                onChange={(e) => setFormData({ ...formData, skill_type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-400 block mb-1">Location / Site:</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold transition-all hover:scale-105 shadow-lg shadow-orange-500/25 flex items-center space-x-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording...' : 'Add to Ledger'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
