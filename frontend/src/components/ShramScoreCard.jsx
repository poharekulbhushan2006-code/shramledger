import React from 'react';
import { 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle,
  AlertCircle,
  Volume2,
  Sparkles,
  Briefcase,
  Users2,
  ArrowUp,
  Zap,
  Percent,
  Layers,
  FileCheck2
} from 'lucide-react';
import { speakText } from '../utils/ttsHelper';
import { TRANSLATIONS } from '../utils/locales';

// ─── Animated SVG Score Ring ────────────────────────────────────────────
function ScoreRing({ score, grade, maxScore = 900, minScore = 300 }) {
  const radius = 72;
  const stroke = 8;
  const svgSize = (radius + stroke) * 2;
  const circumference = 2 * Math.PI * radius;
  const pct = (score - minScore) / (maxScore - minScore);
  const dashOffset = circumference * (1 - pct);

  const getColor = (s) => {
    if (s >= 780) return ['#10b981', '#06b6d4']; // emerald → cyan
    if (s >= 700) return ['#f59e0b', '#22d3ee']; // amber → cyan
    if (s >= 600) return ['#f59e0b', '#f97316']; // amber → orange
    return ['#ef4444', '#f97316'];              // red → orange
  };
  const [startColor, endColor] = getColor(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: svgSize, height: svgSize }}>
      <svg width={svgSize} height={svgSize} className="score-ring -rotate-90">
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="rgba(30,41,59,0.8)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.25,0.46,0.45,0.94)' }}
        />
      </svg>
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">ShramScore</span>
        <span className="text-4xl font-black text-slate-100 leading-tight font-['Outfit']">{score}</span>
        <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-extrabold text-amber-400 mt-0.5">
          Grade {grade}
        </span>
      </div>
    </div>
  );
}

// ─── Dimension Progress Bar ─────────────────────────────────────────────
function DimensionBar({ label, weight, score, icon: Icon, color = "amber" }) {
  const colorMap = {
    emerald: { bar: 'from-emerald-500 to-teal-400', text: 'text-emerald-400', icon: 'text-emerald-400' },
    amber:   { bar: 'from-amber-500 to-orange-400', text: 'text-amber-400',   icon: 'text-amber-400' },
    indigo:  { bar: 'from-indigo-500 to-purple-400', text: 'text-indigo-400', icon: 'text-indigo-400' },
    cyan:    { bar: 'from-cyan-500 to-blue-400',     text: 'text-cyan-400',   icon: 'text-cyan-400' },
    teal:    { bar: 'from-teal-500 to-emerald-400',  text: 'text-teal-400',   icon: 'text-teal-400' },
    orange:  { bar: 'from-orange-500 to-amber-400',  text: 'text-orange-400', icon: 'text-orange-400' },
  };
  const c = colorMap[color] || colorMap.amber;

  return (
    <div className="premium-card p-3.5 rounded-2xl space-y-2 border border-slate-800/80">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5 truncate">
          <Icon className={`w-3.5 h-3.5 ${c.icon} shrink-0`} />
          <span className="truncate">{label}</span>
          <span className="text-[10px] text-slate-500 font-mono">({weight})</span>
        </span>
        <span className={`font-mono font-black ${c.text}`}>{score}<span className="text-slate-600 text-[10px]">/100</span></span>
      </div>
      <div className="progress-bar h-1.5 bg-slate-950 rounded-full overflow-hidden">
        <div
          className={`progress-fill bg-gradient-to-r ${c.bar} h-full rounded-full`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function ShramScoreCard({ scoreData, worker, currentLang }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  if (!scoreData) return null;

  const handleAudioReadout = () => {
    const text = currentLang === 'hi'
      ? `${worker?.name} का रोजगार विश्वसनीयता स्कोर ${scoreData.overall_score} है, जो ग्रेड ${scoreData.grade} में आता है। इनकी अनुमानित मासिक आय ₹${scoreData.estimated_monthly_income} है।`
      : `${worker?.name}'s Employment Reliability Score is ${scoreData.overall_score}, Grade ${scoreData.grade}. Estimated monthly earnings ₹${scoreData.estimated_monthly_income}.`;
    speakText(text, currentLang);
  };

  const eb = scoreData.evidence_breakdown;

  return (
    <div className="glass-card rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">

      {/* Background orbs */}
      <div className="orb orb-amber w-72 h-72 -right-16 -top-16 opacity-40" />
      <div className="orb orb-emerald w-48 h-48 -bottom-12 left-0 opacity-30" />

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 shadow-lg shadow-orange-500/30">
            <Award className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-100 font-['Outfit']">
                Employment & Income Reliability Score
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Transparent 300–900
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Explainable alternative reliability index for informal workforce underwriting (Non-CIBIL)
            </p>
          </div>
        </div>
        <button
          onClick={handleAudioReadout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass hover:bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-amber-400 transition-all hover:scale-105"
        >
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">{t.listenAudio}</span>
        </button>
      </div>

      {/* ── Score Hero ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center glass-dark rounded-2xl p-5 relative z-10 border border-slate-800">
        
        {/* Score Ring */}
        <div className="md:col-span-4 flex flex-col items-center justify-center gap-3 py-2 border-b md:border-b-0 md:border-r border-slate-800/60">
          <ScoreRing score={scoreData.overall_score || scoreData.composite_score || 785} grade={scoreData.grade || 'A+'} />
          <p className="text-[11px] text-slate-400 text-center font-medium max-w-[160px]">
            {scoreData.stability_band || 'High Stability (Prime Informal)'}
          </p>
        </div>

        {/* Right Stats & Evidence Meter */}
        <div className="md:col-span-8 space-y-4">
          
          {/* Loan Readiness Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/25 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-0.5">
                Micro-Credit Pre-Qualification Tier
              </span>
              <p className="text-sm font-bold text-slate-100">{scoreData.loan_readiness || 'Pre-Approved for up to ₹75,000 Micro-Credit'}</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl glass border border-slate-800/60">
              <span className="text-[10px] text-slate-500 font-medium block mb-0.5">Estimated Monthly</span>
              <span className="text-base font-black text-emerald-400">
                ₹{(scoreData.estimated_monthly_income || scoreData.projected_monthly_income || 24200)?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-xl glass border border-slate-800/60">
              <span className="text-[10px] text-slate-500 font-medium block mb-0.5">Average Daily Wage</span>
              <span className="text-base font-black text-amber-300">
                ₹{scoreData.avg_daily_wage || 835}
              </span>
            </div>
            <div className="p-3 rounded-xl glass border border-slate-800/60">
              <span className="text-[10px] text-slate-500 font-medium block mb-0.5">Evidence Confidence</span>
              <span className="text-base font-black text-cyan-400">
                {scoreData.overall_evidence_confidence || scoreData.evidence_index || 91}%
              </span>
            </div>
          </div>

          {/* Multi-tier Evidence Strength Distribution Bar */}
          {eb && (
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 font-bold">Evidence Strength Distribution:</span>
                <span className="text-emerald-400 font-mono font-bold">{eb.strength_band}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-900 flex overflow-hidden">
                <div style={{ width: `${eb.upi_bank_evidence_pct}%` }} className="bg-emerald-400" title="UPI/Bank" />
                <div style={{ width: `${eb.employer_verified_pct}%` }} className="bg-cyan-400" title="Employer Verified" />
                <div style={{ width: `${eb.wage_slips_receipts_pct}%` }} className="bg-amber-400" title="Wage Slips" />
                <div style={{ width: `${eb.voice_declarations_pct}%` }} className="bg-purple-400" title="Voice Notes" />
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-500 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> UPI ({eb.upi_bank_evidence_pct}%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Employer ({eb.employer_verified_pct}%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Slips ({eb.wage_slips_receipts_pct}%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> Voice ({eb.voice_declarations_pct}%)</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── 6 Transparent Dimensions ───────────────────────────── */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              6 Transparent Explainability Dimensions
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">100% Weightage Total</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <DimensionBar 
            label="Income Stability" 
            weight="25%" 
            score={scoreData.income_stability_score || 85} 
            icon={TrendingUp} 
            color="emerald" 
          />
          <DimensionBar 
            label="Work Continuity" 
            weight="20%" 
            score={scoreData.work_continuity_score || 80} 
            icon={Briefcase} 
            color="amber" 
          />
          <DimensionBar 
            label="Verified Earnings" 
            weight="20%" 
            score={scoreData.verified_earnings_score || 88} 
            icon={FileCheck2} 
            color="cyan" 
          />
          <DimensionBar 
            label="Employer Endorsements" 
            weight="15%" 
            score={scoreData.employer_endorsement_score || 75} 
            icon={Users2} 
            color="indigo" 
          />
          <DimensionBar 
            label="Evidence Quality" 
            weight="10%" 
            score={scoreData.evidence_quality_score || 90} 
            icon={ShieldCheck} 
            color="teal" 
          />
          <DimensionBar 
            label="Skill Demand Tier" 
            weight="10%" 
            score={scoreData.skill_demand_score || 85} 
            icon={Layers} 
            color="orange" 
          />
        </div>
      </div>

      {/* ── Positives & Improvements ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Why This Score? (Positive Factors)
          </span>
          <ul className="space-y-1.5">
            {scoreData.factors_positive?.map((f, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">+</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            How to Improve Score (सुझाव)
          </span>
          <ul className="space-y-1.5">
            {scoreData.factors_improvement?.map((f, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 font-black shrink-0">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
