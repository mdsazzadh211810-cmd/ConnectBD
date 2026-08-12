import React, { useState } from 'react';
import { UserProfile, Order, QuoteRequest, Product, ComplianceCertificate, AuditLog } from '../types';
import { 
  BarChart3, 
  DollarSign, 
  Package, 
  Users, 
  ShieldCheck, 
  Layers, 
  FileText, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Plus 
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser?: UserProfile;
  orders?: Order[];
  quotes?: QuoteRequest[];
  jobs?: any[];
  products?: Product[];
  certificates?: ComplianceCertificate[];
  auditLogs?: AuditLog[];
  onUpdateOrderStatus?: (orderId: string, status: any) => void;
  onOpenUploadCertModal?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  orders = [],
  quotes = [],
  jobs = [],
  products = [],
  certificates = [],
  auditLogs = [],
  onUpdateOrderStatus,
  onOpenUploadCertModal
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'quotes' | 'inventory' | 'compliance' | 'audit'>('orders');

  const totalRevenue = (orders || []).reduce((sum, o) => sum + o.totalBDT, 0);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="inline-flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Operations & Executive Control Tower</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">ConnectBD Admin Console</h1>
            <p className="text-xs text-slate-400">Cross-Border Procurement, Field Dispatch, Regulatory Pipeline & Audit Telemetry</p>
          </div>

          <button
            onClick={onOpenUploadCertModal}
            className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5 self-start md:self-center shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Compliance Document</span>
          </button>
        </div>

        {/* KPI Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Gross Processed Revenue</span>
            <div className="text-2xl font-black text-emerald-400">৳{totalRevenue.toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-slate-500">Across {orders.length} Dispatched Orders</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Active Customer Quotes</span>
            <div className="text-2xl font-black text-cyan-400">{quotes.length}</div>
            <span className="text-[10px] text-slate-500">Pipeline Requests</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Warehouse Hardware SKUs</span>
            <div className="text-2xl font-black text-white">{products.length}</div>
            <span className="text-[10px] text-slate-500">Shenzhen Direct Import Stock</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Verified Compliance Records</span>
            <div className="text-2xl font-black text-indigo-400">{certificates.length}</div>
            <span className="text-[10px] text-slate-500">BTRC & NBR Clearances</span>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'quotes', label: `Quotation Pipeline (${quotes.length})` },
            { id: 'inventory', label: `Inventory & SKUs (${products.length})` },
            { id: 'compliance', label: `Regulatory Records (${certificates.length})` },
            { id: 'audit', label: `Audit Trail (${auditLogs.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === tab.id
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {activeAdminTab === 'orders' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Cross-Border Deployment Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-3">Order Ref</th>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Amount (BDT)</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Tracking Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-950/60">
                      <td className="p-3 font-mono font-bold text-cyan-400">{o.orderNumber}</td>
                      <td className="p-3 text-white font-semibold">{o.organizationName}</td>
                      <td className="p-3 text-slate-300">{o.district}</td>
                      <td className="p-3 font-bold text-white">৳{o.totalBDT.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-emerald-400 font-medium">{o.paymentStatus}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 text-[10px] font-bold rounded border border-cyan-800">
                          {o.trackingSteps.find((s) => s.current)?.title || 'Dispatched'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quotes Pipeline Table */}
        {activeAdminTab === 'quotes' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Quotation Requests Pipeline</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-3">Quote Ref</th>
                    <th className="p-3">Customer Type</th>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Users</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-950/60">
                      <td className="p-3 font-mono font-bold text-cyan-400">{q.quoteNumber}</td>
                      <td className="p-3 text-slate-300">{q.customerType}</td>
                      <td className="p-3 text-white font-semibold">{q.organizationName}</td>
                      <td className="p-3 text-slate-300">{q.location}</td>
                      <td className="p-3 font-bold text-slate-200">{q.numberOfUsers}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 text-[10px] font-bold rounded border border-cyan-800">
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        {activeAdminTab === 'inventory' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Sourced Hardware Inventory Stock</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-3">SKU</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Origin</th>
                    <th className="p-3">Stock Level</th>
                    <th className="p-3">Unit Cost (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-950/60">
                      <td className="p-3 font-mono font-bold text-cyan-400">{p.sku}</td>
                      <td className="p-3 text-white font-semibold">{p.name}</td>
                      <td className="p-3 text-slate-300">{p.category}</td>
                      <td className="p-3 text-slate-400">{p.origin}</td>
                      <td className="p-3 font-bold text-emerald-400">{p.stock} units</td>
                      <td className="p-3 text-slate-200 font-mono">৳{p.priceBDT.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Compliance Table */}
        {activeAdminTab === 'compliance' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Published Regulatory Papers</h3>
            <div className="space-y-3">
              {certificates.map((c) => (
                <div key={c.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">{c.category}</span>
                    <h4 className="font-bold text-white mt-1">{c.title}</h4>
                    <p className="text-slate-400 text-[11px]">{c.issuingAuthority} • Ref: {c.certificateNumber}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-300 text-xs font-bold rounded-full border border-emerald-800">
                    {c.verificationStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Trail */}
        {activeAdminTab === 'audit' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">System Operations Audit Log</h3>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 divide-y divide-slate-800/80 text-xs font-mono">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-cyan-400 font-bold">[{log.action}]</span>
                    <span className="text-slate-300 ml-2">{log.details}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{log.timestamp} • User: {log.userEmail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
