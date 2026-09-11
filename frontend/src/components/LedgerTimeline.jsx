import React, { useState } from 'react';
import { 
  Hash, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Mic, 
  CreditCard, 
  Trash2, 
  PhoneCall,
  Layers,
  Search,
  SlidersHorizontal,
  Zap,
  Calendar,
  MapPin,
  IndianRupee,
  Lock
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/locales';

const FILTER_OPTIONS = [
  { value: 'ALL',      label: 'All Entries' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'UPI',      label: 'UPI Digital' },
  { value: 'VOICE',    label: 'Voice Logs' },
];

function EvidenceBadge({ type }) {
  const map = {
    voice_note:          { icon: <Mic className="w-3 h-3" />,        label: 'Voice', color: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
    upi_screenshot:      { icon: <CreditCard className="w-3 h-3" />, label: 'UPI',   color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
    wage_slip_photo:     { icon: <FileText className="w-3 h-3" />,   label: 'Slip',  color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' },
    cash_memo:           { icon: <FileText className="w-3 h-3" />,   label: 'Memo',  color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' },
    contractor_register: { icon: <FileText className="w-3 h-3" />,   label: 'Register', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25' },
  };
  const config = map[type] || { icon: <Clock className="w-3 h-3" />, label: 'Manual', color: 'bg-slate-800 text-slate-400 border-slate-700' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

export default function LedgerTimeline({ entries, worker, currentLang, onDeleteEntry, onOpenContractorEndorse }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.employer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.skill_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.date.includes(searchTerm);
    if (filterType === 'ALL')      return matchesSearch;
    if (filterType === 'VERIFIED') return matchesSearch && (e.endorsement_status === 'verified' || e.confidence_score >= 90);
    if (filterType === 'UPI')      return matchesSearch && e.payment_mode === 'UPI';
    if (filterType === 'VOICE')    return matchesSearch && e.evidence_type === 'voice_note';
    return matchesSearch;
  });

  return (
    <div className="glass-card rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">

      {/* Background accent */}
      <div className="orb orb-indigo w-56 h-56 -top-12 -right-12 opacity-30" />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
            <Layers className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-100 font-['Outfit']">
                Cryptographic Work Ledger
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                {entries.length} Blocks
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable SHA-256 hashed records • AI anomaly-validated
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-52">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contractor, date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-input rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 focus:outline-none"
            />
          </div>
          <div className="relative flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="glass-input rounded-xl pl-7 pr-3 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer appearance-none"
            >
              {FILTER_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Merkle Root Banner ─────────────────────────────────── */}
      <div className="hash-display p-3 rounded-xl flex items-center gap-3 relative z-10 overflow-hidden">
        <div className="animate-shimmer absolute inset-0 rounded-xl" />
        <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
        <div className="min-w-0 text-[11px] font-mono">
          <span className="text-cyan-400 font-bold">CHAIN ROOT: </span>
          <span className="text-slate-400 truncate">
            {entries.length > 0 ? `SHA-256(${entries[0].entry_hash?.slice(0, 48) || 'GENESIS'}...)` : 'GENESIS_EMPTY_CHAIN'}
          </span>
        </div>
        <span className="shrink-0 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] text-cyan-400 font-bold">
          VERIFIED
        </span>
      </div>

      {/* ── Entries ────────────────────────────────────────────── */}
      <div className="space-y-3 relative z-10">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-slate-500 text-sm">No records match your search.</p>
          </div>
        ) : (
          filteredEntries.map((entry, index) => {
            const isVerified = entry.endorsement_status === 'verified';
            return (
              <div
                key={entry.id}
                className={`premium-card p-4 sm:p-5 rounded-2xl group transition-all timeline-connector ${
                  isVerified ? 'hover:border-emerald-500/30' : 'hover:border-amber-500/20'
                }`}
              >
                {/* ── Row 1: Main Info ── */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Block Number */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center font-mono text-xs font-bold text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                      #{filteredEntries.length - index}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-100 truncate">
                          {entry.employer_name}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700/50 text-[10px] font-semibold truncate">
                          {entry.skill_type.split('/')[0].trim()}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{entry.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />{entry.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{entry.hours_worked}h
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount + Status */}
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end flex-shrink-0">
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-emerald-400 flex items-center gap-0.5">
                        <IndianRupee className="w-4 h-4" />{entry.amount_paid.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500">via {entry.payment_mode}</span>
                    </div>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${
                      isVerified
                        ? 'badge-verified'
                        : 'badge-pending'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {isVerified ? 'Verified' : 'Self-Logged'}
                    </span>
                  </div>
                </div>

                {/* ── Row 2: Evidence + Actions ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-800/50 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <EvidenceBadge type={entry.evidence_type} />
                    <span className="text-slate-500 italic truncate text-[11px]">
                      {entry.evidence_text?.slice(0, 60) || `Evidence: ${entry.evidence_type}`}...
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-mono text-slate-600">
                      AI: <strong className={entry.confidence_score >= 90 ? 'text-emerald-400' : 'text-amber-400'}>{entry.confidence_score}%</strong>
                    </span>

                    {!isVerified && (
                      <button
                        onClick={() => onOpenContractorEndorse(entry)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/25 text-indigo-300 text-[11px] font-semibold transition-all hover:scale-105"
                        title="Request contractor endorsement"
                      >
                        <PhoneCall className="w-3 h-3" />
                        Endorse
                      </button>
                    )}

                    {onDeleteEntry && (
                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Row 3: Cryptographic Hash ── */}
                <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono rounded-lg bg-[#040810]/60 border border-slate-800/40 px-3 py-1.5 overflow-hidden">
                  <Hash className="w-3 h-3 text-cyan-500 shrink-0" />
                  <span className="text-cyan-500 font-bold shrink-0">SHA-256:</span>
                  <span className="text-slate-600 truncate">{entry.entry_hash || 'PENDING_HASH'}</span>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
