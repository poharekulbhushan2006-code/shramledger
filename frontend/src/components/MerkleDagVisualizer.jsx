import React, { useState, useEffect, useMemo } from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Hash, 
  ArrowDown, 
  Zap, 
  Check, 
  X,
  Search,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

// Standard pure JS SHA-256 implementation (synchronous, FIPS 180-4 compliant)
function sha256Sync(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = [];
  const k = [];
  let primeCounter = 0;

  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = candidate * candidate; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const i2 = i + j;
      const w15 = w[i - 15],
        w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? w[i]
          : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const s1h = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (hash[7] + s1h + ch + k[i] + w[i]) | 0;
      const s0h = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0h + maj) | 0;

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (8 * j)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

export default function MerkleDagVisualizer({ entries = [], worker, onClose }) {
  // Baseline demo state: Record 1 (₹850), Record 2 (₹900)
  const [record1Wage, setRecord1Wage] = useState(850);
  const [record2Wage, setRecord2Wage] = useState(900);
  const [hasVerified, setHasVerified] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Canonical baseline values
  const GENUINE_RECORD_1_WAGE = 850;
  const GENUINE_RECORD_2_WAGE = 900;

  // Compute canonical SHA-256 hashes
  const genuineHash1 = useMemo(() => {
    const payload = `WRK-REC-01:${worker?.id || 'worker_ramesh'}:2026-09-11:Nirman Infrastructure:${GENUINE_RECORD_1_WAGE.toFixed(2)}`;
    return sha256Sync(payload);
  }, [worker]);

  const genuineHash2 = useMemo(() => {
    const payload = `WRK-REC-02:${worker?.id || 'worker_ramesh'}:2026-09-11:L&T Metro Infra:${GENUINE_RECORD_2_WAGE.toFixed(2)}`;
    return sha256Sync(payload);
  }, [worker]);

  const genuineMerkleRoot = useMemo(() => {
    return sha256Sync(genuineHash1 + genuineHash2);
  }, [genuineHash1, genuineHash2]);

  // Current active hashes based on user modifications
  const currentHash1 = useMemo(() => {
    const payload = `WRK-REC-01:${worker?.id || 'worker_ramesh'}:2026-09-11:Nirman Infrastructure:${Number(record1Wage).toFixed(2)}`;
    return sha256Sync(payload);
  }, [record1Wage, worker]);

  const currentHash2 = useMemo(() => {
    const payload = `WRK-REC-02:${worker?.id || 'worker_ramesh'}:2026-09-11:L&T Metro Infra:${Number(record2Wage).toFixed(2)}`;
    return sha256Sync(payload);
  }, [record2Wage, worker]);

  const currentMerkleRoot = useMemo(() => {
    return sha256Sync(currentHash1 + currentHash2);
  }, [currentHash1, currentHash2]);

  const isTampered = record1Wage !== GENUINE_RECORD_1_WAGE || record2Wage !== GENUINE_RECORD_2_WAGE;

  // Handle Verify Integrity Click
  const handleVerifyIntegrity = async () => {
    setIsVerifying(true);
    setHasVerified(true);

    try {
      // Call backend verification if accessible
      const res = await api.simulateTamper({
        worker_id: worker?.id || 'worker_ramesh',
        fake_amount: record1Wage
      });
      setVerificationResult(res);
    } catch (_) {
      // Local fallback
    } finally {
      setIsVerifying(false);
    }
  };

  const handleApplyTamperScenario = () => {
    setRecord1Wage(950); // Alter ₹850 -> ₹950
    setHasVerified(false);
  };

  const handleReset = () => {
    setRecord1Wage(GENUINE_RECORD_1_WAGE);
    setRecord2Wage(GENUINE_RECORD_2_WAGE);
    setHasVerified(false);
    setVerificationResult(null);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 space-y-6 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="orb orb-cyan w-96 h-96 -top-20 -right-20 opacity-20" />
      <div className="orb orb-amber w-80 h-80 -bottom-20 -left-20 opacity-15" />

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-100 font-['Outfit']">
                SHA-256 Merkle Ledger Tamper Demonstration
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Live Interactive Proof
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Watch how altering even ₹1 in worker records invalidates cryptographic leaf hashes and breaks the Merkle Root.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyTamperScenario}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              record1Wage === 950 
                ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                : 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:scale-105'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tamper: ₹850 → ₹950</span>
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Interactive Verification Bar ─────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Cryptographic Audit Status</div>
            <div className="text-sm font-bold text-slate-100">
              {isTampered ? (
                <span className="text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Modified State: ₹{record1Wage} (Pending Verification)
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Clean Ledger State: ₹850 (Intact)
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleVerifyIntegrity}
          disabled={isVerifying}
          id="btn-verify-merkle-integrity"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isVerifying ? (
            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
          ) : (
            <Search className="w-4 h-4 text-slate-950" />
          )}
          <span>Verify Integrity</span>
        </button>
      </div>

      {/* ── Killer Demo Verification Result ─────────────────────────── */}
      {hasVerified && (
        <div className={`p-5 rounded-2xl border animate-slide-up transition-all ${
          isTampered
            ? 'bg-red-950/40 border-red-500/50 text-red-200'
            : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl shrink-0 ${
              isTampered ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isTampered ? <ShieldAlert className="w-7 h-7 animate-bounce" /> : <ShieldCheck className="w-7 h-7" />}
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-black tracking-wide font-['Outfit']">
                  {isTampered ? '❌ TAMPER DETECTED' : '✅ 100% CRYPTOGRAPHICALLY VALID'}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase font-mono ${
                  isTampered ? 'bg-red-500/30 text-red-300 border border-red-500/40' : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {isTampered ? 'INTEGRITY VIOLATION' : 'AUTHENTIC ROOTS MATCH'}
                </span>
              </div>

              <p className="text-xs leading-relaxed text-slate-300">
                {isTampered 
                  ? `Mathematical inconsistency detected on Worker Record #1! Original wage: ₹850.00 was altered to ₹${record1Wage}.00. The recalculated SHA-256 leaf hash does not match the immutable register. Recomputed Merkle Root breaks the anchored signature.`
                  : `All individual worker records, cryptographic leaf digests, and the aggregate Merkle Root match mathematical proofs. Zero alteration detected across the dataset.`}
              </p>

              {isTampered && (
                <div className="mt-3 p-3 rounded-xl bg-black/40 border border-red-500/30 font-mono text-[11px] space-y-1.5 text-slate-300">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Original Leaf #1 (₹850):</span>
                    <span className="text-emerald-400 font-bold">{genuineHash1.slice(0, 16)}...</span>
                  </div>
                  <div className="flex items-center justify-between text-red-400 font-bold">
                    <span>Tampered Leaf #1 (₹{record1Wage}):</span>
                    <span>{currentHash1.slice(0, 16)}... (MISMATCH)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-red-500/20">
                    <span>Anchored Merkle Root:</span>
                    <span className="text-emerald-400">{genuineMerkleRoot.slice(0, 16)}...</span>
                  </div>
                  <div className="flex items-center justify-between text-red-400 font-bold">
                    <span>Recalculated Merkle Root:</span>
                    <span>{currentMerkleRoot.slice(0, 16)}... (INVALIDATED)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Undeniable Visual DAG Diagram ────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-6">
        <div className="text-center">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Cryptographic SHA-256 DAG Structure
          </span>
          <h4 className="text-sm font-bold text-slate-200 mt-0.5">
            Record Verification Chain
          </h4>
        </div>

        {/* Top: Merkle Root Node */}
        <div className="flex flex-col items-center">
          <div className={`p-4 rounded-2xl border text-center transition-all max-w-md w-full shadow-lg ${
            isTampered 
              ? 'bg-red-500/10 border-red-500/50 text-red-300 shadow-red-500/10' 
              : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-cyan-500/10'
          }`}>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1.5 mb-1">
              <Hash className="w-3 h-3 text-cyan-400" />
              <span>Merkle Root Digest</span>
            </div>
            <div className="font-mono text-xs sm:text-sm font-black break-all">
              {currentMerkleRoot}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {isTampered ? '❌ Mismatched Anchor' : '✅ Institutional Anchor Root'}
            </div>
          </div>

          <div className="w-0.5 h-6 bg-slate-700 my-1" />
          <div className="flex items-center gap-1 text-slate-500 text-[10px] font-mono">
            <span>sha256(Hash_1 + Hash_2)</span>
          </div>
          <div className="w-0.5 h-6 bg-slate-700 my-1" />
        </div>

        {/* Bottom Leaves: Record 1 & Record 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          
          {/* Record 1 Card */}
          <div className={`p-5 rounded-2xl border transition-all relative ${
            record1Wage !== GENUINE_RECORD_1_WAGE
              ? 'bg-red-950/30 border-red-500/60 shadow-lg shadow-red-500/10'
              : 'bg-slate-900/80 border-slate-800'
          }`}>
            {record1Wage !== GENUINE_RECORD_1_WAGE && (
              <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500 text-slate-950">
                Tampered
              </span>
            )}

            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-300">Worker Record #1</span>
              <span className="text-[10px] font-mono text-slate-400">Ramesh Kumar · Mason</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Recorded Wage:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={record1Wage}
                    onChange={(e) => {
                      setRecord1Wage(Number(e.target.value));
                      setHasVerified(false);
                    }}
                    className={`w-20 px-2 py-1 rounded text-right text-xs font-mono font-bold bg-slate-900 border ${
                      record1Wage !== GENUINE_RECORD_1_WAGE 
                        ? 'border-red-500 text-red-400' 
                        : 'border-slate-700 text-slate-100'
                    }`}
                  />
                  <span className="text-slate-400 text-xs">INR</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Employer:</span>
                <span className="text-slate-200">Nirman Infrastructure</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Date:</span>
                <span className="text-slate-200">2026-09-11 (8.0h)</span>
              </div>
            </div>

            <div className="mt-3 flex flex-col items-center">
              <ArrowDown className="w-4 h-4 text-slate-500 mb-1" />
              <div className="w-full p-2.5 rounded-xl bg-black/60 border border-slate-800 text-center font-mono text-[10px] break-all">
                <div className="text-slate-500 text-[9px] uppercase">SHA-256 Leaf Hash #1</div>
                <div className={`font-bold ${record1Wage !== GENUINE_RECORD_1_WAGE ? 'text-red-400' : 'text-emerald-400'}`}>
                  {currentHash1}
                </div>
              </div>
            </div>
          </div>

          {/* Record 2 Card */}
          <div className="p-5 rounded-2xl border bg-slate-900/80 border-slate-800 transition-all">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-300">Worker Record #2</span>
              <span className="text-[10px] font-mono text-slate-400">Sunita Devi · Helper</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Recorded Wage:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={record2Wage}
                    onChange={(e) => {
                      setRecord2Wage(Number(e.target.value));
                      setHasVerified(false);
                    }}
                    className="w-20 px-2 py-1 rounded text-right text-xs font-mono font-bold bg-slate-900 border border-slate-700 text-slate-100"
                  />
                  <span className="text-slate-400 text-xs">INR</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Employer:</span>
                <span className="text-slate-200">L&T Metro Infra</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Date:</span>
                <span className="text-slate-200">2026-09-11 (8.0h)</span>
              </div>
            </div>

            <div className="mt-3 flex flex-col items-center">
              <ArrowDown className="w-4 h-4 text-slate-500 mb-1" />
              <div className="w-full p-2.5 rounded-xl bg-black/60 border border-slate-800 text-center font-mono text-[10px] break-all">
                <div className="text-slate-500 text-[9px] uppercase">SHA-256 Leaf Hash #2</div>
                <div className="font-bold text-emerald-400">
                  {currentHash2}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
