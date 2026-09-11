import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Mic,
  FileText,
  Award,
  Building,
  ArrowRight,
  Zap,
  Lock,
  Sparkles,
  Play,
  ChevronRight,
  FileCheck,
  Layers,
  Building2,
  Landmark,
  Calculator,
  CheckCircle2,
  Phone,
  Mail,
  Sliders,
  Check,
  ArrowUpRight
} from 'lucide-react';
import CommercialQuoteModal from './CommercialQuoteModal';

const STATS = [
  { value: '450M+', label: 'Informal Workforce in India', sub: 'Target beneficiaries' },
  { value: '₹47,000 Cr', label: 'Annual Informal Payroll', sub: 'Tamper-proof digitized' },
  { value: 'SHA-256', label: 'Merkle Ledger DAG', sub: 'Mathematical immutability' },
  { value: 'DPDP 2023', label: 'Statutory Data Protection', sub: 'Consent-governed APIs' },
];

const FEATURES = [
  {
    icon: Mic,
    title: 'AI Multilingual Voice Ingestion',
    desc: 'Workers speak naturally in Hindi, Hinglish, Marathi, Tamil, Bengali or English. Indic NLP extracts wages, employer, trade and hours in seconds.',
    color: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/20',
    tag: 'Indic Voice NLP'
  },
  {
    icon: FileText,
    title: '9-Format OCR Computer Vision',
    desc: 'Scans contractor chits, muster rolls, handwritten slips and UPI transaction screenshots with confidence scoring and bounding boxes.',
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
    tag: 'Computer Vision'
  },
  {
    icon: Lock,
    title: 'SHA-256 Merkle Ledger DAG',
    desc: 'Every work entry is cryptographically anchored. Changing even ₹1 in history alters the Merkle Root and triggers an instant fraud alarm.',
    color: 'from-cyan-500 to-blue-500',
    glow: 'shadow-cyan-500/20',
    tag: 'Cryptographic Security'
  },
  {
    icon: Award,
    title: 'ShramScore™ Credit Engine (300-900)',
    desc: 'Alternative credit score evaluating income consistency, contractor diversity, and verification strength for collateral-free bank loans.',
    color: 'from-purple-500 to-indigo-500',
    glow: 'shadow-purple-500/20',
    tag: 'Alternative Credit'
  },
  {
    icon: Building,
    title: 'Automated Welfare Matcher',
    desc: 'Algorithmic matching to PM Vishwakarma, e-Shram, PM SVANidhi, BOCW Welfare Fund, and PMMY Mudra loans in real time.',
    color: 'from-orange-500 to-rose-500',
    glow: 'shadow-orange-500/20',
    tag: 'GovTech Stack'
  },
  {
    icon: FileCheck,
    title: 'Verifiable Digital Work Passport',
    desc: 'Dynamic QR-scannable A4 income certificate with cryptographic verification seals, printable and downloadable for loan approvals.',
    color: 'from-teal-500 to-emerald-500',
    glow: 'shadow-teal-500/20',
    tag: 'Digital Work Passport'
  },
];

export default function LandingPage({ onEnterDashboard }) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedPlanTier, setSelectedPlanTier] = useState('contractor_pro');

  // ROI Calculator State
  const [roiWorkers, setRoiWorkers] = useState(350);
  const [roiDailyWage, setRoiDailyWage] = useState(800);

  // Calculations
  const monthlyPayroll = roiWorkers * 24 * roiDailyWage;
  const ghostLaborSavings = monthlyPayroll * 0.06; // 6% ghost worker prevention
  const bocwPenaltyProtection = roiWorkers * 450; // BOCW statutory audit penalty protection
  const totalMonthlySavings = ghostLaborSavings + bocwPenaltyProtection;
  const annualSavings = totalMonthlySavings * 12;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveFeature(f => (f + 1) % FEATURES.length), 3500);
    return () => clearInterval(timer);
  }, []);

  const openQuoteModal = (plan = 'contractor_pro') => {
    setSelectedPlanTier(plan);
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#040810] text-slate-100 overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">

      {/* ── Fixed Ambient Background ─────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-amber w-[800px] h-[800px] -top-64 -right-64 opacity-20" />
        <div className="orb orb-emerald w-[600px] h-[600px] bottom-0 -left-48 opacity-15" />
        <div className="orb orb-indigo w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-premium' : 'bg-transparent'}`}>
        {scrolled && <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />}
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-[1.5px] shadow-lg shadow-amber-500/30">
              <div className="w-full h-full bg-[#040810] rounded-[9px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-shimmer font-['Outfit'] block leading-tight">ShramLedger</span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Enterprise FinTech & GovTech</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <a href="#roi-calculator" className="hover:text-slate-200 transition-colors">ROI Calculator</a>
            <a href="#features" className="hover:text-slate-200 transition-colors">Platform Features</a>
            <a href="#pricing" className="hover:text-slate-200 transition-colors">Commercial Pricing</a>
            <a href="#statutory" className="hover:text-slate-200 transition-colors">DPDP & BOCW Compliance</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openQuoteModal('contractor_pro')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl glass border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 font-bold text-xs transition-all"
            >
              <Calculator className="w-3.5 h-3.5" />
              Get Enterprise Quote
            </button>
            <button
              onClick={onEnterDashboard}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20"
            >
              <Zap className="w-4 h-4" />
              Launch Enterprise Suite
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative z-10 pt-36 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-amber-500/30 text-xs font-bold text-amber-300 mb-8 animate-fade-in shadow-lg shadow-amber-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Bank-Grade Digital Work Credentials & Statutory BOCW Compliance
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 font-['Outfit'] animate-slide-up">
            <span className="text-slate-100">Every Shift Worked.</span><br />
            <span className="text-shimmer">Every Rupee Paid.</span><br />
            <span className="text-slate-100">Cryptographically Verified.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            ShramLedger is the enterprise workforce ledger platform empowering
            <strong className="text-slate-200"> Construction EPCs, NBFC Lenders, and Informal Workers</strong> with
            tamper-evident SHA-256 Merkle proofs, alternative credit scoring, and automated welfare integration.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <button
              onClick={onEnterDashboard}
              className="btn-primary flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-base font-bold shadow-2xl shadow-amber-500/25 group w-full sm:w-auto justify-center"
            >
              <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Open Enterprise Platform
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => openQuoteModal('contractor_pro')}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl glass border border-amber-500/40 text-amber-300 text-base font-bold hover:bg-amber-500/10 transition-all w-full sm:w-auto justify-center"
            >
              <Calculator className="w-4 h-4" />
              Request Commercial Proposal
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 animate-fade-in">
            {[
              '🔐 SHA-256 Merkle Proofs',
              '🏛️ BOCW Act 1996 Form XXIX Compliant',
              '🇮🇳 DPDP Act 2023 Framework',
              '💳 RBI Account Aggregator Protocol Ready',
              '🗣️ 6 Indic Languages'
            ].map(badge => (
              <span key={badge} className="px-3.5 py-1.5 rounded-full glass border border-slate-800 font-medium">
                {badge}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="relative z-10 py-10 border-y border-slate-800/60 bg-slate-950/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label, sub }) => (
              <div key={label} className="text-center p-4">
                <div className="text-3xl sm:text-4xl font-black text-shimmer font-['Outfit'] mb-1">{value}</div>
                <div className="text-sm font-bold text-slate-300 mb-0.5">{label}</div>
                <div className="text-[11px] text-slate-500">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE ROI CALCULATOR ────────────────────────────── */}
      <section id="roi-calculator" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block mb-2">Commercial Value</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-['Outfit']">
              Enterprise ROI & Statutory Savings Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
              See how much your construction site or EPC project saves annually by eliminating ghost workers and automating statutory BOCW inspection audits.
            </p>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Sliders */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
                  <span>Active Construction Site Workers:</span>
                  <span className="text-amber-400 text-sm font-black">{roiWorkers} Workers</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2500"
                  step="25"
                  value={roiWorkers}
                  onChange={(e) => setRoiWorkers(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
                  <span>Average Daily Wage Rate:</span>
                  <span className="text-emerald-400 text-sm font-black">₹{roiDailyWage}/day</span>
                </div>
                <input
                  type="range"
                  min="450"
                  max="1500"
                  step="25"
                  value={roiDailyWage}
                  onChange={(e) => setRoiDailyWage(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Monthly Site Payroll:</span>
                  <span className="font-mono text-slate-200 font-bold">₹{monthlyPayroll.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Ghost Worker Prevention (6%):</span>
                  <span className="font-mono font-bold">+₹{ghostLaborSavings.toLocaleString('en-IN')}/mo</span>
                </div>
                <div className="flex justify-between text-cyan-400 font-semibold">
                  <span>BOCW Form XXIX Audit Protection:</span>
                  <span className="font-mono font-bold">+₹{bocwPenaltyProtection.toLocaleString('en-IN')}/mo</span>
                </div>
              </div>
            </div>

            {/* Output Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-tr from-emerald-500/15 via-slate-900 to-amber-500/15 border border-emerald-500/40 text-center space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Net Annual Projected Value
              </span>
              <div className="text-4xl sm:text-5xl font-black text-slate-100 font-['Outfit']">
                ₹{annualSavings.toLocaleString('en-IN')}
                <span className="text-xs text-slate-400 block font-normal mt-1">Estimated annual return on investment</span>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                ShramLedger pays for itself within the first 14 days of site deployment through tamper-proof muster rolls and automated compliance exports.
              </div>

              <button
                onClick={() => openQuoteModal('contractor_pro')}
                className="btn-primary w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Calculator className="w-4 h-4" />
                Generate Custom Enterprise Proposal
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────────── */}
      <section id="features" className="relative z-10 py-20 px-6 border-t border-slate-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-3">Enterprise Capabilities</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-100 font-['Outfit'] mb-4">
              A Complete Financial Identity Stack
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              From voice-based wage logging on active construction sites to bank-grade credit underwriting and government scheme matching.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color, glow, tag }, i) => (
              <div
                key={title}
                className={`premium-card p-6 rounded-2xl group cursor-pointer transition-all ${activeFeature === i ? `shadow-xl ${glow}` : ''}`}
                onClick={() => setActiveFeature(i)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-tr ${color} shadow-lg ${glow} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${color} bg-opacity-10 text-white/70 border border-white/10`}>
                    {tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-2 group-hover:text-white transition-colors">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMERCIAL PRICING TIERS ──────────────────────────────── */}
      <section id="pricing" className="relative z-10 py-20 px-6 border-t border-slate-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 block mb-2">Commercial Licensing</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-100 font-['Outfit']">
              Transparent, Value-Driven Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
              Designed for individual site contractors, fast-growing infrastructure EPCs, and institutional FinTech lenders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tier 1: Contractor Pro */}
            <div className="glass-card p-6 rounded-3xl border border-amber-500/30 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    CONSTRUCTION EPCS
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-100 font-['Outfit']">Contractor Pro</h3>
                  <p className="text-xs text-slate-400 mt-1">Site managers & civil infrastructure contractors.</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-100 font-['Outfit']">₹1,999</span>
                  <span className="text-xs text-slate-400">/site/month + ₹4/worker</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  {[
                    'Unlimited Multilingual Voice & OCR Ingestion',
                    'Automated Bulk Muster Roll Ingestion & Merkle Proofs',
                    'Statutory BOCW Act Form XXIX Inspection Report',
                    'Contractor Digital Stamp & SMS Verification Seals',
                    'Wage Disbursement Batch Generation'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openQuoteModal('contractor_pro')}
                className="btn-primary w-full py-2.5 rounded-xl font-bold text-xs"
              >
                Start 30-Day Site Pilot
              </button>
            </div>

            {/* Tier 2: FinTech & NBFC Underwriting Suite */}
            <div className="glass-card p-6 rounded-3xl border border-cyan-500/40 flex flex-col justify-between space-y-6 relative overflow-hidden ring-2 ring-cyan-500/20 bg-cyan-500/5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    MOST POPULAR FOR BANKS
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-100 font-['Outfit']">FinTech & NBFC API</h3>
                  <p className="text-xs text-slate-400 mt-1">Micro-finance institutions & digital lenders.</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-cyan-300 font-['Outfit']">₹4,999</span>
                  <span className="text-xs text-slate-400">/month + ₹3.50/query</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  {[
                    'Real-Time Underwriting REST API (<150ms)',
                    'DPDP Act 2023 Consent-Gated Verification',
                    '4-Pillar ShramScore™ Alternative Credit Dossier',
                    'Custom Risk Policy Engine & Amortization Simulator',
                    'Automated Shift Collision & Anti-Fraud Stream',
                    'Cryptographic Work Passport Signature Verification'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openQuoteModal('fintech_api')}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
              >
                Provision API Credentials
              </button>
            </div>

            {/* Tier 3: Sovereign GovTech */}
            <div className="glass-card p-6 rounded-3xl border border-purple-500/30 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    STATE LABOR MISSIONS
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-100 font-['Outfit']">Sovereign GovTech</h3>
                  <p className="text-xs text-slate-400 mt-1">State Labor Welfare Boards & Mission Directors.</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-100 font-['Outfit']">Custom</span>
                  <span className="text-xs text-slate-400">GovTech SLA License</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  {[
                    'State-Wide Informal Workforce Census & Geo-Heatmaps',
                    'Direct Batch Integration to e-Shram & PM Vishwakarma',
                    'Collusion & Ghost Labor Detection Radar',
                    'Dedicated Sovereign Cloud / On-Premise Deployment',
                    '99.95% Enterprise SLA with Dedicated Solutions Lead'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openQuoteModal('enterprise_gov')}
                className="w-full py-2.5 rounded-xl glass border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 font-bold text-xs transition-all"
              >
                Request GovTech Briefing
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATUTORY & SECURITY SECTION ──────────────────────────── */}
      <section id="statutory" className="relative z-10 py-20 px-6 border-t border-slate-800/40 bg-slate-950/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 block mb-2">Trust & Compliance</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-['Outfit']">
              Statutory Compliance & Security by Design
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100">DPDP Act 2023 Compliant</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Purpose-specific consent logging with verifiable cryptographic consent hashes and 1-click revocation mechanisms.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <Lock className="w-6 h-6 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">SHA-256 Merkle Ledger DAG</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mathematical tamper-evidence. Zero central database manipulation possible without breaking the Merkle Root signature.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <Building2 className="w-6 h-6 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100">BOCW Act 1996 Form XXIX</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated statutory register of wages and mandays calculation, protecting contractors from labor inspectorate fines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-10 sm:p-14 text-center border border-amber-500/20 relative overflow-hidden">
            <div className="orb orb-amber w-64 h-64 -right-12 top-0 opacity-20" />
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-xl shadow-amber-500/30 mx-auto">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-100 font-['Outfit']">
                Ready for Production Deployment?
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
                Deploy ShramLedger across your construction sites, integrate with your core banking LOS, or explore live worker credentials.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={onEnterDashboard}
                  className="btn-primary flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm w-full sm:w-auto"
                >
                  <Zap className="w-4 h-4" />
                  Launch Enterprise Suite
                </button>
                <button
                  onClick={() => openQuoteModal('contractor_pro')}
                  className="px-8 py-3.5 rounded-xl glass border border-slate-700 text-slate-200 font-bold text-sm hover:border-slate-500 w-full sm:w-auto"
                >
                  Contact Sales & Custom Quotes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-slate-800/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-[1.5px]">
              <div className="w-full h-full bg-[#040810] rounded-[9px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="text-sm font-black text-slate-200 block">ShramLedger Enterprise (श्रमLedger)</span>
              <span className="text-[10px] text-slate-600">Commercial Work History & Income Verification Platform</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
            <span>🔐 SHA-256 Merkle Ledger</span>
            <span>🏛️ BOCW 1996 Act Ready</span>
            <span>🇮🇳 DPDP 2023 Framework</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[10px] text-slate-600 mb-0.5">Author & System Architect</p>
            <p className="text-sm font-black text-amber-400 font-['Outfit']">Kulbhushan</p>
          </div>
        </div>
      </footer>

      {/* Commercial Quote Modal */}
      <CommercialQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialTier={selectedPlanTier}
      />

    </div>
  );
}
