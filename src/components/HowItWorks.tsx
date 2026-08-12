import React from 'react';
import { 
  FileSpreadsheet, 
  MapPin, 
  Cpu, 
  Wrench, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface HowItWorksProps {
  setActiveTab: (tab: string) => void;
  onOpenQuote: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ setActiveTab, onOpenQuote }) => {
  const steps = [
    {
      num: '01',
      title: 'Submit Site Connectivity Requirements',
      desc: 'Tell us your location, student or user count, campus square footage, and load-shedding power cut history using our quote form or AI Smart Network Planner.',
      icon: <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
    },
    {
      num: '02',
      title: 'Site Assessment & Topology Design',
      desc: 'ConnectBD engineering reviews the physical layout, maps RF signal coverage, plans outdoor cabling paths, and selects optimal lithium backup sizing.',
      icon: <MapPin className="w-6 h-6 text-indigo-400" />
    },
    {
      num: '03',
      title: 'Cross-Border Sourcing & QA Pre-Assembly',
      desc: 'Hardware is pulled from our pre-inspected Shenzhen stock, pre-flashed with ConnectBD firmware, and pre-configured for instant plug-and-play field setup.',
      icon: <Cpu className="w-6 h-6 text-blue-400" />
    },
    {
      num: '04',
      title: 'On-Site Field Deployment & Cabling',
      desc: 'Certified local field technicians arrive on-site, mount outdoor IP67 APs on poles, run UV-resistant Cat6 cabling, install the lithium UPS, and test throughput.',
      icon: <Wrench className="w-6 h-6 text-emerald-400" />
    },
    {
      num: '05',
      title: 'Managed Service SLA & Ongoing Monitoring',
      desc: 'Network goes live! Automated cloud health monitoring, speed capping, content security filters, and 24/7 ticket support ensure zero downtime.',
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />
    }
  ];

  return (
    <section className="bg-slate-900 py-16 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 uppercase tracking-wider">
            Simple 5-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How ConnectBD Deploys Your Network
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From initial requirement submission to local field installation and 24/7 SLA monitoring — a seamless end-to-end journey.
          </p>
        </div>

        {/* 5 Steps horizontal / vertical timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((s, idx) => (
            <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-cyan-800/60 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-cyan-400 font-mono">{s.num}</span>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">{s.icon}</div>
                </div>

                <h3 className="text-sm font-bold text-white">{s.title}</h3>

                <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-cyan-950 to-blue-950 p-6 rounded-2xl border border-cyan-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-base font-bold text-white">Ready to start Step 01?</h3>
            <p className="text-xs text-cyan-300">Run our AI Smart Network Planner or request a custom quotation in under 2 minutes.</p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveTab('planner')}
              className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Planner</span>
            </button>
            <button
              onClick={onOpenQuote}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 font-semibold text-xs rounded-xl border border-slate-700"
            >
              Request Quote
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
