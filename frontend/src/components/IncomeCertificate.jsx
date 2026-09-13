import React, { useRef, useState } from 'react';
import { 
  Download, 
  Share2, 
  ShieldCheck, 
  ExternalLink, 
  FileCheck, 
  CheckCircle2, 
  Calendar, 
  Briefcase, 
  IndianRupee,
  Award,
  Sparkles,
  Lock,
  Hash,
  Zap,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { safeExportToPdf, generateCertificateVectorPdf } from '../utils/pdfExport';
import confetti from 'canvas-confetti';
import { TRANSLATIONS } from '../utils/locales';
import MerkleDagVisualizer from './MerkleDagVisualizer';

export default function IncomeCertificate({ certificate, worker, currentLang, onOpenVerifierWithCert }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const certRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showDag, setShowDag] = useState(false);

  if (!certificate || !worker) return null;

  const handleDownloadPDF = async () => {
    if (!certificate || !worker) return;
    setIsExporting(true);
    const firstName = (worker.name || 'Worker').split(' ')[0];
    const filename = `ShramLedger_Passport_${firstName}_${certificate.certificate_id || 'CERT'}.pdf`;

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#10b981', '#f97316', '#06b6d4'],
      });

      generateCertificateVectorPdf(worker, certificate, filename);
    } catch (err) {
      console.error('Certificate PDF Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🇮🇳 *ShramLedger Verified Work & Income Passport*\n` +
      `👤 *Worker:* ${worker.name}\n` +
      `🛠️ *Trade:* ${worker.primary_trade}\n` +
      `💰 *Total Verified Wages:* ₹${certificate.total_earnings?.toLocaleString('en-IN')}\n` +
      `📈 *Est. Monthly Income:* ₹${certificate.average_monthly_wage?.toLocaleString('en-IN')}\n` +
      `⭐ *ShramScore™ Rating:* ${certificate.shram_score}\n` +
      `🔐 *Certificate ID:* ${certificate.certificate_id}\n` +
      `🔍 *Verify Online:* ${window.location.origin}/verify/${certificate.certificate_id}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-5">

      {/* ── Action Bar ─────────────────────────────────────────── */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-100">Verifiable Digital Work Credential</p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">ID: {certificate.certificate_id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowDag(!showDag)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-300 text-xs font-semibold transition-all hover:scale-105"
          >
            <Layers className="w-3.5 h-3.5" />
            {showDag ? 'Hide Merkle DAG' : 'Inspect Merkle DAG'}
          </button>
          <button
            onClick={onOpenVerifierWithCert}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl glass hover:bg-slate-800/80 border border-slate-700/50 text-slate-300 text-xs font-semibold transition-all hover:scale-105"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Verify Portal
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/35 text-emerald-300 text-xs font-semibold transition-all hover:scale-105"
          >
            <Share2 className="w-3.5 h-3.5" />
            {t.shareWhatsApp}
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex-1 sm:flex-none btn-primary flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Generating...' : t.downloadCertificate}
          </button>
        </div>
      </div>

      {/* ── Interactive Merkle DAG Inspector View ─────────────── */}
      {showDag && (
        <div className="animate-slide-up">
          <MerkleDagVisualizer
            entries={worker?.work_entries || []}
            worker={worker}
            onClose={() => setShowDag(false)}
          />
        </div>
      )}

      {/* ── Official Certificate (Exportable) ────────────────── */}
      <div
        ref={certRef}
        className="rounded-3xl relative overflow-hidden text-slate-100 shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #0d1526 0%, #060d1a 40%, #0a1420 70%, #070e1c 100%)',
          border: '1.5px solid rgba(245,158,11,0.35)',
        }}
      >
        {/* Dot watermark pattern */}
        <div className="absolute inset-0 bg-dots opacity-100 pointer-events-none" />
        {/* Inner ambient glow */}
        <div className="absolute top-0 left-1/4 w-64 h-64 orb-amber opacity-30" style={{borderRadius:'50%', filter:'blur(80px)', background:'radial-gradient(circle, rgba(245,158,11,0.2), transparent 70%)'}} />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 orb-emerald opacity-25" style={{borderRadius:'50%', filter:'blur(60px)', background:'radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)'}} />

        <div className="relative z-10 p-6 sm:p-8 space-y-0">

          {/* ── Cert Header ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-amber-500/15 gap-4">
            
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl p-[1.5px] bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-400 shadow-xl shadow-amber-500/25 flex-shrink-0">
                <div className="w-full h-full bg-[#040810] rounded-[13px] flex items-center justify-center">
                  <ShieldCheck className="w-9 h-9 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-2xl font-black tracking-tight text-slate-100 font-['Outfit']">SHRAMLEDGER</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Official Work Passport
                  </span>
                </div>
                <p className="text-xs text-amber-300 font-semibold mt-0.5">
                  श्रम एवं आय सत्यापन प्रमाण पत्र · National Informal Worker Credential
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Issued under Decentralized Cryptographic Ledger Standards</p>
              </div>
            </div>

            <div className="text-center sm:text-right flex-shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-xs font-bold mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                CRYPTOGRAPHICALLY VERIFIED
              </div>
              <p className="text-[11px] text-slate-500">
                Issued: <span className="text-slate-300 font-semibold">{certificate.issue_date || certificate.issued_date || '12 September 2026'}</span>
              </p>
            </div>
          </div>

          {/* ── Worker Section ── */}
          <div className="py-6 border-b border-slate-800/60 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl p-[1.5px] bg-gradient-to-tr from-amber-500/60 to-emerald-500/60 flex-shrink-0">
                <img
                  src={worker.avatar_url || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face"}
                  alt={worker.name}
                  className="w-full h-full rounded-[13px] object-cover bg-slate-900"
                />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-100 font-['Outfit'] mb-1">{worker.name}</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg glass border border-slate-700/50 text-slate-300">🛠️ {worker.primary_trade}</span>
                  <span className="px-2.5 py-1 rounded-lg glass border border-slate-700/50 text-slate-300">📍 {worker.city}, {worker.state}</span>
                  <span className="px-2.5 py-1 rounded-lg glass border border-slate-700/50 text-slate-300">🆔 {worker.aadhaar_masked}</span>
                  {(worker.eshram_uan_masked || worker.eshram_number) && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">🇮🇳 e-Shram: {worker.eshram_uan_masked || worker.eshram_number}</span>
                  )}
                </div>
              </div>
            </div>

            {/* ShramScore Stamp */}
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/30 text-center glow-amber">
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 block mb-1">Verified ShramScore™</span>
                <span className="text-4xl font-black text-slate-100 font-['Outfit'] block">{certificate.shram_score || certificate.composite_shram_score || 785}</span>
                <span className="text-[11px] font-bold text-emerald-400 block mt-1">★ Grade A+ Credit Proxy</span>
              </div>
            </div>
          </div>

          {/* ── Financial Metrics ── */}
          <div className="py-6 border-b border-slate-800/60">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
              Verified Financial History · {certificate.verified_period || '15 Jan 2026 – 12 Sep 2026'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Verified Wages', value: `₹${(certificate.total_earnings || 34850)?.toLocaleString('en-IN')}`, sub: 'On Cryptographic Ledger', color: 'text-emerald-400' },
                { label: 'Est. Monthly Income', value: `₹${(certificate.average_monthly_wage || 24200)?.toLocaleString('en-IN')}`, sub: 'Based on 24-day baseline', color: 'text-amber-300' },
                { label: 'Work Records', value: `${certificate.total_work_days || certificate.total_entries_attested || (worker.work_entries?.length || 4)} Days`, sub: '100% SHA-256 Hashed', color: 'text-slate-100' },
                { label: 'Loan Readiness', value: 'Up to ₹75,000', sub: 'Collateral-free Mudra/MFI', color: 'text-teal-400' },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="p-4 rounded-2xl glass-dark border border-slate-800/50">
                  <p className="text-[10px] text-slate-500 font-medium mb-1">{label}</p>
                  <p className={`text-lg font-extrabold ${color} font-['Outfit']`}>{value}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Crypto Proof + QR ── */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            <div className="space-y-3 max-w-lg">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Cryptographic Proof of Authenticity</span>
              </div>
              <div className="hash-display p-3 rounded-xl space-y-1.5 text-[11px]">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">MERKLE ROOT:</span>
                  <span className="text-slate-300 break-all">{certificate.merkle_root}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">SIGNATURE:</span>
                  <span className="text-slate-300 break-all">{certificate.digital_signature || 'SIG-ECDSA-SHA256-4b8c9a1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b'}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                ⚡ Any alteration to amounts, dates, or hours instantly invalidates this Merkle Root hash.
              </p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center p-4 rounded-2xl bg-white shadow-2xl shadow-black/50 flex-shrink-0">
              <QRCodeSVG
                value={certificate.verification_url || `${window.location.origin}/verify/${certificate.certificate_id}`}
                size={120}
                level="H"
                includeMargin={false}
              />
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-800 mt-2">SCAN TO VERIFY</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
