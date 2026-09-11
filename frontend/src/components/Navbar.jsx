import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Users, 
  Building2, 
  Mic, 
  FileText, 
  ChevronDown,
  Lock, 
  Menu, 
  X,
  Landmark,
  Building,
  ShieldAlert,
  UserPlus,
  CheckCircle2
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/locales';

export default function Navbar({ 
  currentLang, 
  setLang, 
  workers = [], 
  selectedWorker, 
  setSelectedWorker, 
  viewMode, 
  setViewMode,
  onOpenVoiceLog,
  onOpenDocScan,
  onOpenManualEntry,
  onOpenOnboarding,
  onOpenQuote
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [workerDropOpen, setWorkerDropOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const languages = [
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'en', label: 'English', flag: '🌐' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'bn', label: 'বাংলা', flag: '🇮🇳' }
  ];

  const PORTAL_MODES = [
    { id: 'worker', label: 'Worker App', icon: Users, color: 'text-amber-400' },
    { id: 'employer', label: 'Employer / Contractor', icon: Building2, color: 'text-emerald-400' },
    { id: 'lender', label: 'Bank / Underwriting', icon: Landmark, color: 'text-cyan-400' },
    { id: 'ngo', label: 'NGO / Govt Welfare', icon: Building, color: 'text-orange-400' },
    { id: 'admin', label: 'Fraud & Audit', icon: ShieldAlert, color: 'text-red-400' },
    { id: 'verifier', label: 'Public Verifier', icon: ShieldCheck, color: 'text-teal-400' }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'navbar-premium shadow-2xl shadow-black/50'
            : 'bg-[#040810]/95 backdrop-blur-2xl border-b border-white/5'
        }`}
      >
        {/* Top accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/60 via-orange-500/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px] gap-3">

            {/* ── Logo & Brand ── */}
            <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-400 p-[1.5px] shadow-lg shadow-amber-500/30 animate-glow-pulse">
                  <div className="w-full h-full bg-[#040810] rounded-[10px] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#040810]" />
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-shimmer font-['Outfit']">
                    {t.appName}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                    <Lock className="w-2.5 h-2.5" />
                    Tamper-Evident Ledger
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 hidden md:block truncate max-w-[260px] leading-tight mt-0.5">
                  Institutional Employment & Income Layer
                </p>
              </div>
            </div>

            {/* ── Center: Multi-Persona Switcher ── */}
            <div className="hidden xl:flex items-center gap-1 p-1 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              {PORTAL_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = viewMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-slate-800 text-slate-100 shadow-md border border-slate-700' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${mode.color}`} />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile/Compact Persona Dropdown */}
            <div className="xl:hidden flex items-center">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-amber-300 focus:outline-none"
              >
                {PORTAL_MODES.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* ── Right: Proposal Quote + Register Worker + Worker Select + Lang ── */}
            <div className="flex items-center gap-2">

              {/* Commercial Quote Proposal Button */}
              <button
                onClick={onOpenQuote}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-xs transition-all hover:scale-105"
              >
                <span>Pricing & Quote</span>
              </button>

              {/* Onboard New Worker Button */}
              <button
                onClick={onOpenOnboarding}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Register Worker</span>
              </button>

              {/* Worker Profile Dropdown */}
              {viewMode === 'worker' && workers && workers.length > 0 && (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setWorkerDropOpen(!workerDropOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-200 text-xs font-semibold hover:border-amber-500/40 hover:bg-slate-800/80 transition-all backdrop-blur-sm"
                  >
                    <img
                      src={selectedWorker?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                      alt={selectedWorker?.name}
                      className="w-6 h-6 rounded-lg object-cover"
                    />
                    <span className="max-w-[100px] truncate">{selectedWorker?.name}</span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${workerDropOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {workerDropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 glass-card rounded-2xl p-2 shadow-2xl shadow-black/50 z-50 animate-scale-in">
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest px-2 pb-2 font-bold border-b border-slate-800 mb-2">
                        {t.selectWorker}
                      </p>
                      {workers.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => { setSelectedWorker(w); setWorkerDropOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left text-xs group ${
                            selectedWorker?.id === w.id
                              ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                              : 'hover:bg-slate-800/80 text-slate-300 hover:text-slate-100'
                          }`}
                        >
                          <img src={w.avatar_url} alt={w.name} className="w-8 h-8 rounded-xl object-cover border border-slate-700 group-hover:border-amber-500/30 transition-colors" />
                          <div className="min-w-0">
                            <p className="font-bold truncate">{w.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{w.primary_trade.split('/')[0].trim()} • {w.city}</p>
                          </div>
                          {selectedWorker?.id === w.id && (
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 ml-auto shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Language Selector */}
              <div className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-xs text-slate-300 hover:border-slate-600 transition-colors backdrop-blur-sm">
                <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <select
                  value={currentLang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer appearance-none pr-1"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code} className="bg-slate-900 text-slate-200">
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden p-2 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-400 hover:text-slate-200 transition-all"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="xl:hidden glass-dark border-t border-white/5 px-4 pb-4 pt-3 space-y-3 animate-slide-up">
            <div className="grid grid-cols-2 gap-2">
              {PORTAL_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => { setViewMode(mode.id); setMobileOpen(false); }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold ${
                    viewMode === mode.id ? 'bg-slate-800 text-amber-300 border border-amber-500/30' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <mode.icon className="w-4 h-4" />
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Backdrop to close dropdowns */}
      {workerDropOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setWorkerDropOpen(false)} />
      )}
    </>
  );
}
