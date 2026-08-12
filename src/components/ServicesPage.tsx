import React, { useState } from 'react';
import { 
  Wrench, 
  MapPin, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Settings, 
  Calendar, 
  Send 
} from 'lucide-react';

interface ServicesPageProps {
  onOpenQuote: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenQuote }) => {
  const [serviceType, setServiceType] = useState('On-Site Physical Installation');
  const [district, setDistrict] = useState('Dhaka');
  const [submitted, setSubmitted] = useState(false);

  const servicesList = [
    {
      title: 'On-Site RF Survey & Cable Path Design',
      desc: 'Certified field engineers visit your school, office or community center to map Wi-Fi attenuation, optical signal loss, and optimal mounting poles.',
      turnaround: '1 - 2 Business Days',
      price: 'Free with Package Purchase / ৳2,500 Standalone'
    },
    {
      title: 'On-Site Physical Installation & Cabling',
      desc: 'Complete mounting of outdoor IP67 access points, core routers, PoE switches, Cat6 outdoor PVC conduits, and lithium battery UPS units.',
      turnaround: '1 Day Deployment',
      price: 'Included in Packages'
    },
    {
      title: 'Network Configuration & Speed Optimization',
      desc: 'Custom SSID creation, student/faculty bandwidth capping, Multi-WAN ISP failover setup, and branded hotel/cafe guest portals.',
      turnaround: 'Same-Day Activation',
      price: 'Included in Packages'
    },
    {
      title: '24/7 Managed SLA & Field Technician Dispatch',
      desc: 'Remote automated cloud link monitoring, zero-cost replacement of damaged gear under warranty, and rapid on-site technician dispatches.',
      turnaround: '< 4 Hour SLA Response',
      price: 'Monthly SLA Subscription'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 uppercase tracking-wider">
            Turnkey Field Engineering
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Managed Field & Installation Services
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Professional network installation, site surveys, outdoor cable trenching, and ongoing 24/7 technical SLA maintenance across all 64 districts in Bangladesh.
          </p>
        </div>

        {/* Services List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicesList.map((s, idx) => (
            <div key={idx} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 hover:border-cyan-800/60 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-cyan-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{s.title}</h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {s.desc}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-800 text-slate-400">
                <span>Response Time: <strong className="text-slate-200">{s.turnaround}</strong></span>
                <span className="text-cyan-400 font-bold">{s.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Form Card */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-xl max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <h2 className="text-xl font-bold text-white">Book a Service Visit / Technician Survey</h2>
            <p className="text-xs text-slate-400">Schedule an on-site visit by a certified ConnectBD field technician anywhere in Bangladesh.</p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-950/80 rounded-2xl border border-emerald-800/80 text-emerald-300 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold">Service Request Booked Successfully!</h3>
              <p className="text-xs text-emerald-200">A ConnectBD Operations Coordinator will contact you within 2 hours to confirm your site visit time.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Service Type</label>
                  <select 
                    value={serviceType} 
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option>On-Site Physical Installation</option>
                    <option>RF Site Survey & Cable Path Mapping</option>
                    <option>Network Speed Optimization & Config</option>
                    <option>Device Maintenance & Warranty Replacement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">District / Division</label>
                  <input 
                    type="text" 
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g., Bogura, Chattogram, Sylhet, Dhaka"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contact Name</label>
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    placeholder="+880 1700-000000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Site Address & Special Requirements</label>
                <textarea 
                  rows={3}
                  placeholder="Provide campus/building details or specific installation notes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Field Service Request</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
