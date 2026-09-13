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
  ChevronRight,
  FileCheck,
  Layers,
  Building2,
  Landmark,
  Calculator,
  CheckCircle2,
  Phone,
  Mail,
  Check,
  ArrowUpRight,
  Globe,
  Activity
} from 'lucide-react';
import CommercialQuoteModal from './CommercialQuoteModal';

const STATS = [
  { value: '450M+', label: 'Informal Workforce in India', sub: 'Target beneficiaries across states' },
  { value: '₹47,000 Cr', label: 'Annual Informal Payroll', sub: 'Tamper-proof digitized ledger' },
  { value: 'SHA-256', label: 'Merkle Ledger DAG', sub: 'Mathematical immutability guarantee' },
  { value: 'DPDP 2023', label: 'Statutory Data Protection', sub: 'Consent-governed verifiable APIs' },
];

const FEATURES = [
  {
    icon: Mic,
    title: 'AI Multilingual Voice Ingestion',
    desc: 'Workers speak naturally in Hindi, Hinglish, Marathi, Tamil, Bengali or English. Indic NLP extracts wages, employer, trade, and working hours in seconds.',
    tag: 'Indic Voice NLP'
  },
  {
    icon: FileText,
    title: '9-Format OCR Computer Vision',
    desc: 'Scans contractor chits, muster rolls, handwritten slips and UPI transaction screenshots with confidence scoring and bounding boxes.',
    tag: 'Computer Vision'
  },
  {
    icon: Lock,
    title: 'SHA-256 Merkle Ledger DAG',
    desc: 'Every work entry is cryptographically anchored. Altering even ₹1 in past logs breaks the Merkle Root signature and triggers an instant fraud alarm.',
    tag: 'Cryptographic Security'
  },
  {
    icon: Award,
    title: 'ShramScore™ Credit Engine (300-900)',
    desc: 'Alternative credit score evaluating income consistency, contractor diversity, and verification strength for collateral-free bank loans.',
    tag: 'Alternative Credit'
  },
  {
    icon: Building,
    title: 'Automated Welfare Matcher',
    desc: 'Algorithmic matching to PM Vishwakarma, e-Shram, PM SVANidhi, BOCW Welfare Fund, and PMMY Mudra loans in real time.',
    tag: 'GovTech Stack'
  },
  {
    icon: FileCheck,
    title: 'Verifiable Digital Work Passport',
    desc: 'Dynamic QR-scannable A4 income certificate with cryptographic verification seals, printable and downloadable for loan approvals.',
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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openQuoteModal = (tier) => {
    setSelectedPlanTier(tier);
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#F4A900]/30 selection:text-[#1B4332]" style={{ background: '#F8FAF9', color: '#1A2E25' }}>

      {/* ── Tricolor Top Stripe (Official Indian Govt Portal Standard) ── */}
      <div className="gov-top-stripe" />

      {/* ── Official Government Header Band ── */}
      <div className="gov-header-band">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            {/* Ashoka Chakra 24-spoke SVG */}
            <svg className="w-4 h-4 text-[#F4A900] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              {[0,15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270,285,300,315,330,345].map((deg) => (
                <line
                  key={deg}
                  x1="12"
                  y1="12"
                  x2={12 + 10 * Math.sin((deg * Math.PI) / 180)}
                  y2={12 - 10 * Math.cos((deg * Math.PI) / 180)}
                  strokeWidth="0.8"
                />
              ))}
            </svg>
            <span className="font-semibold text-white/90">भारत सरकार | Government of India</span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-white/80 hidden sm:inline">श्रम एवं रोजगार मंत्रालय | Ministry of Labour &amp; Employment</span>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-white/70">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              National Workforce Credential Network · Live
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <div className="hidden md:flex items-center gap-1 font-mono">
              <span className="cursor-pointer hover:text-white">A-</span>
              <span className="cursor-pointer hover:text-white font-bold text-[#F4A900]">A</span>
              <span className="cursor-pointer hover:text-white">A+</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Official Portal Navbar ── */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-200`}
        style={{
          background: '#1B4332',
          borderBottom: '3px solid #F4A900',
          boxShadow: '0 4px 16px rgba(27, 67, 50, 0.25)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onEnterDashboard}>
            <div className="w-11 h-11 rounded-xl p-[2px] shadow-md shrink-0" style={{ background: 'linear-gradient(135deg, #F4A900, #C8860A)' }}>
              <div className="w-full h-full rounded-[9px] flex items-center justify-center" style={{ background: '#0D2B20' }}>
                <ShieldCheck className="w-6 h-6 text-[#F4A900]" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-white font-['Playfair_Display'] leading-none">
                  ShramLedger
                </span>
                <span className="text-xs font-bold text-[#F4A900] tracking-wide">
                  श्रमLedger
                </span>
              </div>
              <span className="text-[10px] text-emerald-100/70 font-semibold tracking-wider uppercase block mt-0.5">
                National Informal Workforce &amp; Income Verification Registry
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-bold text-white/80 uppercase tracking-wider">
            <a href="#roi-calculator" className="hover:text-[#F4A900] transition-colors">ROI Calculator</a>
            <a href="#features" className="hover:text-[#F4A900] transition-colors">Platform Features</a>
            <a href="#pricing" className="hover:text-[#F4A900] transition-colors">Commercial Licensing</a>
            <a href="#statutory" className="hover:text-[#F4A900] transition-colors">Statutory Compliance</a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openQuoteModal('contractor_pro')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold text-[#F4A900] border border-[#F4A900] hover:bg-[#F4A900]/10 transition-all"
            >
              <Calculator className="w-3.5 h-3.5" />
              Get Enterprise Quote
            </button>
            <button
              onClick={onEnterDashboard}
              className="flex items-center gap-2 px-4 py-2 rounded text-xs font-black transition-all shadow-md"
              style={{
                background: '#F4A900',
                color: '#0D2B20',
                border: '1px solid #C8860A'
              }}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Enter Portal (पोर्टल)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 pt-12 pb-16 px-4 sm:px-6 bg-grid">
        <div className="max-w-5xl mx-auto text-center">

          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 shadow-sm"
               style={{ background: '#EAF5EE', color: '#1B4332', border: '1px solid #94B8A4' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>🇮🇳 National Digital Credential Framework · BOCW Act 1996 &amp; DPDP Act 2023</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#C8860A]" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] mb-5 font-['Playfair_Display']" style={{ color: '#1B4332' }}>
            Every Shift Worked.<br />
            <span className="text-shimmer">Every Rupee Paid.</span><br />
            <span>Cryptographically Verified.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg max-w-3xl mx-auto mb-8 leading-relaxed font-normal" style={{ color: '#2D5140' }}>
            ShramLedger is Bharat's sovereign workforce verification and alternative credit scoring registry. Empowering
            <strong className="font-semibold text-[#1B4332]"> Construction EPCs, NBFC Lenders, and 450M+ Informal Workers </strong>
            with tamper-evident SHA-256 Merkle proofs, instant BOCW Form XXIX compliance, and automated welfare integration.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onEnterDashboard}
              className="btn-primary flex items-center justify-center gap-2.5 px-8 py-3.5 rounded text-sm font-bold shadow-lg w-full sm:w-auto"
              style={{ background: '#1B4332', borderColor: '#1B4332', color: '#FFFFFF' }}
            >
              <Zap className="w-4 h-4 fill-current text-[#F4A900]" />
              Launch Enterprise Suite (पोर्टल खोलें)
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openQuoteModal('contractor_pro')}
              className="btn-secondary flex items-center justify-center gap-2 px-7 py-3.5 rounded text-sm font-bold shadow-sm w-full sm:w-auto"
              style={{ background: '#FFFFFF', color: '#1B4332', borderColor: '#C8DDD2' }}
            >
              <Calculator className="w-4 h-4 text-[#C8860A]" />
              Request Commercial Proposal
            </button>
          </div>

          {/* Statutory Trust Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 text-xs text-[#5C7A6A]">
            {[
              '🔐 SHA-256 Merkle Proofs',
              '🏛️ BOCW Act 1996 Form XXIX Compliant',
              '🇮🇳 DPDP Act 2023 Framework',
              '💳 RBI Account Aggregator Protocol Ready',
              '🗣️ 6 Indic Languages'
            ].map(badge => (
              <span
                key={badge}
                className="px-3 py-1.5 rounded-full font-semibold shadow-xs"
                style={{ background: '#FFFFFF', border: '1px solid #C8DDD2', color: '#2D5140' }}
              >
                {badge}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative z-10 py-8 border-y border-[#C8DDD2]" style={{ background: '#EEF5F1' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ value, label, sub }) => (
              <div
                key={label}
                className="text-center p-4 rounded-lg bg-white shadow-xs"
                style={{ borderTop: '3px solid #1B4332', borderLeft: '1px solid #C8DDD2', borderRight: '1px solid #C8DDD2', borderBottom: '1px solid #C8DDD2' }}
              >
                <div className="text-2xl sm:text-3xl font-black font-['Playfair_Display'] mb-1" style={{ color: '#1B4332' }}>
                  {value}
                </div>
                <div className="text-xs font-bold mb-0.5 text-[#1A2E25]">{label}</div>
                <div className="text-[10px] text-[#5C7A6A]">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE ROI CALCULATOR ── */}
      <section id="roi-calculator" className="relative z-10 py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest block mb-1 text-[#C8860A]">
              Statutory Savings &amp; Commercial ROI
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Playfair_Display'] text-[#1B4332]">
              Enterprise ROI &amp; Statutory Savings Calculator
            </h2>
            <p className="text-xs sm:text-sm text-[#5C7A6A] max-w-xl mx-auto mt-2">
              Calculate how much your construction site or EPC project saves annually by eliminating ghost workers and automating statutory BOCW inspection audits.
            </p>
          </div>

          <div
            className="p-6 sm:p-8 rounded-xl bg-white shadow-md grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            style={{ border: '1px solid #C8DDD2', borderTop: '4px solid #1B4332' }}
          >
            
            {/* Sliders */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#1A2E25] mb-1.5">
                  <span>Active Construction Site Workers:</span>
                  <span className="text-sm font-black text-[#C8860A]">{roiWorkers} Workers</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2500"
                  step="25"
                  value={roiWorkers}
                  onChange={(e) => setRoiWorkers(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg cursor-pointer accent-[#1B4332]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#1A2E25] mb-1.5">
                  <span>Average Daily Wage Rate:</span>
                  <span className="text-sm font-black text-[#1B7A3E]">₹{roiDailyWage}/day</span>
                </div>
                <input
                  type="range"
                  min="450"
                  max="1500"
                  step="25"
                  value={roiDailyWage}
                  onChange={(e) => setRoiDailyWage(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg cursor-pointer accent-[#1B7A3E]"
                />
              </div>

              <div className="p-4 rounded-lg space-y-2 text-xs" style={{ background: '#F8FAF9', border: '1px solid #C8DDD2' }}>
                <div className="flex justify-between text-[#5C7A6A]">
                  <span>Estimated Monthly Site Payroll:</span>
                  <span className="font-mono text-[#1A2E25] font-bold">₹{monthlyPayroll.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-semibold text-[#1B7A3E]">
                  <span>Ghost Worker Prevention (6%):</span>
                  <span className="font-mono font-bold">+₹{ghostLaborSavings.toLocaleString('en-IN')}/mo</span>
                </div>
                <div className="flex justify-between font-semibold text-[#C8860A]">
                  <span>BOCW Form XXIX Audit Protection:</span>
                  <span className="font-mono font-bold">+₹{bocwPenaltyProtection.toLocaleString('en-IN')}/mo</span>
                </div>
              </div>
            </div>

            {/* Output Card */}
            <div
              className="p-6 rounded-xl text-center space-y-4 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #1B4332 0%, #0D2B20 100%)',
                color: '#FFFFFF',
                border: '2px solid #F4A900'
              }}
            >
              <span className="text-xs font-black uppercase tracking-wider text-[#F4A900]">
                Net Annual Projected Value
              </span>
              <div className="text-4xl sm:text-5xl font-black font-['Playfair_Display'] text-white">
                ₹{annualSavings.toLocaleString('en-IN')}
                <span className="text-xs text-white/70 block font-normal mt-1">Estimated annual return on investment</span>
              </div>

              <div className="text-xs text-white/80 leading-relaxed max-w-sm mx-auto">
                ShramLedger pays for itself within the first 14 days of site deployment through tamper-proof muster rolls and automated compliance exports.
              </div>

              <button
                onClick={() => openQuoteModal('contractor_pro')}
                className="w-full py-3 rounded font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                style={{ background: '#F4A900', color: '#0D2B20', border: '1px solid #C8860A' }}
              >
                <Calculator className="w-4 h-4" />
                Generate Custom Enterprise Proposal
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="relative z-10 py-16 px-4 sm:px-6 border-t border-[#C8DDD2]" style={{ background: '#F0F7F2' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest block mb-2 text-[#C8860A]">Platform Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Playfair_Display'] text-[#1B4332] mb-3">
              A Complete Financial Identity Stack
            </h2>
            <p className="text-xs sm:text-sm text-[#5C7A6A] max-w-xl mx-auto">
              From voice-based wage logging on active construction sites to bank-grade credit underwriting and government scheme matching.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, tag }, i) => (
              <div
                key={title}
                className="gov-card p-6 rounded-lg cursor-pointer transition-all bg-white"
                style={{
                  borderTop: '3px solid #1B4332',
                  border: '1px solid #C8DDD2'
                }}
                onClick={() => setActiveFeature(i)}
              >
                <div className="flex items-start justify-between mb-3.5">
                  <div className="p-3 rounded-lg shadow-sm" style={{ background: '#EAF5EE', border: '1px solid #94B8A4' }}>
                    <Icon className="w-5 h-5 text-[#1B4332]" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#FFF3CD', color: '#C8860A', border: '1px solid #F4A900' }}>
                    {tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1B4332] mb-2 font-['Playfair_Display']">{title}</h3>
                <p className="text-xs text-[#5C7A6A] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMERCIAL PRICING TIERS ── */}
      <section id="pricing" className="relative z-10 py-16 px-4 sm:px-6 border-t border-[#C8DDD2] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest block mb-1 text-[#C8860A]">Licensing Models</span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Playfair_Display'] text-[#1B4332]">
              Transparent, Value-Driven Plans
            </h2>
            <p className="text-xs sm:text-sm text-[#5C7A6A] max-w-xl mx-auto mt-2">
              Designed for individual site contractors, fast-growing infrastructure EPCs, and institutional FinTech lenders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tier 1: Contractor Pro */}
            <div
              className="p-6 rounded-lg bg-[#F8FAF9] flex flex-col justify-between space-y-6 relative"
              style={{ border: '1px solid #C8DDD2', borderTop: '3px solid #1B4332' }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold" style={{ background: '#EAF5EE', color: '#1B4332', border: '1px solid #94B8A4' }}>
                    CONSTRUCTION EPCS
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#1B4332]">Contractor Pro</h3>
                  <p className="text-xs text-[#5C7A6A] mt-1">Site managers &amp; civil infrastructure contractors.</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-['Playfair_Display'] text-[#1A2E25]">₹1,999</span>
                  <span className="text-xs text-[#5C7A6A]">/site/month + ₹4/worker</span>
                </div>

                <div className="space-y-2.5 text-xs text-[#2D5140] pt-3 border-t border-[#C8DDD2]">
                  {[
                    'Unlimited Multilingual Voice & OCR Ingestion',
                    'Automated Bulk Muster Roll Ingestion & Merkle Proofs',
                    'Statutory BOCW Act Form XXIX Inspection Report',
                    'Contractor Digital Stamp & SMS Verification Seals',
                    'Wage Disbursement Batch Generation'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#1B7A3E] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openQuoteModal('contractor_pro')}
                className="w-full py-2.5 rounded font-bold text-xs transition-all shadow-sm"
                style={{ background: '#1B4332', color: '#FFFFFF' }}
              >
                Start 30-Day Site Pilot
              </button>
            </div>

            {/* Tier 2: FinTech & NBFC Underwriting Suite */}
            <div
              className="p-6 rounded-lg bg-white flex flex-col justify-between space-y-6 relative shadow-md"
              style={{
                border: '2px solid #F4A900',
                borderTop: '4px solid #1B4332'
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold" style={{ background: '#FFF3CD', color: '#C8860A', border: '1px solid #F4A900' }}>
                    ⭐ MOST POPULAR FOR BANKS &amp; NBFCS
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#1B4332]">FinTech &amp; NBFC API</h3>
                  <p className="text-xs text-[#5C7A6A] mt-1">Micro-finance institutions &amp; digital lenders.</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-['Playfair_Display'] text-[#1B4332]">₹4,999</span>
                  <span className="text-xs text-[#5C7A6A]">/month + ₹3.50/query</span>
                </div>

                <div className="space-y-2.5 text-xs text-[#2D5140] pt-3 border-t border-[#C8DDD2]">
                  {[
                    'Real-Time Underwriting REST API (<150ms)',
                    'DPDP Act 2023 Consent-Gated Verification',
                    '4-Pillar ShramScore™ Alternative Credit Dossier',
                    'Custom Risk Policy Engine & Amortization Simulator',
                    'Automated Shift Collision & Anti-Fraud Stream',
                    'Cryptographic Work Passport Signature Verification'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C8860A] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openQuoteModal('fintech_api')}
                className="w-full py-2.5 rounded font-bold text-xs transition-all shadow-md"
                style={{ background: '#F4A900', color: '#0D2B20', border: '1px solid #C8860A' }}
              >
                Provision API Credentials
              </button>
            </div>

            {/* Tier 3: Sovereign GovTech */}
            <div
              className="p-6 rounded-lg bg-[#F8FAF9] flex flex-col justify-between space-y-6 relative"
              style={{ border: '1px solid #C8DDD2', borderTop: '3px solid #1B4332' }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold" style={{ background: '#EAF5EE', color: '#1B4332', border: '1px solid #94B8A4' }}>
                    STATE LABOR MISSIONS
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#1B4332]">Sovereign GovTech</h3>
                  <p className="text-xs text-[#5C7A6A] mt-1">State Labor Welfare Boards &amp; Mission Directors.</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-['Playfair_Display'] text-[#1A2E25]">Custom</span>
                  <span className="text-xs text-[#5C7A6A]">GovTech SLA License</span>
                </div>

                <div className="space-y-2.5 text-xs text-[#2D5140] pt-3 border-t border-[#C8DDD2]">
                  {[
                    'State-Wide Informal Workforce Census & Geo-Heatmaps',
                    'Direct Batch Integration to e-Shram & PM Vishwakarma',
                    'Collusion & Ghost Labor Detection Radar',
                    'Dedicated Sovereign Cloud / On-Premise Deployment',
                    '99.95% Enterprise SLA with Dedicated Solutions Lead'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#1B7A3E] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openQuoteModal('enterprise_gov')}
                className="w-full py-2.5 rounded font-bold text-xs transition-all shadow-sm"
                style={{ background: '#FFFFFF', color: '#1B4332', border: '1.5px solid #1B4332' }}
              >
                Request GovTech Briefing
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATUTORY & SECURITY SECTION ── */}
      <section id="statutory" className="relative z-10 py-16 px-4 sm:px-6 border-t border-[#C8DDD2]" style={{ background: '#EEF5F1' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest block mb-1 text-[#C8860A]">Trust &amp; Compliance</span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Playfair_Display'] text-[#1B4332]">
              Statutory Compliance &amp; Security by Design
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-white shadow-xs space-y-2" style={{ border: '1px solid #C8DDD2', borderTop: '3px solid #1B7A3E' }}>
              <ShieldCheck className="w-6 h-6 text-[#1B7A3E]" />
              <h3 className="text-base font-bold text-[#1B4332] font-['Playfair_Display']">DPDP Act 2023 Compliant</h3>
              <p className="text-xs text-[#5C7A6A] leading-relaxed">
                Purpose-specific consent logging with verifiable cryptographic consent hashes and 1-click revocation mechanisms.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white shadow-xs space-y-2" style={{ border: '1px solid #C8DDD2', borderTop: '3px solid #F4A900' }}>
              <Lock className="w-6 h-6 text-[#C8860A]" />
              <h3 className="text-base font-bold text-[#1B4332] font-['Playfair_Display']">SHA-256 Merkle Ledger DAG</h3>
              <p className="text-xs text-[#5C7A6A] leading-relaxed">
                Mathematical tamper-evidence. Zero central database manipulation possible without breaking the Merkle Root signature.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white shadow-xs space-y-2" style={{ border: '1px solid #C8DDD2', borderTop: '3px solid #1B4332' }}>
              <Building2 className="w-6 h-6 text-[#1B4332]" />
              <h3 className="text-base font-bold text-[#1B4332] font-['Playfair_Display']">BOCW Act 1996 Form XXIX</h3>
              <p className="text-xs text-[#5C7A6A] leading-relaxed">
                Automated statutory register of wages and mandays calculation, protecting contractors from labor inspectorate fines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ── */}
      <section className="relative z-10 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #1B4332 0%, #0D2B20 100%)',
              border: '2px solid #F4A900',
              color: '#FFFFFF'
            }}
          >
            <div className="relative z-10 space-y-5">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg mx-auto" style={{ background: 'linear-gradient(135deg, #F4A900, #C8860A)' }}>
                <ShieldCheck className="w-7 h-7 text-[#0D2B20]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-['Playfair_Display'] text-white">
                Ready for Production Deployment?
              </h2>
              <p className="text-white/80 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
                Deploy ShramLedger across your construction sites, integrate with your core banking LOS, or explore live worker credentials.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={onEnterDashboard}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded font-bold text-sm w-full sm:w-auto shadow-md"
                  style={{ background: '#F4A900', color: '#0D2B20', border: '1px solid #C8860A' }}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Launch Enterprise Suite
                </button>
                <button
                  onClick={() => openQuoteModal('contractor_pro')}
                  className="px-8 py-3.5 rounded font-bold text-sm w-full sm:w-auto transition-all"
                  style={{ background: 'transparent', color: '#FFFFFF', border: '1.5px solid rgba(255,255,255,0.4)' }}
                >
                  Contact Sales &amp; Custom Quotes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OFFICIAL GOVERNMENT FOOTER ── */}
      <footer className="relative z-10 py-10 px-4 sm:px-6" style={{ background: '#0D2B20', color: '#FFFFFF', borderTop: '3px solid #F4A900' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg p-[1.5px]" style={{ background: 'linear-gradient(135deg, #F4A900, #C8860A)' }}>
              <div className="w-full h-full rounded-[7px] flex items-center justify-center" style={{ background: '#1B4332' }}>
                <ShieldCheck className="w-5 h-5 text-[#F4A900]" />
              </div>
            </div>
            <div>
              <span className="text-sm font-bold text-white block">ShramLedger (श्रमLedger)</span>
              <span className="text-[10px] text-white/60">Ministry of Labour &amp; Employment · Government of India</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/80 font-medium">
            <span>🔐 SHA-256 Merkle Ledger</span>
            <span>🏛️ BOCW 1996 Act Ready</span>
            <span>🇮🇳 DPDP 2023 Framework</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[10px] text-white/50 mb-0.5">Author &amp; System Architect</p>
            <p className="text-sm font-bold text-[#F4A900]">Kulbhushan</p>
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
