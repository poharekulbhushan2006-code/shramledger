from typing import Dict, Any, List, Tuple
from .models import SkillCategory, WorkEntry, EvidenceType, EndorsementStatus
from .evidence_engine import EvidenceEngine

# Official / Benchmark Daily Minimum Wage reference rates in INR (2025-2026 standards)
STATE_MINIMUM_WAGE_BENCHMARKS: Dict[str, Dict[SkillCategory, float]] = {
    "Delhi": {
        SkillCategory.UNSKILLED: 673.0,
        SkillCategory.SEMI_SKILLED: 742.0,
        SkillCategory.SKILLED: 816.0,
        SkillCategory.HIGHLY_SKILLED: 920.0
    },
    "Maharashtra": {
        SkillCategory.UNSKILLED: 520.0,
        SkillCategory.SEMI_SKILLED: 580.0,
        SkillCategory.SKILLED: 650.0,
        SkillCategory.HIGHLY_SKILLED: 750.0
    },
    "Karnataka": {
        SkillCategory.UNSKILLED: 510.0,
        SkillCategory.SEMI_SKILLED: 560.0,
        SkillCategory.SKILLED: 630.0,
        SkillCategory.HIGHLY_SKILLED: 730.0
    },
    "Uttar Pradesh": {
        SkillCategory.UNSKILLED: 420.0,
        SkillCategory.SEMI_SKILLED: 470.0,
        SkillCategory.SKILLED: 540.0,
        SkillCategory.HIGHLY_SKILLED: 630.0
    },
    "Bihar": {
        SkillCategory.UNSKILLED: 395.0,
        SkillCategory.SEMI_SKILLED: 430.0,
        SkillCategory.SKILLED: 495.0,
        SkillCategory.HIGHLY_SKILLED: 580.0
    },
    "Tamil Nadu": {
        SkillCategory.UNSKILLED: 480.0,
        SkillCategory.SEMI_SKILLED: 540.0,
        SkillCategory.SKILLED: 620.0,
        SkillCategory.HIGHLY_SKILLED: 710.0
    },
    "West Bengal": {
        SkillCategory.UNSKILLED: 410.0,
        SkillCategory.SEMI_SKILLED: 450.0,
        SkillCategory.SKILLED: 510.0,
        SkillCategory.HIGHLY_SKILLED: 600.0
    },
    "Gujarat": {
        SkillCategory.UNSKILLED: 450.0,
        SkillCategory.SEMI_SKILLED: 490.0,
        SkillCategory.SKILLED: 560.0,
        SkillCategory.HIGHLY_SKILLED: 640.0
    },
    "Default": {
        SkillCategory.UNSKILLED: 450.0,
        SkillCategory.SEMI_SKILLED: 510.0,
        SkillCategory.SKILLED: 580.0,
        SkillCategory.HIGHLY_SKILLED: 680.0
    }
}

class WageValidator:
    @staticmethod
    def get_benchmark(state: str, skill: SkillCategory) -> float:
        for s_key in STATE_MINIMUM_WAGE_BENCHMARKS:
            if s_key.lower() in state.lower():
                return STATE_MINIMUM_WAGE_BENCHMARKS[s_key].get(skill, 550.0)
        return STATE_MINIMUM_WAGE_BENCHMARKS["Default"].get(skill, 550.0)

    @staticmethod
    def validate_entry(entry: WorkEntry, state: str = "Default") -> Tuple[bool, float, List[str], List[str]]:
        """
        Validates work & wage entry against statutory benchmarks and multi-factor heuristics.
        Returns:
            (is_valid, computed_confidence_score, anomalies_flags, positive_signals)
        """
        flags: List[str] = []
        positive_signals: List[str] = []
        
        # Calculate calibrated base confidence using EvidenceEngine
        base_confidence, band, evidence_reasons = EvidenceEngine.evaluate_entry_strength(entry)
        positive_signals.extend(evidence_reasons)
        confidence = base_confidence

        # 1. Hours check
        if entry.hours_worked <= 0:
            flags.append("Invalid hours: Work hours must be greater than zero.")
            confidence -= 30.0
        elif entry.hours_worked > 16:
            flags.append(f"Abnormal hours: {entry.hours_worked} hrs exceeds single-day physical work threshold (>16 hrs).")
            confidence -= 25.0
        elif 6 <= entry.hours_worked <= 10:
            positive_signals.append("Standard working day shift duration (6-10 hrs).")
            confidence += 2.0

        # 2. Hourly rate & benchmark comparison
        benchmark_daily = WageValidator.get_benchmark(state, entry.skill_category)
        
        if entry.amount_paid <= 0:
            flags.append("Zero or negative wage amount recorded.")
            confidence -= 40.0
        elif entry.amount_paid < (benchmark_daily * 0.4):
            flags.append(f"Depressed wage alert: ₹{entry.amount_paid:.0f} is below 40% of state minimum wage benchmark (₹{benchmark_daily:.0f}). Potential underpayment.")
            confidence -= 15.0
        elif entry.amount_paid > (benchmark_daily * 4.0):
            flags.append(f"Wage outlier spike: ₹{entry.amount_paid:.0f} is >4x higher than standard regional benchmark (₹{benchmark_daily:.0f}/day). Requires verification.")
            confidence -= 15.0
        else:
            positive_signals.append(f"Wage matches regional {entry.skill_category.value} benchmark (₹{benchmark_daily:.0f}/day).")
            confidence += 3.0

        # 3. Employer attribution
        if entry.employer_name and len(entry.employer_name.strip()) >= 3:
            if entry.employer_phone and len(entry.employer_phone) >= 10:
                positive_signals.append("Contractor contact number available for verification.")
        else:
            flags.append("Unspecified or anonymous employer.")
            confidence -= 10.0

        final_confidence = min(max(confidence, 10.0), 99.0)
        is_valid = len(flags) == 0 or (len(flags) == 1 and "outlier" in flags[0].lower())

        return is_valid, round(final_confidence, 1), flags, positive_signals
