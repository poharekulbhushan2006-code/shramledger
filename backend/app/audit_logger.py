import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from .models import AuditLogEntryDTO
from .db_models import AuditLog as AuditLogDB

class AuditLogger:
    """
    Production-grade enterprise audit logging service.
    Maintains an immutable chronicle of all state transitions, verifications,
    data queries, DPDP consent grants, and underwriting requests.
    """

    IN_MEMORY_LOGS: List[AuditLogEntryDTO] = []

    @classmethod
    def log(
        cls,
        actor_id: str,
        actor_role: str,
        action: str,
        resource_type: str,
        resource_id: str,
        details: Optional[Dict[str, Any]] = None,
        before_state: Optional[Dict[str, Any]] = None,
        after_state: Optional[Dict[str, Any]] = None,
        ledger_hash: Optional[str] = None,
        ip_address: str = "127.0.0.1",
        db: Optional[Session] = None
    ) -> AuditLogEntryDTO:
        now_utc = datetime.now(timezone.utc)
        log_id = f"AUD-{now_utc.strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        ts_str = now_utc.strftime("%d %b %Y, %H:%M:%S UTC")

        entry_dto = AuditLogEntryDTO(
            id=log_id,
            timestamp=ts_str,
            actor_id=actor_id,
            actor_role=actor_role,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details or {},
            ledger_hash=ledger_hash
        )

        cls.IN_MEMORY_LOGS.insert(0, entry_dto)

        if db:
            try:
                db_log = AuditLogDB(
                    id=log_id,
                    actor_id=actor_id,
                    actor_role=actor_role,
                    action=action,
                    resource_type=resource_type,
                    resource_id=resource_id,
                    before_state_json=before_state,
                    after_state_json=after_state,
                    ip_address=ip_address,
                    ledger_hash=ledger_hash
                )
                db.add(db_log)
                db.commit()
            except Exception as e:
                db.rollback()
                print(f"[AuditLogger Error] Could not save to DB: {e}")

        return entry_dto

    @classmethod
    def log_event(cls, *args, **kwargs) -> AuditLogEntryDTO:
        return cls.log(*args, **kwargs)

    @classmethod
    def get_recent_logs(cls, limit: int = 50) -> List[AuditLogEntryDTO]:
        return cls.IN_MEMORY_LOGS[:limit]
