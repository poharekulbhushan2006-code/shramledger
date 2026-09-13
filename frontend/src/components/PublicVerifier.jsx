import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  FileCheck, 
  Hash, 
  Sparkles, 
  AlertTriangle, 
  RefreshCw,
  Award,
  IndianRupee,
  Lock,
  Unlock
} from 'lucide-react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { TRANSLATIONS } from '../utils/locales';

export default function PublicVerifier({ initialCertId, currentLang }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [certInput, setCertInput] = useState(initialCertId || 'SHRAM-2026-WORK-8C2A1E90');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [tamperResult, setTamperResult] = useState(null);
  const [isTampering, setIsTampering] = useState(false);

  const handleVerify = async (idToVerify) => {
    const id = idToVerify || certInput;
    if (!id || id.trim().length === 0) {
      setErrorMsg('Please enter a certificate ID.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');
    setTamperResult(null);

    try {
      const res = await api.verifyCertificate(id.trim());
      setVerificationData(res);
      if (res.is_authentic) {
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed');
      setVerificationData(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSimulateTamperTest = async () => {
    setIsTampering(true);
    setTamperResult(null);
    try {
      const res = await api.simulateTamper({
        worker_id: verificationData?.certificate?.worker_id || 'worker_ramesh',
        fake_amount: 85000.0 // Synthetic inflation
      });
      setTamperResult(res);
    } catch (err) {
      setErrorMsg(err.message || 'Tamper simulation failed');
    } finally {
      setIsTampering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/20">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-100">
                  Bank & Scheme Verification Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                  Auditor Mode
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant cryptographic audit for Banks, NBFC credit officers, and Government welfare nodal desks
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Trust SHA-256 DAG</span>
          </div>
        </div>

        {/* Certificate Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Certificate ID e.g. SHRAM-2026-RAME-XXXX or worker_ramesh..."
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono shadow-inner"
            />
          </div>

          <button
            onClick={() => handleVerify()}
            disabled={isVerifying}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-extrabold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/25 hover:scale-105"
          >
            {isVerifying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>{isVerifying ? 'Auditing Proof...' : 'Verify Authenticity'}</span>
          </button>
        </div>

        {/* Quick Sample IDs for evaluators */}
        <div className="mt-3 flex items-center space-x-2 text-xs text-slate-400">
          <span>Quick test profiles:</span>
          {['worker_ramesh', 'worker_sunita', 'worker_rajesh'].map((wId) => (
            <button
              key={wId}
              onClick={() => {
                setCertInput(wId);
                handleVerify(wId);
              }}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition-colors"
            >
              {wId.replace('worker_', '')}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-3 shadow-lg">
          <XCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Verification Audit Result View */}
      {verificationData && verificationData.certificate && (
        <div className="space-y-6">
          
          {/* Status Verdict Header */}
          <div className={`p-5 rounded-3xl border shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 ${
            verificationData.is_authentic
              ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-500/50 shadow-emerald-500/10'
              : 'bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border-rose-500/50 shadow-rose-500/10'
          }`}>
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${
                verificationData.is_authentic
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {verificationData.is_authentic ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <ShieldAlert className="w-8 h-8" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                  Cryptographic Audit Verdict
                </span>
                <h3 className={`text-xl font-black ${
                  verificationData.is_authentic ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {verificationData.is_authentic
                    ? '100% CRYPTOGRAPHICALLY AUTHENTIC & VALID'
                    : 'TAMPER DETECTED: INVALID PROOF'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {verificationData.cryptographic_audit?.audit_message || 'Cryptographically verified against immutable Merkle tree.'}
                </p>
              </div>
            </div>

            {/* Fraud Simulation Trigger Button (Demonstration Feature) */}
            <button
              onClick={handleSimulateTamperTest}
              disabled={isTampering}
              className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all hover:scale-105 flex items-center space-x-2 shrink-0"
              title="Test how SHA-256 Merkle root prevents wage inflation fraud"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{isTampering ? 'Testing Tamper...' : 'Simulate Wage Fraud Test'}</span>
            </button>
          </div>

          {/* Tamper Simulation Live Result Box */}
          {tamperResult && (
            <div className="p-5 rounded-3xl bg-rose-950/40 border-2 border-rose-500/50 shadow-2xl space-y-3 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/30">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <Unlock className="w-4 h-4" />
                  <span>Fraud Tamper Injected (Recruiter Security Demo)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {tamperResult.verification_result || 'REJECTED (FRAUD DETECTED)'}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {tamperResult.explanation || tamperResult.alert || 'Tamper detected: Recalculated Merkle Root does not match sealed ledger block header.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">GENUINE MERKLE ROOT:</span>
                  <span className="text-emerald-400 break-all">{tamperResult.genuine_merkle_root || tamperResult.original_hash}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-rose-500/40">
                  <span className="text-rose-400 block text-[10px]">TAMPERED RECOMPUTED ROOT:</span>
                  <span className="text-rose-300 break-all">{tamperResult.tampered_recomputed_root || tamperResult.recalculated_hash}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                💡 {tamperResult.security_guarantee || "ShramLedger's Tamper-Evident Ledger guarantees that even a 1-paisa change invalidates the entire Merkle Root signature."}
              </p>
            </div>
          )}

          {/* Verified Worker Financial Card */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Worker Credential Information
                </span>
                <h4 className="text-lg font-bold text-slate-100 mt-0.5">
                  {verificationData.certificate.worker_name}
                </h4>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium">Trade & Sector</span>
                <p className="text-sm font-bold text-amber-400">
                  {verificationData.certificate.primary_trade}
                </p>
              </div>
            </div>

            {/* 4 Core Financial Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Verified Earnings</span>
                <span className="text-xl font-extrabold text-emerald-400 mt-1 block">
                  ₹{verificationData.certificate.total_earnings?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Est. Monthly Income</span>
                <span className="text-xl font-extrabold text-amber-300 mt-1 block">
                  ₹{verificationData.certificate.average_monthly_wage?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">ShramScore™</span>
                <span className="text-xl font-extrabold text-teal-400 mt-1 block">
                  {verificationData.certificate.shram_score} / 900
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Ledger Entries</span>
                <span className="text-xl font-extrabold text-slate-100 mt-1 block">
                  {verificationData.certificate.total_work_days} Days
                </span>
              </div>
            </div>

            {/* Cryptographic Technical Details */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center space-x-2 text-slate-400">
                <Hash className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-300 font-bold">MERKLE ROOT:</span>
                <span className="text-emerald-400 break-all">{verificationData.cryptographic_audit.merkle_root}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <FileCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-slate-300 font-bold">SIGNATURE:</span>
                <span className="text-cyan-300 break-all">{verificationData.cryptographic_audit.digital_signature}</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
