import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  Search, 
  Check, 
  X, 
  FileText, 
  Phone, 
  Calendar,
  Sparkles,
  Award,
  UploadCloud,
  FileSpreadsheet,
  Download,
  Layers,
  Zap,
  Printer,
  FileCheck
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { api } from '../services/api';

export default function EmployerPortal({ onVerificationHandled }) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'bulk' | 'bocw' | 'payouts'
  const [pendingList, setPendingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [actionType, setActionType] = useState('confirm');
  const [notes, setNotes] = useState('Work hours and wage payout verified on-site.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const fileInputRef = useRef(null);
  const bocwRef = useRef(null);
  const [isExportingBocw, setIsExportingBocw] = useState(false);

  // Bulk muster state
  const [bulkRecords, setBulkRecords] = useState([
    {
      worker_name: 'Ramesh Kumar (रमेश कुमार)',
      phone: '+91 98765 43210',
      primary_trade: 'Mason / राजमिस्त्री',
      hours_worked: 8.0,
      daily_wage: 850.0,
      payment_mode: 'Cash',
      site_location: 'Noida Sector 62',
      work_date: new Date().toISOString().split('T')[0]
    },
    {
      worker_name: 'Sunita Devi (सुनीता देवी)',
      phone: '+91 98201 23456',
      primary_trade: 'Helper / सहायक',
      hours_worked: 8.0,
      daily_wage: 700.0,
      payment_mode: 'UPI',
      site_location: 'Noida Sector 62',
      work_date: new Date().toISOString().split('T')[0]
    },
    {
      worker_name: 'Rajesh Yadav (राजेश यादव)',
      phone: '+91 98109 11223',
      primary_trade: 'Carpenter / बढ़ई',
      hours_worked: 8.5,
      daily_wage: 900.0,
      payment_mode: 'Cash',
      site_location: 'Noida Sector 62',
      work_date: new Date().toISOString().split('T')[0]
    },
    {
      worker_name: 'Kailash Chand (कैलाश चंद)',
      phone: '+91 98765 43210',
      primary_trade: 'Carpenter / बढ़ई',
      hours_worked: 8.0,
      daily_wage: 800.0,
      payment_mode: 'UPI',
      site_location: 'Noida Sector 62',
      work_date: new Date().toISOString().split('T')[0]
    }
  ]);
  const [bulkResult, setBulkResult] = useState(null);
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  // BOCW report state
  const [bocwData, setBocwData] = useState(null);
  const [isLoadingBocw, setIsLoadingBocw] = useState(false);

  // Payout Batch state
  const [payoutTitle, setPayoutTitle] = useState('Site 04 Weekly Mason & Carpenter Disbursement');
  const [payoutResult, setPayoutResult] = useState(null);
  const [isExecutingPayout, setIsExecutingPayout] = useState(false);

  // Contractor profile
  const contractorName = "Rajesh Sharma (Site Incharge)";
  const contractorPhone = "+91 98765 43210";
  const contractorCompany = "Larsen & Toubro Infra Pvt Ltd";
  const siteName = "Noida Sector 62 Infrastructure Extension Site";

  useEffect(() => {
    loadPendingVerifications();
    loadBocwReport();
  }, []);

  const loadPendingVerifications = async () => {
    setIsLoading(true);
    try {
      const data = await api.getEmployerPending();
      setPendingList(data);
    } catch (err) {
      console.error('Failed to load pending verifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBocwReport = async () => {
    setIsLoadingBocw(true);
    try {
      const res = await api.getBOCWReport('site_delhi_metro_04');
      setBocwData(res);
    } catch (err) {
      console.error('BOCW load failed:', err);
    } finally {
      setIsLoadingBocw(false);
    }
  };

  const openActionModal = (entry, action) => {
    setSelectedEntry(entry);
    setActionType(action);
    if (action === 'confirm') {
      setNotes(`Verified attendance (8 hrs) and ₹${entry.amount_paid} wage payout.`);
    } else if (action === 'reject') {
      setNotes(`Record not recognized on this site.`);
    } else {
      setNotes(`Discrepancy in recorded work hours/rate.`);
    }
  };

  const handleActionSubmit = async () => {
    if (!selectedEntry) return;
    setIsProcessing(true);
    try {
      const payload = {
        entry_id: selectedEntry.entry_id,
        employer_name: contractorName,
        employer_phone: contractorPhone,
        action: actionType,
        note: notes
      };
      await api.submitEmployerAction(payload);
      setSuccessMessage(`Successfully ${actionType === 'confirm' ? 'verified' : actionType === 'reject' ? 'rejected' : 'registered dispute for'} ${selectedEntry.worker_name}'s record.`);
      setSelectedEntry(null);
      await loadPendingVerifications();
      if (onVerificationHandled) onVerificationHandled();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      alert('Failed to process verification action: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkSubmit = async () => {
    setIsBulkSubmitting(true);
    try {
      const payload = {
        employer_id: "emp_lnt_01",
        employer_name: contractorCompany,
        site_name: siteName,
        records: bulkRecords,
        auto_anchor_ledger: true
      };
      const res = await api.ingestBulkMuster(payload);
      setBulkResult(res);
      await loadBocwReport();
      if (onVerificationHandled) onVerificationHandled();
    } catch (err) {
      alert('Bulk muster anchoring failed: ' + err.message);
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  const handleExecutePayout = async () => {
    setIsExecutingPayout(true);
    try {
      const totalAmt = bulkRecords.reduce((s, r) => s + r.daily_wage, 0) * 6; // Weekly estimate
      const payload = {
        employer_id: "emp_lnt_01",
        employer_name: contractorCompany,
        payout_date: new Date().toISOString().split('T')[0],
        batch_title: payoutTitle,
        total_amount: totalAmt,
        worker_ids: ["worker_ramesh", "worker_sunita", "worker_rajesh"],
        payment_channel: "UPI / Direct Bank Transfer"
      };
      const res = await api.executePayoutBatch(payload);
      setPayoutResult(res);
    } catch (err) {
      alert('Payout batch execution failed: ' + err.message);
    } finally {
      setIsExecutingPayout(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvHeader = "Worker Name,Phone,Primary Trade,Hours Worked,Daily Wage,Payment Mode,Site Location,Work Date\n";
    const csvRows = [
      "Ramesh Kumar (राजमिस्त्री),+91 98765 43210,Mason / राजमिस्त्री,8.0,850.0,Cash,Noida Sector 62," + new Date().toISOString().split('T')[0],
      "Sunita Devi (सहायक),+91 98201 23456,Helper / सहायक,8.0,700.0,UPI,Noida Sector 62," + new Date().toISOString().split('T')[0],
      "Rajesh Yadav (बढ़ई),+91 98109 11223,Carpenter / बढ़ई,8.5,900.0,Cash,Noida Sector 62," + new Date().toISOString().split('T')[0],
      "Kailash Chand (इलेक्ट्रीशियन),+91 98765 43210,Electrician / इलेक्ट्रीशियन,8.0,800.0,UPI,Noida Sector 62," + new Date().toISOString().split('T')[0],
      "Amit Verma (प्लंबर),+91 98333 44556,Plumber / प्लंबर,8.0,850.0,UPI,Noida Sector 62," + new Date().toISOString().split('T')[0]
    ].join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ShramLedger_Muster_Roll_Template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCsvFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
      if (lines.length <= 1) return;
      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length >= 5) {
          parsed.push({
            worker_name: parts[0] || 'Worker ' + i,
            phone: parts[1] || '+91 98765 43210',
            primary_trade: parts[2] || 'Mason / राजमिस्त्री',
            hours_worked: parseFloat(parts[3]) || 8.0,
            daily_wage: parseFloat(parts[4]) || 750.0,
            payment_mode: parts[5] || 'UPI',
            site_location: parts[6] || 'Noida Sector 62',
            work_date: parts[7] || new Date().toISOString().split('T')[0]
          });
        }
      }
      if (parsed.length > 0) {
        setBulkRecords(parsed);
        setSuccessMessage(`Imported ${parsed.length} workers from CSV!`);
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    };
    reader.readAsText(file);
  };

  const downloadNachBatchFile = () => {
    if (!payoutResult) return;
    const header = `ACH-CR-NACH-BOCW-${new Date().toISOString().slice(0,10).replace(/-/g,'')}---L&T-INFRASTRUCTURE-SITE04\n`;
    const rows = bulkRecords.map((r, i) => {
      return `REC|${(i+1).toString().padStart(4, '0')}|${r.phone.replace(/[^0-9]/g, '').slice(-10)}@upi|INR|${(r.daily_wage * 6).toFixed(2)}|${payoutResult.transaction_reference}|CREDIT_WAGE_WEEK36\n`;
    }).join('');
    const footer = `TRL|COUNT:${bulkRecords.length}|TOTAL:${(totalMusterWages * 6).toFixed(2)}|HASH:${payoutResult.merkle_batch_hash.slice(0, 16)}\n`;
    const blob = new Blob([header + rows + footer], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NACH_BOCW_PAYOUT_BATCH_${payoutResult.payout_batch_id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadBocwPdf = async () => {
    if (!bocwRef.current) return;
    setIsExportingBocw(true);
    try {
      const canvas = await html2canvas(bocwRef.current, {
        scale: 2,
        backgroundColor: '#040810',
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`BOCW_Form_XXIX_Register_${bocwData.site_id}.pdf`);
    } catch (err) {
      console.error('BOCW PDF Export failed:', err);
    } finally {
      setIsExportingBocw(false);
    }
  };

  const totalMusterWages = bulkRecords.reduce((sum, r) => sum + r.daily_wage, 0);

  return (
    <div className="space-y-6 animate-slide-up">
      
      {/* ── Contractor Header Card ────────────────────────────────────── */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Building2 className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-100 font-['Outfit']">
                  Contractor & EPC Site Management Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Site Engineer Portal
                </span>
              </div>
              <p className="text-xs text-amber-300 font-medium mt-0.5">
                {contractorCompany} • {siteName}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Authorized Official: {contractorName} • Phone: {contractorPhone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Pending Claims</span>
              <span className="text-xl font-black text-amber-400 font-mono">{pendingList.length}</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">BOCW Cess Status</span>
              <span className="text-xs font-black text-emerald-400 font-mono">1% AUDIT READY</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800/80 overflow-x-auto hide-scrollbar">
          {[
            { id: 'pending', label: 'Pending Verifications', count: pendingList.length, icon: Clock },
            { id: 'bulk', label: 'Bulk Muster Roll Ingestion', count: bulkRecords.length, icon: FileSpreadsheet },
            { id: 'bocw', label: 'BOCW Statutory Form XXIX', count: '1996 Act', icon: FileCheck },
            { id: 'payouts', label: 'Wage Payout Batches', count: 'UPI/NACH', icon: Zap }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105' : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${isActive ? 'bg-black/20 text-slate-950' : 'bg-slate-950 text-slate-400'}`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ── TAB 1: PENDING VERIFICATIONS ────────────────────────────── */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Pending Worker Wage Declarations ({pendingList.length})
            </h2>
            <span className="text-xs text-slate-500">
              Endorsing adds a cryptographic verification seal and boosts worker ShramScore™
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-500 text-xs">Loading pending claims...</div>
          ) : pendingList.length === 0 ? (
            <div className="p-12 text-center glass-card rounded-3xl border border-slate-800 text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
              <p className="font-bold text-sm text-slate-200">All site records verified!</p>
              <p className="text-xs text-slate-500 mt-1">No pending wage claims requiring employer endorsement.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingList.map((item) => (
                <div key={item.entry_id} className="premium-card p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-100 font-['Outfit']">{item.worker_name}</h3>
                      <p className="text-xs text-amber-400 font-semibold">{item.skill_type}</p>
                      <p className="text-[11px] text-slate-500">{item.worker_phone} · {item.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-400 font-mono">₹{item.amount_paid}</span>
                      <span className="text-[10px] text-slate-500 block">{item.hours_worked} hrs · {item.payment_mode}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Date Claimed:</span>
                      <span className="text-slate-200 font-mono">{item.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Evidence Method:</span>
                      <span className="text-cyan-400 capitalize">{item.evidence_type.replace('_', ' ')}</span>
                    </div>
                    {item.evidence_text && (
                      <div className="pt-1 border-t border-slate-900 text-slate-400 italic">
                        "{item.evidence_text}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => openActionModal(item, 'confirm')}
                      className="flex-1 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Verify & Sign
                    </button>
                    <button
                      onClick={() => openActionModal(item, 'dispute')}
                      className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30"
                    >
                      Dispute
                    </button>
                    <button
                      onClick={() => openActionModal(item, 'reject')}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: BULK MUSTER ROLL INGESTION ───────────────────────── */}
      {activeTab === 'bulk' && (
        <div className="space-y-5">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-100 font-['Outfit'] flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                  Site Muster Roll Bulk Ingestion & Ledger Anchoring
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Import entire shift muster rolls. Automatically verifies worker identities, calculates daily totals, and anchors into SHA-256 Merkle blocks.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCsvFileUpload}
                  accept=".csv,text/csv"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                  Upload CSV Muster
                </button>
                <button
                  type="button"
                  onClick={downloadSampleCsv}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  Sample Template (.csv)
                </button>
                <button
                  type="button"
                  onClick={handleBulkSubmit}
                  disabled={isBulkSubmitting}
                  className="btn-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  {isBulkSubmitting ? <Sparkles className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Anchor Muster ({bulkRecords.length} Workers)
                </button>
              </div>
            </div>

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {successMessage}
              </div>
            )}

            {/* Muster Preview Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Worker Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Trade & Skill</th>
                    <th className="p-3">Hours</th>
                    <th className="p-3">Daily Wage</th>
                    <th className="p-3">Statutory Check</th>
                    <th className="p-3">Mode</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {bulkRecords.map((r, i) => {
                    const isMinWageCompliant = r.daily_wage >= 700;
                    return (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-slate-100">{r.worker_name}</td>
                        <td className="p-3 font-mono text-slate-400">{r.phone}</td>
                        <td className="p-3 text-amber-300">{r.primary_trade}</td>
                        <td className="p-3 font-mono">{r.hours_worked} hrs</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">₹{r.daily_wage}</td>
                        <td className="p-3">
                          {isMinWageCompliant ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              ✓ Compliant
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              ⚠️ Sub-Baseline
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                            {r.payment_mode}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-400">{r.work_date}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-950 text-xs font-bold border-t border-slate-800">
                  <tr>
                    <td colSpan="4" className="p-3 text-slate-400 uppercase">
                      Total Daily Shift Payroll ({bulkRecords.length} Workers)
                    </td>
                    <td colSpan="3" className="p-3 text-emerald-400 font-mono text-sm font-black">
                      ₹{totalMusterWages.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Bulk Result Banner */}
            {bulkResult && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-slate-900 to-amber-500/15 border border-emerald-500/40 space-y-3 animate-scale-up">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm text-slate-100">
                      Batch Ingestion Successful — {bulkResult.processed_count} Workers Anchored
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-amber-400">{bulkResult.batch_id}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[10px] text-slate-400 break-all space-y-1">
                  <div><span className="text-slate-500">Batch Merkle Root:</span> {bulkResult.batch_merkle_root}</div>
                  <div><span className="text-slate-500">Total Shift Wages:</span> ₹{bulkResult.total_wage_disbursed}</div>
                  <div><span className="text-slate-500">Status:</span> <span className="text-emerald-400 font-bold">{bulkResult.status}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: BOCW STATUTORY FORM XXIX COMPLIANCE ──────────────── */}
      {activeTab === 'bocw' && (
        <div className="space-y-5">
          {isLoadingBocw ? (
            <div className="p-12 text-center text-slate-500 text-xs">Generating BOCW Statutory Compliance Statement...</div>
          ) : bocwData && (
            <div ref={bocwRef} className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    FORM XXIX (Rule 241) · STATUTORY REGISTER OF WAGES
                  </span>
                  <h2 className="text-xl font-black text-slate-100 font-['Outfit'] mt-2">
                    Building & Other Construction Workers (BOCW) Act, 1996
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official Labour Inspectorate Audit Dossier · Site ID: {bocwData.site_id}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadBocwPdf}
                    disabled={isExportingBocw}
                    className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isExportingBocw ? 'Exporting...' : 'Download Form XXIX PDF'}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </button>
                </div>
              </div>

              {/* Compliance Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Active Construction Labor</span>
                  <span className="text-xl font-black text-slate-100 font-mono">{bocwData.total_active_workers} Masons/Helpers</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Mandays Recorded</span>
                  <span className="text-xl font-black text-amber-400 font-mono">{bocwData.mandays_worked} Days</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Wage Payout</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">₹{bocwData.total_wages_paid?.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">1% BOCW Cess Payable</span>
                  <span className="text-xl font-black text-cyan-400 font-mono">₹{bocwData.estimated_bocw_cess_payable?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Legal Seal Box */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="text-slate-300 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Statutory Compliance Status: <strong className="text-emerald-400">{bocwData.compliance_status}</strong></span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 mt-1">
                    Verification Seal: {bocwData.verification_seal_hash}
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-mono">
                  Report ID: {bocwData.report_id}<br />
                  Generated: {bocwData.generated_at}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: PAYOUT BATCHES ───────────────────────────────────── */}
      {activeTab === 'payouts' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-100 font-['Outfit'] flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Wage Disbursement Payout Execution
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate bank-ready NACH/UPI batch files with tamper-proof cryptographic audit trail.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Disbursement Batch Title:</label>
              <input
                type="text"
                value={payoutTitle}
                onChange={(e) => setPayoutTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">Target Workers: <strong>{bulkRecords.length} Site Workers</strong></span>
              <button
                type="button"
                onClick={handleExecutePayout}
                disabled={isExecutingPayout}
                className="btn-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                {isExecutingPayout ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                Execute & Sign Batch (₹{(totalMusterWages * 6).toLocaleString('en-IN')})
              </button>
            </div>
          </div>

          {payoutResult && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-scale-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-emerald-300 gap-2">
                <span>{payoutResult.title} — {payoutResult.payout_status}</span>
                <button
                  onClick={downloadNachBatchFile}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 w-fit"
                >
                  <Download className="w-3 h-3" />
                  Download Bank NACH Batch File (.txt)
                </button>
              </div>
              <div className="font-mono text-[10px] text-slate-400 break-all space-y-1">
                <div>Ref: {payoutResult.transaction_reference}</div>
                <div>Merkle Hash: {payoutResult.merkle_batch_hash}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Action Modal ────────────────────────────────────────────── */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full rounded-3xl border border-slate-700 p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-100 font-['Outfit']">
                {actionType === 'confirm' ? 'Verify Wage Entry' : actionType === 'reject' ? 'Reject Entry' : 'Dispute Record'}
              </h3>
              <button onClick={() => setSelectedEntry(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Worker:</span>
                <strong className="text-slate-200">{selectedEntry.worker_name}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount:</span>
                <strong className="text-emerald-400 font-mono">₹{selectedEntry.amount_paid}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Date & Hours:</span>
                <span className="text-slate-300 font-mono">{selectedEntry.date} ({selectedEntry.hours_worked} hrs)</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-1">Contractor Endorsement Note:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleActionSubmit}
                disabled={isProcessing}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 text-slate-950 ${
                  actionType === 'confirm' ? 'bg-emerald-400 hover:bg-emerald-300' : 'bg-rose-400 hover:bg-rose-300'
                }`}
              >
                {isProcessing ? <Sparkles className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
