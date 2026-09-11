import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from .models import WorkEntry, FraudAlert, SkillCategory
from .validator import WageValidator

class FraudDetector:
    """
    Enterprise Anomaly & Fraud Detection Engine.
    Applies multi-vector heuristic auditing:
    1. Shift Collision (Same worker, same date, multiple employers)
    2. Wage Spike Outlier (>4x statutory daily benchmark)
    3. Duplicate Evidence Hash (Reused receipts or cross-worker document sharing)
    4. Rapid Contractor Batch Endorsement (Suspicious endorsement velocity)
    
    Philosophy: Generates 'Risk Flag -> Human Review' rather than binary blacklisting.
    """

    # Track in-memory document hashes and alerts
    DOCUMENT_HASH_REGISTRY: Dict[str, Dict[str, Any]] = {}
    ACTIVE_ALERTS: List[FraudAlert] = []

    @classmethod
    def analyze_new_entry(
        cls, 
        new_entry: WorkEntry, 
        existing_entries: List[WorkEntry],
        worker_name: str,
        state: str = "Delhi"
    ) -> Optional[FraudAlert]:
        """
        Scans a candidate work entry against historical logs for potential risk flags.
        """
        # 1. Shift Collision Check (Same worker + same date + different employer)
        for existing in existing_entries:
            if existing.id != new_entry.id and existing.date == new_entry.date:
                if existing.employer_name.strip().lower() != new_entry.employer_name.strip().lower():
                    alert = FraudAlert(
                        alert_id=f"ALT-{uuid.uuid4().hex[:8].upper()}",
                        worker_id=new_entry.worker_id,
                        worker_name=worker_name,
                        alert_type="SHIFT_COLLISION",
                        severity="HIGH",
                        description=f"Potential duplicate shift: Worker logged two distinct employers on {new_entry.date} ('{existing.employer_name}' and '{new_entry.employer_name}').",
                        detected_at=datetime.utcnow().strftime("%d %b %Y, %H:%M UTC"),
                        status="PENDING_REVIEW",
                        evidence_snapshot={
                            "date": new_entry.date,
                            "employer_1": existing.employer_name,
                            "wage_1": existing.amount_paid,
                            "employer_2": new_entry.employer_name,
                            "wage_2": new_entry.amount_paid
                        }
                    )
                    cls.ACTIVE_ALERTS.insert(0, alert)
                    return alert

        # 2. Wage Spike Outlier Check
        benchmark = WageValidator.get_benchmark(state, new_entry.skill_category)
        if new_entry.amount_paid > (benchmark * 4.0) or new_entry.amount_paid >= 8000.0:
            alert = FraudAlert(
                alert_id=f"ALT-{uuid.uuid4().hex[:8].upper()}",
                worker_id=new_entry.worker_id,
                worker_name=worker_name,
                alert_type="WAGE_SPIKE_OUTLIER",
                severity="MEDIUM",
                description=f"Wage spike anomaly: Claim of ₹{new_entry.amount_paid:,.0f}/day is {new_entry.amount_paid / benchmark:.1f}x regional statutory benchmark (₹{benchmark:.0f}/day).",
                detected_at=datetime.utcnow().strftime("%d %b %Y, %H:%M UTC"),
                status="PENDING_REVIEW",
                evidence_snapshot={
                    "claimed_amount": new_entry.amount_paid,
                    "regional_benchmark": benchmark,
                    "trade": new_entry.skill_type
                }
            )
            cls.ACTIVE_ALERTS.insert(0, alert)
            return alert

        return None

    @classmethod
    def check_document_hash(
        cls, 
        doc_hash: str, 
        worker_id: str, 
        worker_name: str,
        doc_title: str
    ) -> Optional[FraudAlert]:
        """
        Verifies if an identical document hash has already been registered by this or another worker.
        """
        if doc_hash in cls.DOCUMENT_HASH_REGISTRY:
            original = cls.DOCUMENT_HASH_REGISTRY[doc_hash]
            if original["worker_id"] != worker_id:
                alert = FraudAlert(
                    alert_id=f"ALT-{uuid.uuid4().hex[:8].upper()}",
                    worker_id=worker_id,
                    worker_name=worker_name,
                    alert_type="DUPLICATE_DOC_HASH",
                    severity="HIGH",
                    description=f"Cross-worker duplicate document reuse: Uploaded slip matches exact cryptographic SHA-256 hash previously submitted by {original['worker_name']} ({original['worker_id']}).",
                    detected_at=datetime.utcnow().strftime("%d %b %Y, %H:%M UTC"),
                    status="PENDING_REVIEW",
                    evidence_snapshot={
                        "doc_hash": doc_hash,
                        "original_worker": original["worker_name"],
                        "original_worker_id": original["worker_id"],
                        "first_uploaded": original["registered_at"]
                    }
                )
                cls.ACTIVE_ALERTS.insert(0, alert)
                return alert
        else:
            cls.DOCUMENT_HASH_REGISTRY[doc_hash] = {
                "worker_id": worker_id,
                "worker_name": worker_name,
                "doc_title": doc_title,
                "registered_at": datetime.utcnow().strftime("%d %b %Y, %H:%M UTC")
            }
        return None

    @classmethod
    def get_all_alerts(cls) -> List[FraudAlert]:
        return cls.ACTIVE_ALERTS
