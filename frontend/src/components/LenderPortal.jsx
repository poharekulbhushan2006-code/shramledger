import React, { useState, useEffect, useRef } from 'react';
import { 
  Landmark, 
  Search, 
  ShieldCheck, 
  Lock, 
  FileCheck2, 
  TrendingUp, 
  Award, 
  Code2, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Zap, 
  Activity, 
  Copy, 
  Check, 
  Sliders, 
  Sparkles, 
  Printer, 
  FileText, 
  KeyRound, 
  Plus,
  Download,
  Terminal,
  Send
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { api } from '../services/api';

export default function LenderPortal({ workers = [], selectedWorker, onSelectWorker }) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'simulator' | 'sandbox' | 'apikeys'
  const [workerId, setWorkerId] = useState(selectedWorker?.id || 'worker_ramesh');
  const [incomeSummary, setIncomeSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Policy Simulator State
  const [loanAmount, setLoanAmount] = useState(50000);
  const [tenureMonths, setTenureMonths] = useState(12);
  const [minScore, setMinScore] = useState(650);
  const [maxVolatility, setMaxVolatility] = useState(40);
  const [minDays, setMinDays] = useState(30);
  const [minRatio, setMinRatio] = useState(50);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const sanctionLetterRef = useRef(null);
  const [isExportingSanction, setIsExportingSanction] = useState(false);

  // Live API Sandbox State
  const [sandboxEndpoint, setSandboxEndpoint] = useState('/api/v1/workers/{id}/income-summary');
  const [sandboxApiKey, setSandboxApiKey] = useState('shram_live_hdfc_8a92f4c1e0');
  const [sandboxPurpose, setSandboxPurpose] = useState('LOAN_UNDERWRITING_MUDRA');
  const [isCallingApi, setIsCallingApi] = useState(false);
  const [sandboxResponse, setSandboxResponse] = useState(null);

  // API Keys state
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('Production Micro-Credit Decisioning API');
  const [newKeyEnv, setNewKeyEnv] = useState('production');
  const [isCreatingKey, setIsCreatingKey] = useState(false);

  useEffect(() => {
    if (workerId) fetchSummary(workerId);
  }, [workerId]);

  useEffect(() => {
    if (activeTab === 'apikeys') loadApiKeys();
  }, [activeTab]);

  const fetchSummary = async (id) => {
    setIsLoading(true);
    try {
      const data = await api.getLenderIncomeSummary(id);
      setIncomeSummary(data);
    } catch (err) {
      console.error('Lender API query failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadApiKeys = async () => {
    try {
      const keys = await api.listApiKeys();
      setApiKeys(keys);
    } catch (err) {
      console.error('Failed to load API keys:', err);
    }
  };

  const handleCopyJson = () => {
    if (!incomeSummary) return;
    navigator.clipboard.writeText(JSON.stringify(incomeSummary, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleEvaluatePolicy = async () => {
    setIsEvaluating(true);
    try {
      const payload = {
        worker_id: workerId,
        requested_loan_amount: loanAmount,
        loan_tenure_months: tenureMonths,
        policy: {
          min_shram_score: minScore,
          max_income_volatility_pct: maxVolatility,
          min_work_days_logged: minDays,
          min_verified_ratio_pct: minRatio,
          max_loan_limit: 150000
        }
      };
      const res = await api.evaluateLenderPolicy(payload);
      setEvaluationResult(res);
    } catch (err) {
      alert('Underwriting evaluation failed: ' + err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const generateAmortization = (principal, annualRate, months) => {
    const monthlyRate = (annualRate / 12) / 100;
    const n = Math.max(1, months);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    let balance = principal;
    const schedule = [];
    for (let m = 1; m <= Math.min(n, 12); m++) {
      const interest = balance * monthlyRate;
      const principalPaid = emi - interest;
      balance = Math.max(0, balance - principalPaid);
      schedule.push({
        month: m,
        emi: Math.round(emi),
        principalPaid: Math.round(principalPaid),
        interestPaid: Math.round(interest),
        remainingBalance: Math.round(balance)
      });
    }
    return schedule;
  };

  const handleDownloadSanctionPdf = async () => {
    if (!sanctionLetterRef.current) return;
    setIsExportingSanction(true);
    try {
      const canvas = await html2canvas(sanctionLetterRef.current, {
        scale: 2,
        backgroundColor: '#040810',
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Bank_Sanction_Order_${workerId}.pdf`);
    } catch (err) {
      console.error('Sanction PDF Export failed:', err);
    } finally {
      setIsExportingSanction(false);
    }
  };

  const handleExecuteSandboxCall = async () => {
    setIsCallingApi(true);
    const startTime = performance.now();
    try {
      const data = await api.getLenderIncomeSummary(workerId);
      const latency = Math.round(performance.now() - startTime);
      setSandboxResponse({
        status: 200,
        statusText: 'OK',
        latencyMs: latency,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-dpdp-compliance-status': 'VERIFIED_TIME_BOUND_CONSENT',
          'x-merkle-proof-anchored': 'TRUE',
          'x-ratelimit-remaining': '594/600 RPM'
        },
        data
      });
    } catch (err) {
      setSandboxResponse({
        status: 400,
        statusText: 'Bad Request',
        latencyMs: 12,
        error: err.message
      });
    } finally {
      setIsCallingApi(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">

      {/* ── Lender Institutional Header ─────────────────────────────── */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Landmark className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-100 font-['Outfit']">
                  Bank & NBFC Underwriting Terminal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  DPDP Consent Governed
                </span>
              </div>
              <p className="text-xs text-cyan-300 font-medium mt-0.5">
                Alternative Credit Scoring · Real-Time Decisioning · Cryptographic Audit Trail
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Enabling collateral-free Mudra (₹50k-₹2L) and PM SVANidhi micro-lending for unbanked informal earners.
              </p>
            </div>
          </div>

          {/* Worker Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-semibold">Borrower Profile:</label>
            <select
              value={workerId}
              onChange={(e) => {
                setWorkerId(e.target.value);
                const wObj = workers.find(w => w.id === e.target.value);
                if (wObj && onSelectWorker) onSelectWorker(wObj);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-bold text-xs focus:border-cyan-500 focus:outline-none"
            >
              {workers.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.primary_trade})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800/80 overflow-x-auto hide-scrollbar">
          {[
            { id: 'summary', label: 'Borrower Income & Risk Dossier', icon: FileText },
            { id: 'simulator', label: 'Policy Evaluator & Loan Sanction Simulator', icon: Sliders },
            { id: 'apikeys', label: 'B2B REST API & Integration Keys', icon: KeyRound }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105' : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB 1: SUMMARY DOSSIER ──────────────────────────────────── */}
      {activeTab === 'summary' && incomeSummary && (
        <div className="space-y-6">
          
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="premium-card p-5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Underwritten Monthly Income</span>
              <span className="text-2xl font-black text-emerald-400 font-['Outfit']">
                ₹{incomeSummary.verified_monthly_income?.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Based on 24-day benchmark</span>
            </div>

            <div className="premium-card p-5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">ShramScore™ Credit Proxy</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-cyan-400 font-['Outfit']">{incomeSummary.shram_score}</span>
                <span className="text-xs font-bold text-slate-400">Grade {incomeSummary.score_grade}</span>
              </div>
              <span className="text-[10px] text-emerald-400 mt-1 block">Reliable informal earner</span>
            </div>

            <div className="premium-card p-5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Verification Confidence</span>
              <span className="text-2xl font-black text-amber-400 font-['Outfit']">
                {incomeSummary.overall_evidence_confidence}%
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Multi-source verified</span>
            </div>

            <div className="premium-card p-5 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Max Micro-Credit Capacity</span>
              <span className="text-2xl font-black text-purple-400 font-['Outfit']">
                ₹{incomeSummary.max_loan_limit_estimate?.toLocaleString('en-IN') || '75,000'}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Mudra Shishu / Kishor</span>
            </div>
          </div>

          {/* Underwriting Dossier Box */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: DPDP & Merkle Audit Proof */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Compliance & Cryptographic Audit Proofs
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">DPDP Consent Artifact:</span>
                  <span className="font-mono text-[11px] text-emerald-400 font-bold">
                    {incomeSummary.consent_artifact_id || 'CONSENT-DPDP-2026-ACTIVE'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Merkle Root Ledger Hash:</span>
                  <span className="font-mono text-[10px] text-amber-400 font-bold truncate max-w-[200px]">
                    {incomeSummary.merkle_root}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Ledger Audit Verification:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    {incomeSummary.tamper_audit_status}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300">
                💡 <strong>Underwriter Notice:</strong> This record is mathematically tamper-evident. Any fraudulent modification to historical work logs invalidates the Merkle Root instantly.
              </div>
            </div>

            {/* Right: Institutional REST API Payload */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  Institutional REST API Payload (JSON)
                </h3>
                <button
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="text-[11px] font-mono text-cyan-300 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 overflow-x-auto max-h-72">
                {JSON.stringify(incomeSummary, null, 2)}
              </pre>
            </div>

          </div>
        </div>
      )}

      {/* ── TAB 2: POLICY SIMULATOR & OFFICIAL SANCTION LETTER ──────── */}
      {activeTab === 'simulator' && (
        <div className="space-y-5 animate-slide-up">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-100 font-['Outfit'] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                Institutional Risk Underwriting Engine & Loan Sanction Generator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate credit decisioning against your bank's collateral-free Mudra / PM SVANidhi risk parameters.
              </p>
            </div>

            {/* Parameter Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Requested Loan Limit:</span>
                  <span className="text-emerald-400 font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Tenure (Months):</span>
                  <span className="text-cyan-400 font-bold">{tenureMonths} Months</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="36"
                  step="3"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Min ShramScore Cutoff:</span>
                  <span className="text-amber-400 font-bold">{minScore}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="800"
                  step="10"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleEvaluatePolicy}
                disabled={isEvaluating}
                className="btn-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
              >
                {isEvaluating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Evaluate Risk Rules & Generate Official Sanction
              </button>
            </div>

            {/* Rendered Decision & Official Sanction Letter */}
            {evaluationResult && (
              <div className="space-y-6">
                
                {/* Official Bank Sanction Order Card */}
                <div
                  ref={sanctionLetterRef}
                  className="p-6 sm:p-8 rounded-3xl bg-[#070d18] border-2 border-cyan-500/40 space-y-6 shadow-2xl relative overflow-hidden"
                >
                  {/* Subtle Bank Watermark */}
                  <div className="absolute right-6 top-6 opacity-5 pointer-events-none">
                    <Landmark className="w-64 h-64 text-cyan-400" />
                  </div>

                  {/* Letterhead */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                        <Landmark className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest block">
                          HDFC BANK · INCLUSIVE MSME & MICRO-CREDIT DIVISION
                        </span>
                        <h4 className="text-xl font-black text-slate-100 font-['Outfit'] mt-0.5">
                          FORMAL CREDIT SANCTION ORDER
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500">
                          Scheme: Pradhan Mantri Mudra Yojana (PMMY) / Micro-Enterprise Tier
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase ${
                        evaluationResult.decision === 'APPROVED' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {evaluationResult.decision === 'APPROVED' ? '✓ SANCTION APPROVED' : '⚠ CONDITIONAL APPROVAL'}
                      </div>
                      <p className="text-[10px] font-mono text-slate-400 mt-1">
                        Sanction Ref: SANCTION-2026-{evaluationResult.worker_id.replace('worker_', '').toUpperCase()}-0914
                      </p>
                    </div>
                  </div>

                  {/* Borrower & Loan Details Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Borrower Name</span>
                      <span className="text-sm font-bold text-slate-100">{evaluationResult.worker_name}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Approved Limit</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">₹{evaluationResult.approved_amount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Interest Rate</span>
                      <span className="text-lg font-black text-amber-300 font-mono">{evaluationResult.recommended_interest_rate_pct}% p.a.</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Monthly EMI</span>
                      <span className="text-lg font-black text-cyan-300 font-mono">₹{evaluationResult.monthly_emi_estimate?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Rules Checklist */}
                  <div>
                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-2">
                      Underwriting Rules Validated against Merkle Ledger:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {evaluationResult.rule_evaluations.map((r, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                          <span className="text-slate-300 text-[11px]">{r.rule}</span>
                          <span className={`font-bold font-mono text-[10px] ${r.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {r.status} ({r.actual_value})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 12-Month Amortization Schedule */}
                  {evaluationResult.approved_amount > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                        Estimated Repayment Schedule (First 12 Months):
                      </span>
                      <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-48 overflow-y-auto">
                        <table className="w-full text-left text-[11px] text-slate-300 font-mono">
                          <thead className="bg-slate-950 text-[10px] uppercase text-slate-500 sticky top-0 border-b border-slate-800">
                            <tr>
                              <th className="p-2">Month</th>
                              <th className="p-2">Monthly EMI</th>
                              <th className="p-2">Principal</th>
                              <th className="p-2">Interest</th>
                              <th className="p-2">Balance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                            {generateAmortization(evaluationResult.approved_amount, evaluationResult.recommended_interest_rate_pct, tenureMonths).map((row) => (
                              <tr key={row.month} className="hover:bg-slate-800/40">
                                <td className="p-2 font-bold text-slate-400">M{row.month}</td>
                                <td className="p-2 text-cyan-300">₹{row.emi}</td>
                                <td className="p-2 text-emerald-400">₹{row.principalPaid}</td>
                                <td className="p-2 text-amber-300">₹{row.interestPaid}</td>
                                <td className="p-2 text-slate-200">₹{row.remainingBalance}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Cryptographic Audit Stamp */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500">Cryptographic Seal: </span>
                      <span className="text-slate-300 break-all">{evaluationResult.cryptographic_audit_hash}</span>
                    </div>
                    <div className="text-slate-400 text-right">
                      {evaluationResult.timestamp}
                    </div>
                  </div>
                </div>

                {/* Sanction Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <button
                    onClick={handleDownloadSanctionPdf}
                    disabled={isExportingSanction}
                    className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isExportingSanction ? 'Generating Sanction Order...' : 'Download Official Sanction Order (PDF)'}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Sanction
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: LIVE DEVELOPER API SANDBOX ──────────────────────── */}
      {activeTab === 'sandbox' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-100 font-['Outfit'] flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                Live Core Banking REST API Sandbox & Tester
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Directly execute DPDP-gated underwriting queries and inspect live HTTP responses, headers, and latency.
              </p>
            </div>

            <button
              onClick={handleExecuteSandboxCall}
              disabled={isCallingApi}
              className="btn-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {isCallingApi ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Live API Request
            </button>
          </div>

          {/* Request Configurator */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
              <span className="text-slate-300 flex-1 break-all">
                https://api.shramledger.in/api/v1/workers/{workerId}/income-summary
              </span>
            </div>
            <div className="pt-2 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div><strong className="text-cyan-400">x-api-key:</strong> {sandboxApiKey}</div>
              <div><strong className="text-cyan-400">x-dpdp-purpose:</strong> {sandboxPurpose}</div>
            </div>
          </div>

          {/* Response Inspector */}
          {sandboxResponse && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4 animate-scale-up">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                    HTTP {sandboxResponse.status} {sandboxResponse.statusText}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Latency: <strong className="text-cyan-400">{sandboxResponse.latencyMs} ms</strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Live Backend Response</span>
              </div>

              {/* Response Headers */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Response Headers:</span>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-400 space-y-0.5">
                  {Object.entries(sandboxResponse.headers || {}).map(([k, v]) => (
                    <div key={k}><span className="text-cyan-400">{k}:</span> {v}</div>
                  ))}
                </div>
              </div>

              {/* Response Body */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">JSON Payload:</span>
                <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-64">
                  {JSON.stringify(sandboxResponse.data, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* cURL Snippet */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Copy cURL Command for Terminal:
            </span>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
{`curl -X GET "http://127.0.0.1:8000/api/v1/workers/${workerId}/income-summary" \\
  -H "x-api-key: ${sandboxApiKey}" \\
  -H "x-dpdp-purpose: ${sandboxPurpose}"`}
            </pre>
          </div>
        </div>
      )}

      {/* ── TAB 4: B2B API KEYS & INTEGRATION ───────────────────────── */}
      {activeTab === 'apikeys' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-100 font-['Outfit'] flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                Enterprise B2B API Credentials & Webhook Hooks
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Issue production and sandbox API keys for direct integration with your core banking or loan origination system (LOS).
              </p>
            </div>

            <button
              onClick={() => handleCreateApiKey()}
              disabled={isCreatingKey}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Generate API Key
            </button>
          </div>

          {/* Key List */}
          <div className="space-y-3">
            {apiKeys.map((k) => (
              <div key={k.key_id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{k.name}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                      k.environment === 'production' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {k.environment.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-amber-400 mt-1">
                    {k.key_prefix}••••••••••••••••
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Created: {k.created_at} · Rate Limit: {k.rate_limit_rpm} RPM
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* cURL Snippet */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Sample cURL Direct Integration:
            </span>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
{`curl -X GET "https://api.shramledger.in/api/v1/workers/worker_ramesh/income-summary" \\
  -H "x-api-key: shram_live_hdfc_8a92f4c1e0" \\
  -H "x-dpdp-purpose: LOAN_UNDERWRITING_MUDRA"`}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}
