import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Wrench, 
  Globe2, 
  Cpu, 
  Layers, 
  TrendingUp, 
  ArrowRight 
} from 'lucide-react';

interface ProblemSolutionProps {
  setActiveTab: (tab: string) => void;
  onOpenQuote: () => void;
}

export const ProblemSolution: React.FC<ProblemSolutionProps> = ({ setActiveTab, onOpenQuote }) => {
  const problems = [
    {
      title: 'Uneven Rural & Institutional Coverage',
      desc: 'Schools, community centers, and district SMEs struggle with weak consumer-grade routers that fail under dense user loads or large campus footprints.'
    },
    {
      title: 'Power Grid Load-Shedding Interruption',
      desc: 'Frequent 2-4 hour daily power outages disconnect online classes, remote banking, and digital commerce unless expensive UPS systems are manually configured.'
    },
    {
      title: 'Hardware Procurement & Import Friction',
      desc: 'High markup on imported networking equipment, fake grade-B hardware in local markets, and lack of direct OEM manufacturer warranties.'
    },
    {
      title: 'Lack of Ongoing Managed SLA Support',
      desc: 'Local internet service providers drop off hardware at the door, leaving non-technical school principals or union parishads unable to troubleshoot cable or config bugs.'
    }
  ];

  const solutionPillars = [
    {
      icon: <Globe2 className="w-6 h-6 text-blue-600" />,
      title: 'Cross-Border Sourcing',
      desc: 'Direct OEM partnership with Shenzhen technology hubs ensuring authentic Wi-Fi 6, IP67 outdoor APs, and optical ONU gear at factory costs.'
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Lithium Load-Shed Immunity',
      desc: 'Every ConnectBD package includes integrated LiFePO4 battery power stations guaranteeing 4+ hours of uninterrupted network uptime.'
    },
    {
      icon: <Wrench className="w-6 h-6 text-emerald-600" />,
      title: 'Turnkey Field Deployment',
      desc: 'Certified local field technicians perform on-site physical cabling, AP mounting, speed optimization, and log device serial numbers.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      title: 'Managed Service SLA',
      desc: 'Remote cloud monitoring, automated speed capping, content filtering, and 24/7 technical ticket support with replacement warranty.'
    }
  ];

  return (
    <section className="bg-slate-50 py-16 lg:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200 uppercase tracking-wider shadow-2xs">
            Market Challenge & Ecosystem Solution
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Bridging the Last-Mile Connectivity Gap in Bangladesh
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Connecting communities and institutions isn’t just about selling a router — it requires an integrated, resilient cross-border supply chain and local managed support.
          </p>
        </div>

        {/* Problem vs Solution Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Problem Card Column */}
          <div className="lg:col-span-5 bg-red-50/40 p-6 sm:p-8 rounded-2xl border border-red-200 space-y-6 flex flex-col justify-between shadow-2xs">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 text-red-700 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span>The Bangladesh Connectivity Challenge</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Why Standard Retail Internet Fails Local Organizations
              </h3>
            </div>

            <div className="space-y-3.5">
              {problems.map((p, idx) => (
                <div key={idx} className="p-3.5 bg-white rounded-xl border border-red-100 shadow-2xs space-y-1">
                  <div className="text-xs font-bold text-red-800 flex items-center space-x-1.5">
                    <span className="text-red-600 font-mono">0{idx + 1}.</span>
                    <span>{p.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-500 border-t border-red-200/60">
              * Based on local connectivity surveys in rural school districts and SME industrial parks.
            </div>
          </div>

          {/* Solution Column */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 text-blue-700 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>The ConnectBD Ecosystem Approach</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Connectivity-as-a-Service: Procurement + Local SLA
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {solutionPillars.map((s, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all space-y-2">
                  <div className="p-2 bg-white rounded-lg w-fit border border-slate-200 shadow-2xs">
                    {s.icon}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{s.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div>
                <div className="text-xs font-bold text-white">Ready to upgrade your school or community center?</div>
                <div className="text-[11px] text-blue-300">Run our AI Smart Network Planner or request a custom quote.</div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setActiveTab('planner')}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs"
                >
                  AI Planner
                </button>
                <button
                  onClick={onOpenQuote}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 font-semibold text-xs rounded-lg border border-slate-700"
                >
                  Custom Quote
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
