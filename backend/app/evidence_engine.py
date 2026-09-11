from typing import List, Dict, Any, Tuple
from .models import EvidenceType, EvidenceStrengthBand, EndorsementStatus, WorkEntry, EvidenceBreakdown

class EvidenceEngine:
    """
    Commercial Multi-Tier Evidence Engine.
    Quantifies the mathematical reliability of informal worker income claims
    based on verifiable cryptographic, digital, biometric, and employer signals.
    """

    # Base strength weights by primary evidence channel
    EVIDENCE_WEIGHT_MAP = {
        EvidenceType.UPI_SCREENSHOT: 94.0,
        EvidenceType.BANK_STATEMENT: 96.0,
        EvidenceType.WAGE_SLIP: 88.0,
        EvidenceType.SALARY_RECEIPT: 89.0,
        EvidenceType.EMPLOYER_LETTER: 92.0,
        EvidenceType.ATTENDANCE_SHEET: 84.0,
        EvidenceType.WORK_ORDER: 82.0,
        EvidenceType.CONTRACTOR_CHIT: 78.0,
        EvidenceType.HANDWRITTEN_REGISTER: 76.0,
        EvidenceType.VOICE_NOTE: 68.0,
        EvidenceType.MANUAL_ENTRY: 50.0,
    }

    @classmethod
    def evaluate_entry_strength(
        cls, 
        entry: WorkEntry,
        is_employer_endorsed: bool = False
    ) -> Tuple[float, EvidenceStrengthBand, List[str]]:
        """
        Calculates the calibrated evidence strength score (0-100%) and band for a single work record.
        """
        reasons = []
        base_score = cls.EVIDENCE_WEIGHT_MAP.get(entry.evidence_type, 65.0)

        # 1. Employer verification boost
        if entry.endorsement_status == EndorsementStatus.VERIFIED or is_employer_endorsed:
            base_score = max(base_score, 95.0) + 3.0
            reasons.append("Contractor/Employer directly verified attendance and payout.")
        elif entry.endorsement_status == EndorsementStatus.REJECTED:
            base_score = 15.0
            reasons.append("Claim disputed/rejected by contractor.")
        elif entry.endorsement_status == EndorsementStatus.DISPUTED:
            base_score = 35.0
            reasons.append("Wage or hours currently marked under dispute.")

        # 2. Digital trace boost (UPI / Bank)
        if entry.payment_mode in ["UPI", "Bank Transfer"]:
            base_score += 4.0
            reasons.append(f"Digital settlement trackable via {entry.payment_mode}.")

        # 3. Phone number attribution
        if entry.employer_phone and len(entry.employer_phone) >= 10:
            base_score += 2.0
            reasons.append("Direct contractor mobile number attached.")

        # Cap score
        final_score = min(max(base_score, 10.0), 99.0)

        # Map to band
        if final_score >= 93.0:
            band = EvidenceStrengthBand.VERY_HIGH
        elif final_score >= 85.0:
            band = EvidenceStrengthBand.HIGH
        elif final_score >= 72.0:
            band = EvidenceStrengthBand.MEDIUM
        elif final_score >= 58.0:
            band = EvidenceStrengthBand.LOWER
        else:
            band = EvidenceStrengthBand.LOWEST

        return round(final_score, 1), band, reasons

    @classmethod
    def calculate_overall_breakdown(cls, entries: List[WorkEntry]) -> EvidenceBreakdown:
        """
        Computes composite multi-evidence distribution and overall confidence for underwriting.
        """
        if not entries:
            return EvidenceBreakdown(
                upi_bank_evidence_pct=0.0,
                employer_verified_pct=0.0,
                wage_slips_receipts_pct=0.0,
                voice_declarations_pct=0.0,
                overall_evidence_confidence=50.0,
                strength_band="Emerging"
            )

        total_entries = len(entries)
        upi_count = sum(1 for e in entries if e.payment_mode in ["UPI", "Bank Transfer"] or e.evidence_type in [EvidenceType.UPI_SCREENSHOT, EvidenceType.BANK_STATEMENT])
        employer_verified_count = sum(1 for e in entries if e.endorsement_status == EndorsementStatus.VERIFIED or e.evidence_type == EvidenceType.EMPLOYER_LETTER)
        slips_count = sum(1 for e in entries if e.evidence_type in [EvidenceType.WAGE_SLIP, EvidenceType.SALARY_RECEIPT, EvidenceType.CONTRACTOR_CHIT, EvidenceType.HANDWRITTEN_REGISTER, EvidenceType.ATTENDANCE_SHEET])
        voice_count = sum(1 for e in entries if e.evidence_type == EvidenceType.VOICE_NOTE)

        upi_pct = round((upi_count / total_entries) * 100.0, 1)
        employer_pct = round((employer_verified_count / total_entries) * 100.0, 1)
        slips_pct = round((slips_count / total_entries) * 100.0, 1)
        voice_pct = round((voice_count / total_entries) * 100.0, 1)

        # Weighted aggregate confidence
        entry_scores = []
        for e in entries:
            s, _, _ = cls.evaluate_entry_strength(e)
            entry_scores.append(s)

        overall_conf = round(sum(entry_scores) / total_entries, 1)

        if overall_conf >= 90.0:
            band = "Very High Confidence"
        elif overall_conf >= 80.0:
            band = "High Confidence"
        elif overall_conf >= 68.0:
            band = "Moderate Confidence"
        else:
            band = "Developing Confidence"

        return EvidenceBreakdown(
            upi_bank_evidence_pct=upi_pct,
            employer_verified_pct=employer_pct,
            wage_slips_receipts_pct=slips_pct,
            voice_declarations_pct=voice_pct,
            overall_evidence_confidence=overall_conf,
            strength_band=band
        )
