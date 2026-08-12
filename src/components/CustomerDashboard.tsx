import React, { useState } from 'react';
import { UserProfile, Order, QuoteRequest, SupportTicket, TechnicianJob } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  Ticket, 
  FileText, 
  Wifi, 
  Cpu, 
  AlertCircle, 
  Download, 
  ChevronRight 
} from 'lucide-react';

interface CustomerDashboardProps {
  currentUser?: UserProfile;
  orders?: Order[];
  quotes?: QuoteRequest[];
  tickets?: SupportTicket[];
  jobs?: TechnicianJob[];
  onOpenTicketModal?: () => void;
  setActiveTab?: (tab: string) => void;
  onOpenQuote?: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  orders = [],
  quotes = [],
  tickets = [],
  jobs = [],
  onOpenTicketModal,
  setActiveTab,
  onOpenQuote
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'quotes' | 'devices' | 'tickets'>('orders');

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Greeting Header */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-bold text-white">
                {currentUser.name.charAt(0)}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-white">{currentUser.name}</h1>
                <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800">
                  Verified Account
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.organization || 'Community Customer'} • {currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenTicketModal}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <Ticket className="w-4 h-4" />
              <span>Open Support Ticket</span>
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              New AI Plan
            </button>
          </div>
        </div>

        {/* Dashboard Subtabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'orders', label: `My Orders (${orders.length})` },
            { id: 'quotes', label: `Quotation Requests (${quotes.length})` },
            { id: 'devices', label: 'Registered Devices' },
            { id: 'tickets', label: `Support Tickets (${tickets.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Orders & Live Delivery Tracking */}
        {activeSubTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center text-slate-400 text-xs">
                No orders found. Browse packages or hardware to create an order.
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
                  
                  {/* Order Title Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                        {ord.orderNumber}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">
                        Order for {ord.organizationName}
                      </h3>
                      <p className="text-xs text-slate-400">Placed on {ord.createdAt} • Payment: <strong className="text-emerald-400">{ord.paymentStatus} ({ord.paymentMethod})</strong></p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total Paid</span>
                      <span className="text-2xl font-black text-white">৳{ord.totalBDT.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Live Tracking Timeline */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Live Cross-Border Deployment Timeline:</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {ord.trackingSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                            step.completed
                              ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                              : step.current
                              ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 font-bold">
                            {step.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span className="truncate">{step.title}</span>
                          </div>
                          <div className="text-[10px] opacity-80">{step.date || 'Pending'}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Purchased Items */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Purchased Hardware & Services:</span>
                    <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800/80 text-xs">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="p-3 flex justify-between">
                          <div>
                            <span className="text-white font-semibold">{it.item.name}</span>
                            <span className="text-slate-400 text-[11px] block">
                              Qty: {it.quantity} {it.includeInstallation ? '• Includes On-Site Cabling' : ''}
                            </span>
                          </div>
                          <span className="text-cyan-300 font-bold">
                            ৳{((it.item as any).priceBDT || (it.item as any).startingPriceBDT || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Quotations */}
        {activeSubTab === 'quotes' && (
          <div className="space-y-4">
            {quotes.map((q) => (
              <div key={q.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {q.quoteNumber}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{q.organizationName}</h3>
                    <p className="text-xs text-slate-400">{q.location} • {q.numberOfUsers} users • {q.coverageAreaSqFt} sq ft</p>
                  </div>
                  <span className="px-3 py-1 bg-cyan-950 text-cyan-300 text-xs font-bold rounded-full border border-cyan-800">
                    Status: {q.status}
                  </span>
                </div>

                {q.estimatedCostBDT && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Prepared Estimate:</span>
                    <span className="text-emerald-400 font-black text-base">৳{q.estimatedCostBDT.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Registered Devices */}
        {activeSubTab === 'devices' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Assigned Network Hardware Devices</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {[
                { name: 'ConnectBD Pro Mesh AX3000 Router', sku: 'CBD-RTR-AX3000', serial: 'SN-2026-9021-A', status: 'Active Online', location: 'Server Closet' },
                { name: 'ConnectBD IP67 Outdoor Access Point', sku: 'CBD-AP-OUT1200', serial: 'SN-2026-9021-B', status: 'Active Online', location: 'Campus Field Pole 1' },
                { name: 'ConnectBD GPON ONU Optical Terminal', sku: 'CBD-ONU-G100', serial: 'SN-2026-9021-C', status: 'Active Online', location: 'Fiber Drop Box' },
                { name: 'ConnectBD Lithium UPS Power Unit', sku: 'CBD-PWR-Li4H', serial: 'SN-2026-9021-D', status: 'Battery 100%', location: 'UPS Rack' }
              ].map((dev, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-cyan-400">{dev.sku}</span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">{dev.status}</span>
                  </div>
                  <h4 className="font-bold text-white">{dev.name}</h4>
                  <div className="text-[11px] text-slate-400">S/N: <strong className="text-slate-300 font-mono">{dev.serial}</strong></div>
                  <div className="text-[11px] text-slate-400">Location: {dev.location}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Tickets */}
        {activeSubTab === 'tickets' && (
          <div className="space-y-4">
            {tickets.map((t) => (
              <div key={t.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400">{t.ticketNumber}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{t.subject}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">Category: {t.category} • Priority: {t.priority}</div>
                  </div>
                  <span className="px-3 py-1 bg-cyan-950 text-cyan-300 text-xs font-bold rounded-full border border-cyan-800">
                    {t.status}
                  </span>
                </div>

                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3 text-xs">
                  {t.messages.map((m, idx) => (
                    <div key={idx} className={`p-3 rounded-xl ${m.sender === 'customer' ? 'bg-slate-900 text-slate-200 ml-4' : 'bg-cyan-950/60 text-cyan-200 border border-cyan-900/60 mr-4'}`}>
                      <div className="flex justify-between font-bold text-[10px] text-slate-400 mb-1">
                        <span>{m.senderName}</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
