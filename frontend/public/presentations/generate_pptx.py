"""
ShramLedger Executive PowerPoint (.pptx) Generator
Generates two institutional-grade, 16:9 widescreen PowerPoint presentations:
1. ShramLedger_Platform_Walkthrough.pptx
2. ShramLedger_Technical_Architecture.pptx
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# ── Color Palette ──────────────────────────────────────────────────────────
BG_DARK = RGBColor(4, 8, 16)        # #040810 Deep void slate
CARD_BG = RGBColor(15, 23, 42)      # #0f172a Slate 900
CARD_BORDER = RGBColor(30, 41, 59)  # #1e293b Slate 800
AMBER = RGBColor(245, 158, 11)      # #f59e0b Primary warm gold
EMERALD = RGBColor(16, 185, 129)    # #10b981 Verified green
CYAN = RGBColor(6, 182, 212)        # #06b6d4 Tech cyan
TEXT_WHITE = RGBColor(248, 250, 252)# #f8fafc Crisp white
TEXT_MUTED = RGBColor(148, 163, 184)# #94a3b8 Slate 400
TEXT_DIM = RGBColor(100, 116, 139)  # #64748b Slate 500

def set_slide_background(slide):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = BG_DARK

def add_header(slide, tag, title, subtitle=None):
    # Category tag
    tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.4))
    tf_tag = tag_box.text_frame
    tf_tag.word_wrap = True
    p_tag = tf_tag.paragraphs[0]
    p_tag.text = tag.upper()
    p_tag.font.size = Pt(11)
    p_tag.font.bold = True
    p_tag.font.color.rgb = AMBER

    # Slide Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.5), Inches(0.8))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = title
    p_title.font.size = Pt(26)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE

    if subtitle:
        p_sub = tf_title.add_paragraph()
        p_sub.text = subtitle
        p_sub.font.size = Pt(13)
        p_sub.font.color.rgb = TEXT_MUTED

def add_card(slide, left, top, width, height, title, items, accent_color=AMBER):
    # Card background shape
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    shape.fill.solid()
    shape.fill.fore_color.rgb = CARD_BG
    shape.line.color.rgb = CARD_BORDER
    shape.line.width = Pt(1)

    # Accent line on top of card
    accent = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(0.08))
    accent.fill.solid()
    accent.fill.fore_color.rgb = accent_color
    accent.line.fill.background()

    # Content
    tb = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.15), Inches(width - 0.5), Inches(height - 0.3))
    tf = tb.text_frame
    tf.word_wrap = True

    p_title = tf.paragraphs[0]
    p_title.text = title
    p_title.font.size = Pt(16)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE

    for item in items:
        p = tf.add_paragraph()
        p.text = f"•  {item}"
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_MUTED
        p.space_before = Pt(6)

def create_title_slide(prs, badge, main_title, subtitle, presenter_info):
    blank_slide_layout = prs.slide_layouts[6]
    slide = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide)

    # Glowing accent banner
    accent = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(0.2), Inches(7.5))
    accent.fill.solid()
    accent.fill.fore_color.rgb = AMBER
    accent.line.fill.background()

    # Badge
    tb_badge = slide.shapes.add_textbox(Inches(1.2), Inches(1.5), Inches(10), Inches(0.5))
    p_b = tb_badge.text_frame.paragraphs[0]
    p_b.text = badge.upper()
    p_b.font.size = Pt(13)
    p_b.font.bold = True
    p_b.font.color.rgb = AMBER

    # Main Title
    tb_title = slide.shapes.add_textbox(Inches(1.2), Inches(2.0), Inches(11.0), Inches(2.0))
    tf_title = tb_title.text_frame
    tf_title.word_wrap = True
    p_t = tf_title.paragraphs[0]
    p_t.text = main_title
    p_t.font.size = Pt(40)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE

    p_sub = tf_title.add_paragraph()
    p_sub.text = subtitle
    p_sub.font.size = Pt(18)
    p_sub.font.color.rgb = TEXT_MUTED
    p_sub.space_before = Pt(12)

    # Footer
    tb_foot = slide.shapes.add_textbox(Inches(1.2), Inches(5.8), Inches(10), Inches(1.0))
    p_f = tb_foot.text_frame.paragraphs[0]
    p_f.text = presenter_info
    p_f.font.size = Pt(12)
    p_f.font.color.rgb = TEXT_DIM

    return slide


# ═══════════════════════════════════════════════════════════════════════════
# PRESENTATION 1: PLATFORM & PRODUCT WALKTHROUGH
# ═══════════════════════════════════════════════════════════════════════════
def build_presentation_1(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Slide 1: Title
    create_title_slide(
        prs,
        badge="Product & Platform Walkthrough",
        main_title="ShramLedger (श्रमLedger)",
        subtitle="Tamper-Evident Employment & Income Verification Platform for Bharat's 450M Informal Workers",
        presenter_info="Institutional Overview • DPDP Act 2023 Compliant • SHA-256 Merkle Ledger"
    )

    # Slide 2: The 450M Worker Crisis
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2)
    add_header(slide2, "Market Problem", "The 450 Million Gap in Bharat's Informal Economy", "Daily wage earners remain invisible to institutional credit and formal social welfare.")
    add_card(slide2, 0.8, 1.8, 3.6, 5.0, "Cash & Invisible Waged", [
        "92% of India's workforce is informal (construction, domestic work, logistics, agriculture).",
        "Wages are paid in cash or uncatalogued UPI transfers with zero documentation.",
        "Zero payslips or formal ITR filings make workers instantly rejected by NBFCs."
    ], AMBER)
    add_card(slide2, 4.8, 1.8, 3.6, 5.0, "Predatory Debt Traps", [
        "Workers are forced into unregulated local loan sharks charging 36% to 60% APR.",
        "Medical emergencies or monsoon downtime trigger generational debt cycles.",
        "Banks want to lend under micro-priority sector targets but lack verified income data."
    ], RGBColor(239, 68, 68))
    add_card(slide2, 8.8, 1.8, 3.6, 5.0, "Welfare Leakage & Fraud", [
        "Billions in BOCW welfare cess and state schemes sit unallocated or get diverted.",
        "Fake contractor invoices and ghost worker rolls prevent genuine welfare delivery.",
        "No tamper-evident record to prove 90+ days of continuous construction employment."
    ], CYAN)

    # Slide 3: The 4 Core Pillars
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3)
    add_header(slide3, "Platform Solution", "The 4 Foundational Pillars of ShramLedger", "Transforming scattered, informal wage evidence into institutional-grade bank credentials.")
    add_card(slide3, 0.8, 1.8, 2.7, 5.0, "1. Multimodal Logging", [
        "Zero-literacy voice notes in Hindi, Hinglish, Bengali.",
        "OCR photo scanner for site slips, job cards, UPI receipts.",
        "Automatic wage extraction & statutory wage floor validation."
    ], AMBER)
    add_card(slide3, 3.8, 1.8, 2.7, 5.0, "2. Cryptographic Ledger", [
        "SHA-256 Merkle DAG anchors every micro-attestation.",
        "Cryptographic proof of inclusion eliminates data tampering.",
        "Interactive tamper sandbox guarantees mathematical integrity."
    ], EMERALD)
    add_card(slide3, 6.8, 1.8, 2.7, 5.0, "3. ShramScore™ Scoring", [
        "Proprietary 300-900 informal credit & stability gauge.",
        "Measures wage consistency, work continuity & employer backing.",
        "Enables instant underwriting for NBFC micro-loans."
    ], CYAN)
    add_card(slide3, 9.8, 1.8, 2.7, 5.0, "4. DPDP & Portals", [
        "DPDP Act 2023 consent lifecycle with 1-click revocation.",
        "Dedicated portals for Contractors, Lenders, NGOs & Admins.",
        "Dynamic QR verification for instant employer/bank proof."
    ], RGBColor(168, 85, 247))

    # Slide 4: Multimodal Ingestion Engine
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4)
    add_header(slide4, "Multimodal Ingestion", "Inclusive Logging Built for Bharat's Realities", "Designed specifically for migrant laborers with varying literacy levels.")
    add_card(slide4, 0.8, 1.8, 3.6, 5.0, "Indic Voice Logger", [
        "Workers speak naturally: 'आज 8 घंटे चिनाई की, ₹850 नकद मिले'.",
        "Speech NLP engine transcribes Indic dialects & code-switched Hinglish.",
        "Extracts date, wage, trade, and contractor automatically."
    ], AMBER)
    add_card(slide4, 4.8, 1.8, 3.6, 5.0, "OCR Slip & UPI Scanner", [
        "Scan handwritten daily site chits, contractor slips, or job cards.",
        "OCR engine cleans image contrast and extracts structured values.",
        "Matches digital UPI screenshot transactions against claimed amounts."
    ], CYAN)
    add_card(slide4, 8.8, 1.8, 3.6, 5.0, "Statutory Wage Validator", [
        "Prevents predatory underpayment with state minimum wage benchmarks.",
        "Cross-checks Central & State BOCW statutory rates across skill tiers.",
        "Flags low-wage violations and highlights potential labor exploitation."
    ], EMERALD)

    # Slide 5: Cryptographic Merkle DAG
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5)
    add_header(slide5, "Cryptographic Security", "SHA-256 Merkle Tree: Tamper-Evident Ledger", "Mathematical proof replacing institutional mistrust.")
    add_card(slide5, 0.8, 1.8, 5.6, 5.0, "Leaf Hashing & Root Anchoring", [
        "Every work entry is hashed: H(id || worker_id || date || wage || employer || evidence).",
        "Entries are paired recursively into intermediate nodes up to a 64-character Root Hash.",
        "Audit Trail: A worker can prove inclusion of any single day without revealing all history.",
        "Merkle Path Verification runs in O(log N) time with zero external dependencies."
    ], EMERALD)
    add_card(slide5, 6.8, 1.8, 5.6, 5.0, "Interactive Tamper Simulation Sandbox", [
        "Live on-screen demonstration in the website's Merkle DAG visualizer.",
        "A user or auditor can tamper with a single digit (e.g. ₹850 changed to ₹1,850).",
        "Instantly, leaf hash recomputation cascades upwards into a complete root mismatch.",
        "Status flashes 'TAMPER_DETECTED: Cryptographic Root Mismatch' - guaranteeing zero fraud."
    ], RGBColor(239, 68, 68))

    # Slide 6: DPDP Act 2023 Architecture
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6)
    add_header(slide6, "Data Privacy & Governance", "DPDP Act 2023: Worker-Centric Consent Engine", "Workers own and govern their data. No third party access without explicit, time-bound consent.")
    add_card(slide6, 0.8, 1.8, 3.6, 5.0, "Purpose-Bound Consent", [
        "Clear purpose declaration: 'Loan Underwriting', 'Welfare Enrollment', 'Job Verification'.",
        "Granular permissions: Worker chooses what data fields to disclose.",
        "Digital agreement logged in immutable audit records."
    ], AMBER)
    add_card(slide6, 4.8, 1.8, 3.6, 5.0, "Time-to-Live (TTL)", [
        "Every consent grant includes an expiration window (e.g. 7 days for loan evaluation).",
        "Automatic token expiration prevents stale bank access.",
        "Prevents predatory perpetual data harvesting."
    ], CYAN)
    add_card(slide6, 8.8, 1.8, 3.6, 5.0, "1-Click Instant Revocation", [
        "Workers can revoke consent at any moment with a single tap.",
        "Revocation immediately disables API key tokens for requesting NBFCs.",
        "Aadhaar and e-Shram UAN numbers are masked (XXXX-XXXX-4829) by default."
    ], EMERALD)

    # Slide 7: ShramScore Alternative Credit Scoring
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7)
    add_header(slide7, "Underwriting Intelligence", "ShramScore™: Multi-Factor Informal Credit Gauge", "A proprietary 300–900 scale unlocking fair, formal credit for unbanked workers.")
    add_card(slide7, 0.8, 1.8, 5.6, 5.0, "The 5 Algorithmic Pillars", [
        "1. Wage Consistency (25%): Low variance in regular earnings week-over-week.",
        "2. Work Continuity (25%): Active working days (>22 days/month indicates high stability).",
        "3. Employer Endorsement (20%): Percentage of entries verified by contractors.",
        "4. Digital Trail Ratio (15%): Ratio of UPI/bank payments vs cash.",
        "5. Evidence Strength Band (15%): Platinum (cryptographic), Gold, Silver, Bronze."
    ], AMBER)
    add_card(slide7, 6.8, 1.8, 5.6, 5.0, "Underwriting Outcomes for Lenders", [
        "Composite Score: e.g. Ramesh Kumar = 785 (Tier-1 Prime Informal).",
        "Projected Monthly Income: ₹24,200 with 95% confidence interval [₹22.5k - ₹25.8k].",
        "Loan Eligibility: Instant approval for ₹50,000 credit line with 150 bps interest discount.",
        "Default Rate Reduction: Early pilots show 40% lower default compared to unvetted borrowers."
    ], EMERALD)

    # Slide 8: Digital Work Passport & Income Certificate
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8)
    add_header(slide8, "Worker Credentials", "Digital Work Passport & Tamper-Evident Certificate", "Verifiable digital identity empowering workers across contractors, lenders, and cities.")
    add_card(slide8, 0.8, 1.8, 3.6, 5.0, "Verified Work Passport", [
        "Comprehensive employment timeline spanning multi-site projects.",
        "Cryptographic proof stamp attached to every verified work day.",
        "Skill Tier designation (Mason, Electrician, Domestic Cook, Painter)."
    ], CYAN)
    add_card(slide8, 4.8, 1.8, 3.6, 5.0, "Dynamic QR Verification", [
        "Each certificate embeds a tamper-proof QR code linking to verification node.",
        "Anyone scanning the QR sees instant cryptographic validity and Merkle root.",
        "Zero need to share sensitive personal documents or raw phone numbers."
    ], AMBER)
    add_card(slide8, 8.8, 1.8, 3.6, 5.0, "Export & Social Sharing", [
        "Generate bank-ready PDF income certificates with jsPDF in 1 click.",
        "Native WhatsApp sharing to send verified wage proofs to contractors.",
        "Multilingual UI: Switch between Hindi, English, Marathi, Bengali, Telugu."
    ], EMERALD)

    # Slide 9: B2B Employer & Contractor Portal
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9)
    add_header(slide9, "B2B Contractor Console", "Employer Portal: Seamless Roster & Wage Endorsement", "Empowering construction EPCs, builders, and manpower contractors to digitize muster rolls.")
    add_card(slide9, 0.8, 1.8, 3.6, 5.0, "One-Touch Verification", [
        "Contractor receives pending wage claim notification with worker's claimed slip.",
        "Quick OTP / phone attestation confirms worker worked 8 hours at site.",
        "Creates legally sound proof of employment for dispute protection."
    ], AMBER)
    add_card(slide9, 4.8, 1.8, 3.6, 5.0, "Bulk Muster Roll Ingestion", [
        "Upload CSV muster rolls containing hundreds of daily labor records in seconds.",
        "Auto-parses worker names, UAN, trade category, hours, and net wage payables.",
        "Creates batch Merkle roots anchored to the institutional contractor profile."
    ], CYAN)
    add_card(slide9, 8.8, 1.8, 3.6, 5.0, "Automated Payout Batches", [
        "Execute direct bank/UPI wage disbursements for entire site crews.",
        "Escrow hold integration via HDFC/Axis bank APIs with immutable UTR tracking.",
        "Eliminates cash leakage and contractor middleman commission deductions."
    ], EMERALD)

    # Slide 10: B2B Lender & Underwriting Console
    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide10)
    add_header(slide10, "B2B NBFC / Banking Suite", "Lender Portal: Real-Time Underwriting & API Hub", "Transforming 450M unbanked workers into a verified, profitable credit asset class.")
    add_card(slide10, 0.8, 1.8, 3.6, 5.0, "Income Stability Curves", [
        "Real-time chart visualization of seasonal and monthly wage velocity.",
        "Volatility index highlights income dips during monsoon or festival migrations.",
        "Provides true debt service capacity rather than relying on absent CIBIL scores."
    ], CYAN)
    add_card(slide10, 4.8, 1.8, 3.6, 5.0, "Policy Evaluation Engine", [
        "Automated rule execution: Min ShramScore > 700, Endorsement Ratio > 80%.",
        "Instant conditional approval recommendation with interest rate pricing.",
        "Simulates loan policy evaluations against live worker records."
    ], AMBER)
    add_card(slide10, 8.8, 1.8, 3.6, 5.0, "REST API & Key Manager", [
        "Production & Sandbox API key generator with rate limiting (600 RPM).",
        "cURL and JSON code snippets for integration into bank core banking systems.",
        "Webhook event triggers when worker wage verification reaches threshold."
    ], EMERALD)

    # Slide 11: NGO & State Welfare Portal
    slide11 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide11)
    add_header(slide11, "GovTech & Social Welfare", "BOCW & NGO Portal: Ensuring Welfare Reaches the Last Mile", "Empowering labor welfare boards and social organizations with transparent census analytics.")
    add_card(slide11, 0.8, 1.8, 3.6, 5.0, "BOCW 90-Day Verification", [
        "Building & Other Construction Workers Act requires 90 days continuous work.",
        "ShramLedger provides instant mathematical proof of 90-day site employment.",
        "Unlocks accident insurance, daughter marriage grants, and tool subsidies."
    ], EMERALD)
    add_card(slide11, 4.8, 1.8, 3.6, 5.0, "Automated Scheme Matcher", [
        "Matches worker age, income, and trade against central and state social schemes.",
        "Direct qualification for PM Shram Yogi Maan-dhan (PM-SYM ₹3k pension).",
        "PM Suraksha Bima Yojana (PMSBY ₹2 lakh cover) and PM-SVANidhi loans."
    ], AMBER)
    add_card(slide11, 8.8, 1.8, 3.6, 5.0, "Macro Labor Intelligence", [
        "Real-time geographic wage dispersion heatmaps across construction hubs.",
        "Gender wage gap analysis across domestic care and construction sectors.",
        "BOCW cess compliance monitor tracking contractor tax deposits."
    ], CYAN)

    # Slide 12: Admin Fraud Radar & Public Verifier
    slide12 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide12)
    add_header(slide12, "Governance & Integrity", "Admin Fraud Radar & Public Zero-Knowledge Verifier", "Ensuring ecosystem-wide trust, anomaly detection, and universal verification.")
    add_card(slide12, 0.8, 1.8, 5.6, 5.0, "Admin Anomaly & Fraud Radar", [
        "Statistical outlier wage detection (flags wages exceeding P95 regional norms).",
        "Duplicate claim detector: Prevents logging overlapping work hours on multiple sites.",
        "Geographic velocity anomaly: Flags entries logged 500km apart within 2 hours.",
        "Audit Logging: All administrative actions recorded in append-only consensus log."
    ], RGBColor(239, 68, 68))
    add_card(slide12, 6.8, 1.8, 5.6, 5.0, "Public Verifier Terminal", [
        "Open public verification portal accessible by any bank, landlord, or employer.",
        "Input any Certificate ID (e.g. CERT-SL-2026-RAMESH-8921) or scan QR code.",
        "Displays cryptographic validity status, issue date, issuing authority, and Merkle root.",
        "Zero-knowledge proof: Confirms validity without revealing private personal history."
    ], CYAN)

    prs.save(output_path)
    print(f"[OK] Saved Presentation 1: {output_path}")

# ═══════════════════════════════════════════════════════════════════════════
# PRESENTATION 2: TECHNICAL ARCHITECTURE & ENGINEERING BREAKDOWN
# ═══════════════════════════════════════════════════════════════════════════
def build_presentation_2(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Slide 1: Title
    create_title_slide(
        prs,
        badge="Engineering Deep-Dive & Architecture",
        main_title="Under the Hood of ShramLedger",
        subtitle="Fullstack Architecture, Cryptographic Engines, Component Hierarchy & Production Deployment",
        presenter_info="FastAPI • Python 3.10+ • React 19 • Vite • Tailwind CSS v4 • SHA-256 Merkle DAG • Vercel"
    )

    # Slide 2: High-Level System Architecture
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2)
    add_header(slide2, "Architecture Topology", "End-to-End Fullstack Architecture", "Decoupled client-server architecture with cryptographic consensus and resilient failover.")
    add_card(slide2, 0.8, 1.8, 3.6, 5.0, "Frontend Layer (React 19 SPA)", [
        "Vite 8 build toolchain with instant HMR and optimized Rolldown bundling.",
        "Tailwind CSS v4 with custom cyber-banking design tokens & glassmorphism.",
        "Dynamic API service layer with automated mock fallback for high availability.",
        "Web Speech API for audio recording + jsPDF for client-side document generation."
    ], CYAN)
    add_card(slide2, 4.8, 1.8, 3.6, 5.0, "Backend Layer (FastAPI Python)", [
        "High-performance asynchronous REST API built with FastAPI & Uvicorn.",
        "Pydantic v2 schemas providing strict type enforcement and request validation.",
        "Modular domain engines: LedgerEngine, CreditScorer, OCREngine, FraudDetector.",
        "Lifespan context manager syncing in-memory cache with relational database."
    ], AMBER)
    add_card(slide2, 8.8, 1.8, 3.6, 5.0, "Data & Ledger Layer", [
        "SQLAlchemy 2.0 ORM with lightweight auto-migration for zero-downtime schemas.",
        "Dual-engine support: SQLite for instant local dev & PostgreSQL for enterprise.",
        "Cryptographic SHA-256 Merkle DAG engine generating tamper-evident root hashes.",
        "Append-only immutable audit log tracking every user consent & administrative action."
    ], EMERALD)

    # Slide 3: Technologies & Coding Languages Used
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3)
    add_header(slide3, "Technology Stack", "Core Technologies, Languages & Libraries", "Carefully selected modern stack optimizing developer velocity, execution speed, and security.")
    add_card(slide3, 0.8, 1.8, 3.6, 5.0, "Languages & Runtimes", [
        "JavaScript / JSX (ES2024): Frontend UI logic, state reactive pipelines.",
        "Python 3.10+: Backend business logic, cryptographic math, OCR processing.",
        "SQL: Relational database queries, indexed foreign keys, audit persistence.",
        "HTML5 / CSS3: Semantic layout, responsive glassmorphic cards, CSS animations."
    ], AMBER)
    add_card(slide3, 4.8, 1.8, 3.6, 5.0, "Frontend Libraries", [
        "React 19 & React-DOM: Concurrent rendering and modern state hooks.",
        "Tailwind CSS v4 (@tailwindcss/vite): Zero-runtime utility styling.",
        "Lucide React: Iconography for all dashboard controls and status flags.",
        "Canvas Confetti: Delightful micro-interaction on verified milestones.",
        "QRCode.react: Dynamic generation of scannable credential QR codes.",
        "jsPDF & HTML2Canvas: Instant PDF certificate rendering in-browser."
    ], CYAN)
    add_card(slide3, 8.8, 1.8, 3.6, 5.0, "Backend Libraries", [
        "FastAPI & Uvicorn: Async ASGI web framework & high-throughput server.",
        "SQLAlchemy: Enterprise ORM supporting SQLite and PostgreSQL.",
        "Pydantic v2: Fast C-based data validation and DTO serialization.",
        "Cryptography (PyCA): SHA-256 and HMAC cryptographic primitives.",
        "Pillow (PIL): Image normalization, contrast enhancement for OCR chits.",
        "pytest & httpx: Comprehensive unit and integration test suites."
    ], EMERALD)

    # Slide 4: Frontend Component Architecture (All 19 Components)
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4)
    add_header(slide4, "Frontend Component Hierarchy", "Decomposition of All 19 React Components", "Component-driven design organized into Portals, Visualizers, Ingestion Engines, and Modals.")
    add_card(slide4, 0.8, 1.8, 2.7, 5.0, "1. Core & Navigation", [
        "App.jsx: Root coordinator, global state, keyboard shortcuts.",
        "LandingPage.jsx: High-converting hero, stats counter, role switches.",
        "Navbar.jsx: Multi-tenant role tabs, language switcher, brand header.",
        "CommandPaletteModal.jsx: Global Spotlight search (Ctrl+K / Cmd+K)."
    ], AMBER)
    add_card(slide4, 3.8, 1.8, 2.7, 5.0, "2. Institutional Portals", [
        "EmployerPortal.jsx: Contractor approvals, muster rolls, wage payouts.",
        "LenderPortal.jsx: NBFC underwriting console, API keys, policy rules.",
        "NgoGovPortal.jsx: Welfare analytics, BOCW cess compliance monitor.",
        "AdminFraudDashboard.jsx: Outlier radar, dispute handling, audit logs.",
        "PublicVerifier.jsx: Universal QR code and Merkle root verification."
    ], CYAN)
    add_card(slide4, 6.8, 1.8, 2.7, 5.0, "3. Worker & Visualizers", [
        "ShramScoreCard.jsx: 300-900 score gauge, metric breakdown radar.",
        "LedgerTimeline.jsx: Immutable entry cards with cryptographic stamps.",
        "IncomeCertificate.jsx: Tamper-proof certificate with QR and PDF export.",
        "SchemeMatcher.jsx: Government welfare scheme qualification engine.",
        "MerkleDagVisualizer.jsx: Interactive Merkle tree graph & tamper sandbox."
    ], EMERALD)
    add_card(slide4, 9.8, 1.8, 2.7, 5.0, "4. Ingestion & Modals", [
        "VoiceLogger.jsx: Web Speech API recorder, audio wave, NLP extraction.",
        "DocumentScanner.jsx: OCR image upload, canvas crop, chit parsing.",
        "AddEntryModal.jsx: Manual wage form with minimum wage validation.",
        "OnboardingModal.jsx: DPDP consent onboarding with OTP validation.",
        "ContractorEndorseModal.jsx: Quick OTP approval modal for employers.",
        "CommercialQuoteModal.jsx: B2B enterprise tier pricing estimator."
    ], RGBColor(168, 85, 247))

    # Slide 5: State Management & i18n Localization
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5)
    add_header(slide5, "Frontend State & Localization", "Centralized State, Keyboard Control & 5-Language i18n", "Engineered for accessibility across linguistic and demographic divides.")
    add_card(slide5, 0.8, 1.8, 5.6, 5.0, "Reactive State & Event Handling", [
        "Selected Worker State: Switching workers automatically recalculates scores and schemes.",
        "View Mode Routing: Instantly switch between Worker, Employer, Lender, NGO, Admin, Verifier.",
        "Global Command Palette (Ctrl+K): Quick navigation across workers, portals, and settings.",
        "Optimistic UI Updates: Immediate visual feedback on wage entry addition or endorsement."
    ], CYAN)
    add_card(slide5, 6.8, 1.8, 5.6, 5.0, "Multilingual Localization (i18n)", [
        "Dictionary-based locale provider (TRANSLATIONS in locales.js).",
        "Supported Languages: Hindi (हिन्दी), English, Marathi (मराठी), Bengali (বাংলা), Telugu (తెలుగు).",
        "Contextual terminology: Uses cultural terms like 'राजमिस्त्री' (Mason), 'मजदूरी' (Wage).",
        "Responsive font loading: Integrates Google Noto Sans Devanagari for crisp Indic rendering."
    ], AMBER)

    # Slide 6: API Service Layer & High-Availability Fallback
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6)
    add_header(slide6, "API Resilience Pattern", "The API Service Layer: Dynamic Base URL & Fallback", "Ensuring zero-downtime demonstration on static cloud hosting (Vercel).")
    add_card(slide6, 0.8, 1.8, 5.6, 5.0, "Decoupled Environment Resolution", [
        "Dynamic Base URL: import.meta.env.VITE_API_BASE_URL || '/api'.",
        "Automatically adapts: Uses localhost proxy in dev, Render/Railway in prod.",
        "Request Timeout Guard: AbortController with 6000ms timeout prevents hanging requests.",
        "Clean error serialization: Intercepts non-200 responses and extracts JSON details."
    ], AMBER)
    add_card(slide6, 6.8, 1.8, 5.6, 5.0, "Resilient Client-Side Fallback", [
        "safeFetch(url, options, fallbackValue) abstraction handles network disconnects.",
        "Rich Institutional Fallback Dataset (mockData.js): Ramesh Kumar, Sunita Devi, Vikram Singh.",
        "Guarantees that visiting the Vercel URL displays a 100% functional, interactive experience.",
        "Simulates API creation, OTP sending, and tamper testing seamlessly on client side."
    ], EMERALD)

    # Slide 7: Backend Architecture: FastAPI & Relational DB
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7)
    add_header(slide7, "Backend Architecture", "FastAPI Service Layer & SQLAlchemy Relational Models", "Enterprise schema design with automated seeding and self-healing migrations.")
    add_card(slide7, 0.8, 1.8, 5.6, 5.0, "FastAPI Endpoints & Routing", [
        "/workers & /workers/{id}: Worker profiles, trade categorization, and history.",
        "/entries/{worker_id}: Wage micro-attestation creation and tombstone archival.",
        "/score/{worker_id}: Dynamic computation of the 300-900 ShramScore.",
        "/v1/workers/{id}/income-summary: DPDP consent-gated underwriting API for NBFCs.",
        "/employer/action: Cryptographic employer endorsement with phone OTP.",
        "/admin/fraud-alerts: Outlier wage detection and dispute resolution queues."
    ], CYAN)
    add_card(slide7, 6.8, 1.8, 5.6, 5.0, "Database Relational Schema (db_models.py)", [
        "Worker & WorkerProfile: Identity, masked Aadhaar/UAN, primary trade.",
        "WorkEntry: Daily wage records, hours, location, evidence type, SHA-256 hash.",
        "Employer & Contractor: Corporate profiles, authorized phone numbers, tax IDs.",
        "ConsentRecord: DPDP purpose, granted timestamp, TTL expiration, revocation state.",
        "AuditLog: Immutable append-only log of every credential verification and access."
    ], AMBER)

    # Slide 8: The Cryptographic Engine (ledger.py)
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8)
    add_header(slide8, "Cryptographic Implementation", "Merkle Tree Math & Implementation (ledger.py)", "Building tamper-evident integrity from mathematical first principles.")
    add_card(slide8, 0.8, 1.8, 5.6, 5.0, "Recursive Merkle Tree Construction", [
        "1. Leaf Hashing: For each entry e in entries: h = SHA-256(canonical_json(e)).",
        "2. Level Pairing: For i in 0..len(nodes) step 2: parent = SHA-256(nodes[i] + nodes[i+1]).",
        "3. Odd Node Handling: If count is odd, the last leaf node is duplicated to balance the tree.",
        "4. Root Convergence: Process repeats recursively until a single 64-character root remains."
    ], EMERALD)
    add_card(slide8, 6.8, 1.8, 5.6, 5.0, "Proof of Inclusion & Audit Paths", [
        "Audit Path Generation: Extracts co-hashes required to reconstruct root from any leaf.",
        "Verification Complexity: O(log N) operations (a tree with 1,024 entries needs only 10 hashes).",
        "Deterministic Serialization: Ensures identical hash calculation across Python and JavaScript.",
        "Zero Trust: Lenders can verify authenticity locally without trusting the ShramLedger server."
    ], CYAN)

    # Slide 9: Multimodal AI & NLP Pipelines
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9)
    add_header(slide9, "Multimodal Processing", "Indic Speech NLP & OCR Document Pipeline", "Bridging physical paper slips and spoken dialects into structured digital records.")
    add_card(slide9, 0.8, 1.8, 5.6, 5.0, "IndicSpeechNLPEngine (speech_nlp_engine.py)", [
        "Multi-Dialect Phonetic Matching: Accommodates regional Hindi, Bhojpuri, and Hinglish.",
        "Slot Filling & Named Entity Recognition: Identifies wage numbers, hours worked, and contractors.",
        "Regex Rule Fallback: Extracts currency patterns (₹, Rs, rupaye, hazar).",
        "Confidence Scoring: Weighs phonetic clarity and acoustic completeness (0-100 scale)."
    ], AMBER)
    add_card(slide9, 6.8, 1.8, 5.6, 5.0, "OCREngine (ocr_engine.py)", [
        "Image Preprocessing: Pillow contrast enhancement, grayscale normalization, and thresholding.",
        "Chit Parsing Heuristics: Scans for contractor headers, dates, and currency symbols.",
        "UPI Screenshot Matcher: Detects 12-digit UPI reference numbers and transaction status.",
        "Evidence Strength Scoring: Classifies evidence into Platinum, Gold, Silver, or Bronze."
    ], CYAN)

    # Slide 10: Credit Scoring & Anomaly Detection Algorithms
    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide10)
    add_header(slide10, "Algorithmic Models", "ShramScore Formula & Fraud Detection Engine", "Mathematical rigor ensuring bank-grade risk assessment and fraud resistance.")
    add_card(slide10, 0.8, 1.8, 5.6, 5.0, "CreditScorer Mathematical Formulation", [
        "Score = 300 + 600 * (0.25*C_wage + 0.25*C_work + 0.20*E_endorse + 0.15*D_trail + 0.15*S_evidence)",
        "Wage Consistency (C_wage): 1 - min(1, std_dev(wages) / mean(wages)).",
        "Work Continuity (C_work): min(1, verified_days_in_last_90 / 66).",
        "Income Projection: Kernel density estimation with 95% confidence interval."
    ], EMERALD)
    add_card(slide10, 6.8, 1.8, 5.6, 5.0, "FraudDetector Anomaly Rules", [
        "Statistical Wage Dispersion: Flags claims > 2.5 standard deviations from trade mean.",
        "Duplicate Punch Check: Identifies overlapping work entries across different contractors.",
        "Ghost Contractor Detection: Flags contractors who endorse 100+ workers with 0 tax IDs.",
        "Automated Dispute Escalation: Pushes suspicious entries to Admin Audit queue."
    ], RGBColor(239, 68, 68))

    # Slide 11: Production Deployment on Vercel
    slide11 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide11)
    add_header(slide11, "Production Infrastructure", "Vercel Deployment, Bundling & Edge Network", "Sub-second global performance with bank-grade security headers.")
    add_card(slide11, 0.8, 1.8, 3.6, 5.0, "Vite Bundling & Rolldown", [
        "Total production bundle built in 407ms with tree-shaking.",
        "Code splitting generates optimized chunks for core vendor libraries.",
        "Zero-runtime Tailwind CSS v4 compiles directly into single 108KB CSS bundle."
    ], CYAN)
    add_card(slide11, 4.8, 1.8, 3.6, 5.0, "vercel.json Configuration", [
        "SPA Rewrite: Directs all unmatched routes to index.html for client routing.",
        "Security Headers: X-Content-Type-Options: nosniff to prevent MIME sniffing.",
        "Clickjacking Protection: X-Frame-Options: DENY protects worker data.",
        "XSS Protection: Injects X-XSS-Protection: 1; mode=block."
    ], AMBER)
    add_card(slide11, 8.8, 1.8, 3.6, 5.0, "Global Edge Delivery", [
        "Deployed to Vercel Global Edge Network with automatic HTTPS certificates.",
        "Dual production domains: frontend-eureka-b5b5.vercel.app & frontend-nine-alpha-59.vercel.app.",
        "SSO deployment protection disabled for unrestricted public accessibility."
    ], EMERALD)

    # Slide 12: Future Engineering Roadmap
    slide12 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide12)
    add_header(slide12, "Future Roadmap", "Next Phase: Web3, Offline PWA & India Stack Integration", "Scaling from institutional platform to national sovereign infrastructure.")
    add_card(slide12, 0.8, 1.8, 3.6, 5.0, "Decentralized Nodes", [
        "Federate Merkle root consensus across State Labor Boards and PSU Banks.",
        "Anchor daily root hashes to public L1/L2 blockchains (Polygon / Ethereum).",
        "Zero-knowledge proof SNARKs for zero-disclosure credit verification."
    ], AMBER)
    add_card(slide12, 4.8, 1.8, 3.6, 5.0, "Offline-First PWA & SMS", [
        "Progressive Web App with IndexedDB sync for zero-connectivity rural areas.",
        "Feature phone USSD / SMS gateway for workers without smartphones (*99# format).",
        "Local Bluetooth mesh sync between workers and site contractors."
    ], CYAN)
    add_card(slide12, 8.8, 1.8, 3.6, 5.0, "India Stack Deep Integration", [
        "Aadhaar e-KYC & DigiLocker direct credential issuance.",
        "Account Aggregator (AA) framework integration with Sahamati ecosystem.",
        "OCEN (Open Credit Enablement Network) protocol adaptor for 1-click bank loans."
    ], EMERALD)

    prs.save(output_path)
    print(f"[OK] Saved Presentation 2: {output_path}")

if __name__ == "__main__":
    out_dir = os.path.dirname(os.path.abspath(__file__))
    p1 = os.path.join(out_dir, "ShramLedger_Platform_Walkthrough.pptx")
    p2 = os.path.join(out_dir, "ShramLedger_Technical_Architecture.pptx")
    build_presentation_1(p1)
    build_presentation_2(p2)
    print("All PowerPoint (.pptx) decks generated successfully!")

