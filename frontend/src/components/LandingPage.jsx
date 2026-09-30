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
  ChevronRight,
  FileCheck,
  Building2,
  Calculator,
  Check,
  Activity,
  Globe,
  Radio,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import WarpCanvas from './WarpCanvas';
import CommercialQuoteModal from './CommercialQuoteModal';

const STATS = [
  { value: '450M+', label: 'Informal Workforce in Bharat', sub: 'Target beneficiaries across states' },
  { value: '₹47,000 Cr', label: 'Annual Informal Payroll', sub: 'Tamper-proof digitized ledger' },
  { value: 'SHA-256', label: 'Merkle Ledger DAG', sub: 'Mathematical immutability guarantee' },
  { value: 'DPDP 2023', label: 'Statutory Data Protection', sub: 'Consent-governed verifiable APIs' },
];

const FEATURES = [
  {
    icon: Mic,
    title: 'AI Multilingual Voice Ingestion',
    desc: 'Workers speak naturally in Hindi, Hinglish, Marathi, Tamil, Bengali or English. Indic Voice NLP extracts wages, employer, and hours in seconds.',
    tag: 'Indic Voice NLP'
  },
  {
    icon: FileText,
    title: '9-Format OCR Computer Vision',
    desc: 'Scans contractor chits, muster rolls, handwritten slips, and UPI screenshots with confidence scoring and bounding boxes.',
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
    desc: 'Alternative credit scoring evaluating income consistency, contractor diversity, and verification strength for collateral-free bank loans.',
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

  // Single orchestrated reveal pass on scroll into view
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.aether-reveal').forEach((el) => el.classList.add('in'));
      return;
    }

    const revealEls = document.querySelectorAll('.aether-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const openQuoteModal = (tier) => {
    setSelectedPlanTier(tier);
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-[#10B981]/30 selection:text-white font-['Inter',sans-serif]">

      <div className="aether-frame">

        {/* ── Top Micro-Bar: Sovereign Infrastructure Live Status ── */}
        <div className="px-6 py-2 border-b border-white/[0.06] bg-[#04091A]/90 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[11px] tracking-wide text-slate-300 font-medium">
              Sovereign Workforce Credential Network · DPDP Act 2023 &amp; BOCW Act 1996 Compliant
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-400 font-mono">
            <span>Latency: &lt;42ms</span>
            <span className="text-white/20">•</span>
            <span className="text-[#10B981]">SHA-256 Merkle Validated</span>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="aether-nav">
          <div className="aether-brand cursor-pointer" onClick={onEnterDashboard}>
            <span className="aether-brand-mark" />
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold tracking-tight text-white">ShramLedger</span>
              <span className="text-xs text-[#10B981] font-mono tracking-wider">श्रमLedger</span>
            </div>
          </div>

          <div className="aether-nav-links">
            <a href="#features">Platform</a>
            <a href="#mesh-network">Network DAG</a>
            <a href="#roi-calculator">ROI Calculator</a>
            <a href="#pricing">Licensing</a>
            <a href="#compliance">Statutory</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openQuoteModal('contractor_pro')}
              className="aether-btn aether-btn-secondary hidden sm:inline-flex text-xs"
            >
              Enterprise Quote
            </button>
            <button
              onClick={onEnterDashboard}
              className="aether-btn aether-btn-primary flex items-center gap-2 text-xs"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Launch Portal (पोर्टल)</span>
            </button>
          </div>
        </nav>

        {/* ── Hero Section ── */}
        <section className="aether-hero">
          {/* Dynamic Three.js Warp Canvas */}
          <WarpCanvas />

          <div className="aether-hero-content">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium mb-6 border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              <span>Tamper-Evident Workforce &amp; Income Verification Mesh</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </div>

            {/* Main Headline */}
            <h1>Compute that holds its proof under load</h1>

            {/* Subtext */}
            <p>
              ShramLedger runs informal workforce records across a sovereign SHA-256 Merkle mesh that
              reroutes around fraud before audits even notice. Protecting 450M+ workers and institutional EPCs.
            </p>

            {/* Hero CTAs */}
            <div className="aether-hero-ctas">
              <button
                onClick={onEnterDashboard}
                className="aether-btn aether-btn-primary flex items-center gap-2.5 text-sm"
              >
                <span>Launch Enterprise Suite</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#roi-calculator"
                className="aether-btn aether-btn-secondary flex items-center gap-2 text-sm"
              >
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Calculate Site Savings</span>
              </a>
            </div>

            {/* Hero Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              {['SHA-256 Merkle DAG', 'BOCW Form XXIX Automation', 'DPDP 2023 Consent Logs', '6 Indic Languages', 'RBI Account Aggregator Ready'].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats Bar ── */}
        <section className="py-8 px-6 border-b border-white/[0.08] bg-[#04091A]/50">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {STATS.map(({ value, label, sub }) => (
              <div key={label} className="p-4 rounded-xl border border-white/[0.05] bg-[#020617]/40">
                <div className="text-2xl sm:text-3xl font-light tracking-tight text-white mb-1 font-mono">
                  {value}
                </div>
                <div className="text-xs font-medium text-slate-300 mb-0.5">{label}</div>
                <div className="text-[11px] text-slate-500">{sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features Section ── */}
        <section id="features" className="aether-section">
          <div className="max-w-xl mb-12 aether-reveal">
            <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wider block mb-2">
              Sovereign Stack Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight leading-snug mb-3">
              Built for the parts that usually break
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every layer of the stack is designed around the manual failure modes, contractor chits, and ghost labor that take other platforms down.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {FEATURES.map(({ icon: Icon, title, desc, tag }, idx) => (
              <div key={title} className="aether-shell aether-reveal">
                <div className="aether-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="aether-feature-icon">
                        <Icon />
                      </div>
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tag}
                      </span>
                    </div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* ── Wide Feature Row with Dynamic Network Mesh Visual ── */}
            <div id="mesh-network" className="aether-feature-wide aether-shell aether-reveal">
              <div className="aether-card">
                <div>
                  <span className="text-xs font-mono uppercase text-[#10B981] tracking-wider block mb-2">
                    Cryptographic Resilience
                  </span>
                  <h3 className="text-2xl font-light mb-3">A mesh that reroutes around fraud</h3>
                  <p>
                    When a site record is tampered with or conflicting shifts collide, ShramLedger shifts proof to verified Merkle roots in under a second, using the same cryptographic path institutional auditors already trust.
                  </p>

                  <div className="aether-metric-row">
                    <div className="aether-metric">
                      <span className="num">99.997%</span>
                      <span className="lbl">uptime, trailing 12 months</span>
                    </div>
                    <div className="aether-metric">
                      <span className="num">41</span>
                      <span className="lbl">state &amp; regional node endpoints</span>
                    </div>
                    <div className="aether-metric">
                      <span className="num">&lt;900ms</span>
                      <span className="lbl">Merkle verification latency</span>
                    </div>
                  </div>
                </div>

                {/* Animated Mesh Visual */}
                <div className="aether-mesh-visual flex items-center justify-center p-6">
                  <svg viewBox="0 0 320 320" className="w-full h-full">
                    <defs>
                      <radialGradient id="meshCenterGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Outer ambient circle */}
                    <circle cx="160" cy="160" r="110" stroke="rgba(16,185,129,0.15)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                    <circle cx="160" cy="160" r="60" stroke="rgba(16,185,129,0.25)" strokeWidth="1" fill="none" />

                    {/* Connecting network vector links */}
                    <g stroke="rgba(203,213,225,0.25)" strokeWidth="1">
                      <line x1="70" y1="80" x2="160" y2="160" />
                      <line x1="160" y1="160" x2="250" y2="95" />
                      <line x1="160" y1="160" x2="95" y2="245" />
                      <line x1="160" y1="160" x2="255" y2="235" />
                      <line x1="70" y1="80" x2="95" y2="245" />
                      <line x1="250" y1="95" x2="255" y2="235" />
                      <line x1="70" y1="80" x2="250" y2="95" strokeDasharray="3 3" />
                      <line x1="95" y1="245" x2="255" y2="235" strokeDasharray="3 3" />
                    </g>

                    {/* Signal packet dots traveling */}
                    <circle cx="115" cy="120" r="2.5" fill="#10B981">
                      <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="205" cy="127" r="2.5" fill="#10B981">
                      <animate attributeName="opacity" values="1;0.2;1" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="127" cy="202" r="2.5" fill="#10B981">
                      <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
                    </circle>

                    {/* Central Sovereign Root Node with pulse */}
                    <circle cx="160" cy="160" r="22" fill="url(#meshCenterGlow)" opacity="0.4">
                      <animate attributeName="r" values="18;28;18" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="160" cy="160" r="7" fill="#10B981" />
                    <circle cx="160" cy="160" r="3" fill="#FFFFFF" />

                    {/* Satellite Worker & Bank Nodes */}
                    <g fill="#CBD5E1">
                      <circle cx="70" cy="80" r="4.5" />
                      <circle cx="250" cy="95" r="4.5" />
                      <circle cx="95" cy="245" r="4.5" />
                      <circle cx="255" cy="235" r="4.5" />
                    </g>

                    {/* Node labels */}
                    <text x="70" y="65" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">EPC Site</text>
                    <text x="250" y="80" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">NBFC Bank</text>
                    <text x="95" y="265" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">e-Shram</text>
                    <text x="255" y="255" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">BOCW Node</text>
                    <text x="160" y="195" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="bold" fontFamily="monospace">MERKLE ROOT</text>
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Interactive ROI & Statutory Savings Calculator ── */}
        <section id="roi-calculator" className="aether-section border-t border-white/[0.08] bg-[#04091A]/40">
          <div className="max-w-4xl mx-auto aether-reveal">
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase text-[#10B981] tracking-wider block mb-2">
                Statutory Economics &amp; ROI
              </span>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-3">
                Enterprise ROI &amp; Statutory Savings Calculator
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Model real-time cost reduction from ghost labor prevention and automated BOCW Form XXIX inspection protection.
              </p>
            </div>

            <div className="aether-shell">
              <div className="aether-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 sm:p-10">
                {/* Sliders Column */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                      <span>Active Construction Site Workers:</span>
                      <span className="font-mono text-emerald-400 font-semibold">{roiWorkers} Workers</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="2500"
                      step="25"
                      value={roiWorkers}
                      onChange={(e) => setRoiWorkers(parseInt(e.target.value))}
                      className="w-full h-1.5 rounded-lg cursor-pointer bg-slate-700 accent-[#10B981]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                      <span>Average Daily Wage Rate:</span>
                      <span className="font-mono text-emerald-400 font-semibold">₹{roiDailyWage}/day</span>
                    </div>
                    <input
                      type="range"
                      min="450"
                      max="1500"
                      step="25"
                      value={roiDailyWage}
                      onChange={(e) => setRoiDailyWage(parseInt(e.target.value))}
                      className="w-full h-1.5 rounded-lg cursor-pointer bg-slate-700 accent-[#10B981]"
                    />
                  </div>

                  <div className="p-4 rounded-xl space-y-2.5 text-xs bg-[#020617] border border-white/[0.06]">
                    <div className="flex justify-between text-slate-400">
                      <span>Estimated Monthly Site Payroll:</span>
                      <span className="font-mono text-white">₹{monthlyPayroll.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Ghost Worker Prevention (6%):</span>
                      <span className="font-mono">+₹{ghostLaborSavings.toLocaleString('en-IN')}/mo</span>
                    </div>
                    <div className="flex justify-between text-teal-400 font-medium">
                      <span>BOCW Form XXIX Audit Protection:</span>
                      <span className="font-mono">+₹{bocwPenaltyProtection.toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Output Box */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-[#020617] border border-emerald-500/30 text-center space-y-4 shadow-xl">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#10B981]">
                    Net Annual Projected Value
                  </span>
                  <div className="text-4xl sm:text-5xl font-light tracking-tight text-white font-mono">
                    ₹{annualSavings.toLocaleString('en-IN')}
                    <span className="text-xs text-slate-400 block font-sans font-normal mt-1">
                      Estimated net annual return on investment
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    ShramLedger pays for itself within the first 14 days of site deployment through tamper-proof muster rolls and automated compliance exports.
                  </p>

                  <button
                    onClick={() => openQuoteModal('contractor_pro')}
                    className="aether-btn aether-btn-primary w-full text-xs font-semibold py-3"
                  >
                    Generate Custom Enterprise Proposal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Commercial Licensing Plans ── */}
        <section id="pricing" className="aether-section border-t border-white/[0.08]">
          <div className="max-w-5xl mx-auto aether-reveal">
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase text-[#10B981] tracking-wider block mb-2">
                Licensing Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-3">
                Predictable, Value-Driven Deployments
              </h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Purpose-built tiers for general civil contractors, institutional NBFC lenders, and state missions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Tier 1 */}
              <div className="aether-shell">
                <div className="aether-card flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-slate-300">
                      Construction EPCs
                    </span>
                    <div>
                      <h3 className="text-lg font-medium">Contractor Pro</h3>
                      <p className="text-xs text-slate-400">Site managers &amp; civil infrastructure builders.</p>
                    </div>

                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-3xl font-light text-white">₹1,999</span>
                      <span className="text-xs text-slate-400">/site/mo + ₹4/worker</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-white/[0.06]">
                      {[
                        'Unlimited Multilingual Voice & OCR Ingestion',
                        'Automated Bulk Muster Roll Ingestion & Merkle Roots',
                        'Statutory BOCW Act Form XXIX Inspection Exports',
                        'Contractor Digital Stamp & SMS Seals',
                        'Wage Disbursement Batch Generation'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => openQuoteModal('contractor_pro')}
                    className="aether-btn aether-btn-secondary w-full text-xs"
                  >
                    Start 30-Day Site Pilot
                  </button>
                </div>
              </div>

              {/* Tier 2: Highlighted */}
              <div className="aether-shell">
                <div className="aether-card flex flex-col justify-between space-y-6 relative border-emerald-500/40 bg-[#040D1E]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[#10B981]">
                        Institutional FinTech
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">POPULAR</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">FinTech &amp; NBFC API</h3>
                      <p className="text-xs text-slate-400">Micro-finance institutions &amp; digital credit underwriters.</p>
                    </div>

                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-3xl font-light text-white">₹4,999</span>
                      <span className="text-xs text-slate-400">/mo + ₹3.50/query</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-white/[0.06]">
                      {[
                        'Real-Time Underwriting REST API (<150ms)',
                        'DPDP Act 2023 Consent-Gated Verification',
                        '4-Pillar ShramScore™ Alternative Credit Dossier',
                        'Custom Risk Policy Engine & Simulation',
                        'Automated Shift Collision & Anti-Fraud Radar',
                        'Cryptographic Work Passport Signature Verification'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => openQuoteModal('fintech_api')}
                    className="aether-btn aether-btn-primary w-full text-xs"
                  >
                    Provision API Credentials
                  </button>
                </div>
              </div>

              {/* Tier 3 */}
              <div className="aether-shell">
                <div className="aether-card flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-slate-300">
                      State Labor Missions
                    </span>
                    <div>
                      <h3 className="text-lg font-medium">Sovereign GovTech</h3>
                      <p className="text-xs text-slate-400">State Labor Welfare Boards &amp; Mission Directors.</p>
                    </div>

                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-3xl font-light text-white">Custom</span>
                      <span className="text-xs text-slate-400">Sovereign SLA License</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-white/[0.06]">
                      {[
                        'State-Wide Informal Workforce Census & Geo-Heatmaps',
                        'Direct Batch Integration to e-Shram & PM Vishwakarma',
                        'Collusion & Ghost Labor Detection Radar',
                        'Dedicated Sovereign Cloud or On-Prem Deployment',
                        '99.95% Enterprise SLA with Dedicated Solutions Lead'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => openQuoteModal('enterprise_gov')}
                    className="aether-btn aether-btn-secondary w-full text-xs"
                  >
                    Request GovTech Briefing
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Statutory & Security Section ── */}
        <section id="compliance" className="aether-section border-t border-white/[0.08] bg-[#04091A]/30">
          <div className="max-w-5xl mx-auto aether-reveal">
            <div className="text-center mb-10">
              <span className="text-xs font-mono uppercase text-[#10B981] tracking-wider block mb-2">
                Sovereign Trust Framework
              </span>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-3">
                Statutory Compliance &amp; Security by Design
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="aether-shell">
                <div className="aether-card space-y-3">
                  <ShieldCheck className="w-6 h-6 text-[#10B981]" />
                  <h3 className="text-base font-medium">DPDP Act 2023 Compliant</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Purpose-specific consent logging with verifiable cryptographic consent hashes and 1-click revocation mechanisms.
                  </p>
                </div>
              </div>

              <div className="aether-shell">
                <div className="aether-card space-y-3">
                  <Lock className="w-6 h-6 text-[#10B981]" />
                  <h3 className="text-base font-medium">SHA-256 Merkle Ledger DAG</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mathematical tamper-evidence. Zero central database manipulation possible without breaking the Merkle Root signature.
                  </p>
                </div>
              </div>

              <div className="aether-shell">
                <div className="aether-card space-y-3">
                  <Building2 className="w-6 h-6 text-[#10B981]" />
                  <h3 className="text-base font-medium">BOCW Act 1996 Form XXIX</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automated statutory register of wages and mandays calculation, protecting contractors from labor inspectorate audits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom Call to Action Section ── */}
        <section className="aether-section border-t border-white/[0.08] text-center">
          <div className="max-w-xl mx-auto aether-reveal">
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4 text-white">
              Ready to see it hold under real traffic?
            </h2>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              Spin up a region in about the time it takes to read this page. Verify payroll, issue tamper-evident credentials, and unlock credit.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={onEnterDashboard}
                className="aether-btn aether-btn-primary px-8 py-3 text-sm font-semibold"
              >
                Launch Portal Free
              </button>
              <button
                onClick={() => openQuoteModal('contractor_pro')}
                className="aether-btn aether-btn-secondary px-6 py-3 text-sm"
              >
                Get Enterprise Quote
              </button>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="aether-footer">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span>© 2026 ShramLedger Sovereign Infrastructure</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              All Systems Operational
            </span>
            <a href="#compliance" className="hover:text-white transition-colors">Statutory Trust</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <button
              onClick={onEnterDashboard}
              className="aether-btn-link text-xs hover:text-emerald-400 transition-colors"
            >
              Status page &rarr;
            </button>
          </div>
        </footer>

      </div>

      {/* Commercial Quote Modal */}
      <CommercialQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialTier={selectedPlanTier}
      />

    </div>
  );
}
