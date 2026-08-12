import React, { useState } from 'react';
import { UserProfile, Order, QuoteRequest, Product, ComplianceCertificate, AuditLog } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
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
  Plus,
  Download
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
  onAddProductSuccess?: (product: Product) => void;
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
  onOpenUploadCertModal,
  onAddProductSuccess
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'quotes' | 'inventory' | 'compliance' | 'audit' | 'users' | 'analytics'>('inventory');
  
  // User Management State
  const [systemUsers, setSystemUsers] = useState<UserProfile[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeAdminTab === 'users' && systemUsers.length === 0 && !isFetchingUsers) {
      fetchUsers();
    }
  }, [activeAdminTab]);

  const fetchUsers = async () => {
    setIsFetchingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setSystemUsers(data.users);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setIsFetchingUsers(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setSystemUsers(prev => prev.map(u => u.id === userId ? data.user : u));
      } else {
        alert(data.message || 'Failed to update role');
      }
    } catch (err) {
      console.error('Failed to update role', err);
      alert('Error updating role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const downloadCSV = (filename: string, headers: string[], data: any[][]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportInventory = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Current Stock', 'Price (BDT)', 'In Stock'];
    const data = products.map(p => [p.sku, p.name, p.category, p.stock, p.priceBDT, p.inStock ? 'Yes' : 'No']);
    downloadCSV(`inventory_analytics_${new Date().toISOString().split('T')[0]}.csv`, headers, data);
  };

  const handleExportAuditLogs = () => {
    const headers = ['Timestamp', 'User Email', 'Action', 'Details'];
    const data = auditLogs.map(log => [log.timestamp, log.userEmail, log.action, log.details]);
    downloadCSV(`audit_logs_${new Date().toISOString().split('T')[0]}.csv`, headers, data);
  };

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Routers');
  const [prodPriceBDT, setProdPriceBDT] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodSeoKeywords, setProdSeoKeywords] = useState('');
  const [prodStock, setProdStock] = useState('25');
  const [prodOrigin, setProdOrigin] = useState('Shenzhen Direct');
  const [prodWarranty, setProdWarranty] = useState('1 Year BTRC Approved Warranty');
  const [prodImage, setProdImage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const totalRevenue = (orders || []).reduce((sum, o) => sum + o.totalBDT, 0);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: prodName,
          category: prodCategory,
          priceBDT: parseFloat(prodPriceBDT) || 0,
          description: prodDescription,
          seoKeywords: prodSeoKeywords,
          stock: parseInt(prodStock, 10) || 10,
          origin: prodOrigin,
          warranty: prodWarranty,
          image: prodImage || undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to upload product');
      }

      setSuccessMsg(`Product "${data.product.name}" uploaded successfully with SEO keywords!`);
      if (onAddProductSuccess) {
        onAddProductSuccess(data.product);
      }

      // Reset form
      setTimeout(() => {
        setShowProductModal(false);
        setProdName('');
        setProdPriceBDT('');
        setProdDescription('');
        setProdSeoKeywords('');
        setSuccessMsg('');
      }, 1200);

    } catch (err: any) {
      setErrorMsg(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

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
            { id: 'inventory', label: `Products & Inventory (${products.length})` },
            { id: 'compliance', label: `Regulatory Records (${certificates.length})` },
            { id: 'audit', label: `Audit Trail (${auditLogs.length})` },
            { id: 'users', label: `User Management` },
            { id: 'analytics', label: `Inventory Analytics` }
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
                    <th className="p-3">Order Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-950/60">
                      <td className="p-3 font-mono font-bold text-cyan-400">{o.orderNumber}</td>
                      <td className="p-3 text-white font-semibold">{o.organizationName}</td>
                      <td className="p-3 text-slate-300">{o.deliveryAddress?.district || 'Dhaka'}</td>
                      <td className="p-3 font-bold text-white">৳{o.totalBDT.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-emerald-400 font-medium">{o.paymentStatus}</td>
                      <td className="p-3">
                        <select
                          value={o.status}
                          onChange={(e) => onUpdateOrderStatus?.(o.id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 text-slate-200 rounded p-1.5 text-xs outline-none focus:border-cyan-500 max-w-[150px]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Supplier Procurement (China)">Supplier Procurement (China)</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Customs Clearance">Customs Clearance</option>
                          <option value="Bangladesh Warehouse">Bangladesh Warehouse</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Technician Assigned">Technician Assigned</option>
                          <option value="Installation In Progress">Installation In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Product Management & Store Inventory</h3>
                <p className="text-xs text-slate-400">Upload your items, specify categories, set pricing, and manage what you want to sell.</p>
              </div>

              <button
                onClick={() => {
                  setShowProductModal(true);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-3">SKU</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">SEO Keywords</th>
                    <th className="p-3">Stock Level</th>
                    <th className="p-3">Unit Cost (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-950/60">
                      <td className="p-3 font-mono font-bold text-cyan-400">{p.sku}</td>
                      <td className="p-3 text-white font-semibold">
                        {p.name}
                        <span className="block text-[10px] text-slate-400 line-clamp-1">{p.description}</span>
                      </td>
                      <td className="p-3 text-slate-300">{p.category}</td>
                      <td className="p-3 text-cyan-300/80 font-mono text-[10px]">
                        {p.seoKeywords || 'hardware, connectivity, broadband'}
                      </td>
                      <td className="p-3 font-bold text-emerald-400">{p.stock} units</td>
                      <td className="p-3 text-slate-200 font-mono">৳{p.priceBDT.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Uploading New Product */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-black text-white">নতুন প্রোডাক্ট আপলোড • Upload Product</h3>
                  <p className="text-xs text-slate-400">Specify exactly what you want to sell, the category, pricing, and SEO keywords.</p>
                </div>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-200">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name (প্রোডাক্ট এর নাম) *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g., ConnectBD Ultra Dual-Band Wi-Fi 6 Router"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Routers">Routers</option>
                      <option value="Wi-Fi Access Points">Wi-Fi Access Points</option>
                      <option value="Mesh Systems">Mesh Systems</option>
                      <option value="Outdoor Access Points">Outdoor Access Points</option>
                      <option value="Network Switches">Network Switches</option>
                      <option value="Optical Networking">Optical Networking</option>
                      <option value="CPE / Antennas">CPE / Antennas</option>
                      <option value="Power & Backup">Power & Backup</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Price BDT (প্রাইস - ৳) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={prodPriceBDT}
                      onChange={(e) => setProdPriceBDT(e.target.value)}
                      placeholder="e.g., 4500"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Product Description (ডেসক্রিপশন) *</label>
                  <textarea
                    required
                    rows={3}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    placeholder="Enter full technical overview, bandwidth capacity, and features..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-300 mb-1">
                    SEO Keywords (এসইও করার জন্য কিওয়ার্ড) *
                  </label>
                  <input
                    type="text"
                    value={prodSeoKeywords}
                    onChange={(e) => setProdSeoKeywords(e.target.value)}
                    placeholder="e.g. fiber router, Bogura WiFi, BTRC 5G CPE, broadband Bangladesh"
                    className="w-full bg-slate-950 border border-cyan-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    সার্চ ইঞ্জিনে প্রোডাক্ট সহজে খোঁজার জন্য কমা দিয়ে কিওয়ার্ড সেট করুন।
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Level (মজুদ) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      placeholder="25"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Origin / Import Source</label>
                    <input
                      type="text"
                      value={prodOrigin}
                      onChange={(e) => setProdOrigin(e.target.value)}
                      placeholder="Shenzhen Direct Import"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md mt-2"
                >
                  {loading ? 'Publishing Product & Updating SEO...' : 'প্রোডাক্ট ডাটাবেজে আপলোড করুন (Publish Product)'}
                </button>
              </form>

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-bold text-white">System Operations Audit Log</h3>
              <button
                onClick={handleExportAuditLogs}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 self-start sm:self-auto border border-slate-700"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
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

        {/* User Management */}
        {activeAdminTab === 'users' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Registered Users</h3>
            {isFetchingUsers ? (
              <div className="text-slate-400 text-sm py-4">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="p-3">User</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Registered</th>
                      <th className="p-3">Current Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {systemUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-950/60">
                        <td className="p-3">
                          <div className="text-white font-bold">{u.name}</div>
                          {u.organization && <div className="text-[10px] text-slate-400">{u.organization}</div>}
                        </td>
                        <td className="p-3 text-slate-300">{u.email}</td>
                        <td className="p-3 text-slate-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown'}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={updatingUserId === u.id || u.id === currentUser?.id}
                              className="bg-slate-950 border border-slate-700 text-slate-200 rounded p-1.5 text-xs outline-none focus:border-cyan-500 disabled:opacity-50"
                            >
                              <option value="customer">Customer</option>
                              <option value="technician">Technician</option>
                              <option value="operations">Operations</option>
                              <option value="admin">Admin</option>
                            </select>
                            {updatingUserId === u.id && <span className="text-cyan-400 text-[10px] animate-pulse">Updating...</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Inventory Analytics */}
        {activeAdminTab === 'analytics' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Inventory Analytics & Trends</h3>
                <p className="text-xs text-slate-400">Visualize current stock levels against recommended reorder thresholds.</p>
              </div>
              <button
                onClick={handleExportInventory}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 self-start sm:self-auto border border-slate-700"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
            
            <div className="h-[400px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={products.map(p => ({
                    name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
                    stock: p.stock,
                    reorderPoint: 50 // Simulated static reorder point for visualization
                  }))}
                  margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                    itemStyle={{ color: '#38bdf8' }}
                    cursor={{ fill: '#1e293b' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Bar dataKey="stock" name="Current Stock" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reorderPoint" name="Reorder Point" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
