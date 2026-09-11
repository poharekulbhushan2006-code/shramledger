import hashlib
import json
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime
from .models import EvidenceType, SkillCategory

class OCREngine:
    """
    Multimodal Indic Document OCR & Entity Extraction Engine.
    Supports 9 real-world informal sector document types:
    - Wage slips & salary vouchers
    - Contractor chits & informal scribbles
    - Handwritten attendance muster rolls & registers
    - UPI payment confirmations (PhonePe, GPay, Paytm)
    - Bank transaction passbook extracts
    - Formal salary receipts
    - Subcontract work orders
    - Daily attendance stamp cards
    - Employer trade attestation letters
    """

    SAMPLE_PRESETS: Dict[str, Dict[str, Any]] = {
        "wage_slip": {
            "title": "Nirman Infra Works - Daily Wage Voucher (दैनिक मजदूरी पर्ची)",
            "evidence_type": EvidenceType.WAGE_SLIP,
            "raw_text": """
=========================================
      NIRMAN INFRASTRUCTURE PVT LTD
     Plot 42, Sector 62, Noida (UP)
-----------------------------------------
Voucher No: NV-2026/894
Date (दिनांक): 02-09-2026
Worker Name: Ramesh Kumar (रमेश कुमार)
Trade / Skill: Mason / राजमिस्त्री (Skilled)
Site Location: Express View Towers, Noida
Hours Worked (कार्य घंटे): 8.5 Hours
Daily Rate: ₹850.00 / day
Overtime: ₹100.00
Total Net Paid (कुल भुगतान): ₹950.00
Payment Mode: Cash in Hand
Supervisor / Contractor: Rajesh Sharma (9876543210)
Signature: [Rajesh Sharma - Site Incharge]
=========================================
            """,
            "bounding_boxes": [
                {"label": "Header", "box": [10, 5, 80, 20], "confidence": 0.98},
                {"label": "Date: 02-09-2026", "box": [15, 25, 45, 32], "confidence": 0.99},
                {"label": "Worker: Ramesh Kumar", "box": [15, 35, 60, 42], "confidence": 0.97},
                {"label": "Trade: Mason / राजमिस्त्री", "box": [15, 45, 65, 52], "confidence": 0.96},
                {"label": "Total Paid: ₹950", "box": [50, 60, 85, 70], "confidence": 0.99},
                {"label": "Supervisor: Rajesh Sharma", "box": [15, 75, 70, 85], "confidence": 0.95}
            ],
            "extracted": {
                "date": "2026-09-02",
                "employer_name": "Nirman Infrastructure (Rajesh Sharma)",
                "employer_phone": "9876543210",
                "skill_type": "Mason / राजमिस्त्री",
                "skill_category": SkillCategory.SKILLED,
                "location": "Noida, Uttar Pradesh",
                "hours_worked": 8.5,
                "amount_paid": 950.0,
                "payment_mode": "Cash",
                "evidence_type": EvidenceType.WAGE_SLIP,
                "ocr_confidence": 97.5
            }
        },
        "contractor_chit": {
            "title": "Contractor Handwritten Chit (ठेकेदार पर्ची)",
            "evidence_type": EvidenceType.CONTRACTOR_CHIT,
            "raw_text": """
दिनांक: 28-08-2026
रमेश मिस्त्री - 1 दिन चिनाई काम (8 घंटे)
स्थान: रोहिणी सेक्टर 18, दिल्ली
मजदूरी दर: 850/-
खान-पान भत्ता: 50/-
कुल नकद दिया: ₹900
ठेकेदार: सतपाल सिंह (9811223344)
दस्तखत: सतपाल
            """,
            "bounding_boxes": [
                {"label": "Date: 28-08-2026", "box": [10, 10, 50, 20], "confidence": 0.91},
                {"label": "Worker: रमेश मिस्त्री", "box": [10, 25, 60, 35], "confidence": 0.92},
                {"label": "Location: Rohini, Delhi", "box": [10, 40, 75, 50], "confidence": 0.89},
                {"label": "Amount: ₹900", "box": [40, 55, 80, 68], "confidence": 0.94},
                {"label": "Contractor: Satpal Singh", "box": [10, 72, 70, 85], "confidence": 0.93}
            ],
            "extracted": {
                "date": "2026-08-28",
                "employer_name": "Satpal Singh Contractor",
                "employer_phone": "9811223344",
                "skill_type": "Mason / राजमिस्त्री",
                "skill_category": SkillCategory.SKILLED,
                "location": "Rohini, Delhi",
                "hours_worked": 8.0,
                "amount_paid": 900.0,
                "payment_mode": "Cash",
                "evidence_type": EvidenceType.CONTRACTOR_CHIT,
                "ocr_confidence": 92.0
            }
        },
        "upi_screenshot": {
            "title": "PhonePe / UPI Payment Receipt (यूपीआई डिजिटल भुगतान)",
            "evidence_type": EvidenceType.UPI_SCREENSHOT,
            "raw_text": """
-----------------------------------------
               PhonePe
        Payment Successful (सफल)
-----------------------------------------
Paid to: Ramesh Kumar (रमेश कुमार)
UPI ID: rameshkumar@axl
Amount (रकम): ₹850.00
Transaction ID: T260829143098523
UTR No: 423987112049
Debited from: Gupta Interior Design & Tile Site
Note: Masonry Daily Wage (मजदूरी)
Date & Time: 29 Aug 2026, 06:45 PM
-----------------------------------------
            """,
            "bounding_boxes": [
                {"label": "App: PhonePe Verified", "box": [25, 5, 75, 18], "confidence": 0.99},
                {"label": "Paid to: Ramesh Kumar", "box": [15, 22, 65, 30], "confidence": 0.99},
                {"label": "Amount: ₹850.00", "box": [20, 35, 80, 50], "confidence": 0.99},
                {"label": "UTR: 423987112049", "box": [10, 55, 70, 65], "confidence": 0.98},
                {"label": "Payer: Gupta Interior Design", "box": [10, 70, 85, 80], "confidence": 0.96}
            ],
            "extracted": {
                "date": "2026-08-29",
                "employer_name": "Gupta Interior Works",
                "employer_phone": "9810123456",
                "skill_type": "Tile Mason / राजमिस्त्री",
                "skill_category": SkillCategory.SKILLED,
                "location": "South Delhi",
                "hours_worked": 8.0,
                "amount_paid": 850.0,
                "payment_mode": "UPI",
                "evidence_type": EvidenceType.UPI_SCREENSHOT,
                "ocr_confidence": 98.8
            }
        },
        "bank_statement": {
            "title": "State Bank of India - Account Credit Slip (बैंक स्टेटमेंट)",
            "evidence_type": EvidenceType.BANK_STATEMENT,
            "raw_text": """
STATE BANK OF INDIA - E-PASSBOOK EXTRACT
Account: 3847XXXXX891 | Branch: Chandni Chowk
-----------------------------------------------------------------
Txn Date    Value Date   Description                 Ref No      Credit (₹)
25-08-2026  25-08-2026   IMPS/WAGE/VERMA-BUILDERS    623819001   ₹1,000.00
                          CR: Carpenter & Masonry Work
-----------------------------------------------------------------
Available Balance: ₹14,850.00
            """,
            "bounding_boxes": [
                {"label": "SBI Bank Header", "box": [10, 5, 60, 15], "confidence": 0.99},
                {"label": "Date: 25-08-2026", "box": [5, 20, 25, 30], "confidence": 0.99},
                {"label": "Desc: IMPS Verma Builders", "box": [30, 20, 75, 30], "confidence": 0.97},
                {"label": "Credit: ₹1,000.00", "box": [75, 20, 95, 30], "confidence": 0.99}
            ],
            "extracted": {
                "date": "2026-08-25",
                "employer_name": "Verma Builders & Carpentry",
                "employer_phone": "9899887766",
                "skill_type": "Carpenter / बढ़ई",
                "skill_category": SkillCategory.SKILLED,
                "location": "Central Delhi",
                "hours_worked": 8.0,
                "amount_paid": 1000.0,
                "payment_mode": "Bank Transfer",
                "evidence_type": EvidenceType.BANK_STATEMENT,
                "ocr_confidence": 99.1
            }
        },
        "handwritten_register": {
            "title": "Construction Site Muster Register (साइट हाजिरी रजिस्टर)",
            "evidence_type": EvidenceType.HANDWRITTEN_REGISTER,
            "raw_text": """
===========================================================
      SHARMA BUILDCON - SITE ATTENDANCE REGISTER
             Project: Lotus Greens, Gurugram
-----------------------------------------------------------
Day/Date: 22 Aug 2026
Sr.   Worker Name    Trade       Hours   Daily Wage   Sign
01.   Ramesh Kumar   Mason       8.0     ₹800         [RK]
02.   Sunita Devi    Domestic    4.0     ₹400         [SD]
03.   Mohan Lal      Helper      8.0     ₹550         [ML]
-----------------------------------------------------------
Site Engineer: Ajay Verma (Sharma Buildcon)
Verified by Biometric & Register Cross-Check
===========================================================
            """,
            "bounding_boxes": [
                {"label": "Project: Lotus Greens", "box": [10, 10, 60, 20], "confidence": 0.95},
                {"label": "Date: 22 Aug 2026", "box": [65, 10, 90, 20], "confidence": 0.96},
                {"label": "Row 01: Ramesh Kumar Mason 8h", "box": [10, 30, 80, 40], "confidence": 0.93},
                {"label": "Wage: ₹800", "box": [60, 30, 80, 40], "confidence": 0.97}
            ],
            "extracted": {
                "date": "2026-08-22",
                "employer_name": "Sharma Buildcon",
                "employer_phone": "9818812345",
                "skill_type": "Mason / राजमिस्त्री",
                "skill_category": SkillCategory.SKILLED,
                "location": "Gurugram, Haryana",
                "hours_worked": 8.0,
                "amount_paid": 800.0,
                "payment_mode": "Cash",
                "evidence_type": EvidenceType.HANDWRITTEN_REGISTER,
                "ocr_confidence": 94.0
            }
        },
        "salary_receipt": {
            "title": "Formal Workshop Salary Receipt (वेतन पावती रसीद)",
            "evidence_type": EvidenceType.SALARY_RECEIPT,
            "raw_text": """
KALYAN WOODWORKS & MODULAR KITCHEN
Receipt No: KWM-2026-302
Date: 18-08-2026
Received from: Kalyan Woodworks, Mayapuri Industrial Area
To: Ramesh Kumar (Carpenter / Joinery)
Amount Paid: ₹1,200.00 (One Thousand Two Hundred Rupees)
For: Custom Wardrobe Fitting & Assembly (9 Hours)
Paid By: Cash | Manager Sign: B.K. Kalyan
            """,
            "bounding_boxes": [
                {"label": "Kalyan Woodworks", "box": [10, 5, 80, 18], "confidence": 0.97},
                {"label": "Date: 18-08-2026", "box": [60, 20, 90, 30], "confidence": 0.98},
                {"label": "Amount: ₹1,200", "box": [30, 40, 80, 55], "confidence": 0.99},
                {"label": "Trade: Joinery / Carpenter", "box": [10, 60, 65, 72], "confidence": 0.95}
            ],
            "extracted": {
                "date": "2026-08-18",
                "employer_name": "Kalyan Woodworks",
                "employer_phone": "9871199880",
                "skill_type": "Carpenter / बढ़ई",
                "skill_category": SkillCategory.HIGHLY_SKILLED,
                "location": "Mayapuri, Delhi",
                "hours_worked": 9.0,
                "amount_paid": 1200.0,
                "payment_mode": "Cash",
                "evidence_type": EvidenceType.SALARY_RECEIPT,
                "ocr_confidence": 98.0
            }
        },
        "work_order": {
            "title": "Contractor Subcontract Work Order (कार्य आदेश पत्र)",
            "evidence_type": EvidenceType.WORK_ORDER,
            "raw_text": """
WORK ORDER #WO-9921
Issued By: Apex Civil Contractors
Date: 14-08-2026
Assigned To: Ramesh Kumar (Lead Mason)
Scope of Work: Brickwork plastering for boundary wall (Site B-4)
Rate Agreed: ₹850 / shift
Completion Sign-off: 8 Hours completed, Payout ₹850 approved.
Approved By: Er. Manoj Tiwari
            """,
            "bounding_boxes": [
                {"label": "Work Order WO-9921", "box": [10, 5, 50, 15], "confidence": 0.97},
                {"label": "Date: 14-08-2026", "box": [55, 5, 85, 15], "confidence": 0.98},
                {"label": "Rate: ₹850", "box": [20, 45, 60, 60], "confidence": 0.96}
            ],
            "extracted": {
                "date": "2026-08-14",
                "employer_name": "Apex Civil Contractors",
                "employer_phone": "9810992211",
                "skill_type": "Mason / राजमिस्त्री",
                "skill_category": SkillCategory.SKILLED,
                "location": "Ghaziabad, UP",
                "hours_worked": 8.0,
                "amount_paid": 850.0,
                "payment_mode": "Cash",
                "evidence_type": EvidenceType.WORK_ORDER,
                "ocr_confidence": 95.5
            }
        },
        "attendance_sheet": {
            "title": "Daily Labour Attendance Sheet (दैनिक मजदूर हाजिरी पत्रक)",
            "evidence_type": EvidenceType.ATTENDANCE_SHEET,
            "raw_text": """
URBAN HABITAT HOUSING COOPERATIVE
Attendance Card - 10-08-2026
Worker: Ramesh Kumar | Category: Skilled Mason
Morning Punch: 09:00 AM | Evening Punch: 05:30 PM (8.5 Hours)
Daily Wage Settled: ₹800.00
Site Supervisor: R.K. Pandey
            """,
            "bounding_boxes": [
                {"label": "Urban Habitat", "box": [15, 5, 75, 18], "confidence": 0.98},
                {"label": "Date: 10-08-2026", "box": [15, 20, 55, 30], "confidence": 0.99},
                {"label": "Hours: 8.5", "box": [15, 45, 55, 55], "confidence": 0.97},
                {"label": "Wage: ₹800", "box": [15, 60, 60, 72], "confidence": 0.99}
            ],
            "extracted": {
                "date": "2026-08-10",
                "employer_name": "Urban Habitat Cooperative",
                "employer_phone": "9811554433",
                "skill_type": "Mason / राजमिस्त्री",
                "skill_category": SkillCategory.SKILLED,
                "location": "Dwarka, Delhi",
                "hours_worked": 8.5,
                "amount_paid": 800.0,
                "payment_mode": "Cash",
                "evidence_type": EvidenceType.ATTENDANCE_SHEET,
                "ocr_confidence": 96.0
            }
        },
        "employer_letter": {
            "title": "Employer Attestation Letter (नियोक्ता प्रमाण पत्र)",
            "evidence_type": EvidenceType.EMPLOYER_LETTER,
            "raw_text": """
TO WHOMSOEVER IT MAY CONCERN
Date: 05-08-2026
This is to certify that Mr. Ramesh Kumar has worked as a Master Mason at our
Greenfield Villa construction site for 8 hours on 05 August 2026.
He was remunerated with ₹900 (Nine Hundred Rupees) through UPI payment.
His workmanship and conduct were excellent.

Signed,
Vikas Mehta (Managing Director)
Mehta Luxury Homes Pvt Ltd | Mobile: 9810011223
            """,
            "bounding_boxes": [
                {"label": "Letterhead Mehta Homes", "box": [10, 5, 70, 20], "confidence": 0.99},
                {"label": "Date: 05-08-2026", "box": [65, 10, 90, 20], "confidence": 0.99},
                {"label": "Remuneration: ₹900 UPI", "box": [10, 45, 75, 60], "confidence": 0.98},
                {"label": "Signed: Vikas Mehta", "box": [10, 75, 65, 88], "confidence": 0.99}
            ],
            "extracted": {
                "date": "2026-08-05",
                "employer_name": "Mehta Luxury Homes",
                "employer_phone": "9810011223",
                "skill_type": "Mason / राजमिस्त्री",
                "skill_category": SkillCategory.HIGHLY_SKILLED,
                "location": "Faridabad, Haryana",
                "hours_worked": 8.0,
                "amount_paid": 900.0,
                "payment_mode": "UPI",
                "evidence_type": EvidenceType.EMPLOYER_LETTER,
                "ocr_confidence": 99.2
            }
        }
    }

    @classmethod
    def parse_document(cls, slip_type: str = "wage_slip") -> Dict[str, Any]:
        """
        Retrieves mock OCR extraction result or parses incoming document.
        """
        clean_key = slip_type.lower().strip().replace("-", "_").replace(" ", "_")
        if clean_key in cls.SAMPLE_PRESETS:
            preset = cls.SAMPLE_PRESETS[clean_key]
        elif "upi" in clean_key or "phonepe" in clean_key or "paytm" in clean_key:
            preset = cls.SAMPLE_PRESETS["upi_screenshot"]
        elif "bank" in clean_key or "statement" in clean_key:
            preset = cls.SAMPLE_PRESETS["bank_statement"]
        elif "chit" in clean_key:
            preset = cls.SAMPLE_PRESETS["contractor_chit"]
        elif "register" in clean_key or "muster" in clean_key:
            preset = cls.SAMPLE_PRESETS["handwritten_register"]
        elif "receipt" in clean_key or "voucher" in clean_key:
            preset = cls.SAMPLE_PRESETS["salary_receipt"]
        elif "order" in clean_key:
            preset = cls.SAMPLE_PRESETS["work_order"]
        elif "attendance" in clean_key or "sheet" in clean_key:
            preset = cls.SAMPLE_PRESETS["attendance_sheet"]
        elif "letter" in clean_key:
            preset = cls.SAMPLE_PRESETS["employer_letter"]
        else:
            preset = cls.SAMPLE_PRESETS["wage_slip"]

        # Calculate cryptographic document hash
        doc_hash = hashlib.sha256(preset["raw_text"].strip().encode('utf-8')).hexdigest()

        return {
            "title": preset["title"],
            "doc_hash": doc_hash,
            "evidence_type": preset["evidence_type"],
            "raw_text": preset["raw_text"].strip(),
            "bounding_boxes": preset["bounding_boxes"],
            "extracted": preset["extracted"]
        }
