import {
  MOCK_WORKERS,
  MOCK_SCORES,
  MOCK_SCHEMES,
  MOCK_CERTIFICATES,
  MOCK_EMPLOYER_PENDING,
  MOCK_FRAUD_ALERTS,
  MOCK_AUDIT_LOGS,
  MOCK_API_KEYS,
  MOCK_WELFARE_ANALYTICS
} from './mockData';

// Dynamic API Base URL supporting external deployed backend (Render/Railway/Vercel)
const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const API_BASE = RAW_API_BASE.replace(/\/+$/, '');

// Helper for safe fetch with mock fallback
async function safeFetch(url, options = {}, fallbackValue = null) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Network failure, timeout, or backend not deployed
    console.debug(`[ShramLedger] Live API call to ${url} unreachable. Using demo dataset fallback.`);
  }

  if (fallbackValue !== null) {
    return typeof fallbackValue === 'function' ? fallbackValue() : fallbackValue;
  }
  throw new Error(`Endpoint ${url} unavailable and no fallback configured.`);
}

export const api = {
  // Worker Profile & Roster
  async getWorkers() {
    return safeFetch(`${API_BASE}/workers`, {}, MOCK_WORKERS);
  },

  async getWorker(id) {
    return safeFetch(
      `${API_BASE}/workers/${id}`,
      {},
      () => MOCK_WORKERS.find(w => w.id === id) || MOCK_WORKERS[0]
    );
  },

  // Auth & DPDP Onboarding
  async sendOtp(phone) {
    try {
      const res = await fetch(`${API_BASE}/auth/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return { success: true, message: `Demo OTP sent successfully to ${phone}`, debug_otp: "123456" };
  },

  async verifyOtp(phone, otp) {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return { success: true, token: "demo-jwt-token", worker_id: "worker_ramesh" };
  },

  async onboardWorker(profileData) {
    try {
      const res = await fetch(`${API_BASE}/onboard/worker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    const newWorker = {
      id: `worker_${Date.now()}`,
      phone: profileData.phone || "9876543210",
      name: profileData.name || "Newly Onboarded Worker",
      primary_trade: profileData.primary_trade || "General Labor",
      state: profileData.state || "Delhi NCR",
      work_entries: []
    };
    return { success: true, worker: newWorker };
  },

  async revokeConsent(workerId, consentId) {
    try {
      const res = await fetch(`${API_BASE}/consent/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worker_id: workerId, consent_id: consentId })
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return { success: true, message: "Consent revoked successfully in immutable audit log." };
  },

  // Work Entries & Multimodal Ingestion
  async addEntry(workerId, entry) {
    try {
      const res = await fetch(`${API_BASE}/entries/${workerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      success: true,
      entry: {
        ...entry,
        id: `WRK-DEMO-${Date.now()}`,
        worker_id: workerId,
        date: entry.date || new Date().toISOString().slice(0, 10),
        confidence_score: 95.0,
        endorsement_status: "Verified",
        entry_hash: "3a9c72e91b58091cf8e84a7e91240c1a93821098471239084129841209384120"
      }
    };
  },

  async deleteEntry(workerId, entryId) {
    try {
      const res = await fetch(`${API_BASE}/entries/${workerId}/${entryId}`, {
        method: 'DELETE'
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return { success: true, message: "Entry archived with tombstone hash in Merkle DAG." };
  },

  async ingestVoice(payload) {
    try {
      const res = await fetch(`${API_BASE}/ingest/voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      transcription: payload.sample_text || "आज साइट पर 8 घंटे चिनाई का काम किया, ₹850 नकद मिले",
      language: "hi-IN",
      extracted_fields: {
        date: new Date().toISOString().slice(0, 10),
        hours_worked: 8.0,
        amount_paid: 850.0,
        employer_name: "Shree Ram Construction",
        skill_type: "Mason / राजमिस्त्री"
      },
      confidence_score: 96.5
    };
  },

  async ingestOCR(payload) {
    try {
      const res = await fetch(`${API_BASE}/ingest/ocr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      raw_text: "श्री राम कंस्ट्रक्शन साइट - दैनिक मजदूरी ₹850/-, 8 घंटे, आर. के. शर्मा ठेकेदार",
      extracted_fields: {
        amount_paid: 850.0,
        hours_worked: 8.0,
        date: new Date().toISOString().slice(0, 10),
        employer_name: "Shree Ram Construction",
        skill_type: "Mason"
      },
      confidence_score: 97.2
    };
  },

  // ShramScore & Schemes
  async getShramScore(workerId) {
    return safeFetch(
      `${API_BASE}/score/${workerId}`,
      {},
      MOCK_SCORES[workerId] || MOCK_SCORES.worker_ramesh
    );
  },

  async getSchemes(workerId) {
    return safeFetch(
      `${API_BASE}/schemes/${workerId}`,
      {},
      MOCK_SCHEMES[workerId] || MOCK_SCHEMES.worker_ramesh
    );
  },

  // B2B Employer Portal
  async getEmployerPending() {
    return safeFetch(`${API_BASE}/employer/pending`, {}, MOCK_EMPLOYER_PENDING);
  },

  async submitEmployerAction(payload) {
    try {
      const res = await fetch(`${API_BASE}/employer/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return { success: true, message: "Employer verification attested with cryptographic signature." };
  },

  // B2B Lender / Underwriting Portal
  async getLenderIncomeSummary(workerId, consentId) {
    const url = consentId 
      ? `${API_BASE}/v1/workers/${workerId}/income-summary?consent_id=${encodeURIComponent(consentId)}`
      : `${API_BASE}/v1/workers/${workerId}/income-summary`;
    return safeFetch(url, {
      headers: { 'x-api-key': 'DEMO-LENDER-API-KEY' }
    }, {
      worker_id: workerId,
      full_name: "Ramesh Kumar",
      avg_monthly_income: 24200.0,
      annualized_income: 290400.0,
      stability_score: 88.0,
      primary_trade: "Mason / राजमिस्त्री",
      underwriting_grade: "Tier-1 Prime Informal",
      merkle_root: "9e8a7b6c5d4e3f2a109876543210fedcba9876543210abcdef0123456789abcd",
      tamper_check: "VALID_CONSISTENT"
    });
  },

  // B2B NGO & Welfare Analytics Portal
  async getWelfareAnalytics() {
    return safeFetch(`${API_BASE}/analytics/overview`, {}, MOCK_WELFARE_ANALYTICS);
  },

  // Admin Fraud & Audit Portal
  async getFraudAlerts() {
    return safeFetch(`${API_BASE}/admin/fraud-alerts`, {}, MOCK_FRAUD_ALERTS);
  },

  async resolveFraudAlert(alertId, action = 'resolve') {
    try {
      const res = await fetch(`${API_BASE}/admin/fraud-alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return { success: true, message: `Alert ${alertId} resolved.` };
  },

  async getAuditLogs() {
    return safeFetch(`${API_BASE}/admin/audit-logs`, {}, MOCK_AUDIT_LOGS);
  },

  // Certificates & Tamper-Evident Ledger
  async getCertificate(workerId) {
    return safeFetch(
      `${API_BASE}/certificate/${workerId}`,
      {},
      MOCK_CERTIFICATES[workerId] || MOCK_CERTIFICATES.worker_ramesh
    );
  },

  async verifyCertificate(certId) {
    return safeFetch(
      `${API_BASE}/verify/${certId}`,
      {},
      MOCK_CERTIFICATES.worker_ramesh
    );
  },

  async simulateTamper(payload) {
    try {
      const res = await fetch(`${API_BASE}/verify/tamper-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      tamper_detected: true,
      original_hash: "9e8a7b6c5d4e3f2a109876543210fedcba9876543210abcdef0123456789abcd",
      recalculated_hash: "0f1e2d3c4b5a69788796a5b4c3d2e1f0fedcba9876543210abcdef0123456789",
      status: "TAMPERED_HASH_MISMATCH",
      alert: "Cryptographic Merkle Root Mismatch! Claimed amount does not match immutable block tree."
    };
  },

  // Presets
  async getVoicePresets() {
    return safeFetch(`${API_BASE}/presets/voice`, {}, [
      { id: "p1", title: "Masonry Daily Wage (Hindi)", text: "आज 8 घंटे काम किया, ₹850 मिले" },
      { id: "p2", title: "Catering Work (Hinglish)", text: "HSR Layout mein catering kiya, 650 rupay UPI payment aaya" }
    ]);
  },

  async getOcrPresets() {
    return safeFetch(`${API_BASE}/presets/ocr`, {}, [
      { id: "o1", title: "Standard Site Slip", preview: "₹850 Mason Daily Wage Slip" }
    ]);
  },

  // Enterprise Commercial B2B & GovTech APIs
  async generateEnterpriseQuote(payload) {
    try {
      const res = await fetch(`${API_BASE}/enterprise/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    const tierConfig = {
      contractor_pro: {
        name: "Contractor & Site Pro Suite",
        base_monthly: 1999.0,
        per_worker_monthly: 4.0,
        features: [
          "Unlimited Multilingual Voice & OCR Ingestion",
          "Automated Bulk Muster Roll CSV/Excel Anchoring",
          "Cryptographic SHA-256 Merkle Ledger Immutability",
          "Statutory BOCW Act Form XXIX Compliance Certificate Export",
          "Contractor Digital Stamp & SMS Verification Seals",
          "Single-Site Worker Attendance & Wage Payout Batches"
        ],
        guarantee: "100% Protection against statutory BOCW audit penalties and duplicate muster claims."
      },
      fintech_api: {
        name: "FinTech & NBFC Underwriting API Suite",
        base_monthly: 4999.0,
        per_worker_monthly: 3.5,
        features: [
          "Real-Time REST Underwriting API (<150ms latency)",
          "DPDP Act 2023 Compliant Consent-Gated Query Access",
          "Granular 4-Pillar ShramScore™ Alternative Credit Dossier",
          "Automated Fraud & Shift Collision Detection Stream",
          "Dynamic Custom Risk Policy Engine & Loan Amortization Simulator",
          "Cryptographic Digital Work Passport Signature Verification"
        ],
        guarantee: "Zero unconsented data access. Meets RBI digital lending guidelines for informal borrowers."
      },
      enterprise_gov: {
        name: "State Labor Mission & Enterprise EPC Sovereign Suite",
        base_monthly: 24999.0,
        per_worker_monthly: 1.2,
        features: [
          "State-Wide Informal Workforce Census & Geo-Spatial Wage Heatmap",
          "Direct Automated Batch Dispatch to e-Shram & PM Vishwakarma Portals",
          "Real-Time Collusion & Ghost Labor Detection Radar",
          "Dedicated On-Premise / Sovereign Cloud Deployment Option",
          "Multi-Tier Role-Based Access Control (RBAC) & Custom Audit Vault",
          "99.95% Enterprise SLA with Dedicated Solutions Engineer"
        ],
        guarantee: "Sovereign data residency. Comprehensive Direct Benefit Transfer (DBT) verification."
      }
    };

    const tierKey = payload.plan_tier || 'contractor_pro';
    const selectedTier = tierConfig[tierKey] || tierConfig.contractor_pro;
    const workers = Number(payload.estimated_workers) || 600;
    const baseFee = selectedTier.base_monthly;
    const perWorker = selectedTier.per_worker_monthly;
    const totalMonthly = baseFee + (workers * perWorker);
    const annualRaw = totalMonthly * 12;
    const isAnnual = (payload.billing_cycle === 'annual');
    const annualDiscounted = isAnnual ? (annualRaw * 0.8) : totalMonthly;
    const annualSavings = workers * 22 * 750 * 12 * 0.085;
    const randHex = Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();

    return {
      quote_id: `QTE-2026-${randHex}`,
      generated_at: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', 14:30 UTC',
      company_name: payload.company_name || 'Larsen & Toubro Infra Site 04',
      contact_name: payload.contact_name || 'Anil Verma (Project Director)',
      plan_name: selectedTier.name,
      base_fee_monthly: baseFee,
      usage_fee_per_worker: perWorker,
      total_monthly_estimate: totalMonthly,
      annual_discounted_total: Math.round(annualDiscounted),
      savings_estimate_annual: Math.round(annualSavings),
      features_included: selectedTier.features,
      compliance_guarantee: selectedTier.guarantee,
      valid_until: "Valid for 30 Days"
    };
  },

  async ingestBulkMuster(payload) {
    try {
      const res = await fetch(`${API_BASE}/enterprise/bulk-muster`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      batch_id: `MUSTER-${Date.now()}`,
      status: "COMPLETED",
      records_processed: 120,
      merkle_root: "9e8a7b6c5d4e3f2a109876543210fedcba9876543210abcdef0123456789abcd"
    };
  },

  async listApiKeys() {
    return safeFetch(`${API_BASE}/enterprise/api-keys`, {}, MOCK_API_KEYS);
  },

  async createApiKey(payload) {
    try {
      const res = await fetch(`${API_BASE}/enterprise/api-keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      key_id: `key_${Date.now()}`,
      name: payload.name || "Custom Integration Key",
      key_prefix: `shram_${payload.environment || 'sandbox'}_${Math.random().toString(36).substring(2, 10)}`,
      environment: payload.environment || "sandbox",
      created_at: new Date().toLocaleDateString('en-GB'),
      is_active: true,
      rate_limit_rpm: 120
    };
  },

  async evaluateLenderPolicy(payload) {
    try {
      const res = await fetch(`${API_BASE}/enterprise/lender-policy/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      decision: "APPROVED_CONDITIONAL",
      recommended_credit_limit: 50000,
      interest_rate_discount_bps: 150,
      risk_tier: "LOW_MODERATE",
      justification: "Worker exhibits >88% digital wage trail and 100% verified employer attestations."
    };
  },

  async executePayoutBatch(payload) {
    try {
      const res = await fetch(`${API_BASE}/enterprise/payout-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      batch_id: `BATCH-${Date.now()}`,
      status: "EXECUTED",
      total_workers: 45,
      total_payout_inr: 38250.0,
      escrow_hold_id: "ESCROW-HDFC-99120",
      utr_ref: "AXISN0091823741"
    };
  },

  async getBOCWReport(siteId = 'site_delhi_metro_04') {
    return safeFetch(
      `${API_BASE}/enterprise/bocw-report?site_id=${encodeURIComponent(siteId)}`,
      {},
      {
        site_id: siteId,
        site_name: "Delhi Metro Phase IV Pier Construction",
        total_workers_on_site: 248,
        registered_bocw_workers: 236,
        cess_compliance_pct: 95.16,
        total_cess_payable: 148500.0,
        inspection_status: "COMPLIANT_CERTIFIED"
      }
    );
  },

  async submitContactSales(payload) {
    try {
      const res = await fetch(`${API_BASE}/contact-sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      success: true,
      ticket_id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      message: "Sales inquiry logged. Our institutional solutions team will contact you within 2 hours."
    };
  }
};
