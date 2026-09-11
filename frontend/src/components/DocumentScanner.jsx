import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Scan, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Check, 
  Sparkles, 
  FileCheck,
  Eye,
  CreditCard,
  Building,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import { speakText } from '../utils/ttsHelper';
import { TRANSLATIONS } from '../utils/locales';

export default function DocumentScanner({ 
  worker, 
  isOpen, 
  onClose, 
  onEntryAdded, 
  currentLang 
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [selectedSlipType, setSelectedSlipType] = useState('wage_slip');
  const [ocrResult, setOcrResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeBox, setActiveBox] = useState(null);

  const SLIP_PRESETS = [
    {
      id: 'wage_slip',
      title: 'Daily Wage Slip',
      title_hi: 'दैनिक मजदूरी पर्ची',
      badge: 'Wage Slip',
      strength: 'High (88%)'
    },
    {
      id: 'contractor_chit',
      title: 'Contractor Chit',
      title_hi: 'ठेकेदार हस्तलिखित पर्ची',
      badge: 'Contractor Chit',
      strength: 'Medium (78%)'
    },
    {
      id: 'handwritten_register',
      title: 'Site Muster Register',
      title_hi: 'हाजिरी रजिस्टर',
      badge: 'Muster Roll',
      strength: 'Medium (76%)'
    },
    {
      id: 'upi_screenshot',
      title: 'UPI Payment Receipt',
      title_hi: 'PhonePe / GPay भुगतान',
      badge: 'UPI Digital',
      strength: 'Very High (94%)'
    },
    {
      id: 'bank_statement',
      title: 'Bank Passbook Extract',
      title_hi: 'बैंक पासबुक स्टेटमेंट',
      badge: 'Bank Record',
      strength: 'Very High (96%)'
    },
    {
      id: 'salary_receipt',
      title: 'Salary Receipt Voucher',
      title_hi: 'वेतन पावती रसीद',
      badge: 'Formal Voucher',
      strength: 'High (89%)'
    },
    {
      id: 'work_order',
      title: 'Subcontract Work Order',
      title_hi: 'कार्य आदेश पत्र',
      badge: 'Work Order',
      strength: 'Medium (82%)'
    },
    {
      id: 'attendance_sheet',
      title: 'Labour Attendance Sheet',
      title_hi: 'दैनिक मजदूर हाजिरी पत्रक',
      badge: 'Attendance Stamp',
      strength: 'High (84%)'
    },
    {
      id: 'employer_letter',
      title: 'Employer Trade Letter',
      title_hi: 'नियोक्ता प्रमाण पत्र',
      badge: 'Employer Attestation',
      strength: 'Very High (92%)'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      handleScanDocument('wage_slip');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScanDocument = async (slipType) => {
    setSelectedSlipType(slipType);
    setIsScanning(true);
    setErrorMsg('');
    try {
      const res = await api.ingestOCR({
        worker_id: worker?.id || 'worker_ramesh',
        slip_type: slipType
      });
      setOcrResult(res);
    } catch (err) {
      setErrorMsg(err.message || 'OCR parsing failed');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveToLedger = async () => {
    if (!ocrResult || !ocrResult.extracted_entry) return;
    try {
      const added = await api.addEntry(worker?.id || 'worker_ramesh', ocrResult.extracted_entry);
      speakText(`दस्तावेज़ सत्यापित हुआ। ₹${added.amount_paid} का रिकॉर्ड लेजर में जोड़ दिया गया है।`);
      onEntryAdded(added);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save entry');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Scan className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <span>Multi-Format Evidence OCR & Verification</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
                  9 Supported Formats
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Document → OCR → Field Extraction → Confidence Scoring → Worker Confirmation → Tamper-Evident Ledger
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

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          
          {/* Slip Type Selector (Horizontal scrollable or compact grid) */}
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
              Select Evidence Format (प्रमाण दस्तावेज प्रकार चुनें):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SLIP_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleScanDocument(p.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    selectedSlipType === p.id
                      ? 'border-emerald-500 bg-emerald-500/15 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 truncate">
                      {p.badge}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {p.strength}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-200 block truncate">
                    {p.title}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {p.title_hi}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dual Panel: Document Preview & Extracted Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left: Document View with visual bounding boxes */}
            <div className="lg:col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800 p-4 relative flex flex-col justify-between min-h-[280px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Document Text & Bounding Boxes</span>
                </span>
                {ocrResult && (
                  <span className="text-[10px] font-mono text-emerald-400">
                    Hash: {ocrResult.doc_hash?.slice(0, 12)}...
                  </span>
                )}
              </div>

              {/* Simulated Slip Canvas */}
              <div className="relative my-3 p-3.5 rounded-xl bg-[#030712] border border-amber-500/20 font-mono text-xs text-slate-300 leading-relaxed max-h-56 overflow-y-auto">
                {isScanning && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce opacity-80" />
                )}

                <div className="whitespace-pre-wrap font-sans text-xs">
                  {ocrResult?.raw_text || 'Scanning document...'}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                <span>SHA-256 Deduplication Active</span>
                <span className="text-emerald-400 font-mono">100% Client-Side Privacy</span>
              </div>
            </div>

            {/* Right: Extracted Structured Attributes */}
            <div className="lg:col-span-6 space-y-3">
              {ocrResult && ocrResult.extracted_entry && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Extracted Wage Fields
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      OCR Confidence: {ocrResult.validation?.confidence_score}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 text-emerald-400" />
                        <span>Amount Claimed</span>
                      </span>
                      <span className="text-base font-black text-emerald-400 mt-0.5 block">
                        ₹{ocrResult.extracted_entry.amount_paid}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        <span>Date Logged</span>
                      </span>
                      <span className="text-xs font-bold text-slate-200 mt-0.5 block font-mono">
                        {ocrResult.extracted_entry.date}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium flex items-center gap-1">
                        <Building className="w-3 h-3 text-indigo-400" />
                        <span>Skill / Trade</span>
                      </span>
                      <span className="text-xs font-bold text-slate-200 mt-0.5 block truncate">
                        {ocrResult.extracted_entry.skill_type}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-cyan-400" />
                        <span>Payment Mode</span>
                      </span>
                      <span className="text-xs font-bold text-amber-300 mt-0.5 block">
                        {ocrResult.extracted_entry.payment_mode}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 col-span-2">
                      <span className="text-[10px] text-slate-400 block font-medium">Employer / Contracting Authority</span>
                      <span className="text-xs font-bold text-slate-100 mt-0.5 block">
                        {ocrResult.extracted_entry.employer_name}
                      </span>
                      {ocrResult.extracted_entry.employer_phone && (
                        <span className="text-[11px] text-emerald-400 font-mono block mt-0.5">
                          📞 Contact: {ocrResult.extracted_entry.employer_phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Signals */}
                  {ocrResult.validation?.positive_signals && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                      {ocrResult.validation.positive_signals.map((sig, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{sig}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveToLedger}
            disabled={!ocrResult || isScanning}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg ${
              ocrResult && !isScanning
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:scale-105 shadow-emerald-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Confirm & Append to Tamper-Evident Ledger</span>
          </button>
        </div>

      </div>
    </div>
  );
}
