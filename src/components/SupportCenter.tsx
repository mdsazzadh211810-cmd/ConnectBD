import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Ticket
} from 'lucide-react';
import { UserProfile, SupportTicket } from '../types';

interface SupportCenterProps {
  currentUser?: UserProfile;
  tickets?: SupportTicket[];
  onCreateTicket?: (subject: string, category: any, text: string) => void;
  onOpenTicketModal?: () => void;
}

export const SupportCenter: React.FC<SupportCenterProps> = ({
  currentUser,
  tickets = [],
  onCreateTicket,
  onOpenTicketModal
}) => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      q: 'How are ConnectBD hardware products sourced from Shenzhen?',
      a: 'ConnectBD works directly with certified networking OEMs in Shenzhen, Guangdong. Hardware undergoes electrical and thermal stress testing before being imported legally under BTRC equipment compliance standards and NBR customs clearance.'
    },
    {
      q: 'Does ConnectBD handle physical installation and cabling in rural Bangladesh?',
      a: 'Yes. ConnectBD provides certified local field engineers in all 64 districts who handle pole mounting, IP67 outdoor access point installations, Cat6 conduit cabling, optical ONU fiber drop connections, and Lithium UPS power wiring.'
    },
    {
      q: 'How does the Smart Network Planner work?',
      a: 'Our Smart Network Planner uses server-side Gemini AI models trained on Bangladesh network infrastructure parameters. By analyzing your building area, user count, and load-shedding frequency, it calculates the exact required hardware, battery capacity, and estimated BDT costs.'
    },
    {
      q: 'What warranty and SLA support is included with purchases?',
      a: 'All ConnectBD products include a 1 to 3 Year hardware replacement warranty. Managed Connectivity Packages include 24/7 cloud health monitoring, zero-downtime hardware swaps, and rapid field technician dispatches under a monthly SLA.'
    },
    {
      q: 'Can ConnectBD provide formal corporate or institutional quotations for grants/tenders?',
      a: 'Yes! ConnectBD issues official PDF quotations and tax invoices with BIN / TIN credentials suitable for schools, universities, NGOs, government Union Parishad projects, and corporate procurement.'
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(searchTerm.toLowerCase()) || f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 uppercase tracking-wider">
            24/7 Managed Customer Service
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Help & Technical Support
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Find quick answers regarding Shenzhen sourcing, local field installation, warranty coverage, and BTRC compliance, or open a technical support ticket.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenTicketModal}
              className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center space-x-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Open Support Ticket</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FAQs (e.g., installation, warranty, BTRC)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Frequently Asked Questions</h2>
          
          {filteredFaqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                className="w-full p-4 text-left flex justify-between items-center space-x-4 font-bold text-xs sm:text-sm text-white hover:text-cyan-300"
              >
                <span>{faq.q}</span>
                {openFaqIdx === idx ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {openFaqIdx === idx && (
                <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
