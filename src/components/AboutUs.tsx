import React from 'react';
import { Globe2, ShieldCheck, Cpu, Users, Building2, CheckCircle2 } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 uppercase tracking-wider">
            China - Bangladesh Tech Corridor
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            About ConnectBD
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Empowering institutions, communities, and rural regions in Bangladesh with authentic, high-speed networking technology sourced directly from Shenzhen manufacturing hubs.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              ConnectBD was created to solve a fundamental problem in Bangladesh's digital expansion: the prevalence of expensive, counterfeit, or unmanaged gray-market network equipment that fails during power cuts or extreme weather.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              By establishing direct factory relationships with OEM manufacturers in Shenzhen, Guangdong, ConnectBD brings gigabit Wi-Fi 6 routers, IP67 outdoor access points, optical ONUs, and Lithium battery stations straight to Bangladesh — backed by certified local field engineers in all 64 districts.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Direct Factory Sourcing', desc: 'Zero middleman markups; authentic hardware with manufacturer warranty.' },
              { title: 'BTRC & Customs Compliance', desc: '100% legal import procedures under NBR BIN and BTRC equipment standards.' },
              { title: 'Built for Bangladesh Weather & Power', desc: 'Pre-tested for heat, humidity, and 4-hour power cut lithium backup.' },
              { title: 'Last-Mile Field SLA', desc: 'Local technician teams in every district ready for fast site surveys and maintenance.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
