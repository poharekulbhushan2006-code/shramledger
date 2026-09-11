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
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function NgoGovPortal() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

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

        </div>
      ) : null}

    </div>
  );
}
