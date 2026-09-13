import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Scan, 
  FileText, 
  Lock, 
  Award, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  Check, 
  X, 
  Layers, 
  QrCode,
  User,
  Zap
} from 'lucide-react';
import { api } from '../services/api';

export default function EndToEndDemoModal({ isOpen, onClose, worker, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Flow State
  const [evidenceImage, setEvidenceImage] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [validationData, setValidationData] = useState(null);
  const [fraudCheckData, setFraudCheckData] = useState(null);
  const [anchoredBlock, setAnchoredBlock] = useState(null);
  const [updatedScore, setUpdatedScore] = useState(null);
  const [passportCert, setPassportCert] = useState(null);

  if (!isOpen) return null;

  const STEPS = [
    { num: 1, title: 'Worker Profile', sub: 'Identity & Trade' },
    { num: 2, title: 'Upload Evidence', sub: 'Wage Slip Image' },
    { num: 3, title: 'OpenCV & OCR', sub: 'RapidOCR Pixels' },
    { num: 4, title: 'Wage Validation', sub: 'Statutory Benchmarks' },
    { num: 5, title: 'Fraud Radar', sub: 'Multi-Vector Audit' },
    { num: 6, title: 'Ledger Anchoring', sub: 'SHA-256 Merkle Block' },
    { num: 7, title: 'ShramScore', sub: '6-Dimension Rating' },
    { num: 8, title: 'Credit Readiness', sub: 'Lender Decisioning' },
    { num: 9, title: 'Work Passport', sub: 'Cryptographic QR' }
  ];

  // Automated Step 2 -> 3 Execution
  const handleRunOcr = async () => {
    setIsProcessing(true);
    try {
      const res = await api.ingestOCR({
        worker_id: worker?.id || 'worker_ramesh',
        slip_type: 'wage_slip'
      });
      setOcrData(res);
      setValidationData(res.validation || {
        is_valid: true,
        confidence_score: 97.5,
        positive_signals: ['Daily wage ₹850 meets regional skilled benchmark (₹750/day)', 'Valid contractor mobile (+91 9876543210)']
      });
      setCurrentStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 4 -> 5: Fraud Check
  const handleRunFraudCheck = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setFraudCheckData({
        shift_collision: 'CLEAN — No overlapping shift on 2026-09-11',
        wage_anomaly: 'NORMAL — Claimed ₹850 is 1.1x statutory baseline (Max permitted: 4.0x)',
        document_hash: 'UNIQUE — SHA-256 hash has not been submitted previously',
        status: 'PASSED_CLEAN'
      });
      setIsProcessing(false);
      setCurrentStep(5);
    }, 400);
  };

  // Step 5 -> 6: Ledger Anchoring
  const handleAnchorToLedger = async () => {
    setIsProcessing(true);
    try {
      const entryPayload = ocrData?.extracted_entry || {
        id: 'WRK-DEMO-01',
        worker_id: worker?.id || 'worker_ramesh',
        date: '2026-09-11',
        employer_name: 'Nirman Infrastructure (Rajesh Sharma)',
        employer_phone: '9876543210',
        skill_type: 'Mason / राजमिस्त्री',
        skill_category: 'skilled',
        location: 'Noida, Uttar Pradesh',
        hours_worked: 8.0,
        amount_paid: 850.0,
        payment_mode: 'Cash',
        evidence_type: 'wage_slip',
        confidence_score: 97.5
      };

      const added = await api.addEntry(worker?.id || 'worker_ramesh', entryPayload);
      setAnchoredBlock(added);

      const [scoreRes, certRes] = await Promise.all([
        api.getShramScore(worker?.id || 'worker_ramesh'),
        api.getCertificate(worker?.id || 'worker_ramesh')
      ]);

      setUpdatedScore(scoreRes);
      setPassportCert(certRes);
      setCurrentStep(6);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 1-Click Run Entire Pipeline
  const handleAutoRunFullDemo = async () => {
    setIsRunningAll(true);
    setCurrentStep(2);
    await new Promise(r => setTimeout(r, 600));

    // OCR
    const ocrRes = await api.ingestOCR({ worker_id: worker?.id || 'worker_ramesh', slip_type: 'wage_slip' });
    setOcrData(ocrRes);
    setCurrentStep(3);
    await new Promise(r => setTimeout(r, 800));

    // Validation
    setValidationData(ocrRes.validation || { is_valid: true, confidence_score: 97.5 });
    setCurrentStep(4);
    await new Promise(r => setTimeout(r, 600));

    // Fraud check
    setFraudCheckData({
      shift_collision: 'CLEAN — No overlapping shift on 2026-09-11',
      wage_anomaly: 'NORMAL — ₹850 is 1.1x statutory baseline',
      document_hash: 'UNIQUE — SHA-256 hash verified unique',
      status: 'PASSED_CLEAN'
    });
    setCurrentStep(5);
    await new Promise(r => setTimeout(r, 600));

    // Anchor to ledger
    const entryPayload = ocrRes?.extracted_entry || {
      amount_paid: 850,
      hours_worked: 8,
      date: '2026-09-11',
      employer_name: 'Nirman Infrastructure',
      skill_type: 'Mason'
    };
    const added = await api.addEntry(worker?.id || 'worker_ramesh', entryPayload);
    setAnchoredBlock(added);
    setCurrentStep(6);
    await new Promise(r => setTimeout(r, 700));

    // ShramScore
    const scoreRes = await api.getShramScore(worker?.id || 'worker_ramesh');
    setUpdatedScore(scoreRes);
    setCurrentStep(7);
    await new Promise(r => setTimeout(r, 600));

    // Credit readiness
    setCurrentStep(8);
    await new Promise(r => setTimeout(r, 600));

    // Passport
    const certRes = await api.getCertificate(worker?.id || 'worker_ramesh');
    setPassportCert(certRes);
    setCurrentStep(9);
    setIsRunningAll(false);

    if (onComplete) onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-slate-950 font-black">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100 font-['Outfit']">
                  End-to-End Credentialing &amp; Credit Pipeline
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                  Step {currentStep} of 9
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Informal Worker → Wage Slip Image → OpenCV &amp; RapidOCR → Verification → Fraud Check → Merkle Ledger → ShramScore → Passport
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoRunFullDemo}
              disabled={isRunningAll}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 disabled:opacity-50"
            >
              {isRunningAll ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>Auto-Play Full Flow (30s)</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="py-3 border-b border-slate-800/80 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[680px] gap-2 px-1">
            {STEPS.map((s) => (
              <div 
                key={s.num}
                onClick={() => !isRunningAll && setCurrentStep(s.num)}
                className={`flex items-center gap-2 cursor-pointer transition-all ${
                  currentStep === s.num 
                    ? 'text-emerald-400 font-bold' 
                    : currentStep > s.num 
                    ? 'text-slate-300' 
                    : 'text-slate-600'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                  currentStep === s.num
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-500/40'
                    : currentStep > s.num
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-900 border border-slate-800'
                }`}>
                  {currentStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="block truncate">{s.title}</span>
                </div>
                {s.num < 9 && <div className="w-3 h-0.5 bg-slate-800 mx-1 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Step Body */}
        <div className="flex-1 overflow-y-auto py-5 px-1">
          
          {/* STEP 1: Worker Profile */}
          {currentStep === 1 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-scale-up">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100">Step 1: Informal Worker Profile</h4>
                  <p className="text-xs text-slate-400">Verifying target worker identity and trade credentials</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Worker Name</span>
                  <span className="text-sm font-bold text-slate-200">{worker?.name || 'Ramesh Kumar (रमेश कुमार)'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Primary Trade</span>
                  <span className="text-sm font-bold text-emerald-400">{worker?.primary_trade || 'Mason / राजमिस्त्री'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Registered Phone</span>
                  <span className="text-sm font-mono text-slate-300">{worker?.phone || '+91 98765 43210'}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all hover:scale-105"
                >
                  <span>Proceed to Upload Wage Evidence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Upload Wage Evidence */}
          {currentStep === 2 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-scale-up">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Scan className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100">Step 2: Upload Wage Slip / Chit Evidence</h4>
                  <p className="text-xs text-slate-400">Worker or site engineer submits daily shift voucher image</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-slate-800 flex flex-col items-center justify-center space-y-3 text-center">
                <FileText className="w-10 h-10 text-emerald-400 animate-pulse" />
                <div>
                  <span className="text-sm font-bold text-slate-200 block">Nirman Infrastructure - Daily Shift Voucher (₹850)</span>
                  <span className="text-xs text-slate-400 font-mono">Date: 2026-09-11 · Format: Digital PNG Voucher</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button onClick={() => setCurrentStep(1)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs">Back</button>
                <button
                  onClick={handleRunOcr}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all hover:scale-105"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                  <span>Execute OpenCV Preprocessing &amp; RapidOCR</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OpenCV & RapidOCR Extraction */}
          {currentStep === 3 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-scale-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-100">Step 3: Deep-Learning OCR Extraction</h4>
                    <p className="text-xs text-slate-400">Extracted from image pixels with OpenCV CLAHE &amp; Otsu binarization</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                  OCR Confidence: {ocrData?.extracted_entry?.confidence_score || '97.5'}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Raw OCR Text Streams:</span>
                  <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-36 overflow-y-auto">
                    {ocrData?.raw_text || 'NIRMAN INFRASTRUCTURE PVT LTD\nDate: 02-09-2026\nWorker: Ramesh Kumar - Mason\nDaily Rate: Rs 850.00\nTotal Net Paid: Rs 950.00'}
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Extracted Entities:</span>
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between"><span>Amount Paid:</span><span className="font-bold text-emerald-400">₹{ocrData?.extracted_entry?.amount_paid || 850}</span></div>
                    <div className="flex justify-between"><span>Hours Worked:</span><span>{ocrData?.extracted_entry?.hours_worked || 8.0} hrs</span></div>
                    <div className="flex justify-between"><span>Employer:</span><span>{ocrData?.extracted_entry?.employer_name || 'Nirman Infrastructure'}</span></div>
                    <div className="flex justify-between"><span>Trade:</span><span>{ocrData?.extracted_entry?.skill_type || 'Mason / राजमिस्त्री'}</span></div>
                    <div className="flex justify-between"><span>Phone:</span><span className="font-mono text-cyan-400">{ocrData?.extracted_entry?.employer_phone || '9876543210'}</span></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button onClick={() => setCurrentStep(2)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs">Back</button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all hover:scale-105"
                >
                  <span>Validate Statutory Benchmarks</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Wage Validation */}
          {currentStep === 4 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-scale-up">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100">Step 4: Statutory Wage Validation</h4>
                  <p className="text-xs text-slate-400">Cross-checking against state minimum wage baselines</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Statutory Compliance Verified: PASS</span>
                </div>
                <p className="text-xs text-slate-300">
                  Claimed daily wage of ₹{ocrData?.extracted_entry?.amount_paid || 850} meets or exceeds Delhi NCR skilled baseline (₹750/day).
                </p>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button onClick={() => setCurrentStep(3)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs">Back</button>
                <button
                  onClick={handleRunFraudCheck}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all hover:scale-105"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Execute Multi-Vector Fraud Check</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Fraud Check */}
          {currentStep === 5 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-scale-up">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100">Step 5: Multi-Vector Fraud &amp; Anomaly Engine</h4>
                  <p className="text-xs text-slate-400">Heuristic audit: shift collisions, wage outliers, and document deduplication</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Shift Collisions</span>
                  <span className="text-xs text-emerald-400 font-bold">0 Detected (Clean)</span>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Wage Spike Outlier</span>
                  <span className="text-xs text-emerald-400 font-bold">Normal (1.1x benchmark)</span>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Doc Hash Deduplication</span>
                  <span className="text-xs text-emerald-400 font-bold">Unique SHA-256 Hash</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button onClick={() => setCurrentStep(4)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs">Back</button>
                <button
                  onClick={handleAnchorToLedger}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all hover:scale-105"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  <span>Anchor Record to Merkle Ledger</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Ledger Anchoring */}
          {currentStep === 6 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-scale-up">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100">Step 6: Cryptographic SHA-256 Merkle Anchoring</h4>
                  <p className="text-xs text-slate-400">Entry canonicalized and linked into the immutable DAG chain</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Entry Canonical Digest:</span>
                  <span className="text-emerald-400 font-bold break-all">{anchoredBlock?.entry_hash?.slice(0, 32) || '3f8b9a1c4d2e5f6a7b8c9d0e1f2a3b4c'}...</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Merkle Root Anchor:</span>
                  <span className="text-cyan-400 font-bold break-all">{passportCert?.merkle_root?.slice(0, 32) || '8c2a1e904f3b1900d87a2c4e6f1a3b5c'}...</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Tamper-Proof Status:</span>
                  <span className="text-emerald-400">MATHEMATICALLY SECURED</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button onClick={() => setCurrentStep(5)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs">Back</button>
                <button
                  onClick={() => setCurrentStep(7)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all hover:scale-105"
                >
                  <span>Recalculate ShramScore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: ShramScore Recalculation */}
          {currentStep === 7 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-scale-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-100">Step 7: Explainable ShramScore Recalculation</h4>
                    <p className="text-xs text-slate-400">Evaluated across 6 transparent dimensions on 300–900 scale</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400 font-mono">{updatedScore?.overall_score || 835}</span>
                  <span className="text-xs text-slate-400 block font-bold">Grade {updatedScore?.grade || 'A+'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">Income Stability: <span className="font-bold text-emerald-400">96%</span></div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">Work Continuity: <span className="font-bold text-emerald-400">88%</span></div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">Verified Earnings: <span className="font-bold text-emerald-400">82%</span></div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">Employer Endorsement: <span className="font-bold text-emerald-400">75%</span></div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">Evidence Quality: <span className="font-bold text-emerald-400">92%</span></div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">Skill Demand Tier: <span className="font-bold text-emerald-400">90%</span></div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button onClick={() => setCurrentStep(6)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs">Back</button>
                <button
                  onClick={() => setCurrentStep(8)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all hover:scale-105"
                >
                  <span>View Credit Readiness</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: Credit Readiness */}
          {currentStep === 8 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 animate-scale-up">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100">Step 8: Credit-Readiness Assessment</h4>
                  <p className="text-xs text-slate-400">Defensible underwriting output for micro-finance lenders</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 space-y-2">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                  Institutional Credit Readiness
                </span>
                <div className="text-lg font-black text-slate-100">
                  Credit Readiness: High — subject to lender policy and human review.
                </div>
                <p className="text-xs text-slate-300">
                  Transparent, non-black-box evidence profile ready for lender policy engine evaluation under DPDP Act 2023.
                </p>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button onClick={() => setCurrentStep(7)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs">Back</button>
                <button
                  onClick={() => setCurrentStep(9)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all hover:scale-105"
                >
                  <span>Generate Digital Work Passport</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 9: Digital Work Passport */}
          {currentStep === 9 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/40 space-y-4 animate-scale-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500 text-slate-950 font-black">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-100 font-['Outfit']">
                      Step 9: Digital Work Passport Issued!
                    </h4>
                    <p className="text-xs text-emerald-300">Cryptographically signed and QR-verifiable income passport</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                  ACTIVE PASSPORT
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Passport ID</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{passportCert?.certificate_id || 'SHRAM-2026-RAME-8C2A1E'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Merkle Root</span>
                  <span className="text-xs font-mono text-slate-300 truncate block">{passportCert?.merkle_root?.slice(0, 16) || '8c2a1e904f3b...'}...</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">DPDP 2023 Consent</span>
                  <span className="text-xs font-bold text-emerald-400">Active &amp; Revocable</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button onClick={() => setCurrentStep(1)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs">Restart Flow</button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all hover:scale-105"
                >
                  Complete &amp; Return to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
