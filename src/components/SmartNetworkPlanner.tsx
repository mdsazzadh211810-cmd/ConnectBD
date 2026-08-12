import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingCart, 
  ArrowRight, 
  Layers, 
  DollarSign,
  Building,
  Users,
  MapPin,
  Loader2
} from 'lucide-react';
import { NetworkPlanRecommendation } from '../types';

interface SmartNetworkPlannerProps {
  setActiveTab?: (tab: string) => void;
  onOpenQuote?: () => void;
  onOpenQuoteWithData?: (data: any) => void;
  onAddToCartPackage?: (packageName: string) => void;
  onAddToCart?: (item: any) => void;
}

export const SmartNetworkPlanner: React.FC<SmartNetworkPlannerProps> = ({
  setActiveTab,
  onOpenQuote,
  onOpenQuoteWithData,
  onAddToCartPackage,
  onAddToCart
}) => {
  const [location, setLocation] = useState('Bogura Sadar, Bogura District');
  const [customerType, setCustomerType] = useState('Education');
  const [numberOfUsers, setNumberOfUsers] = useState(400);
  const [coverageAreaSqFt, setCoverageAreaSqFt] = useState(15000);
  const [numberOfBuildings, setNumberOfBuildings] = useState(3);
  const [budgetBDT, setBudgetBDT] = useState('40,000 - 60,000 BDT');
  const [preferredBackhaul, setPreferredBackhaul] = useState('Fiber');
  const [specialRequirements, setSpecialRequirements] = useState('Power cuts 2-3 times daily, need high heat tolerance and 4-hour battery backup for computer lab');

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<NetworkPlanRecommendation | null>(null);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);

    try {
      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          customerType,
          numberOfUsers,
          coverageAreaSqFt,
          numberOfBuildings,
          budgetBDT,
          preferredBackhaul,
          specialRequirements
        })
      });

      const data = await response.json();
      if (data.plan) {
        setPlan(data.plan);
      }
    } catch (err) {
      console.error('Planner error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 uppercase tracking-wider text-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI-Assisted Network Architecture Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Smart Network Planner
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Input your site specifics in Bangladesh. Our server-side Gemini AI model calculates optimal hardware topologies, coverage footprints, load-shed power backup, and estimated BDT costs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Column */}
          <div className="lg:col-span-5 bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span>Input Site Requirements</span>
              </h2>
              <p className="text-xs text-slate-400">Generates custom topology & hardware list instantly</p>
            </div>

            <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Site Location in Bangladesh</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Customer / Site Type</label>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option>Community</option>
                    <option>Education</option>
                    <option>Business</option>
                    <option>Government</option>
                    <option>Individual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Preferred Backhaul</label>
                  <select
                    value={preferredBackhaul}
                    onChange={(e) => setPreferredBackhaul(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option>Fiber</option>
                    <option>Terrestrial Wireless</option>
                    <option>Cellular Backhaul</option>
                    <option>Satellite Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Users</label>
                  <input 
                    type="number" 
                    value={numberOfUsers}
                    onChange={(e) => setNumberOfUsers(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Sq Feet</label>
                  <input 
                    type="number" 
                    value={coverageAreaSqFt}
                    onChange={(e) => setCoverageAreaSqFt(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Buildings</label>
                  <input 
                    type="number" 
                    value={numberOfBuildings}
                    onChange={(e) => setNumberOfBuildings(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Budget Range (BDT)</label>
                <input 
                  type="text" 
                  value={budgetBDT}
                  onChange={(e) => setBudgetBDT(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Special Site Notes / Load-Shedding</label>
                <textarea 
                  rows={2}
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Analyzing Site & Synthesizing Topology...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Network Architecture</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {!plan && !loading && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-cyan-400 mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Smart Network Recommendation Output</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Fill in your site details on the left and click "Generate AI Network Architecture" to receive a tailored hardware breakdown, topology layout, and cost estimation.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center space-y-4 animate-pulse">
                <div className="w-12 h-12 bg-cyan-950 rounded-xl border border-cyan-800 flex items-center justify-center text-cyan-400 mx-auto animate-spin">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Querying Gemini AI Model...</h3>
                <p className="text-xs text-slate-400">Synthesizing optimum Shenzhen OEM hardware + Bangladesh local deployment plan</p>
              </div>
            )}

            {plan && (
              <div className="bg-slate-900 rounded-3xl border border-cyan-800/80 p-6 sm:p-8 space-y-6 shadow-2xl">
                
                {/* Header Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800 uppercase tracking-wider">
                      Recommended Package: {plan.recommendedPackageName}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1.5">Generated Network Architecture Plan</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Est. Cost</span>
                    <span className="text-2xl font-black text-cyan-400">৳{plan.estimatedTotalBDT.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block mb-1">Architecture Summary:</strong>
                  {plan.summary}
                </div>

                {/* Recommended Topology */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Recommended Network Topology:</span>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300">
                    {plan.recommendedTopology}
                  </div>
                </div>

                {/* Hardware Breakdown Table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Estimated Sourced Hardware List:</span>
                  <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800/80 text-xs">
                    {plan.estimatedHardwareList.map((hw, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between">
                        <span className="text-slate-200">{hw.item} <strong className="text-cyan-400">x{hw.quantity}</strong></span>
                        <span className="text-slate-300 font-mono">৳{(hw.approxPriceBDT * hw.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div className="p-2.5 flex justify-between font-bold bg-slate-900/60">
                      <span className="text-slate-300">Hardware Subtotal</span>
                      <span className="text-white">৳{plan.estimatedHardwareCostBDT.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2.5 flex justify-between font-bold bg-slate-900/60">
                      <span className="text-slate-300">On-Site Cabling & Technician Deployment</span>
                      <span className="text-white">৳{plan.estimatedInstallationCostBDT.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Coverage Highlights:</span>
                    <ul className="text-[11px] text-slate-300 space-y-1">
                      {plan.coverageHighlights.map((ch, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{ch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">Technical Considerations:</span>
                    <ul className="text-[11px] text-slate-300 space-y-1">
                      {plan.technicalConsiderations.map((tc, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                          <span>{tc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Disclaimer Label */}
                <div className="text-[10px] text-slate-400 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  ⚠️ {plan.disclaimer}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => onOpenQuoteWithData && onOpenQuoteWithData(plan)}
                    className="w-full sm:w-auto flex-1 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center space-x-2"
                  >
                    <span>Convert AI Plan to Formal Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onAddToCartPackage && onAddToCartPackage(plan.recommendedPackageName)}
                    className="w-full sm:w-auto py-3 px-6 bg-slate-950 hover:bg-slate-800 text-slate-200 font-semibold text-xs rounded-xl border border-slate-800 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4 text-cyan-400" />
                    <span>Order Recommended Package</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
