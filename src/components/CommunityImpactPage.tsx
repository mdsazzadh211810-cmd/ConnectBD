import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  Heart, 
  Globe2, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const CommunityImpactPage: React.FC = () => {
  const pillars = [
    {
      title: 'Digital Education Enablement',
      icon: <GraduationCap className="w-6 h-6 text-indigo-400" />,
      desc: 'Connecting rural school campuses and computer labs allows students in Bogura, Rangpur, and Sylhet to access online educational portals, STEM courses, and global learning content without bandwidth bottlenecks.'
    },
    {
      title: 'Rural Community Inclusion',
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      desc: 'Deploying high-power outdoor Wi-Fi at village Union Parishads and community plazas provides affordable internet access for local farmers, craftsmen, and citizens accessing government e-services.'
    },
    {
      title: 'SME & Local Business Empowerment',
      icon: <Building2 className="w-6 h-6 text-emerald-400" />,
      desc: 'Empowering small garment factories, local hotels, and cottage industries with load-shed-resistant Wi-Fi and dual-WAN backup so digital invoicing and customer communication never stop during grid outages.'
    },
    {
      title: 'Local Technical Employment & Tech Transfer',
      icon: <Globe2 className="w-6 h-6 text-yellow-400" />,
      desc: 'Training and employing local young technicians in district headquarters across Bangladesh, creating skilled jobs in optical fiber splicing, RF alignment, and network field maintenance.'
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 uppercase tracking-wider">
            Social Purpose & Digital Inclusion
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Connecting Communities, Expanding Opportunity
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            ConnectBD is committed to reducing the digital divide in Bangladesh by bringing affordable, high-speed, load-shed-resistant connectivity to underserved regions.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p, idx) => (
            <div key={idx} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4 hover:border-cyan-800/60 transition-colors">
              <div className="w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center shrink-0 shadow-md">
                {p.icon}
              </div>

              <h3 className="text-lg font-bold text-white">{p.title}</h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {p.desc}
              </p>

              <div className="pt-2 flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold border-t border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Impact Pillar</span>
              </div>
            </div>
          ))}
        </div>

        {/* Real-World Demonstration Statement */}
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-3 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">Impact Verification Policy</h3>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            ConnectBD never publishes fake impact numbers or fabricated customer statistics. As deployments scale across districts, actual verified metrics (schools connected, students served, total network uptime) will be updated live in this portal.
          </p>
        </div>

      </div>
    </div>
  );
};
