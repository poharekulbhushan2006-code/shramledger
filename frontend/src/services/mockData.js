// ShramLedger Fallback Mock Data for High-Availability Static / Serverless Demonstrations

export const MOCK_WORKERS = [
  {
    id: "worker_ramesh",
    phone: "9876543210",
    name: "Ramesh Kumar (रमेश कुमार)",
    age: 38,
    gender: "Male",
    primary_trade: "Mason / राजमिस्त्री",
    skill_tier: "Highly Skilled",
    state: "Delhi NCR",
    city: "Noida / Greater Noida",
    aadhaar_masked: "XXXX-XXXX-4829",
    eshram_uan_masked: "UAN-9021-4820-1192",
    avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    joined_date: "2026-01-15",
    dpdp_consent_accepted: true,
    work_entries: [
      {
        id: "WRK-RAM-01",
        worker_id: "worker_ramesh",
        date: "2026-09-12",
        employer_name: "Shree Ram Construction / आर. के. शर्मा",
        employer_phone: "9876543210",
        skill_type: "Mason / राजमिस्त्री",
        skill_category: "Skilled",
        location: "Sector 62, Noida, NCR",
        hours_worked: 8.0,
        amount_paid: 850.0,
        payment_mode: "Cash",
        evidence_type: "Wage Slip",
        evidence_text: "श्री राम कंस्ट्रक्शन साइट - दैनिक मजदूरी ₹850/-, 8 घंटे, आर. के. शर्मा ठेकेदार",
        confidence_score: 94.0,
        endorsement_status: "Verified",
        endorsement_note: "Verified by Contractor R.K. Sharma via Phone OTP.",
        entry_hash: "a4f9c8e102938475bcdef890123456789abcdef0123456789abcdef012345678",
        is_anomaly_flagged: false
      },
      {
        id: "WRK-RAM-02",
        worker_id: "worker_ramesh",
        date: "2026-09-11",
        employer_name: "Gupta Builders & Interiors",
        employer_phone: "9811223344",
        skill_type: "Mason / राजमिस्त्री",
        skill_category: "Skilled",
        location: "South Delhi Residential Site",
        hours_worked: 8.5,
        amount_paid: 850.0,
        payment_mode: "UPI",
        evidence_type: "UPI Screenshot",
        evidence_text: "UPI Ref 423891029381: ₹850 paid by Gupta Builders (Tile fitting work Day 3)",
        confidence_score: 97.0,
        endorsement_status: "Verified",
        endorsement_note: "Digital UPI bank ledger match confirmed.",
        entry_hash: "b5e8d7c601928374abcdef90123456789abcdef0123456789abcdef012345679",
        is_anomaly_flagged: false
      },
      {
        id: "WRK-RAM-03",
        worker_id: "worker_ramesh",
        date: "2026-09-10",
        employer_name: "Gupta Builders & Interiors",
        employer_phone: "9811223344",
        skill_type: "Mason / राजमिस्त्री",
        skill_category: "Skilled",
        location: "South Delhi Residential Site",
        hours_worked: 8.0,
        amount_paid: 800.0,
        payment_mode: "UPI",
        evidence_type: "UPI Screenshot",
        evidence_text: "UPI Ref 423880192831: ₹800 paid for masonry & plastering work",
        confidence_score: 96.0,
        endorsement_status: "Verified",
        endorsement_note: "Digital UPI match verified.",
        entry_hash: "c6d7e8f901827364abcdef890123456789abcdef0123456789abcdef012345680",
        is_anomaly_flagged: false
      },
      {
        id: "WRK-RAM-04",
        worker_id: "worker_ramesh",
        date: "2026-09-08",
        employer_name: "Self-Reported Contractor Log",
        employer_phone: "9899001122",
        skill_type: "Mason / राजमिस्त्री",
        skill_category: "Skilled",
        location: "Indirapuram, Ghaziabad",
        hours_worked: 8.0,
        amount_paid: 800.0,
        payment_mode: "Cash",
        evidence_type: "Voice Note",
        evidence_text: "Voice note: आज इंदिरापुरम साइट पर 8 घंटे चिनाई का काम किया, 800 रुपए मिले",
        confidence_score: 88.0,
        endorsement_status: "Self-Attested",
        endorsement_note: "Speech NLP transcription verified with acoustic baseline.",
        entry_hash: "d7e8f9a012938475bcdef90123456789abcdef0123456789abcdef012345681",
        is_anomaly_flagged: false
      }
    ]
  },
  {
    id: "worker_sunita",
    phone: "9845012345",
    name: "Sunita Devi (सुनीता देवी)",
    age: 34,
    gender: "Female",
    primary_trade: "Domestic Cook & Housekeeping",
    skill_tier: "Skilled",
    state: "Karnataka",
    city: "Bengaluru (HSR Layout)",
    aadhaar_masked: "XXXX-XXXX-9182",
    eshram_uan_masked: "UAN-8172-3391-4401",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    joined_date: "2026-02-10",
    dpdp_consent_accepted: true,
    work_entries: [
      {
        id: "WRK-SUN-01",
        worker_id: "worker_sunita",
        date: "2026-09-12",
        employer_name: "Mehra Household (HSR Sector 2)",
        employer_phone: "9845112233",
        skill_type: "Cook / रसोइया",
        skill_category: "Skilled",
        location: "HSR Layout, Bengaluru",
        hours_worked: 4.0,
        amount_paid: 650.0,
        payment_mode: "UPI",
        evidence_type: "UPI Screenshot",
        evidence_text: "UPI txn to Sunita Devi ₹650 from Priyanshu Mehra for culinary catering",
        confidence_score: 99.0,
        endorsement_status: "Verified",
        endorsement_note: "Verified by Society Resident Association.",
        entry_hash: "e8f9a0b123456789abcdef0123456789abcdef0123456789abcdef012345682",
        is_anomaly_flagged: false
      },
      {
        id: "WRK-SUN-02",
        worker_id: "worker_sunita",
        date: "2026-09-11",
        employer_name: "Sharma Apartment (Koramangala 4th Block)",
        employer_phone: "9845223344",
        skill_type: "Housekeeping",
        skill_category: "Semi-Skilled",
        location: "Koramangala, Bengaluru",
        hours_worked: 3.5,
        amount_paid: 550.0,
        payment_mode: "UPI",
        evidence_type: "UPI Screenshot",
        evidence_text: "Monthly advance partial installment ₹550",
        confidence_score: 95.0,
        endorsement_status: "Verified",
        endorsement_note: "Employer verified on app.",
        entry_hash: "f9a0b1c234567890abcdef0123456789abcdef0123456789abcdef012345683",
        is_anomaly_flagged: false
      }
    ]
  },
  {
    id: "worker_vikram",
    phone: "9820098765",
    name: "Vikram Singh (विक्रम सिंह)",
    age: 29,
    gender: "Male",
    primary_trade: "Electrician / इलेक्ट्रीशियन",
    skill_tier: "Certified Technician",
    state: "Maharashtra",
    city: "Mumbai (Andheri West)",
    aadhaar_masked: "XXXX-XXXX-6351",
    eshram_uan_masked: "UAN-7261-0092-8812",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    joined_date: "2026-03-01",
    dpdp_consent_accepted: true,
    work_entries: [
      {
        id: "WRK-VIK-01",
        worker_id: "worker_vikram",
        date: "2026-09-12",
        employer_name: "Godrej Living Maintenance",
        employer_phone: "9820011223",
        skill_type: "Electrical Wiring",
        skill_category: "Highly Skilled",
        location: "Andheri West, Mumbai",
        hours_worked: 8.0,
        amount_paid: 1100.0,
        payment_mode: "Bank Transfer",
        evidence_type: "Wage Slip",
        evidence_text: "Job Card #EV-889: Commercial sub-meter installation and circuit inspection",
        confidence_score: 98.0,
        endorsement_status: "Verified",
        endorsement_note: "Certified by Site Electrical Engineer.",
        entry_hash: "0a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef012345684",
        is_anomaly_flagged: false
      }
    ]
  }
];

export const MOCK_SCORES = {
  worker_ramesh: {
    worker_id: "worker_ramesh",
    composite_score: 785,
    evidence_index: 88.5,
    repayment_readiness_score: 82.0,
    credit_tier: "Tier-1 Prime Informal",
    wage_consistency_score: 91.0,
    work_continuity_score: 84.0,
    employer_endorsement_score: 89.0,
    digital_trail_ratio: 78.0,
    avg_daily_wage: 835.0,
    projected_monthly_income: 24200.0,
    evidence_strength_band: "Gold (High Fidelity)",
    tamper_status: "Pristine",
    merkle_root: "9e8a7b6c5d4e3f2a109876543210fedcba9876543210abcdef0123456789abcd",
    confidence_interval: [765, 805]
  },
  worker_sunita: {
    worker_id: "worker_sunita",
    composite_score: 742,
    evidence_index: 85.0,
    repayment_readiness_score: 76.0,
    credit_tier: "Tier-1 Prime Informal",
    wage_consistency_score: 88.0,
    work_continuity_score: 80.0,
    employer_endorsement_score: 85.0,
    digital_trail_ratio: 92.0,
    avg_daily_wage: 600.0,
    projected_monthly_income: 18000.0,
    evidence_strength_band: "Gold (High Fidelity)",
    tamper_status: "Pristine",
    merkle_root: "8f7e6d5c4b3a201987654321fedcba9876543210abcdef0123456789abcde0",
    confidence_interval: [720, 764]
  },
  worker_vikram: {
    worker_id: "worker_vikram",
    composite_score: 820,
    evidence_index: 94.0,
    repayment_readiness_score: 89.0,
    credit_tier: "Tier-1 Prime Informal",
    wage_consistency_score: 95.0,
    work_continuity_score: 90.0,
    employer_endorsement_score: 92.0,
    digital_trail_ratio: 96.0,
    avg_daily_wage: 1100.0,
    projected_monthly_income: 33000.0,
    evidence_strength_band: "Platinum (Cryptographically Bound)",
    tamper_status: "Pristine",
    merkle_root: "7e6d5c4b3a201987654321fedcba9876543210abcdef0123456789abcde01f",
    confidence_interval: [800, 840]
  }
};

export const MOCK_SCHEMES = {
  worker_ramesh: [
    {
      scheme_id: "PMSYM",
      scheme_name: "Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)",
      category: "Social Security Pension",
      benefit_summary: "₹3,000/month guaranteed pension after age 60 with 50% central match",
      match_confidence: 96.0,
      eligibility_status: "Eligible (Auto-Verified)",
      required_documents: ["Aadhaar", "Savings Bank Account", "e-Shram UAN"]
    },
    {
      scheme_id: "PMSBY",
      scheme_name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
      category: "Accidental Life & Disability Cover",
      benefit_summary: "₹2,00,000 accidental death/disability insurance at ₹20/year premium",
      match_confidence: 99.0,
      eligibility_status: "Eligible (Active Linkage)",
      required_documents: ["Aadhaar Linked Bank Account"]
    },
    {
      scheme_id: "BOCW_WELFARE",
      scheme_name: "Building & Other Construction Workers (BOCW) Welfare Cess Board",
      category: "Construction State Welfare",
      benefit_summary: "Toolbox subsidy of ₹5,000, daughter marriage grant ₹51,000 & accident cover",
      match_confidence: 98.0,
      eligibility_status: "Eligible (>90 days continuous verified work on record)",
      required_documents: ["BOCW Card", "90-Day Employer Endorsements", "Bank Passbook"]
    }
  ]
};

export const MOCK_CERTIFICATES = {
  worker_ramesh: {
    certificate_id: "CERT-SL-2026-RAMESH-8921",
    worker_id: "worker_ramesh",
    worker_name: "Ramesh Kumar",
    trade: "Mason / राजमिस्त्री",
    issued_date: "2026-09-12",
    merkle_root: "9e8a7b6c5d4e3f2a109876543210fedcba9876543210abcdef0123456789abcd",
    total_entries_attested: 4,
    verified_entries_ratio: "100%",
    composite_shram_score: 785,
    qr_payload: "https://frontend-eureka-b5b5.vercel.app/verify/CERT-SL-2026-RAMESH-8921",
    issuer: "ShramLedger Autonomous Proof Authority (Bharat Decentralized Node 01)",
    is_valid: true
  }
};

export const MOCK_EMPLOYER_PENDING = [
  {
    entry_id: "WRK-RAM-04",
    worker_id: "worker_ramesh",
    worker_name: "Ramesh Kumar",
    trade: "Mason",
    date: "2026-09-08",
    hours_worked: 8.0,
    amount_paid: 800.0,
    location: "Indirapuram, Ghaziabad",
    claimed_evidence: "Voice Note: ₹800 चिनाई काम",
    confidence_score: 88.0,
    status: "Pending Endorsement"
  }
];

export const MOCK_FRAUD_ALERTS = [
  {
    id: "ALERT-9921",
    severity: "Medium",
    worker_name: "Ramesh Kumar",
    type: "Wage Dispersion Outlier",
    description: "Daily wage ₹1,800 claimed on 02 Sep exceeds NCR masonry P95 threshold (₹950).",
    timestamp: "2026-09-11 16:40 IST",
    status: "Investigating"
  }
];

export const MOCK_AUDIT_LOGS = [
  {
    timestamp: "2026-09-13 14:15:20 IST",
    action: "MERKLE_ROOT_ANCHORED",
    actor: "ShramLedger Consensus Node #1",
    entity: "Block #10482",
    details: "SHA-256 Merkle root anchored with 12 new worker micro-attestations."
  },
  {
    timestamp: "2026-09-13 13:45:00 IST",
    action: "DPDP_CONSENT_GRANTED",
    actor: "Worker: Ramesh Kumar",
    entity: "ConsentRecord #CR-8812",
    details: "Worker granted time-bound explicit consent for NBFC credit evaluation."
  }
];

export const MOCK_API_KEYS = [
  {
    key_id: "key_live_nbfc_01",
    name: "HDFC Rural Micro-Finance Production API",
    key_prefix: "shram_live_hdfc_8a92f4c1e0",
    environment: "production",
    created_at: "15 Aug 2026, 10:00 UTC",
    last_used_at: "13 Sep 2026, 14:20 UTC",
    is_active: true,
    rate_limit_rpm: 600
  },
  {
    key_id: "key_sandbox_01",
    name: "L&T Construction Site Integration Sandbox",
    key_prefix: "shram_sand_lnt_4f3b1900d8",
    environment: "sandbox",
    created_at: "20 Aug 2026, 11:30 UTC",
    last_used_at: "13 Sep 2026, 09:15 UTC",
    is_active: true,
    rate_limit_rpm: 120
  }
];

export const MOCK_WELFARE_ANALYTICS = {
  total_workers_indexed: "4,821,940",
  active_daily_attestations: "842,190",
  total_wages_verified: "₹184.2 Cr",
  avg_shram_score: 762,
  bank_credit_linked_rate: "34.8%",
  bocw_cess_compliance_pct: "91.4%",
  top_trades: [
    { trade: "Masonry & Civil Construction", count: "42%" },
    { trade: "Domestic Care & Cooking", count: "26%" },
    { trade: "Electrical & Plumbing", count: "18%" },
    { trade: "Transport & Logistics", count: "14%" }
  ]
};
