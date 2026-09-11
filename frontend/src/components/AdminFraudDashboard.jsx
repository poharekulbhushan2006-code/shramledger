import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  History, 
  FileText, 
  User, 
  Lock, 
  RefreshCw, 
  Check, 
  X,
  Layers,
  Sparkles,
  Eye
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminFraudDashboard() {
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' or 'audit'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [alerts, logs] = await Promise.all([
        api.getFraudAlerts(),
        api.getAuditLogs()
      ]);
      setFraudAlerts(alerts);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load admin fraud & audit data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveAlert = async (alertId, action) => {
    try {
      await api.resolveFraudAlert(alertId, action);
      await loadData();
    } catch (err) {
      alert('Failed to update alert: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">

      {/* ── Admin Risk & Audit Header ───────────────────────────────── */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-red-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-600 p-0.5 shadow-xl shadow-red-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-100 font-['Outfit']">
                  Enterprise Fraud & Audit Control
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                  Risk Flag → Human Review
                </span>
              </div>
              <p className="text-xs text-red-300 font-medium mt-0.5">
                Heuristic Anomaly Detection · SHA-256 Document Deduplication · Immutable Audit Log
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Zero arbitrary AI blocking — all flagged anomalies routed for human investigator review
              </p>
            </div>
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Logs</span>
          </button>
        </div>
      </div>

      {/* ── Tab Switcher ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'alerts' 
              ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-lg' 
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Active Risk Alerts</span>
          <span className="px-1.5 py-0.5 rounded-md bg-black/40 text-[10px] font-mono">
            {fraudAlerts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'audit' 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg' 
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Immutable Audit Trail</span>
          <span className="px-1.5 py-0.5 rounded-md bg-black/40 text-[10px] font-mono">
            {auditLogs.length}
          </span>
        </button>
      </div>

      {isLoading ? (
        <div className="glass-card p-12 text-center rounded-3xl text-slate-400 text-sm">
          Loading fraud alerts and audit trails...
        </div>
      ) : activeTab === 'alerts' ? (
        
        /* ── Risk Flags Queue ───────────────────────────────────────── */
        <div className="space-y-4">
          {fraudAlerts.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-3xl border border-slate-800 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No Anomalies Detected</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                All logged records, document hashes, and daily shift entries comply with regional heuristics.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {fraudAlerts.map((alert) => (
                <div
                  key={alert.alert_id}
                  className={`glass-card p-5 rounded-3xl border transition-all space-y-3 ${
                    alert.status === 'RESOLVED' 
                      ? 'border-emerald-500/20 opacity-70' 
                      : alert.severity === 'HIGH'
                      ? 'border-red-500/40 bg-red-950/10'
                      : 'border-amber-500/30 bg-amber-950/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        alert.severity === 'HIGH' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {alert.alert_type}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ID: {alert.alert_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Detected: {alert.detected_at}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        alert.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-200">
                    {alert.description}
                  </p>

                  {/* Evidence Snapshot */}
                  {alert.evidence_snapshot && (
                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                      {Object.entries(alert.evidence_snapshot).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-slate-500">{k}:</span>
                          <span className="text-slate-200">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Investigator Actions */}
                  {alert.status === 'PENDING_REVIEW' && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleResolveAlert(alert.alert_id, 'resolve')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Resolved (Approved)</span>
                      </button>

                      <button
                        onClick={() => handleResolveAlert(alert.alert_id, 'dismiss')}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Dismiss Alert</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      ) : (

        /* ── Immutable Audit Logs Table ─────────────────────────────── */
        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Cryptographic Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{log.id}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-amber-300">
                      {log.actor_id} ({log.actor_role})
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {log.resource_type} (#{log.resource_id.slice(-6)})
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-emerald-400">
                      {log.ledger_hash ? `${log.ledger_hash.slice(0, 12)}...` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}

    </div>
  );
}
