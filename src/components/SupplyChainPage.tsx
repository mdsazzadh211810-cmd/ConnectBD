import React from 'react';
import { 
  Globe2, 
  Cpu, 
  ShieldCheck, 
  Truck, 
  Building2, 
  Wrench, 
  CheckCircle2, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';

export const SupplyChainPage: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'China OEM Manufacturing Sourcing',
      location: 'Shenzhen & Guangdong, China',
      desc: 'ConnectBD directly partners with leading hardware manufacturers in Shenzhen for Wi-Fi 6 gigabit routers, outdoor IP67 access points, and optical ONU terminals at factory OEM costs.',
      icon: <Cpu className="w-6 h-6 text-cyan-400" />
    },
    {
      step: '02',
      title: 'Factory QA Electrical & Safety Testing',
      location: 'CQC Inspection Lab, Shenzhen',
      desc: 'Every hardware batch undergoes rigorous electrical surge testing, high-temperature heat chamber testing (up to 60°C), and ISO 9001 quality assurance prior to packing.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />
    },
    {
      step: '03',
      title: 'Cross-Border Freight & Customs Clearance',
      location: 'NBR Customs & Chattogram Port, BD',
      desc: 'Official import processing under ConnectBD NBR BIN tax registration and BTRC equipment clearance standards, ensuring zero counterfeit or smuggled gray-market gear.',
      icon: <Truck className="w-6 h-6 text-blue-400" />
    },
    {
      step: '04',
      title: 'Bangladesh Central Warehouse Inventory',
      location: 'Dhaka & Chattogram Logistics Hubs',
      desc: 'Sourced inventory is stored locally with pre-flashed custom ConnectBD firmware, pre-tested LiFePO4 battery power stations, and replacement warranty stock.',
      icon: <PackageCheck className="w-6 h-6 text-yellow-400" />
    },
    {
      step: '05',
      title: 'Local Field Technician Deployment & SLA',
      location: 'All 64 Districts, Bangladesh',
      desc: 'Certified local field engineers carry out physical pole-mounting, outdoor Cat6 PVC conduit routing, speed testing, and log device serial numbers into the customer dashboard.',
      icon: <Wrench className="w-6 h-6 text-purple-400" />
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 uppercase tracking-wider">
            China ➔ Bangladesh Cross-Border Engine
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Cross-Border Technology Supply Chain
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            How ConnectBD bridges world-class networking hardware ecosystems in Shenzhen with last-mile community and institutional deployment across Bangladesh.
          </p>
        </div>

        {/* Visual Supply Chain Steps */}
        <div className="space-y-6">
          {steps.map((s, idx) => (
            <div 
              key={idx}
              className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-cyan-800/60 transition-colors"
            >
              <div className="flex items-start space-x-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-md">
                  {s.icon}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-cyan-400 font-mono">STEP {s.step}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{s.location}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{s.title}</h3>

                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-emerald-400 flex items-center space-x-1.5 self-start md:self-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Quality Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Cross-Border Guarantee Banner */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 p-8 rounded-3xl border border-cyan-800/60 space-y-3 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">Direct Sourcing Guarantee: Authentic Gear, Zero Gray-Market Risks</h3>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Unlike informal hardware importers, ConnectBD maintains strict direct factory relationships with Shenzhen networking original equipment manufacturers. Every item sold on ConnectBD carries full replacement warranty and custom firmware engineered for Bangladesh weather and power grid conditions.
          </p>
        </div>

      </div>
    </div>
  );
};
