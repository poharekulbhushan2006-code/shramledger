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
  CheckCircle2,
  Search,
  Phone,
  MapPin
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
  onOpenQuote,
  onOpenCommandPalette,
  onOpenEndToEndDemo
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
    { id: 'worker',   label: 'Worker App',          icon: Users,       activeColor: 'bg-white text-[#1B4332]' },
    { id: 'employer', label: 'Employer / Contractor', icon: Building2,   activeColor: 'bg-white text-[#1B4332]' },
    { id: 'lender',   label: 'Bank / NBFC',          icon: Landmark,    activeColor: 'bg-white text-[#1B4332]' },
    { id: 'ngo',      label: 'NGO / Welfare',        icon: Building,    activeColor: 'bg-white text-[#1B4332]' },
    { id: 'admin',    label: 'Fraud & Audit',        icon: ShieldAlert, activeColor: 'bg-white text-[#1B4332]' },
    { id: 'verifier', label: 'Public Verifier',      icon: ShieldCheck, activeColor: 'bg-white text-[#1B4332]' }
  ];

  return (
    <>
      {/* ── Tricolor Top Stripe ── */}
      <div className="gov-top-stripe" />

      {/* ── Government Header Band ── */}
      <div className="gov-header-band">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-center gap-3">
            {/* Ashoka Chakra / Lion Capital SVG emblem */}
            <svg className="w-6 h-6 text-white opacity-90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="4" fill="none"/>
              <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.8"/>
              {/* 24 spokes */}
              {Array.from({length:24}, (_,i) => {
                const angle = (i * 360 / 24) * Math.PI / 180;
                const x1 = 50 + 11 * Math.cos(angle);
                const y1 = 50 + 11 * Math.sin(angle);
                const x2 = 50 + 39 * Math.cos(angle);
                const y2 = 50 + 39 * Math.sin(angle);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" opacity="0.7"/>;
              })}
            </svg>
            <span className="font-semibold text-white">
              Ministry of Labour &amp; Employment &nbsp;|&nbsp; Government of India
            </span>
          </div>
          <div className="flex items-center gap-4 text-white/80 text-[10px]">
            <span className="hidden sm:flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Bharat Digital Infrastructure
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
              Portal Status: Active
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Navigation ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          isScrolled
            ? 'shadow-lg shadow-blue-900/20'
            : ''
        }`}
        style={{ background: '#1B4332', borderBottom: '3px solid #F4A900' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[64px] gap-3">

            {/* ── Logo & Brand ── */}
            <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-white p-[2px] shadow-md animate-glow-pulse">
                  <div className="w-full h-full bg-[#1B4332] rounded-md flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white" />
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-white font-['Noto_Sans']">
                    ShramLedger
                  </span>
                  <span className="text-white/60 hidden sm:inline text-sm">|</span>
                  <span className="text-white/80 hidden sm:inline text-sm font-medium">श्रमLedger</span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-white/15 text-white border border-white/25 rounded-sm">
                    <Lock className="w-2.5 h-2.5" />
                    Tamper-Evident
                  </span>
                </div>
                <p className="text-[10px] text-white/55 hidden md:block truncate max-w-[280px] leading-tight mt-0.5">
                  Digital Employment &amp; Income Verification Platform · DPDP 2023 Compliant
                </p>
              </div>
            </div>

            {/* ── Center: Portal Mode Switcher ── */}
            <div className="hidden xl:flex items-center gap-0.5 p-1 rounded-md bg-white/10 border border-white/20">
              {PORTAL_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = viewMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#F4A900] text-[#0D2B20] shadow-sm font-bold'
                        : 'text-white/75 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Persona Dropdown */}
            <div className="xl:hidden flex items-center">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="px-3 py-1.5 rounded bg-white/10 border border-white/25 text-xs font-semibold text-white focus:outline-none"
              >
                {PORTAL_MODES.map(m => (
                  <option key={m.id} value={m.id} className="bg-[#1B4332] text-white">{m.label}</option>
                ))}
              </select>
            </div>

            {/* ── Right Controls ── */}
            <div className="flex items-center gap-2">

              {/* Search */}
              <button
                onClick={onOpenCommandPalette}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white/80 border border-white/20 font-medium text-xs transition-all hover:border-white/40"
                title="Search (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60 border border-white/15">⌘K</kbd>
              </button>

              {/* Quote Button */}
              <button
                onClick={onOpenQuote}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs transition-all"
              >
                Pricing &amp; Quote
              </button>

              {/* End-to-End Demo Button */}
              <button
                onClick={onOpenEndToEndDemo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded font-black text-xs shadow-md transition-all hover:scale-105 bg-emerald-400 hover:bg-emerald-300 text-slate-950 border border-emerald-300"
                title="Run complete 9-step credentialing & credit demo"
              >
                <span>⚡ End-to-End Demo</span>
              </button>

              {/* Register Worker — Saffron CTA */}
              <button
                onClick={onOpenOnboarding}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded font-black text-xs shadow-md transition-all hover:scale-105"
                style={{ background: '#F4A900', color: '#0D2B20', border: '1.5px solid #C8860A' }}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Register Worker</span>
              </button>

              {/* Worker Selector */}
              {viewMode === 'worker' && workers && workers.length > 0 && (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setWorkerDropOpen(!workerDropOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 border border-white/25 text-white text-xs font-semibold hover:bg-white/20 transition-all"
                  >
                    <img
                      src={selectedWorker?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                      alt={selectedWorker?.name}
                      className="w-6 h-6 rounded object-cover border border-white/30"
                    />
                    <span className="max-w-[100px] truncate">{selectedWorker?.name}</span>
                    <ChevronDown className={`w-3 h-3 text-white/60 transition-transform duration-200 ${workerDropOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {workerDropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg p-2 shadow-xl z-50 animate-scale-in">
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest px-2 pb-2 font-bold border-b border-gray-100 mb-2">
                        {t.selectWorker}
                      </p>
                      {workers.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => { setSelectedWorker(w); setWorkerDropOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-left text-xs group ${
                            selectedWorker?.id === w.id
                              ? 'bg-green-50 border border-green-300 text-green-900'
                              : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          <img src={w.avatar_url} alt={w.name} className="w-8 h-8 rounded object-cover border border-gray-200" />
                          <div className="min-w-0">
                            <p className="font-bold truncate text-gray-900">{w.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{w.primary_trade.split('/')[0].trim()} · {w.city}</p>
                          </div>
                          {selectedWorker?.id === w.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" style={{color:'#1B4332'}} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Language Selector */}
              <div className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/10 border border-white/20 text-xs text-white hover:bg-white/20 transition-colors">
                <Globe className="w-3.5 h-3.5 shrink-0 text-white/80" />
                <select
                  value={currentLang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-transparent text-white text-xs focus:outline-none cursor-pointer appearance-none pr-1"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#1B4332] text-white">{l.label}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden p-2 rounded bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-white/10 px-4 pb-4 pt-3 space-y-3 animate-slide-up" style={{background:'#0D2B20'}}>
            <div className="grid grid-cols-2 gap-2">
              {PORTAL_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => { setViewMode(mode.id); setMobileOpen(false); }}
                  className={`flex items-center gap-2 p-2.5 rounded text-xs font-bold transition-all ${
                    viewMode === mode.id
                      ? 'text-white'
                      : 'bg-white/10 text-white/70'
                  }`}
                  style={viewMode === mode.id ? {background:'#F4A900', color:'#0D2B20'} : {}}
                >
                  <mode.icon className="w-4 h-4" />
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Backdrop */}
      {workerDropOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setWorkerDropOpen(false)} />
      )}
    </>
  );
}
