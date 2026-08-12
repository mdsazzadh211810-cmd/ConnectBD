import React from 'react';
import { 
  Wifi, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Globe2, 
  Building2, 
  GraduationCap, 
  Users, 
  Zap, 
  CheckCircle2,
  Check
} from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: string) => void;
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab, onOpenQuote }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-white text-slate-900 py-16 lg:py-24 border-b border-slate-200">
      {/* Background Decorative Grids & Soft Radial Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/80 rounded-full px-3.5 py-1 text-xs text-blue-800 font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>China ➔ Bangladesh Cross-Border Connectivity Platform</span>
              <span className="text-blue-400">•</span>
              <span className="text-slate-700 font-bold">Managed Networks</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Connect Bangladesh. <br className="hidden sm:inline" />
              <span className="text-blue-600">
                Power Possibility.
              </span>
            </h1>

            {/* Supporting Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Smart, affordable and professionally managed connectivity solutions powered by cross-border networking technology sourced directly from China and deployed locally across schools, communities, and businesses in Bangladesh.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => setActiveTab('solutions')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/15 flex items-center justify-center space-x-2"
              >
                <span>Explore Solutions</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('planner')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 transition-all shadow-2xs flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Build My Connectivity Plan (AI)</span>
              </button>

              <button
                onClick={onOpenQuote}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
              >
                Talk to an Expert
              </button>
            </div>

            {/* Key Value Trust Chips */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-blue-700 font-extrabold text-sm flex items-center space-x-1">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Sourced in China</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Direct Shenzhen OEM hardware</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-blue-700 font-extrabold text-sm flex items-center space-x-1">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Deployed Locally</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Certified BD field engineers</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-blue-700 font-extrabold text-sm flex items-center space-x-1">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Managed SLA</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">24/7 maintenance & monitoring</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-blue-700 font-extrabold text-sm flex items-center space-x-1">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Load-Shed Protection</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Integrated Lithium UPS backup</div>
              </div>
            </div>

          </div>

          {/* Right Column Interactive Network Supply Chain Visualizer */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Cross-Border Deployment Map</span>
                </div>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
                  LIVE PIPELINE
                </span>
              </div>

              {/* Step-by-step Visual Network Route */}
              <div className="py-6 space-y-5 relative">
                
                {/* Visual Route Line */}
                <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-emerald-500 z-0" />

                {/* Node 1: Shenzhen Manufacturing */}
                <div className="relative z-10 flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 shrink-0 shadow-md">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Shenzhen Technology Hub</span>
                      <span className="text-[10px] text-slate-500 font-mono">CHINA</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">AX3000 Wi-Fi 6, IP67 Outdoor APs & Lithium UPS Sourcing</p>
                  </div>
                </div>

                {/* Node 2: Cross-Border Compliance & Freight */}
                <div className="relative z-10 flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 shrink-0 shadow-md">
                    <Globe2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Customs & Quality Inspection</span>
                      <span className="text-[10px] text-blue-700 font-mono font-bold">IN TRANSIT</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">NBR Customs Import clearance & QA electrical testing</p>
                  </div>
                </div>

                {/* Node 3: Bangladesh Deployment & Local Hubs */}
                <div className="relative z-10 flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0 shadow-md">
                    <Wifi className="w-6 h-6" />
                  </div>
                  <div className="flex-1 bg-emerald-50/50 p-3 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Bangladesh Local Field Deployment</span>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold">READY</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">ABC Education Center & Community Union Hubs active</p>
                  </div>
                </div>

              </div>

              {/* Bottom Quick Action Box */}
              <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Need a custom layout for your institution?</div>
                  <div className="text-[11px] text-blue-300">Run our Smart Network Planner AI in seconds</div>
                </div>
                <button
                  onClick={() => setActiveTab('planner')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors shrink-0 shadow-xs"
                >
                  Start Planner
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
