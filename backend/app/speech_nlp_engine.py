import re
from datetime import date, timedelta, datetime
from typing import Dict, Any, Optional, Tuple
from .models import SkillCategory, EvidenceType

class IndicSpeechNLPEngine:
    """
    NLP & Named Entity Extraction engine tailored for informal worker utterances
    in Hindi, Hinglish, and English.
    """

    TRADE_KEYWORDS = {
        "राजमिस्त्री / Mason": ["राजमिस्त्री", "मिस्त्री", "mason", "bricklayer", "cement", "चिनाई"],
        "बढ़ई / Carpenter": ["बढ़ई", "carpenter", "लकड़ी", "furniture", "woodwork"],
        "घरेलू सहायिका / Domestic Help": ["घरेलू", "झाड़ू", "पोछा", "बर्तन", "maid", "housekeeper", "cleaning", "cook", "खाना"],
        "पेंटर / Painter": ["पेंटर", "रंगाई", "पुट्टी", "painter", "painting", "whitewash"],
        "प्लंबर / Plumber": ["प्लंबर", "नल", "पाइप", "plumber", "sanitary"],
        "इलेक्ट्रीशियन / Electrician": ["बिजली", "वायरिंग", "इलेक्ट्रीशियन", "electrician", "wiring"],
        "ड्राइवर / Driver": ["ड्राइवर", "गाड़ी", "ऑटो", "रिक्शा", "driver", "cab", "delivery"],
        "रेहड़ी-पटरी / Street Vendor": ["ठेला", "रेहड़ी", "दुकान", "सब्जी", "vendor", "stall", "cart", "फल"],
        "हेल्पर / Construction Helper": ["हेल्पर", "मजदूर", "लेबर", "helper", "labor", "unskilled", "सामान उठाना"],
        "दर्जी / Tailor": ["दर्जी", "सिलाई", "कपड़ा", "tailor", "stitching"]
    }

    SKILL_CATEGORY_MAP = {
        "हेल्पर / Construction Helper": SkillCategory.UNSKILLED,
        "घरेलू सहायिका / Domestic Help": SkillCategory.SEMI_SKILLED,
        "रेहड़ी-पटरी / Street Vendor": SkillCategory.SEMI_SKILLED,
        "पेंटर / Painter": SkillCategory.SEMI_SKILLED,
        "राजमिस्त्री / Mason": SkillCategory.SKILLED,
        "बढ़ई / Carpenter": SkillCategory.SKILLED,
        "प्लंबर / Plumber": SkillCategory.SKILLED,
        "इलेक्ट्रीशियन / Electrician": SkillCategory.SKILLED,
        "ड्राइवर / Driver": SkillCategory.SKILLED,
        "दर्जी / Tailor": SkillCategory.SKILLED,
    }

    NUMBER_WORDS_HI = {
        "सौ": 100, "दो सौ": 200, "तीन सौ": 300, "चार सौ": 400, "पाँच सौ": 500, "पांच सौ": 500,
        "छह सौ": 600, "सात सौ": 700, "साढ़े सात सौ": 750, "आठ सौ": 800, "नौ सौ": 900, "हज़ार": 1000,
        "एक हज़ार": 1000, "डेढ़ हज़ार": 1500, "दो हज़ार": 2000, "ढाई सौ": 250, "साढ़े तीन सौ": 350
    }

    STOPWORDS_HI = {"आज", "कल", "परसों", "मैंने", "किया", "गया", "काम", "था", "पर", "में", "से", "को", "का", "की", "के", "aaj", "kal", "kaam", "kiya", "worked", "at"}

    @classmethod
    def parse_transcript(cls, text: str, default_location: str = "Delhi NCR") -> Dict[str, Any]:
        """
        Parses informal Hindi / Hinglish / English voice transcript into structured work entry fields.
        """
        cleaned = text.strip()
        lower = cleaned.lower()

        # 1. Amount Extraction
        amount = 600.0 # fallback default
        amount_patterns = [
            r'(?:₹|rs\.?|inr|रुपये|रुपए|रुपिया)\s*([0-9,]+)',
            r'([0-9,]+)\s*(?:₹|rs\.?|inr|रुपये|रुपए|रुपिया|rupees|rupaye)',
            r'paid\s*([0-9,]+)',
            r'मिला\s*([0-9,]+)',
            r'([0-9]{3,5})\s*(?:ka|ko|paid|diye|mila|रुपये|रुपए)'
        ]
        
        found_amount = None
        for pat in amount_patterns:
            match = re.search(pat, lower)
            if match:
                val_str = match.group(1).replace(",", "")
                try:
                    found_amount = float(val_str)
                    break
                except ValueError:
                    pass
        
        if not found_amount:
            # Check Hindi number words
            for word, val in cls.NUMBER_WORDS_HI.items():
                if word in cleaned:
                    found_amount = float(val)
                    break
        
        if found_amount:
            amount = found_amount

        # 2. Hours Extraction
        hours = 8.0
        hour_match = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*(?:ghante|ghanta|hours?|hrs?|घंटे|घंटा)', lower)
        if hour_match:
            try:
                hours = float(hour_match.group(1))
            except ValueError:
                pass
        elif "आधा दिन" in cleaned or "half day" in lower:
            hours = 4.0
        elif "पूरा दिन" in cleaned or "full day" in lower:
            hours = 8.0

        # 3. Date Extraction
        today_dt = date.today()
        entry_date = today_dt.isoformat()
        if "कल" in cleaned or "yesterday" in lower or "kal" in lower:
            entry_date = (today_dt - timedelta(days=1)).isoformat()
        elif "परसों" in cleaned or "day before yesterday" in lower or "parson" in lower:
            entry_date = (today_dt - timedelta(days=2)).isoformat()

        # 4. Trade / Skill Extraction
        detected_trade = "राजमिस्त्री / Mason"
        for trade, keywords in cls.TRADE_KEYWORDS.items():
            if any(kw in lower or kw in cleaned for kw in keywords):
                detected_trade = trade
                break

        # 5. Employer / Contractor Extraction
        employer = "Ramesh Contractor / रमेश ठेकेदार"
        contractor_patterns = [
            r'([A-Za-z\u0900-\u097F]+)\s*(?:thekedar|thekedaar|contractor|builder|ji|bhaiya|sahab|seth|ठेकेदार|जी|साहब|मालिक)',
            r'(?:contractor|thekedar|thekedaar|ठेकेदार)\s+([A-Za-z\u0900-\u097F]+)',
            r'at\s+([A-Za-z\u0900-\u097F]+(?:\s+builders|\s+construction|\s+site)?)',
            r'([A-Za-z\u0900-\u097F]+)\s*(?:ke paas|ke yahan|के पास|के यहाँ)'
        ]
        for pat in contractor_patterns:
            c_match = re.search(pat, cleaned, re.IGNORECASE)
            if c_match:
                candidate = c_match.group(1).strip()
                # Remove stop words
                words = [w for w in candidate.split() if w.lower() not in cls.STOPWORDS_HI]
                if words:
                    cand_clean = " ".join(words)
                    if len(cand_clean) >= 2:
                        employer = f"{cand_clean} (Contractor / ठेकेदार)"
                        break

        # 6. Payment Mode
        payment_mode = "Cash"
        if any(w in lower for w in ["upi", "gpay", "google pay", "phonepe", "paytm", "online", "फोनपे", "पेटीएम"]):
            payment_mode = "UPI"
        elif any(w in lower for w in ["bank", "transfer", "khata", "खाता", "अकाउंट"]):
            payment_mode = "Bank Transfer"

        # 7. Location Extraction
        location = default_location
        loc_match = re.search(r'(?:at|near|in|location|site|जगह|साइट|सेक्टर)\s+([A-Za-z0-9\s,\-]+?)(?:\s+mein|\s+par|\s+me|\.|\,|$)', cleaned, re.IGNORECASE)
        if loc_match:
            loc_cand = loc_match.group(1).strip()
            if len(loc_cand) > 3 and len(loc_cand) < 40:
                location = loc_cand

        skill_cat = cls.SKILL_CATEGORY_MAP.get(detected_trade, SkillCategory.SKILLED)

        return {
            "date": entry_date,
            "amount_paid": amount,
            "hours_worked": hours,
            "skill_type": detected_trade,
            "skill_category": skill_cat,
            "employer_name": employer,
            "location": location,
            "payment_mode": payment_mode,
            "raw_transcript": text,
            "evidence_type": EvidenceType.VOICE_NOTE
        }
