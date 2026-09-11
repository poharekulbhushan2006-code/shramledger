import React, { useState, useEffect } from 'react';
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
  Plus
} from 'lucide-react';
import { api } from '../services/api';

export default function LenderPortal({ workers = [], selectedWorker, onSelectWorker }) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'simulator' | 'apikeys'
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

  const handleCreateApiKey = async (e) => {
    if (e) e.preventDefault();
    setIsCreatingKey(true);
    try {
      await api.createApiKey({ name: newKeyName, environment: newKeyEnv });
      await loadApiKeys();
      setNewKeyName('');
    } catch (err) {
      alert('Failed to generate key: ' + err.message);
    } finally {
      setIsCreatingKey(false);
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

            {/* Right: API JSON Inspection */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  REST API Response Payload
                </span>
                <button
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1.5 transition-all"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedJson ? 'Copied' : 'Copy JSON'}
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-64 hide-scrollbar">
                {JSON.stringify(incomeSummary, null, 2)}
              </pre>
            </div>

          </div>

        </div>
      )}

      {/* ── TAB 2: POLICY RISK EVALUATOR & LOAN SANCTION SIMULATOR ─── */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-100 font-['Outfit'] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                Custom Risk Policy Engine & Loan Amortization Simulator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Define institutional underwriting thresholds to simulate real-time loan approval, risk grading, and EMI schedule.
              </p>
            </div>

            {/* Policy Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Loan Amount:</span>
                  <span className="text-emerald-400 font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
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
                  className="w-full accent-cyan-500"
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
                  className="w-full accent-amber-500"
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
                Evaluate Risk Rules & Generate Decision
              </button>
            </div>

            {/* Rendered Decision */}
            {evaluationResult && (
              <div className="p-6 rounded-3xl bg-gradient-to-tr from-cyan-500/10 via-slate-900 to-emerald-500/10 border border-cyan-500/30 space-y-5 animate-scale-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                        evaluationResult.decision === 'APPROVED' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {evaluationResult.decision}
                      </span>
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        Tier: {evaluationResult.risk_tier}
                      </span>
                    </div>
                    <h4 className="text-xl font-black text-slate-100 font-['Outfit'] mt-2">
                      Sanction Dossier for {evaluationResult.worker_name}
                    </h4>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-400 font-mono">
                      ₹{evaluationResult.approved_amount?.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Approved Limit @ {evaluationResult.recommended_interest_rate_pct}% p.a.
                    </span>
                  </div>
                </div>

                {/* Rules Evaluation List */}
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-2">
                    Automated Risk Rule Checklist:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {evaluationResult.rule_evaluations.map((r, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                        <span className="text-slate-300">{r.rule}</span>
                        <span className={`font-bold font-mono text-[11px] ${r.status === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {r.status} ({r.actual_value})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EMI Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold">Estimated Monthly EMI:</span>
                    <span className="text-lg font-black text-cyan-300 font-mono block">
                      ₹{evaluationResult.monthly_emi_estimate?.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono break-all max-w-sm">
                    Audit Hash: {evaluationResult.cryptographic_audit_hash}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: B2B API KEYS & INTEGRATION ───────────────────────── */}
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
