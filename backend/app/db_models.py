import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, 
    Text, Enum as SQLEnum, Index, JSON
)
from sqlalchemy.orm import relationship
from .database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Worker(Base):
    __tablename__ = "workers"

    id = Column(String(64), primary_key=True, default=lambda: f"WRK-{uuid.uuid4().hex[:8].upper()}")
    phone = Column(String(20), unique=True, nullable=False, index=True)
    is_active = Column(Boolean, default=True)
    is_phone_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    profile = relationship("WorkerProfile", back_populates="worker", uselist=False, cascade="all, delete-orphan")
    employment_history = relationship("EmploymentHistory", back_populates="worker", uselist=False, cascade="all, delete-orphan")
    work_entries = relationship("WorkEntry", back_populates="worker", cascade="all, delete-orphan", order_by="desc(WorkEntry.date)")
    shram_score = relationship("ShramScore", back_populates="worker", uselist=False, cascade="all, delete-orphan")
    consents = relationship("ConsentRecord", back_populates="worker", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="worker", cascade="all, delete-orphan")
    scheme_eligibilities = relationship("SchemeEligibility", back_populates="worker", cascade="all, delete-orphan")

class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id = Column(String(64), ForeignKey("workers.id", ondelete="CASCADE"), nullable=False, unique=True)
    name = Column(String(128), nullable=False)
    age = Column(Integer, default=32)
    gender = Column(String(20), default="Male")
    primary_trade = Column(String(100), nullable=False) # e.g., "Mason / राजमिस्त्री"
    skill_tier = Column(String(50), default="skilled") # unskilled, semi_skilled, skilled, highly_skilled
    state = Column(String(100), default="Delhi")
    city = Column(String(100), default="New Delhi")
    aadhaar_masked = Column(String(30), default="XXXX-XXXX-9842") # Never store raw Aadhaar
    eshram_uan_masked = Column(String(30), nullable=True)
    avatar_url = Column(String(512), nullable=True)
    dpdp_consent_accepted = Column(Boolean, default=True)
    dpdp_consent_timestamp = Column(DateTime, default=utc_now)
    language_preference = Column(String(10), default="hi")

    worker = relationship("Worker", back_populates="profile")

class EmploymentHistory(Base):
    __tablename__ = "employment_histories"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id = Column(String(64), ForeignKey("workers.id", ondelete="CASCADE"), nullable=False, unique=True)
    total_work_days = Column(Integer, default=0)
    total_lifetime_earnings = Column(Float, default=0.0)
    total_distinct_employers = Column(Integer, default=0)
    first_recorded_date = Column(String(20), nullable=True)
    latest_recorded_date = Column(String(20), nullable=True)
    active_continuity_months = Column(Integer, default=1)
    reputation_score = Column(Float, default=85.0) # 0-100%

    worker = relationship("Worker", back_populates="employment_history")

class WorkEntry(Base):
    __tablename__ = "work_entries"

    id = Column(String(64), primary_key=True, default=lambda: f"WRK-LOG-{uuid.uuid4().hex[:8].upper()}")
    worker_id = Column(String(64), ForeignKey("workers.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(String(20), nullable=False, index=True) # YYYY-MM-DD
    employer_id = Column(String(64), ForeignKey("employers.id", ondelete="SET NULL"), nullable=True)
    employer_name = Column(String(128), nullable=False)
    employer_phone = Column(String(20), nullable=True)
    skill_type = Column(String(100), nullable=False)
    skill_category = Column(String(50), default="skilled")
    location = Column(String(150), default="Delhi NCR")
    hours_worked = Column(Float, default=8.0)
    amount_paid = Column(Float, nullable=False)
    payment_mode = Column(String(50), default="Cash") # Cash, UPI, Bank Transfer
    evidence_type = Column(String(50), default="manual_entry")
    evidence_url = Column(String(512), nullable=True)
    evidence_text = Column(Text, nullable=True)
    confidence_score = Column(Float, default=85.0)
    evidence_strength_band = Column(String(50), default="Medium") # Very High, High, Medium, Lower, Lowest
    endorsement_status = Column(String(50), default="self_attested") # pending, verified, rejected, disputed, self_attested
    endorsement_note = Column(Text, nullable=True)
    entry_hash = Column(String(128), nullable=True, index=True) # Canonical SHA-256
    is_anomaly_flagged = Column(Boolean, default=False)
    anomaly_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    # Relationships
    worker = relationship("Worker", back_populates="work_entries")
    employer = relationship("Employer", back_populates="work_entries")
    wage_record = relationship("WageRecord", back_populates="work_entry", uselist=False, cascade="all, delete-orphan")
    evidence_document = relationship("EvidenceDocument", back_populates="work_entry", uselist=False, cascade="all, delete-orphan")
    voice_record = relationship("VoiceRecord", back_populates="work_entry", uselist=False, cascade="all, delete-orphan")
    endorsement = relationship("Endorsement", back_populates="work_entry", uselist=False, cascade="all, delete-orphan")

class WageRecord(Base):
    __tablename__ = "wage_records"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    work_entry_id = Column(String(64), ForeignKey("work_entries.id", ondelete="CASCADE"), nullable=False, unique=True)
    daily_wage = Column(Float, nullable=False)
    hourly_rate = Column(Float, nullable=False)
    state_benchmark_daily = Column(Float, default=580.0)
    deviation_percentage = Column(Float, default=0.0)
    statutory_compliant = Column(Boolean, default=True)
    payout_verified = Column(Boolean, default=False)

    work_entry = relationship("WorkEntry", back_populates="wage_record")

class EvidenceDocument(Base):
    __tablename__ = "evidence_documents"

    id = Column(String(64), primary_key=True, default=lambda: f"DOC-{uuid.uuid4().hex[:8].upper()}")
    work_entry_id = Column(String(64), ForeignKey("work_entries.id", ondelete="CASCADE"), nullable=True)
    worker_id = Column(String(64), ForeignKey("workers.id", ondelete="CASCADE"), nullable=True)
    storage_key = Column(String(256), nullable=False) # S3 or storage path
    doc_type = Column(String(64), default="wage_slip") # wage_slip, upi_screenshot, bank_statement, chit, register, etc.
    doc_hash = Column(String(128), nullable=False, index=True) # SHA-256 for dedup / fraud detection
    ocr_raw_text = Column(Text, nullable=True)
    ocr_confidence = Column(Float, default=90.0)
    evidence_strength_score = Column(Float, default=85.0)
    extracted_fields_json = Column(JSON, nullable=True)
    is_duplicate_flagged = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    work_entry = relationship("WorkEntry", back_populates="evidence_document")

class VoiceRecord(Base):
    __tablename__ = "voice_records"

    id = Column(String(64), primary_key=True, default=lambda: f"VOICE-{uuid.uuid4().hex[:8].upper()}")
    work_entry_id = Column(String(64), ForeignKey("work_entries.id", ondelete="CASCADE"), nullable=True)
    worker_id = Column(String(64), ForeignKey("workers.id", ondelete="CASCADE"), nullable=True)
    storage_key = Column(String(256), nullable=True)
    language = Column(String(10), default="hi")
    raw_transcript = Column(Text, nullable=False)
    nlp_confidence = Column(Float, default=88.0)
    parsed_entities_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    work_entry = relationship("WorkEntry", back_populates="voice_record")

class Employer(Base):
    __tablename__ = "employers"

    id = Column(String(64), primary_key=True, default=lambda: f"EMP-{uuid.uuid4().hex[:6].upper()}")
    name = Column(String(128), nullable=False)
    business_name = Column(String(150), nullable=True)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(120), nullable=True)
    industry_type = Column(String(100), default="Construction & Infrastructure")
    city = Column(String(100), default="Delhi NCR")
    state = Column(String(100), default="Delhi")
    gstin_optional = Column(String(30), nullable=True)
    verified_workers_count = Column(Integer, default=0)
    reputation_score = Column(Float, default=92.0)
    created_at = Column(DateTime, default=utc_now)

    work_entries = relationship("WorkEntry", back_populates="employer")
    endorsements = relationship("Endorsement", back_populates="employer")

class Contractor(Base):
    __tablename__ = "contractors"

    id = Column(String(64), primary_key=True, default=lambda: f"CON-{uuid.uuid4().hex[:6].upper()}")
    name = Column(String(128), nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    trade_specialty = Column(String(100), default="Masonry & Civil Works")
    active_sites = Column(Integer, default=3)
    crew_size = Column(Integer, default=25)
    verification_speed_hours = Column(Float, default=4.5)
    created_at = Column(DateTime, default=utc_now)

class Endorsement(Base):
    __tablename__ = "endorsements"

    id = Column(String(64), primary_key=True, default=lambda: f"END-{uuid.uuid4().hex[:8].upper()}")
    work_entry_id = Column(String(64), ForeignKey("work_entries.id", ondelete="CASCADE"), nullable=False, unique=True)
    employer_id = Column(String(64), ForeignKey("employers.id", ondelete="SET NULL"), nullable=True)
    endorser_name = Column(String(128), nullable=False)
    endorser_phone = Column(String(20), nullable=False)
    status = Column(String(50), default="verified") # verified, rejected, disputed
    remarks = Column(Text, nullable=True)
    cryptographic_timestamp = Column(String(64), default=lambda: utc_now().isoformat())
    created_at = Column(DateTime, default=utc_now)

    work_entry = relationship("WorkEntry", back_populates="endorsement")
    employer = relationship("Employer", back_populates="endorsements")

class Verification(Base):
    __tablename__ = "verifications"

    id = Column(String(64), primary_key=True, default=lambda: f"VER-{uuid.uuid4().hex[:8].upper()}")
    worker_id = Column(String(64), ForeignKey("workers.id", ondelete="CASCADE"), nullable=False)
    verifier_org_name = Column(String(150), nullable=False)
    verifier_type = Column(String(50), default="Bank") # Bank, NBFC, Employer, NGO, Government
    purpose = Column(String(200), default="Micro-Credit Assessment")
    consent_id = Column(String(64), nullable=True)
    is_verified_authentic = Column(Boolean, default=True)
    tamper_status = Column(String(50), default="CLEAN")
    requested_at = Column(DateTime, default=utc_now)

class ShramScore(Base):
    __tablename__ = "shram_scores"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id = Column(String(64), ForeignKey("workers.id", ondelete="CASCADE"), nullable=False, unique=True)
    overall_score = Column(Integer, default=740) # 300 - 900
    grade = Column(String(10), default="A") # A+, A, B, C
    
    # 6 Transparent Component Scores (0 - 100)
    income_stability_score = Column(Integer, default=80)      # 25% weight
    work_continuity_score = Column(Integer, default=78)       # 20% weight
    verified_earnings_score = Column(Integer, default=85)     # 20% weight
    employer_endorsement_score = Column(Integer, default=75)  # 15% weight
    evidence_quality_score = Column(Integer, default=88)      # 10% weight
    skill_demand_score = Column(Integer, default=82)          # 10% weight

    avg_daily_wage = Column(Float, default=750.0)
    estimated_monthly_income = Column(Float, default=18000.0)
    overall_evidence_confidence = Column(Float, default=91.0) # 0-100%
    stability_band = Column(String(100), default="High Stability")
    loan_readiness = Column(String(200), default="Eligible for up to ₹50,000 Micro-Credit")
    
    factors_positive_json = Column(JSON, default=list)
    factors_improvement_json = Column(JSON, default=list)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    worker = relationship("Worker", back_populates="shram_score")

class SchemeEligibility(Base):
    __tablename__ = "scheme_eligibilities"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id = Column(String(64), ForeignKey("workers.id", ondelete="CASCADE"), nullable=False)
    scheme_id = Column(String(100), nullable=False)
    scheme_name = Column(String(200), nullable=False)
    match_score = Column(Integer, default=85)
    is_potentially_eligible = Column(Boolean, default=True)
    conditions_met_json = Column(JSON, default=list)
    pending_verifications_json = Column(JSON, default=list)
    updated_at = Column(DateTime, default=utc_now)

    worker = relationship("Worker", back_populates="scheme_eligibilities")

class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(String(64), primary_key=True, default=lambda: f"DPDP-CSN-{uuid.uuid4().hex[:8].upper()}")
    worker_id = Column(String(64), ForeignKey("workers.id", ondelete="CASCADE"), nullable=False)
    requester_name = Column(String(150), nullable=False)
    requester_type = Column(String(50), default="Lender") # Lender, Employer, Welfare_Body
    purpose = Column(String(255), nullable=False)
    dpdp_notice_version = Column(String(20), default="v1.0-2026")
    is_active = Column(Boolean, default=True)
    is_revoked = Column(Boolean, default=False)
    granted_at = Column(DateTime, default=utc_now)
    # DPDP Act 2023 compliance: consent must be time-bound
    ttl_days = Column(Integer, default=180)  # 180-day default TTL
    expires_at = Column(DateTime, nullable=True)  # Set to granted_at + ttl_days on creation
    revoked_at = Column(DateTime, nullable=True)
    consent_proof_hash = Column(String(128), nullable=False)

    worker = relationship("Worker", back_populates="consents")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, default=lambda: f"AUD-{uuid.uuid4().hex[:10].upper()}")
    actor_id = Column(String(64), nullable=False) # e.g. EMP-1042, WRK-101, SYSTEM
    actor_role = Column(String(50), default="Worker") # Worker, Employer, Lender, Admin, System
    action = Column(String(100), nullable=False) # e.g. "VERIFIED_WAGE_RECORD", "ONBOARDED_WORKER", "QUERY_LENDER_SUMMARY"
    resource_type = Column(String(50), nullable=False) # WorkEntry, Certificate, Consent, Profile
    resource_id = Column(String(64), nullable=False)
    before_state_json = Column(JSON, nullable=True)
    after_state_json = Column(JSON, nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    session_id = Column(String(64), nullable=True)
    ledger_hash = Column(String(128), nullable=True)
    timestamp = Column(DateTime, default=utc_now, index=True)

class Certificate(Base):
    __tablename__ = "certificates"

    certificate_id = Column(String(64), primary_key=True) # e.g. SHRAM-2026-WORK-8C2A1E90
    worker_id = Column(String(64), ForeignKey("workers.id", ondelete="CASCADE"), nullable=False)
    worker_name = Column(String(128), nullable=False)
    primary_trade = Column(String(100), nullable=False)
    location = Column(String(150), nullable=False)
    verified_period = Column(String(100), nullable=False)
    total_work_days = Column(Integer, default=0)
    total_earnings = Column(Float, default=0.0)
    average_monthly_wage = Column(Float, default=0.0)
    shram_score = Column(Integer, default=740)
    merkle_root = Column(String(128), nullable=False)
    digital_signature = Column(String(128), nullable=False)
    is_valid = Column(Boolean, default=True)
    issue_date = Column(String(50), default=lambda: utc_now().strftime("%d %B %Y"))
    created_at = Column(DateTime, default=utc_now)

    worker = relationship("Worker", back_populates="certificates")
