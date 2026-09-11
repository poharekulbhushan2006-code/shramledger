from typing import List, Dict, Any
from .models import WorkerProfile, SchemeRecommendation

SCHEMES_DATABASE: List[Dict[str, Any]] = [
    {
        "id": "pm-svanidhi",
        "name": "PM SVANidhi (Street Vendor Micro-Credit Scheme)",
        "name_hi": "पीएम स्वनिधि (रेहड़ी-पटरी विक्रेता ऋण योजना)",
        "ministry": "Ministry of Housing and Urban Affairs (MoHUA)",
        "category": "Credit",
        "benefit_amount": "₹10,000 to ₹50,000 Collateral-Free working capital loan with 7% interest subsidy",
        "description": "Special micro-credit facility empowering informal vendors, street food sellers, and hawkers to access formal institutional bank credit without any property collateral.",
        "description_hi": "रेहड़ी-पटरी और ठेला लगाने वाले दुकानदारों के लिए बिना किसी गारंटी के ₹10,000 से ₹50,000 तक का सस्ता बैंक ऋण।",
        "applicable_trades": ["रेहड़ी-पटरी / Street Vendor", "दुकानदार", "फल/सब्जी विक्रेता", "vendor", "hawker"],
        "max_income": 30000.0,
        "action_url": "https://pmsvanidhi.mohua.gov.in/",
        "required_documents": ["ShramLedger Verified Work Passport", "Aadhaar Card", "Vendor Certificate / Vending ID", "Bank Passbook"],
        "mandatory_conditions": [
            "Active vending operations in urban/semi-urban territory",
            "Continuous 30-day verified work ledger attendance",
            "Clean non-delinquency credit track on ShramLedger"
        ]
    },
    {
        "id": "bocw-welfare",
        "name": "BOCW Construction Workers Welfare Board",
        "name_hi": "भवन एवं सन्निर्माण कर्मकार कल्याण बोर्ड (BOCW)",
        "ministry": "Ministry of Labour & Employment / State Labour Boards",
        "category": "Social Security",
        "benefit_amount": "₹5,000 Tool Grant + ₹51,000 Daughter Marriage Aid + ₹2 Lakh Accidental Cover",
        "description": "State statutory welfare boards for masons, carpenters, painters, plumbers, and construction helpers providing modern toolkits, education scholarships, and welfare aid.",
        "description_hi": "भवन निर्माण, राजमिस्त्री, बढ़ई, पेंटर, प्लंबर और निर्माण मजदूरों के लिए औजार किट, बच्चों की पढ़ाई और शादी हेतु वित्तीय सहायता।",
        "applicable_trades": ["राजमिस्त्री / Mason", "बढ़ई / Carpenter", "पेंटर / Painter", "प्लंबर / Plumber", "इलेक्ट्रीशियन / Electrician", "हेल्पर / Construction Helper"],
        "max_income": 35000.0,
        "action_url": "https://eshram.gov.in/",
        "required_documents": ["ShramLedger 90-Day Verified Work Proof", "Aadhaar Card", "Bank Account Details", "Passport Photo"],
        "mandatory_conditions": [
            "Minimum 90 days of construction work completed in the preceding 12 months",
            "Age between 18 and 60 years",
            "Employer or Contractor work confirmation on ledger"
        ]
    },
    {
        "id": "pm-vishwakarma",
        "name": "PM Vishwakarma Scheme for Traditional Artisans",
        "name_hi": "पीएम विश्वकर्मा योजना (कारीगर एवं शिल्पकार कल्याण)",
        "ministry": "Ministry of Micro, Small and Medium Enterprises (MSME)",
        "category": "Credit",
        "benefit_amount": "₹15,000 Modern Tool Grant + ₹3,00,000 Concessional Loan @ 5% interest",
        "description": "Comprehensive institutional support, advanced skill verification, modern digital tools, and collateral-free low-interest credit for 18 traditional artisan trades.",
        "description_hi": "पारंपरिक कारीगरों (बढ़ई, राजमिस्त्री, दर्जी, लोहार) को ₹15,000 का टूलकिट और 5% रियायती ब्याज पर ₹3 लाख तक का आसान ऋण।",
        "applicable_trades": ["बढ़ई / Carpenter", "राजमिस्त्री / Mason", "दर्जी / Tailor", "मूर्तिकार", "कारीगर", "artisan"],
        "max_income": 40000.0,
        "action_url": "https://pmvishwakarma.gov.in/",
        "required_documents": ["ShramLedger Trade Credential", "Aadhaar Card", "Ration Card", "Mobile Linked Bank Account"],
        "mandatory_conditions": [
            "Practicing one of the 18 traditional family-based crafts",
            "Not having availed prior PMEGP or Mudra loans for identical trade",
            "Verified trade output and wage receipts logged"
        ]
    },
    {
        "id": "pm-sym-pension",
        "name": "PM Shram Yogi Maan-dhan (PM-SYM Pension)",
        "name_hi": "प्रधानमंत्री श्रम योगी मानधन योजना (मासिक पेंशन)",
        "ministry": "Ministry of Labour & Employment",
        "category": "Pension",
        "benefit_amount": "Guaranteed ₹3,000/month lifelong pension after 60 years of age",
        "description": "Voluntary and contributory pension scheme for unorganised workers with 50:50 matching contribution by the Central Government.",
        "description_hi": "असंगठित क्षेत्र के कामगारों के लिए 60 वर्ष की आयु के बाद ₹3,000 प्रतिमाह की सुनिश्चित वृद्धावस्था पेंशन।",
        "applicable_trades": ["all"],
        "max_income": 15000.0,
        "action_url": "https://maandhan.in/",
        "required_documents": ["ShramLedger Income Certificate (< ₹15k/mo)", "Aadhaar Card", "Savings Bank Account / Jan Dhan"],
        "mandatory_conditions": [
            "Monthly income below ₹15,000 threshold",
            "Age between 18 and 40 years at entry",
            "Not a member of EPFO, ESIC or NPS"
        ]
    },
    {
        "id": "ayushman-bharat-pmjay",
        "name": "Ayushman Bharat PM-JAY (Free Health Cover)",
        "name_hi": "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
        "ministry": "National Health Authority (NHA)",
        "category": "Health",
        "benefit_amount": "₹5,00,000 / year cashless hospital treatment per family",
        "description": "World's largest government-funded healthcare assurance scheme offering secondary and tertiary hospitalization care across empaneled hospitals nationwide.",
        "description_hi": "गरीब और असंगठित परिवारों को देश भर के अस्पतालों में ₹5 लाख तक का मुफ्त व कैशलेस इलाज।",
        "applicable_trades": ["all"],
        "max_income": 25000.0,
        "action_url": "https://pmjay.gov.in/",
        "required_documents": ["Ration Card", "Aadhaar Card", "ShramLedger Household Ledger"],
        "mandatory_conditions": [
            "Identified in SECC deprivation criteria or state beneficiary list",
            "Active mobile linked Aadhaar verification"
        ]
    },
    {
        "id": "pm-mudra-shishu",
        "name": "Pradhan Mantri Mudra Yojana (PMMY) - Shishu",
        "name_hi": "प्रधानमंत्री मुद्रा योजना (शिशु ऋण)",
        "ministry": "Department of Financial Services, Ministry of Finance",
        "category": "Credit",
        "benefit_amount": "Up to ₹50,000 collateral-free micro-enterprise loan",
        "description": "Zero-collateral bank loans tailored for informal entrepreneurs, mobile repairs, domestic service providers, and craftsmen looking to expand independent operations.",
        "description_hi": "छोटे व्यवसाय, दुकान, मरम्मत केंद्र या स्वरोजगार शुरू करने के लिए ₹50,000 तक का बिना गारंटी मुद्रा बैंक लोन।",
        "applicable_trades": ["all"],
        "max_income": 50000.0,
        "action_url": "https://www.mudra.org.in/",
        "required_documents": ["ShramLedger ShramScore Card (Grade A/B)", "Aadhaar & PAN", "Bank Statement / Verified Ledger Proof"],
        "mandatory_conditions": [
            "Valid micro-enterprise proposal or independent service profile",
            "ShramScore reliability grade of B or above",
            "No prior willful default in banking system"
        ]
    }
]

class SchemeRecommender:
    @classmethod
    def get_recommendations(cls, profile: WorkerProfile, monthly_income: float, shram_score: int) -> List[SchemeRecommendation]:
        recommendations = []
        user_trade_lower = profile.primary_trade.lower()

        for s in SCHEMES_DATABASE:
            match_score = 70
            conditions_met = []
            pending_conditions = []

            # 1. Trade matching
            applies_to_trade = False
            if "all" in s["applicable_trades"]:
                applies_to_trade = True
                match_score += 10
                conditions_met.append(f"Trade qualification verified ({profile.primary_trade})")
            else:
                for t in s["applicable_trades"]:
                    if t.lower() in user_trade_lower or user_trade_lower in t.lower():
                        applies_to_trade = True
                        match_score += 25
                        conditions_met.append(f"Matches scheme target occupational category: {t}")
                        break
            
            # 2. Income threshold check
            if monthly_income <= s["max_income"]:
                match_score += 15
                conditions_met.append(f"Income criterion satisfied: Estimated ₹{monthly_income:,.0f}/mo is within ₹{s['max_income']:,.0f} limit")
            else:
                match_score -= 20
                pending_conditions.append(f"Income ceiling verification: Claimed ₹{monthly_income:,.0f}/mo exceeds standard ₹{s['max_income']:,.0f} ceiling")

            # 3. Work history / ShramScore check
            if shram_score >= 680:
                match_score += 10
                conditions_met.append(f"High Reliability ShramScore ({shram_score}) accelerates institutional processing")
            else:
                pending_conditions.append("Requires additional verified ledger entries to reach Grade A fast-track eligibility")

            # Add mandatory conditions to list
            for cond in s.get("mandatory_conditions", []):
                if "90 days" in cond and len(profile.work_entries) < 15:
                    pending_conditions.append(cond)
                else:
                    conditions_met.append(cond)

            match_score = max(40, min(99, match_score))

            if applies_to_trade:
                recommendations.append(SchemeRecommendation(
                    id=s["id"],
                    name=s["name"],
                    name_hi=s["name_hi"],
                    ministry=s["ministry"],
                    category=s["category"],
                    benefit_amount=s["benefit_amount"],
                    description=s["description"],
                    description_hi=s["description_hi"],
                    eligibility_status="Potentially eligible — verify these conditions",
                    conditions_met=conditions_met,
                    pending_conditions=pending_conditions,
                    eligibility_match=(match_score >= 70),
                    match_score=match_score,
                    action_url=s["action_url"],
                    required_documents=s["required_documents"],
                    differentiation_note="ShramLedger provides the verifiable employment/income evidence layer that complements official platforms like e-Shram."
                ))

        recommendations.sort(key=lambda x: x.match_score, reverse=True)
        return recommendations
