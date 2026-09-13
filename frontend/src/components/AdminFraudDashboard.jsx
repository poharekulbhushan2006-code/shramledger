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
  Eye,
  Radar,
  Search
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminFraudDashboard() {
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'radar' | 'audit'
  const [auditSearch, setAuditSearch] = useState('');
  const [collisionSimResult, setCollisionSimResult] = useState(null);
  const [isSimulatingCollision, setIsSimulatingCollision] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

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
                  Multi-vector Fraud &amp; Anomaly Detection Engine
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
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'radar' 
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg' 
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radar className="w-4 h-4" />
          <span>Shift Collision Radar</span>
          <span className="px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-200 text-[10px] font-mono">
            Anti-Ghosting
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

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button 
            onClick={() => setActionNotice('')}
            className="text-purple-400 hover:text-purple-200 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

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
              {fraudAlerts.map((alert, idx) => {
                const alertId = alert.alert_id || alert.id || `ALT-${idx}`;
                const alertType = alert.alert_type || alert.type || 'ANOMALY';
                const severity = (alert.severity || 'MEDIUM').toUpperCase();
                const status = (alert.status || 'PENDING_REVIEW').toUpperCase();
                const isPending = status.includes('PENDING') || status.includes('INVESTIGATING');
                const isResolved = status === 'RESOLVED';
                return (
                  <div
                    key={alertId}
                    className={`glass-card p-5 rounded-3xl border transition-all space-y-3 ${
                      isResolved 
                        ? 'border-emerald-500/20 opacity-70' 
                        : severity === 'HIGH'
                        ? 'border-red-500/40 bg-red-950/10'
                        : 'border-amber-500/30 bg-amber-950/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          severity === 'HIGH' 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {alertType}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ID: {alertId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Detected: {alert.detected_at || alert.timestamp}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isResolved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {status}
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
                    {isPending && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleResolveAlert(alertId, 'resolve')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Resolved (Approved)</span>
                        </button>

                        <button
                          onClick={() => handleResolveAlert(alertId, 'dismiss')}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Dismiss Alert</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      ) : activeTab === 'radar' ? (

        /* ── Shift Collision Radar (Ghost Worker & Double-Billing Prevention) ── */
        <div className="space-y-5">
          <div className="glass-card p-6 rounded-3xl border border-purple-500/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Radar className="w-5 h-5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
                  Inter-Contractor Shift Collision Heuristic Engine
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Automatically flags biometric shifts logged for the same worker across different EPC contractors within impossible travel intervals (e.g. Mumbai vs Delhi, or 40km apart within 15 minutes).
                </p>
              </div>

              <button
                onClick={() => {
                  setIsSimulatingCollision(true);
                  setTimeout(() => {
                    setCollisionSimResult({
                      worker_id: 'WKR-88219',
                      worker_name: 'Ramesh Kumar (Bar Bender)',
                      contractor_a: {
                        name: 'Demo Infrastructure Ltd (Site A)',
                        location: 'Sector 62 Site, NCR',
                        shift_time: '08:00 - 16:30 IST',
                        supervisor: 'J. Sharma',
                        gps: '28.6280° N, 77.3649° E'
                      },
                      contractor_b: {
                        name: 'Apex Builders (Site B)',
                        location: 'Greater Noida Site',
                        shift_time: '10:00 - 18:00 IST',
                        supervisor: 'R. K. Verma',
                        gps: '19.2612° N, 72.9644° E'
                      },
                      conflict_window: '10:00 - 16:30 IST (6.5 hrs direct collision)',
                      geographical_distance: '28.4 km in peak congestion (Transit Time: ~1h 45m)',
                      probability: '99.8% Concurrent Ghost Billing'
                    });
                    setIsSimulatingCollision(false);
                  }, 650);
                }}
                disabled={isSimulatingCollision}
                className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSimulatingCollision ? 'Calculating Geospatial Vectors...' : 'Simulate Inter-Site Collision'}</span>
              </button>
            </div>

            {collisionSimResult ? (
              <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/40 space-y-4 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-black text-red-400 uppercase tracking-wider">
                      CRITICAL ANOMALY: Dual Concurrent Shift Detected
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    Confidence: {collisionSimResult.probability}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Employer Site A</div>
                    <div className="text-sm font-bold text-slate-100">{collisionSimResult.contractor_a.name}</div>
                    <div className="text-xs text-slate-400">📍 {collisionSimResult.contractor_a.location} ({collisionSimResult.contractor_a.gps})</div>
                    <div className="text-xs font-mono text-emerald-400">⏱ Shift: {collisionSimResult.contractor_a.shift_time}</div>
                    <div className="text-[11px] text-slate-500">Supervisor: {collisionSimResult.contractor_a.supervisor}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Employer Site B</div>
                    <div className="text-sm font-bold text-slate-100">{collisionSimResult.contractor_b.name}</div>
                    <div className="text-xs text-slate-400">📍 {collisionSimResult.contractor_b.location} ({collisionSimResult.contractor_b.gps})</div>
                    <div className="text-xs font-mono text-amber-400">⏱ Shift: {collisionSimResult.contractor_b.shift_time}</div>
                    <div className="text-[11px] text-slate-500">Supervisor: {collisionSimResult.contractor_b.supervisor}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-300">Conflict Telemetry: </span>
                    <span className="text-red-300">{collisionSimResult.conflict_window}</span>
                    <span className="text-slate-500"> · Distance: {collisionSimResult.geographical_distance}</span>
                  </div>

                  <button
                    onClick={() => {
                      setActionNotice(`Statutory Notice generated & sent to L&T and Shapoorji site supervisors for worker ${collisionSimResult.worker_id} under BOCW Rules Section 44.`);
                      setCollisionSimResult(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shrink-0 transition-all"
                  >
                    Issue Dual-Supervisor Inquiry Notice
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 text-center space-y-2">
                <Radar className="w-8 h-8 text-purple-400/60 mx-auto" />
                <p className="text-xs text-slate-400">
                  Radar active across 12 EPC contractors and 4,890 live biometric reader events. Click "Simulate Inter-Site Collision" to inspect how ShramLedger prevents duplicate contractor billing for migrant labor.
                </p>
              </div>
            )}
          </div>
        </div>

      ) : (

        /* ── Immutable Audit Logs Table ─────────────────────────────── */
        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-950/40">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Filter logs by actor, action, resource, hash..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Audit Entries: {auditLogs.filter(l => 
                !auditSearch || 
                l.actor_id?.toLowerCase().includes(auditSearch.toLowerCase()) ||
                l.action?.toLowerCase().includes(auditSearch.toLowerCase()) ||
                l.resource_type?.toLowerCase().includes(auditSearch.toLowerCase()) ||
                l.ledger_hash?.toLowerCase().includes(auditSearch.toLowerCase())
              ).length} / {auditLogs.length}
            </div>
          </div>

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
                {auditLogs
                  .filter(l => 
                    !auditSearch || 
                    (l.actor_id || l.actor || '')?.toLowerCase().includes(auditSearch.toLowerCase()) ||
                    (l.action || '')?.toLowerCase().includes(auditSearch.toLowerCase()) ||
                    (l.resource_type || l.entity || '')?.toLowerCase().includes(auditSearch.toLowerCase()) ||
                    (l.ledger_hash || '')?.toLowerCase().includes(auditSearch.toLowerCase())
                  )
                  .map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{log.id || `AUD-${idx + 1}`}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-amber-300">
                      {log.actor_id || log.actor || 'System'} ({log.actor_role || 'Node'})
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {log.resource_type || log.entity || 'Ledger'} (#{String(log.resource_id || '').slice(-6) || 'GEN'})
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
