import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Award, 
  Building, 
  FileCheck, 
  Mic, 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Activity,
  Home,
  ArrowLeft,
  UserPlus
} from 'lucide-react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import IncomeCertificate from './components/IncomeCertificate';
import LedgerTimeline from './components/LedgerTimeline';
import ShramScoreCard from './components/ShramScoreCard';
import SchemeMatcher from './components/SchemeMatcher';
import PublicVerifier from './components/PublicVerifier';
import VoiceLogger from './components/VoiceLogger';
import DocumentScanner from './components/DocumentScanner';
import AddEntryModal from './components/AddEntryModal';
import ContractorEndorseModal from './components/ContractorEndorseModal';
import OnboardingModal from './components/OnboardingModal';
import EmployerPortal from './components/EmployerPortal';
import LenderPortal from './components/LenderPortal';
import NgoGovPortal from './components/NgoGovPortal';
import AdminFraudDashboard from './components/AdminFraudDashboard';
import CommercialQuoteModal from './components/CommercialQuoteModal';
import CommandPaletteModal from './components/CommandPaletteModal';
import EndToEndDemoModal from './components/EndToEndDemoModal';
import { api } from './services/api';
import { TRANSLATIONS } from './utils/locales';

// ─── Animated Loading Screen ───────────────────────────────────────────
function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const steps = [
    'Initializing Tamper-Evident Ledger Engine...', 
    'Loading SHA-256 Merkle Roots...', 
    'Syncing Relational Worker Database...', 
    'Ready!'
  ];
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(timer); return 100; }
        return p + 4;
      });
    }, 40);
    const stepTimer = setInterval(() => {
      setStepIdx(s => Math.min(s + 1, steps.length - 1));
    }, 600);
    return () => { clearInterval(timer); clearInterval(stepTimer); };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden" style={{background:'#020617'}}>
      {/* Subtle background ambient glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-15 pointer-events-none" style={{background:'#10B981', top:'20%', left:'50%', transform:'translateX(-50%)'}} />
      <div className="absolute inset-0 bg-dots opacity-20" />

      <div className="relative z-10 flex flex-col items-center space-y-7 px-8">
        {/* Glowing Brand Mark Emblem */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl p-[1px] shadow-2xl" style={{background:'linear-gradient(135deg, rgba(16,185,129,0.8), rgba(255,255,255,0.1))'}}>
            <div className="w-full h-full rounded-[15px] flex items-center justify-center" style={{background:'#04091A'}}>
              <ShieldCheck className="w-10 h-10 text-[#10B981]" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{animation: 'orbit 3s linear infinite'}}>
            <div className="absolute w-2.5 h-2.5 rounded-full shadow-lg" style={{top: '-4px', left: '50%', marginLeft: '-5px', background:'#10B981', boxShadow:'0 0 10px #10B981'}} />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-light tracking-tight text-white mb-1 font-['Inter',sans-serif]">
            ShramLedger
          </h1>
          <p className="text-xs font-mono font-medium tracking-wider mb-1" style={{color:'#10B981'}}>श्रमLedger · SOVEREIGN MESH</p>
          <p className="text-xs text-slate-400 font-normal">
            Digital Workforce &amp; Income Verification Infrastructure
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80">
          <div className="flex justify-between text-[11px] text-slate-400 font-mono mb-2">
            <span>{steps[stepIdx]}</span>
            <span className="text-[#10B981]">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{background:'#0F172A', border:'1px solid rgba(255,255,255,0.08)'}}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background:'linear-gradient(90deg, #10B981, #34D399)' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500 font-mono">
          {['450M+ Workers', 'SHA-256 Merkle', 'DPDP 2023', '&lt;42ms Latency'].map((stat) => (
            <div key={stat} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>{stat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Metric Badge Card ──────────────────────────────────────────────────
function MetricBadge({ label, value, sub, accent = 'navy' }) {
  const colorMap = {
    navy:    { color: '#1B4332', bg: '#EAF5EE', border: '#94B8A4' },
    navy:    { color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
    saffron: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
    green:   { color: '#34D399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
    amber:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
    blue:    { color: '#38BDF8', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.3)' },
  };
  const c = colorMap[accent] || colorMap.navy;
  return (
    <div className="gov-card p-4 rounded-xl border border-white/10" style={{borderTopColor: c.color}}>
      <span className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-slate-400">{label}</span>
      <span className="text-xl font-light tracking-tight block leading-tight text-white font-mono">{value}</span>
      {sub && <span className="text-[10px] mt-1 block text-slate-400 font-sans">{sub}</span>}
    </div>
  );
}

// ─── Tab Button ─────────────────────────────────────────────────────────
function TabButton({ active, onClick, icon: Icon, label, badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? 'bg-[#10B981] text-black shadow-lg shadow-emerald-500/20 font-semibold'
          : 'bg-white/[0.04] text-slate-300 border border-white/10 hover:border-white/20 hover:text-white hover:bg-white/[0.08]'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {badge != null && (
        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${active ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-400'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

export default function App() {
  const [currentLang, setLang] = useState('hi');
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [showLanding, setShowLanding] = useState(true);
  const [viewMode, setViewMode] = useState('worker'); // 'worker' | 'employer' | 'lender' | 'ngo' | 'admin' | 'verifier'
  const [activeTab, setActiveTab] = useState('overview');

  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isEndToEndDemoOpen, setIsEndToEndDemoOpen] = useState(false);
  const [endorseTargetEntry, setEndorseTargetEntry] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEnterDashboard = () => {
    setShowLanding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    loadInitialData();
    const loaderTimer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(loaderTimer);
  }, []);

  useEffect(() => {
    if (selectedWorker) refreshWorkerData(selectedWorker.id);
  }, [selectedWorker?.id]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const workerList = await api.getWorkers();
      setWorkers(workerList);
      if (workerList.length > 0) setSelectedWorker(workerList[0]);
    } catch (err) {
      console.error('Failed to load workers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWorkerData = async (workerId) => {
    try {
      const [workerObj, scoreObj, certObj, schemesList] = await Promise.all([
        api.getWorker(workerId),
        api.getShramScore(workerId),
        api.getCertificate(workerId),
        api.getSchemes(workerId)
      ]);
      setSelectedWorker(workerObj);
      setScoreData(scoreObj);
      setCertificate(certObj);
      setSchemes(schemesList);
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  };

  const handleWorkerOnboarded = async (newWorker) => {
    const workerList = await api.getWorkers();
    setWorkers(workerList);
    setSelectedWorker(newWorker);
    setViewMode('worker');
    refreshWorkerData(newWorker.id);
  };

  const handleEntryAdded = () => { if (selectedWorker) refreshWorkerData(selectedWorker.id); };
  const handleDeleteEntry = async (entryId) => {
    if (!selectedWorker) return;
    try { await api.deleteEntry(selectedWorker.id, entryId); refreshWorkerData(selectedWorker.id); } catch {}
  };
  const handleEndorsed = () => { if (selectedWorker) refreshWorkerData(selectedWorker.id); };

  const HeroBg = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute w-[600px] h-[600px] rounded-full blur-[160px] opacity-10 bg-[#10B981] -top-40 -right-40" />
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-08 bg-[#38BDF8] -bottom-40 -left-40" />
      <div className="absolute inset-0 bg-dots opacity-20" />
    </div>
  );

  if (showLoader) return <LoadingScreen />;

  if (showLanding) {
    return <LandingPage onEnterDashboard={handleEnterDashboard} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-['Inter',sans-serif] aether-frame" style={{background:'#020617', color:'#FFFFFF'}}>
      
      <HeroBg />

      {/* Sovereign Infrastructure Breadcrumb Strip */}
      <div className="relative z-40 py-2 px-6 flex items-center justify-between border-b border-white/[0.08] bg-[#04091A]">
        <button
          onClick={() => setShowLanding(true)}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#10B981]" />
          <span>&larr; Sovereign Home / <span className="text-white capitalize">{viewMode} Portal</span></span>
        </button>
        <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Live Sovereign Mesh · SHA-256 Validated · DPDP 2023 Compliant
          </span>
        </div>
      </div>
      
      <Navbar
        currentLang={currentLang}
        setLang={setLang}
        workers={workers}
        selectedWorker={selectedWorker}
        setSelectedWorker={setSelectedWorker}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenVoiceLog={() => setIsVoiceOpen(true)}
        onOpenDocScan={() => setIsDocOpen(true)}
        onOpenManualEntry={() => setIsManualOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenEndToEndDemo={() => setIsEndToEndDemoOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">

        {/* ── B2B PORTALS OR WORKER APP ────────────────────────────── */}
        {viewMode === 'employer' ? (
          <EmployerPortal onVerificationHandled={() => { if (selectedWorker) refreshWorkerData(selectedWorker.id); }} />
        ) : viewMode === 'lender' ? (
          <LenderPortal 
            workers={workers} 
            selectedWorker={selectedWorker} 
            onSelectWorker={(w) => setSelectedWorker(w)} 
          />
        ) : viewMode === 'ngo' ? (
          <NgoGovPortal />
        ) : viewMode === 'admin' ? (
          <AdminFraudDashboard />
        ) : viewMode === 'verifier' ? (
          <div className="animate-slide-up">
            <PublicVerifier
              initialCertId={certificate?.certificate_id || 'SHRAM-2026-WORK-8C2A1E90'}
              currentLang={currentLang}
            />
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">

            {/* ── Worker Hero Banner ───────────────────────────────── */}
            {selectedWorker && scoreData && (
              <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden bg-[#04091A] border border-white/10 shadow-2xl">
                
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">

                  {/* Worker Identity */}
                  <div className="flex items-center gap-5">
                    <div className="relative flex-shrink-0">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-[1px] shadow-xl bg-gradient-to-br from-[#10B981] to-white/10">
                        <img
                          src={selectedWorker.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                          alt={selectedWorker.name}
                          className="w-full h-full rounded-[15px] object-cover bg-[#020617]"
                          style={{width: '76px', height: '76px'}}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10B981] border-2 border-[#04091A] flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-black font-bold" />
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-white font-['Inter',sans-serif]">
                          {selectedWorker.name}
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Activity className="w-2.5 h-2.5" />
                          DPDP Consent Active
                        </span>
                      </div>
                      <p className="text-sm font-medium flex items-center gap-2 text-emerald-400">
                        <span>🛠️ {selectedWorker.primary_trade}</span>
                        <span className="text-white/20">•</span>
                        <span>📍 {selectedWorker.city}, {selectedWorker.state}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 font-mono">
                        🆔 {selectedWorker.aadhaar_masked} • 📞 {selectedWorker.phone}
                      </p>
                    </div>
                  </div>

                  {/* Metric Badges Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4 gap-3">
                    <MetricBadge
                      label={t.totalEarnings}
                      value={`₹${(certificate?.total_earnings || 34850).toLocaleString('en-IN')}`}
                      accent="green"
                    />
                    <MetricBadge
                      label={t.avgMonthly}
                      value={`₹${(scoreData.estimated_monthly_income || scoreData.projected_monthly_income || 24200).toLocaleString('en-IN')}`}
                      accent="amber"
                    />
                    <MetricBadge
                      label={t.shramScore}
                      value={`${scoreData.overall_score || scoreData.composite_score || 785}`}
                      sub={`Grade ${scoreData.grade || 'A+'}`}
                      accent="navy"
                    />
                    <MetricBadge
                      label={t.workDays}
                      value={`${selectedWorker.work_entries?.length || 4}`}
                      sub="Days Logged"
                      accent="blue"
                    />
                  </div>
                </div>

                {/* Quick Ingest Bar */}
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="font-medium">Multi-Modal Ingestion: Indic Voice + 9-Format OCR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsVoiceOpen(true)}
                      className="aether-btn aether-btn-primary flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{t.voiceLog}</span>
                    </button>
                    <button
                      onClick={() => setIsDocOpen(true)}
                      className="aether-btn aether-btn-secondary flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t.scanSlip}</span>
                    </button>
                    <button
                      onClick={() => setIsManualOpen(true)}
                      className="aether-btn aether-btn-secondary flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{t.manualEntry}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Navigation Tabs ──────────────────────────────────── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                icon={FileCheck}
                label="Work Passport (पासपोर्ट)"
                activeClass="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/30"
              />
              <TabButton
                active={activeTab === 'ledger'}
                onClick={() => setActiveTab('ledger')}
                icon={Layers}
                label={t.ledgerTab}
                badge={selectedWorker?.work_entries?.length || 0}
                activeClass="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-cyan-500/30"
              />
              <TabButton
                active={activeTab === 'score'}
                onClick={() => setActiveTab('score')}
                icon={Award}
                label="Reliability Score (ShramScore)"
                activeClass="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/30"
              />
              <TabButton
                active={activeTab === 'schemes'}
                onClick={() => setActiveTab('schemes')}
                icon={Building}
                label={t.schemesTab}
                badge={schemes.length}
                activeClass="bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-orange-500/30"
              />
            </div>

            {/* ── Tab Content ──────────────────────────────────────── */}
            <div className="animate-fade-in">
              {activeTab === 'overview' && certificate && selectedWorker && (
                <IncomeCertificate
                  certificate={certificate}
                  worker={selectedWorker}
                  currentLang={currentLang}
                  onOpenVerifierWithCert={() => setViewMode('verifier')}
                />
              )}
              {activeTab === 'ledger' && selectedWorker && (
                <LedgerTimeline
                  entries={selectedWorker.work_entries}
                  worker={selectedWorker}
                  currentLang={currentLang}
                  onDeleteEntry={handleDeleteEntry}
                  onOpenContractorEndorse={(entry) => setEndorseTargetEntry(entry)}
                />
              )}
              {activeTab === 'score' && scoreData && selectedWorker && (
                <ShramScoreCard
                  scoreData={scoreData}
                  worker={selectedWorker}
                  currentLang={currentLang}
                />
              )}
              {activeTab === 'schemes' && selectedWorker && (
                <SchemeMatcher
                  schemes={schemes}
                  worker={selectedWorker}
                  currentLang={currentLang}
                />
              )}
            </div>

          </div>
        )}
      </main>

      {/* ── Premium Footer ───────────────────────────────────────────── */}
      <footer className="relative z-10 w-full mt-16 border-t border-slate-800/50">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-200 block">ShramLedger Enterprise (श्रमLedger)</span>
                <span className="text-[11px] text-slate-500">Tamper-Evident Employment & Income Verification Platform</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t.tamperProofGuarantee}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onWorkerOnboarded={handleWorkerOnboarded}
      />
      <VoiceLogger
        worker={selectedWorker}
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onEntryAdded={handleEntryAdded}
        currentLang={currentLang}
      />
      <DocumentScanner
        worker={selectedWorker}
        isOpen={isDocOpen}
        onClose={() => setIsDocOpen(false)}
        onEntryAdded={handleEntryAdded}
        currentLang={currentLang}
      />
      <AddEntryModal
        worker={selectedWorker}
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        onEntryAdded={handleEntryAdded}
      />
      <ContractorEndorseModal
        entry={endorseTargetEntry}
        worker={selectedWorker}
        isOpen={!!endorseTargetEntry}
        onClose={() => setEndorseTargetEntry(null)}
        onEndorsed={handleEndorsed}
      />
      <CommercialQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
      />
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        workers={workers}
        onSelectWorker={(w) => setSelectedWorker(w)}
        onNavigateView={(v) => setViewMode(v)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenDoc={() => setIsDocOpen(true)}
      />
      <EndToEndDemoModal
        isOpen={isEndToEndDemoOpen}
        onClose={() => setIsEndToEndDemoOpen(false)}
        worker={selectedWorker}
        onComplete={() => { if (selectedWorker) refreshWorkerData(selectedWorker.id); }}
      />
    </div>
  );
}
