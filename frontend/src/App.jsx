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
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden" style={{background:'#f5f7fa'}}>
      {/* Subtle background dots */}
      <div className="absolute inset-0 bg-dots opacity-60" />
      {/* Tricolor decorative orbs */}
      <div className="orb orb-amber w-[400px] h-[400px] -top-24 -right-24 opacity-25" />
      <div className="orb orb-emerald w-[350px] h-[350px] -bottom-20 -left-20 opacity-20" />
      <div className="orb orb-indigo w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />

      <div className="relative z-10 flex flex-col items-center space-y-8 px-8">
        {/* Government Emblem */}
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl p-[3px] shadow-xl animate-glow-pulse" style={{background:'linear-gradient(135deg,#003087,#FF6B00)'}}>
            <div className="w-full h-full rounded-[14px] flex items-center justify-center" style={{background:'#003087'}}>
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center" style={{animation: 'orbit 3s linear infinite'}}>
            <div className="absolute w-3 h-3 rounded-full border-2 border-white" style={{top: '-6px', left: '50%', marginLeft: '-6px', background:'#FF6B00'}} />
          </div>
        </div>

        {/* Tricolor stripe */}
        <div className="w-48 h-1.5 rounded-full overflow-hidden flex">
          <div className="flex-1" style={{background:'#FF6B00'}} />
          <div className="flex-1 bg-white border-y border-gray-200" />
          <div className="flex-1" style={{background:'#138808'}} />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight font-['Noto_Sans'] mb-1" style={{color:'#003087'}}>
            ShramLedger
          </h1>
          <p className="text-base font-semibold mb-0.5" style={{color:'#FF6B00'}}>श्रमLedger</p>
          <p className="text-sm text-gray-500 font-medium">
            Digital Employment &amp; Income Verification Platform
          </p>
          <p className="text-xs text-gray-400 mt-1">Ministry of Labour &amp; Employment · Government of India</p>
        </div>

        {/* Progress Bar */}
        <div className="w-80">
          <div className="flex justify-between text-[10px] text-gray-400 font-mono mb-2">
            <span>{steps[stepIdx]}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{background:'#e8eef8', border:'1px solid #d0d9e8'}}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background:'linear-gradient(90deg,#003087,#FF6B00)' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-gray-400">
          {['450M+ Workers', 'SHA-256 Merkle', 'DPDP 2023', '5 Languages'].map((stat) => (
            <div key={stat} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{background:'#003087'}} />
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
    navy:    { color: '#003087', bg: '#e8eef8', border: '#a8b8d0' },
    saffron: { color: '#FF6B00', bg: '#fff4ec', border: '#ffcca0' },
    green:   { color: '#138808', bg: '#e8f5e6', border: '#9fd09b' },
    amber:   { color: '#8a6000', bg: '#fff8e1', border: '#ffd54f' },
    blue:    { color: '#004ba8', bg: '#e8eef8', border: '#90b0e0' },
  };
  const c = colorMap[accent] || colorMap.navy;
  return (
    <div className="gov-card p-4 rounded-md" style={{borderTopColor: c.color}}>
      <span className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{color:'#6b7c9e'}}>{label}</span>
      <span className="text-lg font-extrabold block leading-tight" style={{color: c.color}}>{value}</span>
      {sub && <span className="text-[10px] mt-0.5 block" style={{color:'#9aaac0'}}>{sub}</span>}
    </div>
  );
}

// ─── Tab Button ─────────────────────────────────────────────────────────
function TabButton({ active, onClick, icon: Icon, label, badge, activeClass }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded text-xs font-bold transition-all duration-200 whitespace-nowrap ${
        active
          ? 'text-white shadow-md'
          : 'text-gray-500 hover:text-gray-800 hover:bg-blue-50'
      }`}
      style={active ? {background:'#003087'} : {background:'#f0f4fb', border:'1px solid #d0d9e8'}}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {badge != null && (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${active ? 'bg-white/20 text-white/90' : 'bg-gray-200 text-gray-600'}`}>
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
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="orb orb-amber w-[700px] h-[700px] -top-48 -right-48 opacity-15" />
      <div className="orb orb-emerald w-[500px] h-[500px] -bottom-32 -left-32 opacity-10" />
      <div className="orb orb-indigo w-[400px] h-[400px] top-1/2 -translate-y-1/2 left-1/3 opacity-10" />
      <div className="absolute inset-0 bg-dots opacity-50" />
    </div>
  );

  if (showLoader) return <LoadingScreen />;

  if (showLanding) {
    return <LandingPage onEnterDashboard={handleEnterDashboard} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{background:'#f5f7fa', color:'#1a2642'}}>
      
      <HeroBg />

      {/* Government Breadcrumb Strip */}
      <div className="relative z-50 py-1.5 px-4 flex items-center justify-between" style={{background:'#eef1f6', borderBottom:'1px solid #d0d9e8'}}>
        <button
          onClick={() => setShowLanding(true)}
          className="flex items-center gap-2 text-[11px] font-medium group transition-colors"
          style={{color:'#3d5280'}}
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" style={{color:'#003087'}} />
          <span className="hover:underline" style={{color:'#003087'}}>Home &gt; Worker Dashboard</span>
        </button>
        <div className="flex items-center gap-3 text-[10px]" style={{color:'#6b7c9e'}}>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live System · SHA-256 Merkle Ledger · DPDP 2023 Compliant
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
              <div className="rounded-3xl glass-card p-6 sm:p-8 shadow-2xl relative overflow-hidden gradient-border-amber">
                
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-emerald-500/5 pointer-events-none rounded-3xl" />
                <div className="absolute -right-16 -top-16 w-64 h-64 orb orb-amber opacity-60" />

                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">

                  {/* Worker Identity */}
                  <div className="flex items-center gap-5">
                    <div className="relative flex-shrink-0">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-[2px] bg-gradient-to-tr from-amber-500 to-emerald-500 shadow-xl shadow-amber-500/20">
                        <img
                          src={selectedWorker.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                          alt={selectedWorker.name}
                          className="w-full h-full rounded-[14px] object-cover bg-slate-900"
                          style={{width: '76px', height: '76px'}}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#040810] flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h1 className="text-2xl font-black text-slate-100 font-['Outfit']">
                          {selectedWorker.name}
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Activity className="w-2.5 h-2.5" />
                          DPDP Consent Active
                        </span>
                      </div>
                      <p className="text-sm text-amber-300 font-semibold flex items-center gap-2">
                        <span>🛠️ {selectedWorker.primary_trade}</span>
                        <span className="text-slate-600">•</span>
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
                      accent="emerald"
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
                      accent="teal"
                    />
                    <MetricBadge
                      label={t.workDays}
                      value={`${selectedWorker.work_entries?.length || 4}`}
                      sub="Days Logged"
                      accent="slate"
                    />
                  </div>
                </div>

                {/* Quick Ingest Bar */}
                <div className="mt-6 pt-5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Multi-Modal Ingestion: Indic Voice + 9-Format OCR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsVoiceOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold border border-amber-500/30 text-xs transition-all hover:scale-105 hover:glow-amber"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{t.voiceLog}</span>
                    </button>
                    <button
                      onClick={() => setIsDocOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/30 text-xs transition-all hover:scale-105"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t.scanSlip}</span>
                    </button>
                    <button
                      onClick={() => setIsManualOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass text-slate-300 font-bold border border-slate-700/60 text-xs transition-all hover:border-slate-600"
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
    </div>
  );
}
