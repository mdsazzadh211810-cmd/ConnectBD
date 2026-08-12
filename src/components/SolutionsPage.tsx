import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  Radio, 
  Wifi, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Wrench,
  ChevronRight
} from 'lucide-react';

interface SolutionsPageProps {
  setActiveTab: (tab: string) => void;
  onOpenQuote: () => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({ setActiveTab, onOpenQuote }) => {
  const [selectedSolution, setSelectedSolution] = useState<'community' | 'education' | 'business' | 'remote'>('community');

  const solutions = [
    {
      id: 'community',
      title: 'Community Connectivity',
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      forWho: 'Villages, Union Parishads, Public Plazas & Community Organizations',
      headline: 'Shared, High-Density Wi-Fi Infrastructure for Rural Villages & Hubs',
      description: 'Provides scalable public and private Wi-Fi coverage for rural union centers, local markets, and village gathering hubs. Built to survive harsh outdoor weather and power grid fluctuations.',
      keyCapabilities: [
        'Shared High-Density Wi-Fi supporting 100-300 concurrent mobile users',
        'IP67 Weatherproof Outdoor Access Points for open bazaars & plazas',
        'Centralized captive portal with customizable speed limit caps',
        'Lithium LiFePO4 battery power stations for zero load-shed interruption',
        'Complete local cable routing and pole-mounting by ConnectBD technicians'
      ],
      hardwareIncludes: [
        'ConnectBD AX3000 Gigabit Gateway Router',
        'IP67 High-Power Dual-Band Outdoor Access Points',
        '1x Optical GPON ONU Fiber Terminal',
        '1x Smart Lithium Battery Station (4-Hour Load)'
      ],
      startingPrice: '12,500 BDT',
      ctaText: 'Design a Community Network'
    },
    {
      id: 'education',
      title: 'Education Connectivity',
      icon: <GraduationCap className="w-6 h-6 text-indigo-400" />,
      forWho: 'Schools, Colleges, Universities, Vocational Labs & Libraries',
      headline: 'Campus-Wide High-Speed Wi-Fi for Digital Classrooms & Labs',
      description: 'Dedicated institutional network architecture supporting classroom learning, multimedia streaming, research labs, and administrative operations with secure network segmentation.',
      keyCapabilities: [
        'Separated Student Wi-Fi vs Faculty Wi-Fi network segmentation',
        'Content filtering and web safety rules designed for school environments',
        'High-density indoor access points optimized for 40+ students per room',
        'Digital classroom bandwidth prioritization during class hours',
        '3-Year Dedicated Educational SLA & field technician maintenance'
      ],
      hardwareIncludes: [
        'ConnectBD Enterprise Core Router with Multi-VLAN support',
        'High-Density Indoor Access Points (Ceiling Mount)',
        'Managed 16-Port Gigabit PoE+ Switch',
        'IP67 Campus Field Outdoor Access Points'
      ],
      startingPrice: '45,000 BDT',
      ctaText: 'Build an Education Network'
    },
    {
      id: 'business',
      title: 'Business Connectivity',
      icon: <Building2 className="w-6 h-6 text-emerald-400" />,
      forWho: 'SMEs, Garments Factories, Hotels, Restaurants & Corporate Offices',
      headline: 'Business-Grade Wi-Fi & Redundant Multi-WAN Failover',
      description: 'Enterprise networking designed for business continuity. Combines high-speed local fiber drops with LTE backhaul failover and branded guest portals.',
      keyCapabilities: [
        'Dual-ISP Load Balancing & instant failover preventing order loss',
        'Custom Branded Guest Login Portal for hotel guests and cafe customers',
        'Department VLAN isolation (Accounting, Operations, Guest Wi-Fi)',
        'Encrypted VPN tunnels for inter-office or factory site connectivity',
        '24/7 Priority Business SLA with rapid replacement guarantees'
      ],
      hardwareIncludes: [
        'Multi-WAN Load Balancing Core Router',
        'Wi-Fi 6 Indoor Access Points',
        '8-Port Smart Managed PoE Switch',
        'LiFePO4 Lithium UPS Power Station'
      ],
      startingPrice: '32,000 BDT',
      ctaText: 'Build a Business Network'
    },
    {
      id: 'remote',
      title: 'Remote & Off-Grid Connectivity',
      icon: <Radio className="w-6 h-6 text-yellow-400" />,
      forWho: 'River Islands (Chars), Remote Clinics, Aquaculture Farms & Off-Grid Sites',
      headline: 'Long-Distance Wireless Bridges & Solar Hybrid Links',
      description: 'Overcomes the lack of physical fiber cables in remote riverine areas. Uses 15km directional 5GHz CPE antennas paired with solar backup power.',
      keyCapabilities: [
        '15km Line-of-Sight Wireless Bridge connecting remote sites to fiber nodes',
        'Integrated Solar Array & Lithium Battery Enclosure for 24/7 off-grid power',
        'Heavy-duty anti-corrosion dish mountings for riverine humidity and winds',
        'High-throughput 450Mbps aggregate real wireless link speed',
        'Remote telemetry & automated signal link health monitoring'
      ],
      hardwareIncludes: [
        'Pair of 5GHz 23dBi High-Gain Directional CPE Dish Antennas',
        'High-Power Outdoor Gateway AP',
        'Solar Charge Controller & LiFePO4 Battery Enclosure',
        'Heavy-Duty Mounting Mast Kit'
      ],
      startingPrice: '58,000 BDT',
      ctaText: 'Design a Remote Hybrid Link'
    }
  ];

  const current = solutions.find((s) => s.id === selectedSolution) || solutions[0];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 uppercase tracking-wider">
            Turnkey Network Solutions
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Tailored Connectivity Solutions for Bangladesh
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Whether you are connecting a rural union school, a multi-story hotel, or a remote river island facility, ConnectBD provides end-to-end hardware procurement, installation, and SLA management.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          {solutions.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSolution(s.id as any)}
              className={`p-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 text-left ${
                selectedSolution === s.id
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="shrink-0">{s.icon}</span>
              <span className="truncate">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Active Solution Detail Card */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                  Target: {current.forWho}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white pt-1">
                  {current.headline}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {current.description}
                </p>
              </div>

              {/* Key Capabilities */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Key Solution Capabilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {current.keyCapabilities.map((cap, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 leading-snug">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing & Package Highlight Box */}
            <div className="lg:col-span-4 bg-slate-950 p-6 rounded-2xl border border-cyan-900/60 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-xs text-slate-400 font-medium">Estimated Solution Cost</span>
                  <div className="text-2xl font-black text-white mt-0.5">
                    Starting from <span className="text-cyan-400">{current.startingPrice}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">* Price includes hardware, cables & local technician setup</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Included Hardware Sourcing:</span>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {current.hardwareIncludes.map((hw, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{hw}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2.5 pt-4">
                <button
                  onClick={onOpenQuote}
                  className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md flex items-center justify-center space-x-2"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('planner')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Customize with AI Planner</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
