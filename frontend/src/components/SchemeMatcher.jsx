import React, { useState } from 'react';
import { 
  Building, 
  CheckCircle2, 
  ExternalLink, 
  FileCheck, 
  Sparkles, 
  ShieldCheck, 
  Percent, 
  ChevronRight,
  HelpCircle,
  IndianRupee,
  Award
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/locales';

export default function SchemeMatcher({ schemes, worker, currentLang }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  if (!schemes) return null;

  const categories = ['ALL', 'Credit', 'Social Security', 'Pension', 'Health'];

  const filteredSchemes = schemes.filter((s) => {
    if (selectedCategory === 'ALL') return true;
    return s.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-100">
                Government Welfare Schemes & Credit Products
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                {schemes.length} Matched
              </span>
            </div>
            <p className="text-xs text-slate-400">
              AI matching based on verified trade, location ({worker?.state}), and monthly income
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="p-5 rounded-3xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            {/* Header & Match Badge */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                    {scheme.ministry}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                    {currentLang === 'hi' && scheme.name_hi ? scheme.name_hi : scheme.name}
                  </h3>
                </div>

                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold shrink-0">
                  <Sparkles className="w-3 h-3" />
                  <span>{scheme.match_score}% Match</span>
                </div>
              </div>

              {/* Benefit Highlight Banner */}
              <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start space-x-2.5">
                <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-amber-200 leading-snug">
                  {scheme.benefit_amount}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                {currentLang === 'hi' && scheme.description_hi ? scheme.description_hi : scheme.description}
              </p>

              {/* Required Documents Checklist */}
              <div className="mt-3 pt-3 border-t border-slate-900 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Eligible Documents (Pre-Verified):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.required_documents?.map((doc, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 text-[11px] border border-slate-800 flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{doc}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-3 border-t border-slate-900/80 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Eligibility Confirmed</span>
              </span>

              <a
                href={scheme.action_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 text-xs font-bold transition-all flex items-center space-x-1.5 group-hover:shadow-md"
              >
                <span>Apply on Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
