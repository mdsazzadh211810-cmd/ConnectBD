import React, { useState } from 'react';
import { 
  ConnectivityPackage 
} from '../types';
import { 
  Check, 
  X, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Wrench, 
  Sparkles, 
  ShoppingCart, 
  ArrowRight 
} from 'lucide-react';

interface PackagesPageProps {
  packages?: ConnectivityPackage[];
  onSelectPackage?: (pkg: ConnectivityPackage) => void;
  onAddToCart?: (pkg: ConnectivityPackage, isInstallationNeeded: boolean) => void;
  onOpenQuote?: () => void;
  setActiveTab?: (tab: string) => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({
  packages = [],
  onSelectPackage,
  onAddToCart,
  onOpenQuote,
  setActiveTab
}) => {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Community', 'Education', 'Business', 'Remote'];

  const filtered = filter === 'All' 
    ? packages 
    : packages.filter((p) => p.category === filter);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 uppercase tracking-wider">
            All-In-One Managed Bundles
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Managed Connectivity Packages
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Pre-engineered cross-border hardware bundles complete with Lithium power backup, physical cable installation, and managed SLA technical support.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === cat
                  ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat} Packages
            </button>
          ))}
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-slate-900 rounded-3xl border ${
                pkg.popular 
                  ? 'border-cyan-500 shadow-xl shadow-cyan-500/10' 
                  : 'border-slate-800 hover:border-slate-700'
              } p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-md">
                  Most Popular Choice
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                    {pkg.category} Solution
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Complexity: <strong className="text-slate-200">{pkg.complexity}</strong>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{pkg.name}</h3>

                {/* Price Display */}
                <div>
                  <div className="text-2xl font-black text-white">
                    ৳{pkg.startingPriceBDT.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-slate-400">starting price</span>
                  </div>
                  <div className="text-xs text-cyan-300 mt-0.5">
                    + ৳{pkg.monthlyServiceBDT.toLocaleString('en-IN')}/month managed SLA
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Recommended Load</span>
                    <strong className="text-white">{pkg.recommendedUsers}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Coverage Area</span>
                    <strong className="text-white">{pkg.coverageArea}</strong>
                  </div>
                </div>

                {/* Included Hardware */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Included Hardware & Gear:</span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {pkg.includedHardware.map((hw, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{hw}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Highlights */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  {pkg.highlights.map((hl, idx) => (
                    <div key={idx} className="text-[11px] text-cyan-200 flex items-center space-x-1.5">
                      <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Exclusions if any */}
                {pkg.notIncluded && pkg.notIncluded.length > 0 && (
                  <div className="text-[10px] text-slate-400 space-y-1 pt-1">
                    <span className="font-semibold text-slate-300">Note (Not included):</span>
                    {pkg.notIncluded.map((ni, idx) => (
                      <div key={idx} className="flex items-center space-x-1 text-slate-400">
                        <X className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{ni}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    if (onAddToCart) {
                      onAddToCart(pkg, true);
                    } else if (onSelectPackage) {
                      onSelectPackage(pkg);
                    }
                  }}
                  className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Order Package (With Installation)</span>
                </button>

                <button
                  onClick={onOpenQuote}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Request Custom Quotation</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* AI Custom Planner CTA Banner */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 p-6 sm:p-8 rounded-3xl border border-cyan-800/60 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">Not sure which package fits your location?</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Input your building square footage, number of students/staff, and load-shedding history to let our Smart Network Planner AI design a custom topology.
            </p>
          </div>
          <button
            onClick={() => setActiveTab?.('planner')}
            className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Network Planner</span>
          </button>
        </div>

      </div>
    </div>
  );
};
