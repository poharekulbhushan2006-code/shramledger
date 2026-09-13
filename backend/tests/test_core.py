import pytest
import hashlib
from fastapi.testclient import TestClient
from app.main import app, WORKERS_CACHE, ACTIVE_OTP_STORE
from app.speech_nlp_engine import IndicSpeechNLPEngine
from app.ocr_engine import OCREngine
from app.validator import WageValidator
from app.evidence_engine import EvidenceEngine
from app.ledger import MerkleTree, LedgerEngine
from app.credit_scorer import CreditScorer
from app.scheme_recommender import SchemeRecommender
from app.fraud_detector import FraudDetector
from app.audit_logger import AuditLogger
from app.models import (
    WorkEntry, SkillCategory, EvidenceType, EndorsementStatus,
    WorkerOnboardingRequest, EmployerActionRequest, EvidenceStrengthBand
)

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "ShramLedger" in data["app"]
    assert data["status"] == "online"
    # SECURITY: internal counts must not be exposed
    assert "active_profiles" not in data
    assert "database" not in data

def test_otp_and_dpdp_onboarding():
    test_phone = "+91 98765 43210"
    # Server normalises by stripping spaces and dashes only (not + prefix)
    clean_phone = test_phone.replace(" ", "").replace("-", "")  # "+919876543210"

    # 1. Request OTP
    otp_res = client.post("/api/auth/otp", json={"phone": test_phone})
    assert otp_res.status_code == 200
    assert otp_res.json()["status"] == "OTP_SENT"
    # SECURITY: OTP must NOT be in the response body
    assert "otp" not in otp_res.json()
    assert "sms_preview" not in otp_res.json()

    # 2a. SECURITY TEST: The old bypass code '8492' must be REJECTED
    # It returns 422 (validation error: OTP must be 6 digits) or 400 (invalid OTP)
    # Both responses confirm the bypass is completely blocked.
    bypass_res = client.post("/api/auth/verify-otp", json={"phone": test_phone, "otp": "8492"})
    assert bypass_res.status_code in (400, 422), f"Security failure: '8492' bypass returned {bypass_res.status_code}"

    # 2b. Retrieve the actual OTP from the in-memory store (test-only access)
    stored = ACTIVE_OTP_STORE.get(clean_phone)
    assert stored is not None, "OTP was not stored in ACTIVE_OTP_STORE"
    stored_hash = stored["otp_hash"]
    # Brute-force find the 6-digit OTP that matches the hash (test environment only)
    real_otp = None
    for candidate in range(100000, 1000000):
        if hashlib.sha256(str(candidate).encode()).hexdigest() == stored_hash:
            real_otp = str(candidate)
            break
    assert real_otp is not None, "Could not recover OTP from hash — check store"

    # 2c. Verify with the correct real OTP
    verify_res = client.post("/api/auth/verify-otp", json={"phone": test_phone, "otp": real_otp})
    assert verify_res.status_code == 200
    v_data = verify_res.json()
    assert v_data["status"] == "VERIFIED"
    # SECURITY: Must return a real JWT, not a UUID placeholder
    assert "access_token" in v_data
    assert len(v_data["access_token"]) > 20

    # 3. Register worker with DPDP consent
    onboard_payload = {
        "phone": test_phone,
        "name": "Kailash Chand (कैलाश चंद)",
        "age": 35,
        "gender": "Male",
        "primary_trade": "Carpenter / बढ़ई",
        "skill_tier": "skilled",
        "state": "Uttar Pradesh",
        "city": "Lucknow",
        "language_preference": "hi",
        "dpdp_consent_accepted": True
    }
    onboard_res = client.post("/api/onboard/worker", json=onboard_payload)
    assert onboard_res.status_code == 200
    w_data = onboard_res.json()
    assert w_data["name"] == "Kailash Chand (कैलाश चंद)"
    assert w_data["dpdp_consent_accepted"] is True
    assert len(w_data["work_entries"]) >= 1

def test_speech_nlp_indic_extraction():
    text = "आज मैंने 8 घंटे चिनाई का काम किया रमेश ठेकेदार के पास सेक्टर 62 में और 850 रुपये नकद मिले"
    parsed = IndicSpeechNLPEngine.parse_transcript(text)
    assert parsed["amount_paid"] == 850.0
    assert parsed["hours_worked"] == 8.0
    assert "Mason" in parsed["skill_type"] or "राजमिस्त्री" in parsed["skill_type"]
    assert "Ramesh" in parsed["employer_name"] or "ठेकेदार" in parsed["employer_name"]
    assert parsed["payment_mode"] == "Cash"

def test_ocr_multi_evidence_extraction():
    doc = OCREngine.parse_document("wage_slip")
    assert "Nirman" in doc["extracted"]["employer_name"] or "Rajesh" in doc["extracted"]["employer_name"]
    assert doc["extracted"]["amount_paid"] == 950.0
    assert len(doc["bounding_boxes"]) >= 4
    assert len(doc["doc_hash"]) == 64

    # Test UPI screenshot preset
    upi_doc = OCREngine.parse_document("upi_screenshot")
    assert upi_doc["extracted"]["payment_mode"] == "UPI"
    assert upi_doc["extracted"]["amount_paid"] == 850.0

def test_evidence_strength_engine():
    entry = WorkEntry(
        id="TEST-EV-01",
        worker_id="worker_ramesh",
        date="2026-08-31",
        employer_name="Gupta Builders",
        employer_phone="9811223344",
        skill_type="Mason / राजमिस्त्री",
        skill_category=SkillCategory.SKILLED,
        location="Delhi NCR",
        hours_worked=8.0,
        amount_paid=850.0,
        payment_mode="UPI",
        evidence_type=EvidenceType.UPI_SCREENSHOT,
        endorsement_status=EndorsementStatus.VERIFIED
    )
    score, band, reasons = EvidenceEngine.evaluate_entry_strength(entry)
    assert score >= 95.0
    assert band == EvidenceStrengthBand.VERY_HIGH

def test_tamper_evident_merkle_dag():
    worker = WORKERS_CACHE["worker_ramesh"]
    entries = worker.work_entries
    
    # 1. Compute valid root
    leafs = [MerkleTree.compute_entry_hash(e) for e in entries]
    root, levels = MerkleTree.build_tree(leafs)
    assert len(root) == 64
    
    # 2. Check genuine list
    is_valid, is_tampered, explanation = LedgerEngine.verify_ledger_integrity(entries, root)
    assert is_valid is True
    assert is_tampered is False
    
    # 3. Alter wage in tampered list
    tampered_entries = [e.model_copy(deep=True) for e in entries]
    tampered_entries[0].amount_paid = 99999.0
    
    is_valid_t, is_tampered_t, explanation_t = LedgerEngine.verify_ledger_integrity(tampered_entries, root)
    assert is_valid_t is False
    assert is_tampered_t is True
    assert "Tamper detected" in explanation_t or "mismatch" in explanation_t

def test_explainable_shramscore():
    worker = WORKERS_CACHE["worker_ramesh"]
    score = CreditScorer.calculate_score(worker.work_entries, worker.state)
    assert 300 <= score.overall_score <= 900
    assert score.income_stability_score > 0
    assert score.work_continuity_score > 0
    assert score.verified_earnings_score > 0
    assert score.employer_endorsement_score > 0
    assert score.evidence_quality_score > 0
    assert score.skill_demand_score > 0
    assert len(score.factors_positive) >= 1

def test_employer_action_endpoint():
    worker = WORKERS_CACHE["worker_ramesh"]
    target_entry = worker.work_entries[0]
    
    payload = {
        "entry_id": target_entry.id,
        "employer_name": "Rajesh Sharma",
        "employer_phone": "9876543210",
        "action": "confirm",
        "note": "Payment and 8 hours verified on site."
    }
    res = client.post("/api/employer/action", json=payload)
    assert res.status_code == 200
    assert res.json()["endorsement_status"] == "verified"

def test_lender_underwriting_api():
    res = client.get("/api/v1/workers/worker_ramesh/income-summary")
    assert res.status_code == 200
    data = res.json()
    assert data["verified_monthly_income"] > 0
    assert 0.0 <= data["income_stability"] <= 1.0
    assert data["tamper_audit_status"] == "MERKLE_VERIFIED_GENUINE"
    assert data["active_dpdp_consent"] is True

def test_fraud_shift_collision_detection():
    worker = WORKERS_CACHE["worker_ramesh"]
    existing_entry = worker.work_entries[0]
    
    colliding_entry = WorkEntry(
        id="WRK-COLLISION-TEST",
        worker_id="worker_ramesh",
        date=existing_entry.date, # SAME DATE
        employer_name="Different Fake Employer Ltd", # DIFFERENT EMPLOYER
        skill_type="Mason / राजमिस्त्री",
        location="Sector 62, Noida",
        amount_paid=900.0,
        hours_worked=8.0
    )
    alert = FraudDetector.analyze_new_entry(colliding_entry, worker.work_entries, worker.name)
    assert alert is not None
    assert alert.alert_type == "SHIFT_COLLISION"

def test_audit_logging():
    logs = AuditLogger.get_recent_logs(10)
    assert len(logs) >= 1
    assert any("LOGGED" in log.action or "ONBOARDED" in log.action or "QUERY" in log.action for log in logs)

# ----------------- ENTERPRISE COMMERCIAL B2B TESTS -----------------

def test_enterprise_quote_generation():
    payload = {
        "company_name": "Larsen & Toubro Construction Ltd",
        "contact_name": "Anil Verma (Project Director)",
        "email": "anil.verma@lntepc.com",
        "phone": "+91 98111 44556",
        "organization_type": "Construction EPC",
        "active_sites_count": 5,
        "estimated_workers": 1200,
        "plan_tier": "contractor_pro",
        "billing_cycle": "annual"
    }
    res = client.post("/api/enterprise/quote", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["company_name"] == "Larsen & Toubro Construction Ltd"
    assert data["total_monthly_estimate"] > 0
    assert data["annual_discounted_total"] > 0
    assert len(data["features_included"]) >= 4
    assert data["quote_id"].startswith("QTE-")

def test_bulk_muster_roll_ingestion():
    payload = {
        "employer_id": "emp_lnt_01",
        "employer_name": "L&T Delhi Metro Phase 4",
        "site_name": "Mukundpur Depot Site",
        "records": [
            {
                "worker_name": "Ramesh Kumar",
                "phone": "+91 98765 43210",
                "primary_trade": "Mason / राजमिस्त्री",
                "hours_worked": 8.0,
                "daily_wage": 850.0,
                "payment_mode": "Cash",
                "site_location": "Delhi NCR",
                "work_date": "2026-09-11"
            },
            {
                "worker_name": "Sunita Devi",
                "phone": "+91 98201 23456",
                "primary_trade": "Helper / सहायक",
                "hours_worked": 8.0,
                "daily_wage": 700.0,
                "payment_mode": "UPI",
                "site_location": "Delhi NCR",
                "work_date": "2026-09-11"
            }
        ]
    }
    res = client.post("/api/enterprise/bulk-muster", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["processed_count"] == 2
    assert data["total_wage_disbursed"] == 1550.0
    assert len(data["batch_merkle_root"]) == 64
    assert data["status"] == "LEDGER_ANCHORED_SUCCESS"

def test_api_key_lifecycle():
    # 1. List active keys
    list_res = client.get("/api/enterprise/api-keys")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1
    
    # 2. Create new key
    create_res = client.post("/api/enterprise/api-keys", json={
        "name": "Tata Capital Micro-Loans Sandbox",
        "environment": "sandbox"
    })
    assert create_res.status_code == 200
    key_data = create_res.json()
    assert "shram_sand_" in key_data["key_prefix"]
    assert key_data["is_active"] is True

def test_lender_custom_risk_policy_evaluation():
    payload = {
        "worker_id": "worker_ramesh",
        "requested_loan_amount": 50000.0,
        "loan_tenure_months": 12,
        "policy": {
            "min_shram_score": 600,
            "max_income_volatility_pct": 50.0,
            "min_work_days_logged": 1,
            "min_verified_ratio_pct": 30.0,
            "max_loan_limit": 80000.0
        }
    }
    res = client.post("/api/enterprise/lender-policy/evaluate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["decision"] in ["APPROVED", "CONDITIONAL_APPROVAL"]
    assert data["approved_amount"] > 0
    assert data["monthly_emi_estimate"] > 0
    assert len(data["rule_evaluations"]) >= 4
    assert len(data["cryptographic_audit_hash"]) == 64

def test_payout_batch_execution():
    payload = {
        "employer_id": "emp_lnt_01",
        "employer_name": "L&T Infrastructure",
        "payout_date": "2026-09-11",
        "batch_title": "Weekly Mason Wages Week 36",
        "total_amount": 17850.0,
        "worker_ids": ["worker_ramesh", "worker_sunita"],
        "payment_channel": "Direct Bank Account / UPI"
    }
    res = client.post("/api/enterprise/payout-batch", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["payout_status"] == "EXECUTED_AND_ANCHORED"
    assert len(data["merkle_batch_hash"]) == 64

def test_bocw_statutory_report():
    res = client.get("/api/enterprise/bocw-report?site_id=site_delhi_metro_04")
    assert res.status_code == 200
    data = res.json()
    assert data["compliance_status"] == "FULLY_COMPLIANT_WITH_BOCW_1996"
    assert data["cess_applicable_pct"] == 1.0
    assert data["mandays_worked"] > 0
    assert len(data["verification_seal_hash"]) == 64

def test_contact_sales_lead_capture():
    payload = {
        "name": "Vikram Sethi",
        "email": "v.sethi@shapporji.com",
        "phone": "+91 99887 76655",
        "company": "Shapoorji Pallonji Real Estate",
        "plan_interest": "State Labor Mission & Enterprise EPC Sovereign Suite",
        "message": "Interested in deploying across 18 construction sites in Mumbai."
    }
    res = client.post("/api/contact-sales", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["inquiry_id"].startswith("LEAD-")

