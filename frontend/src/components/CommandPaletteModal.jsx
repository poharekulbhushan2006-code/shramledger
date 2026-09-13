import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  User, 
  Building2, 
  Landmark, 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  Zap, 
  ArrowRight,
  GitBranch,
  Building,
  UserPlus
} from 'lucide-react';

export default function CommandPaletteModal({
  isOpen,
  onClose,
  workers = [],
  onSelectWorker,
  onNavigateView,
  onOpenOnboarding,
  onOpenQuote,
  onOpenVoice,
  onOpenDoc
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // If open triggered externally
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'onboard',
      category: 'Quick Actions',
      title: 'Register New Worker (KYC & Biometric Hash)',
      subtitle: 'Onboard unorganized labor with zero-knowledge credentialing',
      icon: UserPlus,
      color: 'text-amber-400 bg-amber-500/10',
      action: () => { onClose(); onOpenOnboarding(); }
    },
    {
      id: 'quote',
      category: 'Quick Actions',
      title: 'Generate Enterprise RFP Quote / Proposal',
      subtitle: 'Commercial tier selection and PDF proposal generator',
      icon: Zap,
      color: 'text-orange-400 bg-orange-500/10',
      action: () => { onClose(); onOpenQuote(); }
    },
    {
      id: 'voice',
      category: 'Quick Actions',
      title: 'Multilingual Voice Shift Logger',
      subtitle: 'Hindi / Bhojpuri / Marathi / Tamil audio transcription',
      icon: Zap,
      color: 'text-purple-400 bg-purple-500/10',
      action: () => { onClose(); onOpenVoice?.(); }
    }
  ];

  const portals = [
    {
      id: 'employer',
      category: 'Institutional Consoles',
      title: 'Demo Infrastructure Ltd — Contractor Console',
      subtitle: 'Form XXIX statutory registers, CSV bulk attendance, NACH bank export',
      icon: Building2,
      color: 'text-emerald-400 bg-emerald-500/10',
      action: () => { onClose(); onNavigateView('employer'); }
    },
    {
      id: 'lender',
      category: 'Institutional Consoles',
      title: 'Partner Bank Digital Underwriting & Sanction Desk',
      subtitle: 'Live ShramScore underwriting, 12-mo amortization, sanction order generator',
      icon: Landmark,
      color: 'text-cyan-400 bg-cyan-500/10',
      action: () => { onClose(); onNavigateView('lender'); }
    },
    {
      id: 'ngo',
      category: 'Institutional Consoles',
      title: 'UP BOCW & Central Labor Board Welfare Console',
      subtitle: 'Direct automated DBT dispatch, entitlement matcher, nodal officer console',
      icon: Building,
      color: 'text-orange-400 bg-orange-500/10',
      action: () => { onClose(); onNavigateView('ngo'); }
    },
    {
      id: 'admin',
      category: 'Institutional Consoles',
      title: 'Chief Risk Officer — Fraud & Collision Radar',
      subtitle: 'Inter-contractor ghost-shift heuristic engine, immutable audit trail',
      icon: ShieldAlert,
      color: 'text-red-400 bg-red-500/10',
      action: () => { onClose(); onNavigateView('admin'); }
    },
    {
      id: 'verifier',
      category: 'Institutional Consoles',
      title: 'Public Cryptographic Verifier Portal',
      subtitle: 'Zero-knowledge verification of tamper-evident Merkle credentials',
      icon: ShieldCheck,
      color: 'text-teal-400 bg-teal-500/10',
      action: () => { onClose(); onNavigateView('verifier'); }
    },
    {
      id: 'worker',
      category: 'Institutional Consoles',
      title: 'Worker Portable Identity & Pass Console',
      subtitle: 'Dynamic QR credential, Merkle DAG visualizer, offline SMS verification',
      icon: User,
      color: 'text-amber-400 bg-amber-500/10',
      action: () => { onClose(); onNavigateView('worker'); }
    }
  ];

  const workerItems = (workers || []).map(w => ({
    id: `worker-${w.id}`,
    category: 'Active Workers',
    title: `${w.name} (${w.primary_trade?.split('/')[0]?.trim() || 'Skilled'})`,
    subtitle: `${w.city}, ${w.state} · ShramScore: ${w.shram_score || '780'} · Aadhaar Ref: XXXX-${w.aadhaar_hash?.slice(-4) || '2849'}`,
    icon: User,
    color: 'text-amber-300 bg-amber-500/10',
    action: () => {
      onSelectWorker(w);
      onNavigateView('worker');
      onClose();
    }
  }));

  const allItems = [...portals, ...quickActions, ...workerItems];
  const filteredItems = allItems.filter(item => 
    !query || 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to console, worker, statutory form, or audit module... (or press ESC)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-slate-800/40">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching records, consoles, or workers found for "{query}".
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-800/80 transition-all text-left group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors truncate">
                        {item.title}
                      </span>
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950/80 text-slate-500 border border-slate-800 shrink-0 ml-2">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>ShramLedger Enterprise Command Console</span>
          </div>
          <div className="font-mono text-[10px]">
            Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">K</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
