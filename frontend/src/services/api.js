const API_BASE = '/api';

export const api = {
  // Worker Profile & Roster
  async getWorkers() {
    const res = await fetch(`${API_BASE}/workers`);
    if (!res.ok) throw new Error('Failed to fetch workers');
    return res.json();
  },

  async getWorker(id) {
    const res = await fetch(`${API_BASE}/workers/${id}`);
    if (!res.ok) throw new Error('Failed to fetch worker profile');
    return res.json();
  },

  // Auth & DPDP Onboarding
  async sendOtp(phone) {
    const res = await fetch(`${API_BASE}/auth/otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    if (!res.ok) throw new Error('Failed to send OTP');
    return res.json();
  },

  async verifyOtp(phone, otp) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Invalid OTP' }));
      throw new Error(err.detail || 'Invalid OTP');
    }
    return res.json();
  },

  async onboardWorker(profileData) {
    const res = await fetch(`${API_BASE}/onboard/worker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Onboarding failed' }));
      throw new Error(err.detail || 'Onboarding failed');
    }
    return res.json();
  },

  async revokeConsent(workerId, consentId) {
    const res = await fetch(`${API_BASE}/consent/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ worker_id: workerId, consent_id: consentId })
    });
    if (!res.ok) throw new Error('Failed to revoke consent');
    return res.json();
  },

  // Work Entries & Multimodal Ingestion
  async addEntry(workerId, entry) {
    const res = await fetch(`${API_BASE}/entries/${workerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!res.ok) throw new Error('Failed to add work entry');
    return res.json();
  },

  async deleteEntry(workerId, entryId) {
    const res = await fetch(`${API_BASE}/entries/${workerId}/${entryId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete entry');
    return res.json();
  },

  async ingestVoice(payload) {
    const res = await fetch(`${API_BASE}/ingest/voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to ingest voice note');
    return res.json();
  },

  async ingestOCR(payload) {
    const res = await fetch(`${API_BASE}/ingest/ocr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to parse wage document');
    return res.json();
  },

  // ShramScore & Schemes
  async getShramScore(workerId) {
    const res = await fetch(`${API_BASE}/score/${workerId}`);
    if (!res.ok) throw new Error('Failed to fetch ShramScore');
    return res.json();
  },

  async getSchemes(workerId) {
    const res = await fetch(`${API_BASE}/schemes/${workerId}`);
    if (!res.ok) throw new Error('Failed to fetch schemes');
    return res.json();
  },

  // B2B Employer Portal
  async getEmployerPending() {
    const res = await fetch(`${API_BASE}/employer/pending`);
    if (!res.ok) throw new Error('Failed to fetch pending verifications');
    return res.json();
  },

  async submitEmployerAction(payload) {
    const res = await fetch(`${API_BASE}/employer/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to submit employer verification');
    return res.json();
  },

  // B2B Lender / Underwriting Portal
  async getLenderIncomeSummary(workerId, consentId) {
    const url = consentId 
      ? `${API_BASE}/v1/workers/${workerId}/income-summary?consent_id=${encodeURIComponent(consentId)}`
      : `${API_BASE}/v1/workers/${workerId}/income-summary`;
    const res = await fetch(url, {
      headers: { 'x-api-key': 'DEMO-LENDER-API-KEY' }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Worker underwriting lookup failed' }));
      throw new Error(err.detail || 'Worker underwriting lookup failed');
    }
    return res.json();
  },

  // B2B NGO & Welfare Analytics Portal
  async getWelfareAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/overview`);
    if (!res.ok) throw new Error('Failed to fetch welfare analytics');
    return res.json();
  },

  // Admin Fraud & Audit Portal
  async getFraudAlerts() {
    const res = await fetch(`${API_BASE}/admin/fraud-alerts`);
    if (!res.ok) throw new Error('Failed to fetch fraud alerts');
    return res.json();
  },

  async resolveFraudAlert(alertId, action = 'resolve') {
    const res = await fetch(`${API_BASE}/admin/fraud-alerts/${alertId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    if (!res.ok) throw new Error('Failed to update fraud alert');
    return res.json();
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/admin/audit-logs`);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  // Certificates & Tamper-Evident Ledger
  async getCertificate(workerId) {
    const res = await fetch(`${API_BASE}/certificate/${workerId}`);
    if (!res.ok) throw new Error('Failed to fetch certificate');
    return res.json();
  },

  async verifyCertificate(certId) {
    const res = await fetch(`${API_BASE}/verify/${certId}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Verification failed' }));
      throw new Error(err.detail || 'Certificate not found');
    }
    return res.json();
  },

  async simulateTamper(payload) {
    const res = await fetch(`${API_BASE}/verify/tamper-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Tamper simulation failed');
    return res.json();
  },

  // Presets
  async getVoicePresets() {
    const res = await fetch(`${API_BASE}/presets/voice`);
    if (!res.ok) throw new Error('Failed to fetch voice presets');
    return res.json();
  },

  async getOcrPresets() {
    const res = await fetch(`${API_BASE}/presets/ocr`);
    if (!res.ok) throw new Error('Failed to fetch OCR presets');
    return res.json();
  },

  // Enterprise Commercial B2B & GovTech APIs
  async generateEnterpriseQuote(payload) {
    const res = await fetch(`${API_BASE}/enterprise/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to generate enterprise quote');
    return res.json();
  },

  async ingestBulkMuster(payload) {
    const res = await fetch(`${API_BASE}/enterprise/bulk-muster`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to ingest bulk muster roll');
    return res.json();
  },

  async listApiKeys() {
    const res = await fetch(`${API_BASE}/enterprise/api-keys`);
    if (!res.ok) throw new Error('Failed to fetch API keys');
    return res.json();
  },

  async createApiKey(payload) {
    const res = await fetch(`${API_BASE}/enterprise/api-keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create API key');
    return res.json();
  },

  async evaluateLenderPolicy(payload) {
    const res = await fetch(`${API_BASE}/enterprise/lender-policy/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to evaluate underwriting policy');
    return res.json();
  },

  async executePayoutBatch(payload) {
    const res = await fetch(`${API_BASE}/enterprise/payout-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to execute wage payout batch');
    return res.json();
  },

  async getBOCWReport(siteId = 'site_delhi_metro_04') {
    const res = await fetch(`${API_BASE}/enterprise/bocw-report?site_id=${encodeURIComponent(siteId)}`);
    if (!res.ok) throw new Error('Failed to fetch BOCW compliance report');
    return res.json();
  },

  async submitContactSales(payload) {
    const res = await fetch(`${API_BASE}/contact-sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to submit sales inquiry');
    return res.json();
  }
};

