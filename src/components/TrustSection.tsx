import React from 'react';
import { ShieldCheck, FileCheck, CheckCircle, ExternalLink, AlertCircle, Building2, Lock } from 'lucide-react';
import { ComplianceCertificate } from '../types';

interface TrustSectionProps {
  certificates?: ComplianceCertificate[];
  setActiveTab: (tab: string) => void;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ certificates = [], setActiveTab }) => {
  return (
    <section className="bg-white border-b border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center space-x-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Compliance & Credibility Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Verified Regulatory Status & Sourcing Transparency
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
              ConnectBD operates with full legal transparency. We publish our verified commercial registration, tax permits, and regulatory authorization paperwork directly for public inspection.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('compliance')}
            className="self-start md:self-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 shrink-0 shadow-2xs"
          >
            <span>View All Verified Documents</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
          {certificates.map((cert) => (
            <div 
              key={cert.id}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
                    {cert.category}
                  </span>
                  
                  {cert.verificationStatus === 'Verified' ? (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      <span>Paperwork Pending</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-900 mt-2.5 line-clamp-1">
                  {cert.title}
                </h3>

                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                  {cert.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
                <div><strong className="text-slate-700">Issuer:</strong> {cert.issuingAuthority}</div>
                <div><strong className="text-slate-700">ID / Ref:</strong> <span className="font-mono text-blue-700 font-semibold">{cert.certificateNumber}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Regulatory Warning / Policy Notice */}
        <div className="mt-8 p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 flex items-start space-x-3 text-xs text-slate-800 shadow-2xs">
          <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">ConnectBD Evidence-Based Compliance Guarantee:</span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              We adhere strictly to BTRC (Bangladesh Telecommunication Regulatory Commission) spectrum and equipment guidelines. ConnectBD never displays fabricated regulatory licenses or fake partner seals. All equipment imported from China undergoes factory QA testing prior to local deployment.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
