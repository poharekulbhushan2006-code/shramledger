import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Landmark,
  Layers,
  CheckCircle2,
  Download,
  X,
  Sparkles,
  Calculator,
  ArrowRight,
  Phone,
  Mail,
  Send,
  Check,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

export default function CommercialQuoteModal({ isOpen, onClose, initialTier = 'contractor_pro' }) {
  const [tier, setTier] = useState(initialTier);
  const [billingCycle, setBillingCycle] = useState('annual');
  const [activeSites, setActiveSites] = useState(3);
  const [workerCount, setWorkerCount] = useState(600);
  
  // Contact details
  const [companyName, setCompanyName] = useState('Larsen & Toubro Infra Site 04');
  const [contactName, setContactName] = useState('Anil Verma (Project Director)');
  const [email, setEmail] = useState('anil.verma@lntepc.com');
  const [phone, setPhone] = useState('+91 98111 22334');
  
  const [quoteData, setQuoteData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleGenerateQuote = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    try {
      const payload = {
        company_name: companyName,
        contact_name: contactName,
        email,
        phone,
        organization_type: tier === 'contractor_pro' ? 'Construction EPC' : tier === 'fintech_api' ? 'NBFC / FinTech' : 'State Labor Mission',
        active_sites_count: activeSites,
        estimated_workers: workerCount,
        plan_tier: tier,
        billing_cycle: billingCycle
      };
      const res = await api.generateEnterpriseQuote(payload);
      setQuoteData(res);
    } catch (err) {
      alert('Failed to generate quote: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitLead = async () => {
    try {
      await api.submitContactSales({
        name: contactName,
        email,
        phone,
        company: companyName,
        plan_interest: quoteData ? quoteData.plan_name : tier,
        message: `Generated Quote ID: ${quoteData?.quote_id || 'Direct'} with ${workerCount} workers across ${activeSites} sites.`
      });
      setIsSubmitted(true);
    } catch (err) {
      alert('Error submitting inquiry: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="w-full max-w-4xl rounded-2xl shadow-2xl p-6 sm:p-8 my-8 relative bg-white animate-scale-in"
        style={{ border: '1px solid #C8DDD2', borderTop: '4px solid #1B4332', color: '#1A2E25' }}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-[#1B4332] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-xl p-0.5 shadow-md shrink-0" style={{ background: 'linear-gradient(135deg, #1B4332, #F4A900)' }}>
            <div className="w-full h-full rounded-[10px] flex items-center justify-center" style={{ background: '#1B4332' }}>
              <Calculator className="w-6 h-6 text-[#F4A900]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-['Playfair_Display'] text-[#1B4332]">
                Enterprise Pricing &amp; Quotation Engine
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: '#FFF3CD', color: '#C8860A', border: '1px solid #F4A900' }}>
                Official Commercial License
              </span>
            </div>
            <p className="text-xs text-[#5C7A6A] mt-0.5">
              Calculate commercial license fees, statutory compliance savings, and generate verified proposals.
            </p>
          </div>
        </div>

        {/* Plan Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            {
              id: 'contractor_pro',
              icon: Building2,
              title: 'Contractor Pro',
              subtitle: 'EPC & Construction Sites',
            },
            {
              id: 'fintech_api',
              icon: Landmark,
              title: 'FinTech & NBFC API',
              subtitle: 'Bank Underwriting Suite',
            },
            {
              id: 'enterprise_gov',
              icon: Layers,
              title: 'Sovereign GovTech',
              subtitle: 'State Labor Missions',
            }
          ].map(p => {
            const Icon = p.icon;
            const isSelected = tier === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => { setTier(p.id); setQuoteData(null); }}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'ring-2 ring-[#F4A900] shadow-sm'
                    : 'hover:border-[#1B4332]/40 bg-[#F8FAF9]'
                }`}
                style={isSelected ? { background: '#EAF5EE', borderColor: '#1B4332' } : { borderColor: '#C8DDD2' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-[#1B4332]" />
                  {isSelected && <Check className="w-4 h-4 text-[#1B7A3E]" />}
                </div>
                <div className="text-sm font-bold text-[#1B4332] font-['Playfair_Display']">{p.title}</div>
                <div className="text-[11px] text-[#5C7A6A]">{p.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Configuration Sliders & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          <div className="space-y-4 p-5 rounded-xl bg-[#F8FAF9]" style={{ border: '1px solid #C8DDD2' }}>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1B4332]">
              1. Deployment Parameters
            </h3>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#1A2E25] mb-1">
                <span>Active Work Sites:</span>
                <span className="text-[#C8860A] font-bold">{activeSites} Sites</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={activeSites}
                onChange={(e) => setActiveSites(parseInt(e.target.value))}
                className="w-full accent-[#1B4332]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#1A2E25] mb-1">
                <span>Active Worker Workforce:</span>
                <span className="text-[#1B7A3E] font-bold">{workerCount.toLocaleString('en-IN')} Workers</span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={workerCount}
                onChange={(e) => setWorkerCount(parseInt(e.target.value))}
                className="w-full accent-[#1B7A3E]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1A2E25] block mb-1">Billing Commitment:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                    billingCycle === 'annual' ? 'bg-[#EAF5EE] border-[#1B4332] text-[#1B4332]' : 'bg-white border-[#C8DDD2] text-[#5C7A6A]'
                  }`}
                >
                  Annual (20% Savings)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                    billingCycle === 'monthly' ? 'bg-[#EAF5EE] border-[#1B4332] text-[#1B4332]' : 'bg-white border-[#C8DDD2] text-[#5C7A6A]'
                  }`}
                >
                  Monthly Standard
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-5 rounded-xl bg-[#F8FAF9]" style={{ border: '1px solid #C8DDD2' }}>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1B4332]">
              2. Company &amp; Contact Details
            </h3>

            <div>
              <label className="text-[11px] text-[#5C7A6A] font-semibold block mb-0.5">Company / Organization:</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#C8DDD2] text-[#1A2E25] text-xs focus:border-[#1B4332] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-[#5C7A6A] font-semibold block mb-0.5">Contact Person:</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#C8DDD2] text-[#1A2E25] text-xs focus:border-[#1B4332] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#5C7A6A] font-semibold block mb-0.5">Phone:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#C8DDD2] text-[#1A2E25] text-xs focus:border-[#1B4332] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#5C7A6A] font-semibold block mb-0.5">Official Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#C8DDD2] text-[#1A2E25] text-xs focus:border-[#1B4332] focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerateQuote}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 mt-2 shadow-sm transition-all"
              style={{ background: '#1B4332', color: '#FFFFFF' }}
            >
              {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
              {quoteData ? 'Recalculate Proposal' : 'Generate Formal Proposal & Quote'}
            </button>
          </div>
        </div>

        {/* Rendered Official Quotation Dossier */}
        {quoteData && (
          <div
            className="p-6 rounded-xl space-y-4 animate-fade-in"
            style={{ background: '#EEF5F1', border: '1px solid #94B8A4', borderTop: '3px solid #1B4332' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C8DDD2] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-[#1B4332]">{quoteData.quote_id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF5EE] text-[#1B7A3E] border border-[#94B8A4]">
                    APPROVED PROPOSAL
                  </span>
                </div>
                <h4 className="text-lg font-bold font-['Playfair_Display'] text-[#1B4332] mt-1">
                  {quoteData.plan_name} — {quoteData.company_name}
                </h4>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black font-['Playfair_Display'] text-[#1B7A3E]">
                  ₹{quoteData.annual_discounted_total?.toLocaleString('en-IN')}{billingCycle === 'annual' ? '/yr' : '/mo'}
                </div>
                <div className="text-[10px] text-[#5C7A6A]">
                  Base Fee: ₹{quoteData.base_fee_monthly} + ₹{quoteData.usage_fee_per_worker}/worker/mo
                </div>
              </div>
            </div>

            {/* Savings highlight */}
            <div className="p-3.5 rounded-lg bg-white border border-[#94B8A4] flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-[#1B4332] font-semibold">
                <Sparkles className="w-4 h-4 text-[#F4A900] shrink-0" />
                <span>Estimated Annual Savings (Ghost worker elimination & statutory audit fine protection):</span>
              </div>
              <span className="text-sm font-black text-[#1B7A3E]">
                ₹{quoteData.savings_estimate_annual?.toLocaleString('en-IN')}/yr
              </span>
            </div>

            {/* Features list */}
            <div>
              <span className="text-[11px] text-[#5C7A6A] font-semibold uppercase tracking-wider block mb-2">
                Included Enterprise Modules:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2D5140]">
                {(quoteData.features_included || []).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B7A3E] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal guarantee */}
            <div className="text-[11px] text-[#5C7A6A] italic pt-2 border-t border-[#C8DDD2]">
              ⚖️ <strong>Compliance Guarantee:</strong> {quoteData.compliance_guarantee}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[10px] text-[#8FA89B] font-mono">
                Generated: {quoteData.generated_at} · {quoteData.valid_until}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSubmitLead}
                  disabled={isSubmitted}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isSubmitted ? 'bg-[#1B7A3E] text-white' : 'text-white'
                  }`}
                  style={!isSubmitted ? { background: '#1B4332' } : {}}
                >
                  {isSubmitted ? (
                    <>
                      <Check className="w-4 h-4" />
                      Inquiry Dispatched to Sales
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Request Commercial Onboarding
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
