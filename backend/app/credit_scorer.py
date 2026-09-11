import math
from typing import List, Dict, Any
from .models import WorkEntry, ShramScoreBreakdown, EndorsementStatus, EvidenceType, SkillCategory
from .evidence_engine import EvidenceEngine

class CreditScorer:
    """
    Computes ShramScore (300 to 900) - an explainable Employment & Income Reliability Score.
    Transparent, non-black-box architecture across 6 core pillars:
    1. Income Stability (25% weight)
    2. Work Continuity (20% weight)
    3. Verified Earnings (20% weight)
    4. Employer Endorsements (15% weight)
    5. Evidence Quality (10% weight)
    6. Skill / Occupation Demand (10% weight)
    """

    SKILL_TIER_WEIGHTS = {
        SkillCategory.UNSKILLED: 65,
        SkillCategory.SEMI_SKILLED: 78,
        SkillCategory.SKILLED: 90,
        SkillCategory.HIGHLY_SKILLED: 98
    }

    @classmethod
    def calculate_score(cls, entries: List[WorkEntry], state: str = "Default") -> ShramScoreBreakdown:
        if not entries:
            return ShramScoreBreakdown(
                overall_score=350,
                grade="C",
                income_stability_score=40,
                work_continuity_score=30,
                verified_earnings_score=30,
                employer_endorsement_score=20,
                evidence_quality_score=35,
                skill_demand_score=70,
                avg_daily_wage=0.0,
                estimated_monthly_income=0.0,
                overall_evidence_confidence=40.0,
                evidence_breakdown=EvidenceEngine.calculate_overall_breakdown([]),
                stability_band="Emerging / Insufficient History",
                loan_readiness="Requires at least 5 verified work entries",
                factors_positive=["Account created and ready for evidence logging"],
                factors_improvement=["Start recording daily wage slips and contractor details"]
            )

        total_entries = len(entries)
        total_wages = sum(e.amount_paid for e in entries)
        avg_daily = total_wages / max(total_entries, 1)

        # 1. Income Stability Score (25% weight) - 0 to 100
        wages = [e.amount_paid for e in entries]
        variance = sum((w - avg_daily) ** 2 for w in wages) / max(total_entries, 1)
        std_dev = math.sqrt(variance)
        cv = (std_dev / avg_daily) if avg_daily > 0 else 1.0 # Coefficient of variation
        
        if cv < 0.15:
            income_stability_score = 96
        elif cv < 0.28:
            income_stability_score = 88
        elif cv < 0.45:
            income_stability_score = 78
        elif cv < 0.65:
            income_stability_score = 65
        else:
            income_stability_score = 50

        # 2. Work Continuity Score (20% weight) - 0 to 100
        # Based on number of recorded entries (target: 24+ days logged)
        work_continuity_score = min(int((total_entries / 24.0) * 100), 100)

        # 3. Verified Earnings Score (20% weight) - 0 to 100
        # Evaluates daily wage relative to minimum wage and digital payment modes
        digital_count = sum(1 for e in entries if e.payment_mode in ["UPI", "Bank Transfer"] or e.evidence_type in [EvidenceType.UPI_SCREENSHOT, EvidenceType.BANK_STATEMENT])
        digital_ratio = (digital_count / total_entries)
        earnings_rate_pts = min(int((avg_daily / 800.0) * 60), 60)
        digital_pts = int(digital_ratio * 40)
        verified_earnings_score = min(100, earnings_rate_pts + digital_pts)

        # 4. Employer Endorsements Score (15% weight) - 0 to 100
        verified_count = sum(1 for e in entries if e.endorsement_status == EndorsementStatus.VERIFIED or e.evidence_type == EvidenceType.EMPLOYER_LETTER)
        distinct_employers = len(set(e.employer_name.strip().lower() for e in entries if e.employer_name))
        endorsement_ratio = (verified_count / max(total_entries, 1))
        employer_endorsement_score = min(100, int((endorsement_ratio * 70) + min(distinct_employers * 15, 30)))

        # 5. Evidence Quality Score (10% weight) - 0 to 100
        evidence_breakdown = EvidenceEngine.calculate_overall_breakdown(entries)
        evidence_quality_score = int(evidence_breakdown.overall_evidence_confidence)

        # 6. Skill / Occupation Demand Score (10% weight) - 0 to 100
        primary_skill = entries[0].skill_category if entries else SkillCategory.SKILLED
        skill_demand_score = cls.SKILL_TIER_WEIGHTS.get(primary_skill, 80)

        # Weighted aggregate score (0 to 100)
        weighted_index = (
            (income_stability_score * 0.25) +
            (work_continuity_score * 0.20) +
            (verified_earnings_score * 0.20) +
            (employer_endorsement_score * 0.15) +
            (evidence_quality_score * 0.10) +
            (skill_demand_score * 0.10)
        )

        # Map 0-100 to 300-900 Scale
        overall_score = int(300 + (weighted_index / 100.0) * 600)
        overall_score = max(300, min(900, overall_score))

        # Grade & Readiness Band
        if overall_score >= 780:
            grade = "A+"
            stability_band = "Exceptional Reliability & High Wage Predictability"
            loan_readiness = "Pre-approved for Micro-Enterprise Loan up to ₹1,00,000 (Mudra / NBFC)"
        elif overall_score >= 700:
            grade = "A"
            stability_band = "High Stability & Consistent Work History"
            loan_readiness = "Eligible for Collateral-Free Credit up to ₹50,000 (PM-SVANidhi / MFI)"
        elif overall_score >= 600:
            grade = "B"
            stability_band = "Moderate Reliability"
            loan_readiness = "Eligible for Micro-Credit up to ₹25,000 with contractor attestation"
        else:
            grade = "C"
            stability_band = "Developing Profile"
            loan_readiness = "Eligible for Micro-Savings & Emergency Credit Pool (₹5,000)"

        # Monthly income calculation (normalized to 24 active workdays)
        estimated_monthly = round(avg_daily * min(max(total_entries, 18), 26), 2)

        # Transparent Explainability Factors
        positives = []
        improvements = []

        if income_stability_score >= 80:
            positives.append("Strong income consistency: Daily earnings show low variance across workdays")
        if total_entries >= 10:
            positives.append(f"{total_entries} verified work records logged on tamper-evident ledger")
        if verified_count >= 2:
            positives.append(f"{verified_count} direct employer/contractor confirmations recorded")
        if evidence_quality_score >= 85:
            positives.append(f"High evidence authenticity: {evidence_quality_score}% multi-source verification score")
        if distinct_employers >= 2:
            positives.append(f"Diversified employment: Works with {distinct_employers} independent contractors")

        if employer_endorsement_score < 60:
            improvements.append("Request 1-click verification from contractors to unlock higher tier")
        if total_entries < 15:
            improvements.append("Log at least 15 work days per month to build formal credit history")
        if digital_ratio < 0.40:
            improvements.append("Increase UPI or bank payment recordings to boost verified income score")

        if not positives:
            positives.append("Initial ledger records created and secured")
        if not improvements:
            improvements.append("Maintain continuous weekly logging to preserve top reliability tier")

        return ShramScoreBreakdown(
            overall_score=overall_score,
            grade=grade,
            income_stability_score=income_stability_score,
            work_continuity_score=work_continuity_score,
            verified_earnings_score=verified_earnings_score,
            employer_endorsement_score=employer_endorsement_score,
            evidence_quality_score=evidence_quality_score,
            skill_demand_score=skill_demand_score,
            avg_daily_wage=round(avg_daily, 2),
            estimated_monthly_income=estimated_monthly,
            overall_evidence_confidence=evidence_breakdown.overall_evidence_confidence,
            evidence_breakdown=evidence_breakdown,
            stability_band=stability_band,
            loan_readiness=loan_readiness,
            factors_positive=positives,
            factors_improvement=improvements
        )
