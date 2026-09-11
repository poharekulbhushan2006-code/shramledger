import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  KeyRound, 
  User, 
  Briefcase, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Lock, 
  FileText,
  Sparkles,
  AlertCircle,
  BellRing,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../services/api';

const POPULAR_TRADES = [
  "Mason / राजमिस्त्री",
  "Carpenter / बढ़ई",
  "Painter / पेंटर",
  "Electrician / इलेक्ट्रीशियन",
  "Plumber / प्लंबर",
  "Domestic Help / घरेलू सहायिका",
  "Street Vendor / रेहड़ी-पटरी",
  "Driver / कमर्शियल ड्राइवर",
  "Tailor / दर्जी",
  "Construction Helper / लेबर"
];

const STATES = [
  "Delhi / NCR",
  "Maharashtra",
  "Uttar Pradesh",
  "Bihar",
  "Karnataka",
  "Tamil Nadu",
  "West Bengal",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh"
];

export default function OnboardingModal({ isOpen, onClose, onWorkerOnboarded }) {
  const [step, setStep] = useState(1); // 1: Mobile/OTP, 2: Profile & Skill, 3: DPDP Consent
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Real-time SMS notification simulator
  const [incomingSms, setIncomingSms] = useState(null);

  // Profile Form
  const [name, setName] = useState('');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('Male');
  const [primaryTrade, setPrimaryTrade] = useState(POPULAR_TRADES[0]);
  const [skillTier, setSkillTier] = useState('skilled');
  const [state, setState] = useState(STATES[0]);
  const [city, setCity] = useState('Noida / East Delhi');
  const [language, setLanguage] = useState('hi');
  
  // Consent
  const [dpdpAccepted, setDpdpAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setIsSendingOtp(true);
    setIncomingSms(null);
    try {
      const res = await api.sendOtp(phone.trim());
      setIsOtpSent(true);
      if (res.otp) {
        setIncomingSms({
          otp: res.otp,
          preview: res.sms_preview || `Your ShramLedger verification OTP is ${res.otp}. Valid for 10 minutes.`,
          timestamp: 'Just now'
        });
      }
    } catch (err) {
      setErrorMsg('Failed to dispatch OTP. Please check mobile number.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp || otp.trim().length === 0) {
      setErrorMsg('Please enter the verification code sent to your phone.');
      return;
    }
    setErrorMsg('');
    setIsVerifying(true);
    try {
      await api.verifyOtp(phone.trim(), otp.trim());
      setIsOtpVerified(true);
      setStep(2);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid OTP. Please enter the exact verification code sent to your phone.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!name || name.trim().length === 0) {
      setErrorMsg('Please enter the worker’s full name.');
      return;
    }
    if (!dpdpAccepted) {
      setErrorMsg('DPDP Consent must be accepted to issue the official Work Passport.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const payload = {
        phone: phone.trim(),
        name: name.trim(),
        age: parseInt(age) || 30,
        gender,
        primary_trade: primaryTrade,
        skill_tier: skillTier,
        state,
        city,
        language_preference: language,
        dpdp_consent_accepted: true
      };
      const newWorker = await api.onboardWorker(payload);
      if (onWorkerOnboarded) onWorkerOnboarded(newWorker);
      onClose();
    } catch (err) {
      setErrorMsg('Registration failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card w-full max-w-lg rounded-3xl border border-amber-500/30 shadow-2xl p-6 sm:p-8 my-8 relative animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-100 font-['Outfit']">
                {step === 1 ? 'Mobile Verification (OTP)' : step === 2 ? 'Worker Profile & Skills' : 'DPDP 2023 Consent & Issuance'}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {step === 1 ? 'Instant phone verification for Bharat’s informal workforce' : step === 2 ? 'Register occupational trade, skill tier and location' : 'Issue verifiable cryptographic work credential'}
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 px-2">
          {[
            { num: 1, label: 'Phone & OTP' },
            { num: 2, label: 'Trade & Profile' },
            { num: 3, label: 'DPDP Passport' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                step === s.num ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30' : step > s.num ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}>
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-xs font-bold ${step === s.num ? 'text-amber-400' : 'text-slate-500'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 mb-4 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── STEP 1: MOBILE & DYNAMIC OTP ───────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">

            {/* Simulated Live SMS Notification Toast */}
            {incomingSms && (
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-slate-900 to-emerald-500/20 border border-amber-500/40 shadow-xl space-y-2 animate-slide-down">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                    <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
                    <span>Incoming SMS from SHRAM-SEC</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{incomingSms.timestamp}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 font-mono">
                  {incomingSms.preview}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setOtp(incomingSms.otp)}
                    className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 transition-all"
                  >
                    <Check className="w-3 h-3" />
                    Auto-Fill Code ({incomingSms.otp})
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Worker Mobile Number:</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold focus:border-amber-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-all"
                >
                  {isSendingOtp ? 'Sending...' : isOtpSent ? 'Resend' : 'Send OTP'}
                </button>
              </div>
            </div>

            {isOtpSent && (
              <div className="space-y-3 pt-2 animate-fade-in">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-300">Enter 6-Digit Verification Code:</label>
                    <span className="text-[10px] text-emerald-400 font-mono">SMS Dispatched</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="e.g. 482910"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 text-base font-black tracking-widest text-center focus:border-amber-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifying}
                  className="w-full btn-primary py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 mt-2"
                >
                  {isVerifying ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Verify OTP & Continue
                </button>
              </div>
            )}

          </div>
        )}

        {/* ── STEP 2: PROFILE & SKILLS ──────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name (English & Hindi):</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar (रमेश कुमार)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-semibold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Age:</label>
                <input
                  type="number"
                  min={18}
                  max={65}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Gender:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold focus:border-amber-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Trade / Skill:</label>
              <select
                value={primaryTrade}
                onChange={(e) => setPrimaryTrade(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold focus:border-amber-500 focus:outline-none"
              >
                {POPULAR_TRADES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">State:</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold focus:border-amber-500 focus:outline-none"
                >
                  {STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">City / District:</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lucknow"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!name) { setErrorMsg('Please enter worker full name'); return; }
                  setErrorMsg('');
                  setStep(3);
                }}
                className="flex-1 btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                Continue to DPDP Consent
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: DPDP CONSENT & ISSUANCE ───────────────────────── */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Lock className="w-4 h-4" />
                <span>DPDP Act 2023 Statutory Consent Notice (Notice v1.0)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                By creating this profile, you consent to ShramLedger capturing and cryptographically anchoring your daily wage records for the purpose of maintaining verifiable digital work credentials and matching welfare schemes. You retain the right to revoke consent at any time.
              </p>
            </div>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={dpdpAccepted}
                onChange={(e) => setDpdpAccepted(e.target.checked)}
                className="mt-0.5 accent-amber-500 rounded"
              />
              <span className="text-xs text-slate-300 font-semibold">
                I hereby grant consent under the Digital Personal Data Protection Act 2023 for verifiable employment credentialing.
              </span>
            </label>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 btn-primary py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                {isSubmitting ? <Sparkles className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Issue Cryptographic Work Passport
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
