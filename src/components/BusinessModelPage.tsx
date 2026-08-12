import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Users, 
  BarChart3 
} from 'lucide-react';

export const BusinessModelPage: React.FC = () => {
  const streams = [
    {
      title: '01. Hardware Procurement Margins',
      desc: 'Direct OEM purchasing from Shenzhen manufacturers enables competitive retail and wholesale margins on Wi-Fi 6 routers, outdoor APs, and lithium UPS units in Bangladesh.',
      type: 'Direct Product Sales'
    },
    {
      title: '02. Connectivity Package Bundles',
      desc: 'Pre-engineered turnkey bundles (Community Basic, Education Campus, Business Pro) combining hardware, cabling, and deployment fees.',
      type: 'Turnkey Solution Revenue'
    },
    {
      title: '03. Managed SLA & Subscription Retainers',
      desc: 'Recurring monthly fees for 24/7 cloud network monitoring, speed capping management, content filtering, and priority technician SLA support.',
      type: 'Recurring Monthly Revenue (MRR)'
    },
    {
      title: '04. Physical Field Installation & Cabling Fees',
      desc: 'Fixed-rate fees for physical pole-mounting, outdoor PVC conduit cabling, and optical fiber patch terminations carried out by ConnectBD field engineers.',
      type: 'Service Fee Revenue'
    },
    {
      title: '05. Custom Enterprise & Institutional Projects',
      desc: 'Tailored high-density wireless deployments for university campuses, industrial garments EPZs, and riverine district connectivity projects.',
      type: 'Custom B2B / B2G Contracting'
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 uppercase tracking-wider">
            Commercial Architecture & Financial Structure
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ConnectBD Business Model
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            A diversified multi-stream commercial model combining cross-border e-commerce, turnkey solution engineering, and recurring managed connectivity SLA subscriptions.
          </p>
        </div>

        {/* Revenue Streams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((st, idx) => (
            <div key={idx} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                  {st.type}
                </span>
                <h3 className="text-base font-bold text-white pt-1">{st.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Business Logic</span>
              </div>
            </div>
          ))}
        </div>

        {/* Unit Economics Highlight Card */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <h3 className="text-xl font-bold text-white">Representative Unit Economics (Education Package Example)</h3>
            <p className="text-xs text-slate-400">Illustrative breakdown for an Education Campus Network package deployment</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block">Gross Sourced Hardware Cost</span>
              <span className="text-xl font-bold text-white mt-1">৳28,500</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Shenzhen OEM Direct Sourcing</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block">Customer Turnkey Price</span>
              <span className="text-xl font-bold text-cyan-400 mt-1">৳45,000</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Includes Cables & Installation</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block">Recurring Monthly SLA Fee</span>
              <span className="text-xl font-bold text-emerald-400 mt-1">৳5,000/mo</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">24/7 SLA Monitoring & Field Support</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
