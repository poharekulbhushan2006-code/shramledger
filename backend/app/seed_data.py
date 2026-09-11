from typing import List, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models import WorkerProfile, WorkEntry, EvidenceType, SkillCategory, EndorsementStatus
from .db_models import (
    Worker as WorkerDB, WorkerProfile as WorkerProfileDB, 
    WorkEntry as WorkEntryDB, Employer as EmployerDB,
    Contractor as ContractorDB, ConsentRecord as ConsentRecordDB
)
from .ledger import MerkleTree

def generate_seed_profiles() -> Dict[str, WorkerProfile]:
    today = datetime.now()
    
    # 1. Ramesh Kumar (Construction Mason - Delhi NCR)
    ramesh_entries: List[WorkEntry] = [
        WorkEntry(
            id="WRK-RAM-01",
            worker_id="worker_ramesh",
            date=(today - timedelta(days=1)).strftime("%Y-%m-%d"),
            employer_name="Shree Ram Construction / आर. के. शर्मा",
            employer_phone="9876543210",
            skill_type="Mason / राजमिस्त्री",
            skill_category=SkillCategory.SKILLED,
            location="Sector 62, Noida, NCR",
            hours_worked=8.0,
            amount_paid=850.0,
            payment_mode="Cash",
            evidence_type=EvidenceType.WAGE_SLIP,
            evidence_text="श्री राम कंस्ट्रक्शन साइट - दैनिक मजदूरी ₹850/-, 8 घंटे, आर. के. शर्मा ठेकेदार",
            confidence_score=94.0,
            endorsement_status=EndorsementStatus.VERIFIED,
            endorsement_note="Verified by Contractor R.K. Sharma via Phone OTP."
        ),
        WorkEntry(
            id="WRK-RAM-02",
            worker_id="worker_ramesh",
            date=(today - timedelta(days=2)).strftime("%Y-%m-%d"),
            employer_name="Gupta Builders & Interiors",
            employer_phone="9811223344",
            skill_type="Mason / राजमिस्त्री",
            skill_category=SkillCategory.SKILLED,
            location="South Delhi Residential Site",
            hours_worked=8.5,
            amount_paid=850.0,
            payment_mode="UPI",
            evidence_type=EvidenceType.UPI_SCREENSHOT,
            evidence_text="UPI Ref 423891029381: ₹850 paid by Gupta Builders (Tile fitting work Day 3)",
            confidence_score=97.0,
            endorsement_status=EndorsementStatus.VERIFIED,
            endorsement_note="Digital UPI bank ledger match confirmed."
        ),
        WorkEntry(
            id="WRK-RAM-03",
            worker_id="worker_ramesh",
            date=(today - timedelta(days=3)).strftime("%Y-%m-%d"),
            employer_name="Gupta Builders & Interiors",
            employer_phone="9811223344",
            skill_type="Mason / राजमिस्त्री",
            skill_category=SkillCategory.SKILLED,
            location="South Delhi Residential Site",
            hours_worked=8.0,
            amount_paid=800.0,
            payment_mode="UPI",
            evidence_type=EvidenceType.UPI_SCREENSHOT,
            evidence_text="UPI Ref 423880192831: ₹800 paid for masonry & plastering work",
            confidence_score=96.0,
            endorsement_status=EndorsementStatus.VERIFIED
        ),
        WorkEntry(
            id="WRK-RAM-04",
            worker_id="worker_ramesh",
            date=(today - timedelta(days=5)).strftime("%Y-%m-%d"),
            employer_name="Verma & Sons Contracting",
            employer_phone="9899001122",
            skill_type="Mason / राजमिस्त्री",
            skill_category=SkillCategory.SKILLED,
            location="Gurugram Cyber Hub Site",
            hours_worked=8.0,
            amount_paid=800.0,
            payment_mode="Cash",
            evidence_type=EvidenceType.VOICE_NOTE,
            evidence_text="Audio transcript: 'आज गुड़गांव साइट पर 8 घंटे चिनाई का काम किया वर्मा जी के पास और ₹800 नकद मिले।'",
            confidence_score=88.0,
            endorsement_status=EndorsementStatus.SELF_ATTESTED
        ),
        WorkEntry(
            id="WRK-RAM-05",
            worker_id="worker_ramesh",
            date=(today - timedelta(days=6)).strftime("%Y-%m-%d"),
            employer_name="Verma & Sons Contracting",
            employer_phone="9899001122",
            skill_type="Mason / राजमिस्त्री",
            skill_category=SkillCategory.SKILLED,
            location="Gurugram Cyber Hub Site",
            hours_worked=8.0,
            amount_paid=800.0,
            payment_mode="Cash",
            evidence_type=EvidenceType.HANDWRITTEN_REGISTER,
            evidence_text="Muster Roll Entry #42 - Mason Shift 1",
            confidence_score=91.0,
            endorsement_status=EndorsementStatus.VERIFIED
        ),
        WorkEntry(
            id="WRK-RAM-06",
            worker_id="worker_ramesh",
            date=(today - timedelta(days=8)).strftime("%Y-%m-%d"),
            employer_name="Shree Ram Construction / आर. के. शर्मा",
            employer_phone="9876543210",
            skill_type="Mason / राजमिस्त्री",
            skill_category=SkillCategory.SKILLED,
            location="Sector 62, Noida, NCR",
            hours_worked=8.0,
            amount_paid=750.0,
            payment_mode="Cash",
            evidence_type=EvidenceType.WAGE_SLIP,
            evidence_text="Voucher #882: Brickwork 2nd floor, paid ₹750",
            confidence_score=92.0,
            endorsement_status=EndorsementStatus.VERIFIED
        ),
        WorkEntry(
            id="WRK-RAM-07",
            worker_id="worker_ramesh",
            date=(today - timedelta(days=9)).strftime("%Y-%m-%d"),
            employer_name="Shree Ram Construction / आर. के. शर्मा",
            employer_phone="9876543210",
            skill_type="Mason / राजमिस्त्री",
            skill_category=SkillCategory.SKILLED,
            location="Sector 62, Noida, NCR",
            hours_worked=8.0,
            amount_paid=750.0,
            payment_mode="Cash",
            evidence_type=EvidenceType.WAGE_SLIP,
            evidence_text="Voucher #881: Foundation brick alignment, paid ₹750",
            confidence_score=92.0,
            endorsement_status=EndorsementStatus.VERIFIED
        ),
        WorkEntry(
            id="WRK-RAM-08",
            worker_id="worker_ramesh",
            date=(today - timedelta(days=11)).strftime("%Y-%m-%d"),
            employer_name="Anand Colony Renovation",
            employer_phone="9711882233",
            skill_type="Mason / राजमिस्त्री",
            skill_category=SkillCategory.SKILLED,
            location="Mayur Vihar, East Delhi",
            hours_worked=9.0,
            amount_paid=900.0,
            payment_mode="UPI",
            evidence_type=EvidenceType.UPI_SCREENSHOT,
            evidence_text="UPI Ref 423811902844: ₹900 paid by Homeowner Anand (Bathroom wall tiling)",
            confidence_score=97.0,
            endorsement_status=EndorsementStatus.VERIFIED
        ),
        WorkEntry(
            id="WRK-RAM-09",
            worker_id="worker_ramesh",
            date=(today - timedelta(days=12)).strftime("%Y-%m-%d"),
            employer_name="Anand Colony Renovation",
            employer_phone="9711882233",
            skill_type="Mason / राजमिस्त्री",
            skill_category=SkillCategory.SKILLED,
            location="Mayur Vihar, East Delhi",
            hours_worked=8.0,
            amount_paid=800.0,
            payment_mode="UPI",
            evidence_type=EvidenceType.UPI_SCREENSHOT,
            evidence_text="UPI Ref 423800192844: ₹800 paid by Homeowner Anand",
            confidence_score=97.0,
            endorsement_status=EndorsementStatus.VERIFIED
        ),
        WorkEntry(
            id="WRK-RAM-10",
            worker_id="worker_ramesh",
            date=(today - timedelta(days=14)).strftime("%Y-%m-%d"),
            employer_name="Gupta Builders & Interiors",
            employer_phone="9811223344",
            skill_type="Mason / राजमिस्त्री",
            skill_category=SkillCategory.SKILLED,
            location="South Delhi Residential Site",
            hours_worked=8.0,
            amount_paid=800.0,
            payment_mode="UPI",
            evidence_type=EvidenceType.UPI_SCREENSHOT,
            evidence_text="UPI Ref 423719001928: ₹800 wage transfer",
            confidence_score=96.0,
            endorsement_status=EndorsementStatus.VERIFIED
        ),
        WorkEntry(
            id="WRK-RAM-11",
            worker_id="worker_ramesh",
            date=(today - timedelta(days=16)).strftime("%Y-%m-%d"),
            employer_name="Shree Ram Construction / आर. के. शर्मा",
            employer_phone="9876543210",
            skill_type="Mason / राजमिस्त्री",
            skill_category=SkillCategory.SKILLED,
            location="Sector 62, Noida, NCR",
            hours_worked=8.0,
            amount_paid=750.0,
            payment_mode="Cash",
            evidence_type=EvidenceType.WAGE_SLIP,
            evidence_text="Voucher #870: Boundary wall construction",
            confidence_score=92.0,
            endorsement_status=EndorsementStatus.VERIFIED
        ),
        WorkEntry(
            id="WRK-RAM-12",
            worker_id="worker_ramesh",
            date=(today - timedelta(days=18)).strftime("%Y-%m-%d"),
            employer_name="Shree Ram Construction / आर. के. शर्मा",
            employer_phone="9876543210",
            skill_type="Mason / राजमिस्त्री",
            skill_category=SkillCategory.SKILLED,
            location="Sector 62, Noida, NCR",
            hours_worked=8.0,
            amount_paid=750.0,
            payment_mode="Cash",
            evidence_type=EvidenceType.WAGE_SLIP,
            evidence_text="Voucher #868: Concrete mixing & beam prep",
            confidence_score=92.0,
            endorsement_status=EndorsementStatus.VERIFIED
        )
    ]

    for e in ramesh_entries:
        e.entry_hash = MerkleTree.compute_entry_hash(e)

    ramesh_profile = WorkerProfile(
        id="worker_ramesh",
        name="Ramesh Kumar (रमेश कुमार)",
        phone="+91 98712 34567",
        age=38,
        gender="Male",
        primary_trade="Mason / राजमिस्त्री",
        skill_tier="skilled",
        state="Delhi",
        city="Noida & South Delhi",
        aadhaar_masked="XXXX-XXXX-4921",
        eshram_uan_masked="UAN-9102-3849-1102",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        joined_date="2025-06-15",
        dpdp_consent_accepted=True,
        work_entries=ramesh_entries
    )

    # 2. Sunita Devi (Domestic Cook & Housekeeper - Mumbai)
    sunita_entries: List[WorkEntry] = [
        WorkEntry(
            id="WRK-SUN-01",
            worker_id="worker_sunita",
            date=(today - timedelta(days=1)).strftime("%Y-%m-%d"),
            employer_name="Smt. Abha Mehra (Bandra)",
            employer_phone="9920112233",
            skill_type="Domestic Help / घरेलू सहायिका",
            skill_category=SkillCategory.SEMI_SKILLED,
            location="Bandra West, Mumbai",
            hours_worked=4.0,
            amount_paid=4500.0,
            payment_mode="UPI",
            evidence_type=EvidenceType.UPI_SCREENSHOT,
            evidence_text="UPI Ref 592819201928: ₹4,500 monthly cooking wage received from Abha Mehra",
            confidence_score=97.0,
            endorsement_status=EndorsementStatus.VERIFIED
        ),
        WorkEntry(
            id="WRK-SUN-02",
            worker_id="worker_sunita",
            date=(today - timedelta(days=2)).strftime("%Y-%m-%d"),
            employer_name="Dr. Kulkarni Residence (Khar)",
            employer_phone="9820556677",
            skill_type="Domestic Help / घरेलू सहायिका",
            skill_category=SkillCategory.SEMI_SKILLED,
            location="Khar West, Mumbai",
            hours_worked=3.5,
            amount_paid=4000.0,
            payment_mode="Bank Transfer",
            evidence_type=EvidenceType.BANK_STATEMENT,
            evidence_text="Monthly Household Service Memo: ₹4,000 NEFT received for housekeeping & cooking",
            confidence_score=96.0,
            endorsement_status=EndorsementStatus.VERIFIED
        ),
        WorkEntry(
            id="WRK-SUN-03",
            worker_id="worker_sunita",
            date=(today - timedelta(days=3)).strftime("%Y-%m-%d"),
            employer_name="Mr. Rahul Shah (Santacruz)",
            employer_phone="9819445566",
            skill_type="Domestic Help / घरेलू सहायिका",
            skill_category=SkillCategory.SEMI_SKILLED,
            location="Santacruz East, Mumbai",
            hours_worked=3.0,
            amount_paid=3500.0,
            payment_mode="Cash",
            evidence_type=EvidenceType.VOICE_NOTE,
            evidence_text="Voice memo: 'संतक्रूज़ वाले शाह जी के घर से महीने का ₹3500 मिला नकद।'",
            confidence_score=87.0,
            endorsement_status=EndorsementStatus.SELF_ATTESTED
        )
    ]
    for e in sunita_entries:
        e.entry_hash = MerkleTree.compute_entry_hash(e)

    sunita_profile = WorkerProfile(
        id="worker_sunita",
        name="Sunita Devi (सुनीता देवी)",
        phone="+91 98201 98765",
        age=34,
        gender="Female",
        primary_trade="Domestic Help / घरेलू सहायिका",
        skill_tier="semi_skilled",
        state="Maharashtra",
        city="Mumbai (Bandra/Khar)",
        aadhaar_masked="XXXX-XXXX-8310",
        eshram_uan_masked="UAN-9201-4412-8871",
        avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        joined_date="2025-08-10",
        dpdp_consent_accepted=True,
        work_entries=sunita_entries
    )

    # 3. Rajesh Yadav (Street Vendor - Varanasi & Delhi)
    rajesh_entries: List[WorkEntry] = [
        WorkEntry(
            id="WRK-RAJ-01",
            worker_id="worker_rajesh",
            date=(today - timedelta(days=1)).strftime("%Y-%m-%d"),
            employer_name="Azadpur Mandi / Self-Employed",
            employer_phone="9810998877",
            skill_type="Street Vendor / रेहड़ी-पटरी",
            skill_category=SkillCategory.SEMI_SKILLED,
            location="Azadpur & Rohini, Delhi",
            hours_worked=10.0,
            amount_paid=950.0,
            payment_mode="UPI",
            evidence_type=EvidenceType.CONTRACTOR_CHIT,
            evidence_text="Mandi purchase receipt + QR customer collection ₹950",
            confidence_score=94.0,
            endorsement_status=EndorsementStatus.VERIFIED
        ),
        WorkEntry(
            id="WRK-RAJ-02",
            worker_id="worker_rajesh",
            date=(today - timedelta(days=2)).strftime("%Y-%m-%d"),
            employer_name="Azadpur Mandi / Self-Employed",
            employer_phone="9810998877",
            skill_type="Street Vendor / रेहड़ी-पटरी",
            skill_category=SkillCategory.SEMI_SKILLED,
            location="Azadpur & Rohini, Delhi",
            hours_worked=10.0,
            amount_paid=900.0,
            payment_mode="UPI",
            evidence_type=EvidenceType.UPI_SCREENSHOT,
            evidence_text="PhonePe Merchant Settlement ₹900",
            confidence_score=97.0,
            endorsement_status=EndorsementStatus.VERIFIED
        )
    ]
    for e in rajesh_entries:
        e.entry_hash = MerkleTree.compute_entry_hash(e)

    rajesh_profile = WorkerProfile(
        id="worker_rajesh",
        name="Rajesh Yadav (राजेश यादव)",
        phone="+91 98109 11223",
        age=29,
        gender="Male",
        primary_trade="Street Vendor / रेहड़ी-पटरी",
        skill_tier="semi_skilled",
        state="Uttar Pradesh",
        city="Varanasi & Delhi",
        aadhaar_masked="XXXX-XXXX-1904",
        eshram_uan_masked="UAN-9304-1829-3321",
        avatar_url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        joined_date="2025-10-01",
        dpdp_consent_accepted=True,
        work_entries=rajesh_entries
    )

    return {
        "worker_ramesh": ramesh_profile,
        "worker_sunita": sunita_profile,
        "worker_rajesh": rajesh_profile
    }

def seed_database_if_empty(db: Session):
    """
    Checks if database is populated. If empty, seeds production-grade test entities into SQLAlchemy tables.
    """
    existing_count = db.query(WorkerDB).count()
    if existing_count > 0:
        return

    # Create Employers
    emp1 = EmployerDB(
        id="EMP-1042",
        name="Rajesh Sharma (Site Incharge)",
        business_name="Shree Ram Construction Pvt Ltd",
        phone="9876543210",
        industry_type="Civil & Residential Construction",
        city="Noida",
        state="Uttar Pradesh",
        verified_workers_count=18,
        reputation_score=95.0
    )
    emp2 = EmployerDB(
        id="EMP-2088",
        name="Sanjay Gupta",
        business_name="Gupta Builders & Interiors",
        phone="9811223344",
        industry_type="Interior Design & Tile Works",
        city="South Delhi",
        state="Delhi",
        verified_workers_count=12,
        reputation_score=93.5
    )
    db.add(emp1)
    db.add(emp2)
    db.commit()

    profiles_dict = generate_seed_profiles()
    for w_key, p in profiles_dict.items():
        worker_db = WorkerDB(
            id=p.id,
            phone=p.phone,
            is_active=True,
            is_phone_verified=True
        )
        db.add(worker_db)
        db.flush()

        profile_db = WorkerProfileDB(
            worker_id=p.id,
            name=p.name,
            age=p.age,
            gender=p.gender,
            primary_trade=p.primary_trade,
            skill_tier=p.skill_tier,
            state=p.state,
            city=p.city,
            aadhaar_masked=p.aadhaar_masked,
            eshram_uan_masked=p.eshram_uan_masked,
            avatar_url=p.avatar_url,
            dpdp_consent_accepted=True
        )
        db.add(profile_db)

        # Consent record
        consent_db = ConsentRecordDB(
            id=f"DPDP-CSN-{p.id.upper()}",
            worker_id=p.id,
            requester_name="Institutional Partner Network",
            requester_type="System",
            purpose="Employment Verification & Welfare Scheme Eligibility",
            dpdp_notice_version="v1.0-2026",
            is_active=True,
            consent_proof_hash=f"CSN_PROOF_{p.id.upper()}"
        )
        db.add(consent_db)

        # Work entries
        for entry in p.work_entries:
            entry_db = WorkEntryDB(
                id=entry.id,
                worker_id=p.id,
                date=entry.date,
                employer_name=entry.employer_name,
                employer_phone=entry.employer_phone,
                skill_type=entry.skill_type,
                skill_category=entry.skill_category.value,
                location=entry.location,
                hours_worked=entry.hours_worked,
                amount_paid=entry.amount_paid,
                payment_mode=entry.payment_mode,
                evidence_type=entry.evidence_type.value,
                confidence_score=entry.confidence_score,
                endorsement_status=entry.endorsement_status.value,
                endorsement_note=entry.endorsement_note,
                entry_hash=entry.entry_hash
            )
            db.add(entry_db)

    db.commit()
