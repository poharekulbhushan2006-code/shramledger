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
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card w-full max-w-4xl rounded-3xl border border-amber-500/30 shadow-2xl p-6 sm:p-8 my-8 relative animate-scale-up">
        
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
              <Calculator className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-100 font-['Outfit']">
                Enterprise Pricing & Quotation Engine
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Official Commercial License
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Calculate commercial license fees, statutory compliance savings, and instant proposal generation.
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
              color: 'border-amber-500 bg-amber-500/10 text-amber-300'
            },
            {
              id: 'fintech_api',
              icon: Landmark,
              title: 'FinTech & NBFC API',
              subtitle: 'Bank Underwriting Suite',
              color: 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
            },
            {
              id: 'enterprise_gov',
              icon: Layers,
              title: 'Sovereign GovTech',
              subtitle: 'State Labor Missions',
              color: 'border-purple-500 bg-purple-500/10 text-purple-300'
            }
          ].map(p => {
            const Icon = p.icon;
            const isSelected = tier === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => { setTier(p.id); setQuoteData(null); }}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  isSelected ? `${p.color} ring-2 ring-amber-500/30 scale-[1.02]` : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5" />
                  {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="text-sm font-bold text-slate-100">{p.title}</div>
                <div className="text-[11px] text-slate-400">{p.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Configuration Sliders & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
              1. Deployment Parameters
            </h3>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Active Work Sites:</span>
                <span className="text-amber-400 font-bold">{activeSites} Sites</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={activeSites}
                onChange={(e) => setActiveSites(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Active Worker Workforce:</span>
                <span className="text-emerald-400 font-bold">{workerCount.toLocaleString('en-IN')} Workers</span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={workerCount}
                onChange={(e) => setWorkerCount(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Billing Commitment:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    billingCycle === 'annual' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Annual (20% Savings)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    billingCycle === 'monthly' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Monthly Standard
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
              2. Company & Contact Details
            </h3>

            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-0.5">Company / Organization:</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-0.5">Contact Person:</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-0.5">Phone:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-0.5">Official Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerateQuote}
              disabled={isGenerating}
              className="w-full btn-primary py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mt-2"
            >
              {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
              {quoteData ? 'Recalculate Proposal' : 'Generate Formal Proposal & Quote'}
            </button>
          </div>
        </div>

        {/* Rendered Official Quotation Dossier */}
        {quoteData && (
          <div className="p-6 rounded-2xl bg-gradient-to-tr from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/30 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-amber-400">{quoteData.quote_id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    APPROVED PROPOSAL
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-100 font-['Outfit'] mt-1">
                  {quoteData.plan_name} — {quoteData.company_name}
                </h4>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-emerald-400 font-['Outfit']">
                  ₹{quoteData.annual_discounted_total?.toLocaleString('en-IN')}{billingCycle === 'annual' ? '/yr' : '/mo'}
                </div>
                <div className="text-[10px] text-slate-400">
                  Base Fee: ₹{quoteData.base_fee_monthly} + ₹{quoteData.usage_fee_per_worker}/worker/mo
                </div>
              </div>
            </div>

            {/* Savings highlight */}
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-emerald-300 font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Estimated Annual Savings (Ghost worker elimination & statutory audit fine protection):</span>
              </div>
              <span className="text-sm font-black text-emerald-300">
                ₹{quoteData.savings_estimate_annual?.toLocaleString('en-IN')}/yr
              </span>
            </div>

            {/* Features list */}
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-2">
                Included Enterprise Modules:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {(quoteData.features_included || []).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal guarantee */}
            <div className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800/80">
              ⚖️ <strong>Compliance Guarantee:</strong> {quoteData.compliance_guarantee}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[10px] text-slate-500 font-mono">
                Generated: {quoteData.generated_at} · {quoteData.valid_until}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSubmitLead}
                  disabled={isSubmitted}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isSubmitted ? 'bg-emerald-500 text-slate-950' : 'btn-primary'
                  }`}
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
