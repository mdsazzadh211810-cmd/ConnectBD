import React from 'react';
import { Wifi, ShieldCheck, Mail, Phone, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenQuote }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-9 h-9 rounded-xl bg-blue-600 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">CONNECT<span className="text-blue-400">BD</span></span>
                <p className="text-[10px] text-slate-400 font-medium">Cross-Border Connectivity Technology</p>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm text-xs">
              ConnectBD is a China–Bangladesh cross-border connectivity technology platform sourcing hardware directly from Shenzhen technology hubs and deploying managed connectivity solutions for educational institutions, communities, SMEs, and rural organizations in Bangladesh.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 shadow-2xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Regulatory Compliance Notice</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-normal">
                Registered under DNCC Trade License & NBR Import BIN. BTRC equipment sourcing paperwork is under official regulatory verification. ConnectBD publishes verified compliance documents directly in our Compliance Center.
              </p>
            </div>
          </div>

          {/* Column 1: Solutions */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] text-blue-400">Solutions</h4>
            <ul className="space-y-2 text-slate-300">
              <li><button onClick={() => setActiveTab('solutions')} className="hover:text-blue-300 transition-colors">Community Wi-Fi</button></li>
              <li><button onClick={() => setActiveTab('solutions')} className="hover:text-blue-300 transition-colors">Education Campus Network</button></li>
              <li><button onClick={() => setActiveTab('solutions')} className="hover:text-blue-300 transition-colors">SME & Business Network</button></li>
              <li><button onClick={() => setActiveTab('solutions')} className="hover:text-blue-300 transition-colors">Remote Char / Wireless CPE</button></li>
              <li><button onClick={() => setActiveTab('planner')} className="text-blue-400 font-medium hover:underline flex items-center space-x-1">
                <span>Smart Network Planner AI</span>
                <ArrowRight className="w-3 h-3" />
              </button></li>
            </ul>
          </div>

          {/* Column 2: E-Commerce & Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] text-blue-400">Products & Services</h4>
            <ul className="space-y-2 text-slate-300">
              <li><button onClick={() => setActiveTab('products')} className="hover:text-blue-300 transition-colors">AX3000 Wi-Fi 6 Routers</button></li>
              <li><button onClick={() => setActiveTab('products')} className="hover:text-blue-300 transition-colors">IP67 Outdoor Access Points</button></li>
              <li><button onClick={() => setActiveTab('products')} className="hover:text-blue-300 transition-colors">Optical ONU Terminals</button></li>
              <li><button onClick={() => setActiveTab('products')} className="hover:text-blue-300 transition-colors">Lithium Battery UPS Units</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-blue-300 transition-colors">Site Survey & Cabling</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-blue-300 transition-colors">Managed Network SLA</button></li>
            </ul>
          </div>

          {/* Column 3: Corporate & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] text-blue-400">Company & Contact</h4>
            <ul className="space-y-2 text-slate-300">
              <li><button onClick={() => setActiveTab('about')} className="hover:text-blue-300 transition-colors">About ConnectBD</button></li>
              <li><button onClick={() => setActiveTab('supply-chain')} className="hover:text-blue-300 transition-colors">China-BD Supply Chain</button></li>
              <li><button onClick={() => setActiveTab('business-model')} className="hover:text-blue-300 transition-colors">Business Model</button></li>
              <li><button onClick={() => setActiveTab('compliance')} className="hover:text-blue-300 transition-colors">Compliance & Certifications</button></li>
              <li><button onClick={() => setActiveTab('support')} className="hover:text-blue-300 transition-colors">Help & Ticket Center</button></li>
            </ul>

            <div className="pt-2 space-y-1.5 text-slate-400 text-[11px]">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Banani Tech Tower, Level 8, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>contact@connectbd.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>+880 2-9876543 / +880 1700-000000</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} <strong>ConnectBD Technology Ltd.</strong> All rights reserved. Connecting Technology. Expanding Access.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('compliance')} className="hover:text-white underline">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setActiveTab('compliance')} className="hover:text-white underline">Terms of Service</button>
            <span>•</span>
            <button onClick={() => setActiveTab('compliance')} className="hover:text-white underline">Warranty & Returns</button>
            <span>•</span>
            <button onClick={() => setActiveTab('compliance')} className="hover:text-white underline">Regulatory Status</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
