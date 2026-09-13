from pydantic import BaseModel, Field, field_validator, model_validator
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from enum import Enum
import re

class EvidenceType(str, Enum):
    WAGE_SLIP = "wage_slip"
    CONTRACTOR_CHIT = "contractor_chit"
    HANDWRITTEN_REGISTER = "handwritten_register"
    UPI_SCREENSHOT = "upi_screenshot"
    BANK_STATEMENT = "bank_statement"
    SALARY_RECEIPT = "salary_receipt"
    WORK_ORDER = "work_order"
    ATTENDANCE_SHEET = "attendance_sheet"
    EMPLOYER_LETTER = "employer_letter"
    VOICE_NOTE = "voice_note"
    MANUAL_ENTRY = "manual_entry"

class EvidenceStrengthBand(str, Enum):
    VERY_HIGH = "Very High"   # Employer Verified (95-99%)
    HIGH = "High"             # Bank/UPI Statement or Signed Slip (88-94%)
    MEDIUM = "Medium"         # Contractor Chit / Register (75-85%)
    LOWER = "Lower"           # Worker Voice Declaration (60-75%)
    LOWEST = "Lowest"         # Unverified Manual Entry (40-59%)

class SkillCategory(str, Enum):
    UNSKILLED = "unskilled"         # Helper, loader, agricultural worker
    SEMI_SKILLED = "semi_skilled"   # Painter, security guard, delivery partner
    SKILLED = "skilled"             # Mason (राजमिस्त्री), carpenter (बढ़ई), electrician, plumber
    HIGHLY_SKILLED = "highly_skilled" # Master artisan, site supervisor, heavy machinery operator

class EndorsementStatus(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"
    DISPUTED = "disputed"
    SELF_ATTESTED = "self_attested"
    REVOKED = "revoked"  # Non-destructive soft-delete status

# ----------------- WORK ENTRY DTOs -----------------

class WorkEntry(BaseModel):
    id: str
    worker_id: str
    date: str
    employer_id: Optional[str] = None
    employer_name: str = Field(..., min_length=2, max_length=200)
    employer_phone: Optional[str] = None
    skill_type: str = Field(..., min_length=2, max_length=120)
    skill_category: SkillCategory = SkillCategory.SKILLED
    location: str = Field(..., min_length=2, max_length=200)
    hours_worked: float = Field(8.0, ge=0.5, le=24.0)  # Must be 0.5–24 hrs
    amount_paid: float = Field(..., ge=0.0, le=99999.0)  # Sanity cap: ₹99,999/day
    payment_mode: str = "Cash"  # Cash, UPI, Bank Transfer
    evidence_type: EvidenceType = EvidenceType.MANUAL_ENTRY
    evidence_url: Optional[str] = None
    evidence_text: Optional[str] = Field(None, max_length=2000)
    confidence_score: float = Field(85.0, ge=0.0, le=100.0)
    evidence_strength_band: EvidenceStrengthBand = EvidenceStrengthBand.MEDIUM
    endorsement_status: EndorsementStatus = EndorsementStatus.SELF_ATTESTED
    endorsement_note: Optional[str] = Field(None, max_length=500)
    entry_hash: Optional[str] = None
    is_anomaly_flagged: bool = False
    anomaly_reason: Optional[str] = None
    timestamp: Optional[str] = None

    @field_validator('date')
    @classmethod
    def validate_date(cls, v: str) -> str:
        """Enforce ISO 8601 date format YYYY-MM-DD."""
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("date must be in YYYY-MM-DD format")
        return v

class CreateWorkEntryRequest(BaseModel):
    date: str
    employer_name: str
    employer_phone: Optional[str] = None
    skill_type: str
    skill_category: SkillCategory = SkillCategory.SKILLED
    location: str
    hours_worked: float = 8.0
    amount_paid: float
    payment_mode: str = "Cash"
    evidence_type: EvidenceType = EvidenceType.MANUAL_ENTRY
    evidence_text: Optional[str] = None
    evidence_url: Optional[str] = None
    confidence_score: Optional[float] = 85.0

# ----------------- ONBOARDING & DPDP CONSENT -----------------

class OTPRequest(BaseModel):
    phone: str = Field(..., min_length=10, max_length=15)

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        """Reject non-numeric phone numbers (allow spaces, dashes, + prefix)."""
        clean = re.sub(r'[\s\-\+]', '', v)
        if not re.match(r'^\d{10,12}$', clean):
            raise ValueError("Phone number must be 10-12 digits")
        return v

class OTPVerifyRequest(BaseModel):
    phone: str = Field(..., min_length=10, max_length=15)
    otp: str = Field(..., min_length=6, max_length=6, pattern=r'^\d{6}$')

class WorkerOnboardingRequest(BaseModel):
    phone: str = Field(..., min_length=10, max_length=15)
    name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(18, ge=14, le=80)
    gender: str = Field("Male", pattern=r'^(Male|Female|Other)$')
    primary_trade: str = Field(..., min_length=2, max_length=100)
    skill_tier: SkillCategory = SkillCategory.SKILLED
    state: str = Field(..., min_length=2, max_length=60)
    city: str = Field(..., min_length=2, max_length=60)
    language_preference: str = "hi"
    dpdp_consent_accepted: bool = True

    @field_validator('dpdp_consent_accepted')
    @classmethod
    def consent_must_be_given(cls, v: bool) -> bool:
        if not v:
            raise ValueError("DPDP consent must be accepted to register")
        return v

class DPDPConsentRecordDTO(BaseModel):
    consent_id: str
    worker_id: str
    purpose: str
    requester_name: str
    requester_type: str
    dpdp_notice_version: str
    is_active: bool
    granted_at: str
    consent_proof_hash: str

class ConsentRevokeRequest(BaseModel):
    worker_id: str
    consent_id: str

# ----------------- WORKER PROFILE DTO -----------------

class WorkerProfile(BaseModel):
    id: str
    phone: str
    name: str
    age: int
    gender: str
    primary_trade: str
    skill_tier: str
    state: str
    city: str
    aadhaar_masked: str
    eshram_uan_masked: Optional[str] = None
    avatar_url: Optional[str] = None
    joined_date: str
    dpdp_consent_accepted: bool = True
    work_entries: List[WorkEntry] = []

# ----------------- EVIDENCE ENGINE & OCR DTOs -----------------

class EvidenceBreakdown(BaseModel):
    upi_bank_evidence_pct: float # e.g. 35%
    employer_verified_pct: float # e.g. 40%
    wage_slips_receipts_pct: float # e.g. 15%
    voice_declarations_pct: float # e.g. 10%
    overall_evidence_confidence: float # e.g. 91.0%
    strength_band: str # "Very High", "High", "Medium", "Lower"

class IngestionVoiceRequest(BaseModel):
    worker_id: str
    audio_transcript: Optional[str] = None
    audio_base64: Optional[str] = None
    language: str = "hi" # hi, en, mr, ta, bn

class IngestionOCRRequest(BaseModel):
    worker_id: str
    image_base64: Optional[str] = None
    slip_type: Optional[str] = "handwritten_voucher" # upi, wage_slip, chit, register, statement, etc.

# ----------------- SHRAMSCORE BREAKDOWN -----------------

class ShramScoreBreakdown(BaseModel):
    overall_score: int # 300 - 900
    grade: str # A+, A, B, C
    score_label: str = "Employment & Income Reliability Score"
    
    # 6 Transparent Dimensions
    income_stability_score: int       # 25% weight
    work_continuity_score: int        # 20% weight
    verified_earnings_score: int      # 20% weight
    employer_endorsement_score: int   # 15% weight
    evidence_quality_score: int       # 10% weight
    skill_demand_score: int           # 10% weight
    
    avg_daily_wage: float
    estimated_monthly_income: float
    overall_evidence_confidence: float
    evidence_breakdown: Optional[EvidenceBreakdown] = None
    
    stability_band: str # "High Stability", "Moderate", "Emerging"
    loan_readiness: str # "Eligible for up to ₹50,000 Micro-Credit"
    factors_positive: List[str]
    factors_improvement: List[str]

# ----------------- LENDER UNDERWRITING API DTOs -----------------

class LenderIncomeSummaryResponse(BaseModel):
    worker_id: str
    verified_monthly_income: float
    income_stability: float # 0.0 - 1.0 (e.g. 0.81)
    verified_work_months: int # e.g. 17
    evidence_strength: float # 0.0 - 1.0 (e.g. 0.92)
    employment_continuity: float # 0.0 - 1.0 (e.g. 0.76)
    employer_endorsement_rate: float
    shram_score: int
    reliability_grade: str
    loan_eligibility_tier: str
    active_dpdp_consent: bool
    consent_id: str
    tamper_audit_status: str # "MERKLE_VERIFIED_GENUINE"
    merkle_root: str
    last_verified_timestamp: str

# ----------------- EMPLOYER / CONTRACTOR PORTAL DTOs -----------------

class EmployerActionRequest(BaseModel):
    entry_id: str
    employer_id: Optional[str] = None
    employer_name: str
    employer_phone: str
    action: str # "confirm", "reject", "dispute"
    note: Optional[str] = "Payment and hours verified."

class EmployerProfileDTO(BaseModel):
    id: str
    name: str
    business_name: Optional[str]
    phone: str
    industry_type: str
    city: str
    verified_workers_count: int
    reputation_score: float

# ----------------- FRAUD DETECTION & AUDIT LOG DTOs -----------------

class FraudAlert(BaseModel):
    alert_id: str
    worker_id: str
    worker_name: str
    alert_type: str # "SHIFT_COLLISION", "WAGE_SPIKE_OUTLIER", "DUPLICATE_DOC_HASH", "RAPID_ENDORSEMENT"
    severity: str # "HIGH", "MEDIUM", "LOW"
    description: str
    detected_at: str
    status: str = "PENDING_REVIEW" # PENDING_REVIEW, RESOLVED, DISMISSED
    evidence_snapshot: Optional[Dict[str, Any]] = None

class AuditLogEntryDTO(BaseModel):
    id: str
    timestamp: str
    actor_id: str
    actor_role: str
    action: str
    resource_type: str
    resource_id: str
    details: Optional[Dict[str, Any]] = None
    ledger_hash: Optional[str] = None

# ----------------- CERTIFICATE & SCHEME DTOs -----------------

class CertificateVerification(BaseModel):
    certificate_id: str
    worker_id: str
    worker_name: str
    issue_date: str
    primary_trade: str
    location: str
    verified_period: str
    total_work_days: int
    total_earnings: float
    average_monthly_wage: float
    shram_score: int
    evidence_strength: float = 91.0
    merkle_root: str
    digital_signature: str
    is_valid: bool = True
    tamper_detected: bool = False
    verification_url: str
    entries_count: int

class SchemeRecommendation(BaseModel):
    id: str
    name: str
    name_hi: str
    ministry: str
    category: str # "Credit", "Social Security", "Pension", "Health", "Housing"
    benefit_amount: str
    description: str
    description_hi: str
    eligibility_status: str = "Potentially eligible — verify these conditions"
    conditions_met: List[str]
    pending_conditions: List[str]
    eligibility_match: bool
    match_score: int # 0-100%
    action_url: str
    required_documents: List[str]
    differentiation_note: str = "ShramLedger serves as an independent verifiable employment evidence layer complementing e-Shram."

# ----------------- ENTERPRISE & COMMERCIAL B2B DTOs -----------------

class EnterpriseQuoteRequest(BaseModel):
    company_name: str
    contact_name: str
    email: str
    phone: str
    organization_type: str = "Construction EPC" # "Construction EPC", "NBFC / FinTech", "State Labor Board", "Staffing Agency"
    active_sites_count: int = 3
    estimated_workers: int = 500
    plan_tier: str = "contractor_pro" # "contractor_pro", "fintech_api", "enterprise_gov"
    billing_cycle: str = "annual" # "annual", "monthly"

class EnterpriseQuoteResponse(BaseModel):
    quote_id: str
    generated_at: str
    company_name: str
    contact_name: str
    plan_name: str
    base_fee_monthly: float
    usage_fee_per_worker: float
    total_monthly_estimate: float
    annual_discounted_total: float
    savings_estimate_annual: float
    features_included: List[str]
    compliance_guarantee: str
    valid_until: str

class BulkMusterRow(BaseModel):
    worker_name: str
    phone: str
    primary_trade: str
    hours_worked: float = 8.0
    daily_wage: float
    payment_mode: str = "Cash"
    site_location: str
    work_date: str
    worker_id: Optional[str] = None

class BulkMusterRequest(BaseModel):
    employer_id: str = "emp_demo_01"
    employer_name: str = "Demo Infrastructure Pvt Ltd"
    site_name: str = "Demo Infrastructure Site 01"
    records: List[BulkMusterRow]
    auto_anchor_ledger: bool = True

class BulkMusterResponse(BaseModel):
    batch_id: str
    site_name: str
    processed_count: int
    total_wage_disbursed: float
    batch_merkle_root: str
    created_entries: List[Dict[str, Any]]
    flagged_anomalies: List[str]
    status: str = "LEDGER_ANCHORED_SUCCESS"
    timestamp: str

class ApiKeyDTO(BaseModel):
    key_id: str
    name: str
    key_prefix: str
    environment: str = "production"
    created_at: str
    last_used_at: Optional[str] = None
    is_active: bool = True
    rate_limit_rpm: int = 300

class ApiKeyCreateRequest(BaseModel):
    name: str
    environment: str = "production"

class LenderPolicyConfig(BaseModel):
    min_shram_score: int = 650
    max_income_volatility_pct: float = 40.0
    min_work_days_logged: int = 30
    min_verified_ratio_pct: float = 60.0
    max_loan_limit: float = 100000.0

class LenderPolicyEvaluationRequest(BaseModel):
    worker_id: str
    requested_loan_amount: float
    loan_tenure_months: int = 12
    policy: Optional[LenderPolicyConfig] = None

class LenderPolicyEvaluationResponse(BaseModel):
    decision: str # "APPROVED", "CONDITIONAL_APPROVAL", "REJECTED"
    worker_id: str
    worker_name: str
    overall_score: int
    score_grade: str
    approved_amount: float
    monthly_emi_estimate: float
    recommended_interest_rate_pct: float
    risk_tier: str # "PRIME_LOW_RISK", "NEAR_PRIME", "ELEVATED_RISK"
    rule_evaluations: List[Dict[str, Any]]
    cryptographic_audit_hash: str
    timestamp: str

class PayoutBatchRequest(BaseModel):
    employer_id: str
    employer_name: str
    payout_date: str
    batch_title: str
    total_amount: float
    worker_ids: List[str]
    payment_channel: str = "UPI / Direct Wage Transfer"

class PayoutBatchResponse(BaseModel):
    payout_batch_id: str
    title: str
    disbursed_total: float
    worker_count: int
    transaction_reference: str
    payout_status: str = "EXECUTED_AND_ANCHORED"
    merkle_batch_hash: str
    timestamp: str

class BOCWReportResponse(BaseModel):
    report_id: str
    site_id: str
    site_name: str
    contractor_name: str
    reporting_period: str
    total_active_workers: int
    mandays_worked: int
    total_wages_paid: float
    cess_applicable_pct: float = 1.0
    estimated_bocw_cess_payable: float
    compliance_status: str = "FULLY_COMPLIANT_WITH_BOCW_1996"
    verification_seal_hash: str
    generated_at: str

class ContactSalesRequest(BaseModel):
    name: str
    email: str
    phone: str
    company: str
    message: Optional[str] = None
    plan_interest: str = "Contractor Pro"

class ContactSalesResponse(BaseModel):
    success: bool = True
    inquiry_id: str
    message: str

