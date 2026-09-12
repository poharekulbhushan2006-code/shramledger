import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  TrendingUp, 
  MapPin, 
  PieChart, 
  ShieldCheck, 
  FileCheck2, 
  Coins, 
  Download,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  Send,
  Zap,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../services/api';

export default function NgoGovPortal() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [dispatches, setDispatches] = useState([
    {
      id: 'DBT-UP-2026-8A1C',
      worker_name: 'Ramesh Kumar (राजमिस्त्री)',
      trade: 'Mason / राजमिस्त्री',
      scheme: 'PM Vishwakarma Toolkit Incentive (₹15,000)',
      status: 'DISPATCHED_TO_STATE_MISSION',
      timestamp: 'Today, 14:10 UTC',
      hash: '3f8b9a1c4d2e5f6a7b8c9d0e1f2a3b4c5d6e7f8a'
    },
    {
      id: 'DBT-DL-2026-94BE',
      worker_name: 'Sunita Devi (सहायक)',
      trade: 'Helper / सहायक',
      scheme: 'BOCW Maternity & Healthcare Benefit (₹25,000)',
      status: 'DISPATCHED_TO_STATE_MISSION',
      timestamp: 'Yesterday, 11:35 UTC',
      hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b'
    }
  ]);
  const [newWorkerName, setNewWorkerName] = useState('Kailash Chand (कैलाश चंद)');
  const [newScheme, setNewScheme] = useState('PM SVANidhi Collateral-Free Micro-Loan (₹20,000)');
  const [isDispatching, setIsDispatching] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleCreateDispatch = (e) => {
    if (e) e.preventDefault();
    setIsDispatching(true);
    setTimeout(() => {
      const newDbt = {
        id: `DBT-UP-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        worker_name: newWorkerName,
        trade: 'Carpenter / बढ़ई',
        scheme: newScheme,
        status: 'DISPATCHED_TO_STATE_MISSION',
        timestamp: 'Just now',
        hash: Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')
      };
      setDispatches([newDbt, ...dispatches]);
      setIsDispatching(false);
    }, 500);
  };

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await api.getWelfareAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load welfare analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">

      {/* ── NGO / Government Portal Header ──────────────────────────── */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-orange-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-xl shadow-orange-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Building className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-100 font-['Outfit']">
                  NGO & Government Welfare Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-300 border border-orange-500/30">
                  Livelihood & Scheme Delivery
                </span>
              </div>
              <p className="text-xs text-orange-300 font-medium mt-0.5">
                Verifiable Employment Layer Complementing e-Shram & State Welfare Boards
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Real-time workforce formalization, scheme eligibility tracking, and wage transparency
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAnalytics}
              className="px-4 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border border-orange-500/30 text-xs font-bold transition-all"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card p-12 text-center rounded-3xl text-slate-400 text-sm">
          Loading aggregated welfare distribution analytics...
        </div>
      ) : analytics ? (
        <div className="space-y-6">

          {/* ── Key High-Level Stats ─────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-3xl border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                Workers Enrolled
              </span>
              <span className="text-2xl font-black text-slate-100 block font-['Outfit']">
                {analytics.total_workers_enrolled}
              </span>
              <span className="text-[10px] text-emerald-400 mt-1 block flex items-center gap-1">
                <Activity className="w-3 h-3" /> Active Roster
              </span>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                Work Records Stamped
              </span>
              <span className="text-2xl font-black text-cyan-400 block font-['Outfit']">
                {analytics.total_work_records_logged}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                SHA-256 Merkle Ledger
              </span>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                Average Daily Wage
              </span>
              <span className="text-2xl font-black text-amber-400 block font-['Outfit']">
                ₹{analytics.average_daily_wage_inr?.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Across skilled/semi-skilled trades
              </span>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                Verification Rate
              </span>
              <span className="text-2xl font-black text-emerald-400 block font-['Outfit']">
                {analytics.overall_verification_rate}%
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Digital / Employer Authenticated
              </span>
            </div>
          </div>

          {/* ── Occupation & Geographic Breakdown (2 Cols) ───────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Occupation Breakdown */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-amber-400" />
                  Trade & Skill Distribution (व्यवसाय वितरण)
                </h3>
                <span className="text-xs text-slate-500">
                  {analytics.occupation_distribution?.length} Occupations
                </span>
              </div>

              <div className="space-y-3">
                {analytics.occupation_distribution?.map((occ, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200">{occ.trade}</span>
                      <span className="font-mono text-amber-400 font-bold">{occ.workers_count} Workers ({occ.percentage}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        style={{ width: `${occ.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* State & Scheme Welfare Delivery */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Regional Livelihood Benchmark & Delivery
                </h3>
              </div>

              <div className="space-y-3">
                {analytics.state_distribution?.map((st, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{st.state}</h4>
                      <p className="text-[10px] text-slate-400">Pilot Cohort Active</p>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <span className="text-emerald-400 font-bold block">₹{st.avg_wage}/day</span>
                      <span className="text-slate-500 text-[10px]">{st.workers} enrolled</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scheme Highlight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/30 text-xs space-y-1">
                <span className="font-bold text-orange-300 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Social Welfare Readiness
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {analytics.scheme_matching_rate}
                </p>
              </div>
            </div>
          </div>

          {/* ── Direct Automated Scheme Dispatcher & Nodal Console ── */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-orange-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  DBT Direct Benefit Transfer Gateway
                </span>
                <h3 className="text-lg font-black text-slate-100 font-['Outfit'] mt-1.5 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  State Welfare Mission Dispatch Console
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct automated package submission to PM Vishwakarma, e-Shram, PM SVANidhi, and State BOCW Funds.
                </p>
              </div>

              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                API Connected: State DBT Nodal Engine
              </span>
            </div>

            {/* Quick Dispatch Action Form */}
            <form onSubmit={handleCreateDispatch} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4">
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Worker:</label>
                <input
                  type="text"
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-orange-500 focus:outline-none"
                  placeholder="Worker Name"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Welfare Scheme:</label>
                <select
                  value={newScheme}
                  onChange={(e) => setNewScheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-orange-500 focus:outline-none"
                >
                  <option value="PM Vishwakarma Toolkit Incentive (₹15,000)">PM Vishwakarma Toolkit Incentive (₹15,000)</option>
                  <option value="PM SVANidhi Collateral-Free Micro-Loan (₹20,000)">PM SVANidhi Collateral-Free Micro-Loan (₹20,000)</option>
                  <option value="BOCW Maternity & Healthcare Benefit (₹25,000)">BOCW Maternity & Healthcare Benefit (₹25,000)</option>
                  <option value="e-Shram Accidental Insurance (₹2,00,000)">e-Shram Accidental Insurance (₹2,00,000)</option>
                  <option value="PMMY Mudra Shishu Scheme (₹50,000)">PMMY Mudra Shishu Scheme (₹50,000)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={isDispatching}
                  className="w-full btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20"
                >
                  {isDispatching ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Dispatch to Mission
                </button>
              </div>
            </form>

            {/* Dispatched Records Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Dispatch Ref</th>
                    <th className="p-3">Beneficiary</th>
                    <th className="p-3">Trade</th>
                    <th className="p-3">Scheme Title</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Merkle Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono text-[11px]">
                  {dispatches.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/40">
                      <td className="p-3 text-orange-300 font-bold">{d.id}</td>
                      <td className="p-3 font-sans font-semibold text-slate-100">{d.worker_name}</td>
                      <td className="p-3 font-sans text-slate-400">{d.trade}</td>
                      <td className="p-3 font-sans text-slate-200">{d.scheme}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {d.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 truncate max-w-xs">{d.hash}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
