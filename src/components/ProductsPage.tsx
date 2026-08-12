import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { 
  Search, 
  ShoppingCart, 
  Check, 
  Sparkles, 
  SlidersHorizontal, 
  Download, 
  ShieldCheck, 
  ExternalLink,
  Layers
} from 'lucide-react';

interface ProductsPageProps {
  products?: Product[];
  onAddToCart?: (prod: Product) => void;
  onOpenQuote?: () => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products = [],
  onAddToCart,
  onOpenQuote
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSpecProduct, setActiveSpecProduct] = useState<Product | null>(null);

  const categories = [
    'All',
    'Routers',
    'Outdoor Access Points',
    'Optical Networking',
    'Network Switches',
    'CPE / Antennas',
    'Power & Backup'
  ];

  const filtered = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 uppercase tracking-wider">
            Sourced Directly From Shenzhen Tech Hubs
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Networking Hardware Marketplace
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Authentic, factory-tested Wi-Fi 6 routers, IP67 outdoor access points, optical ONUs, PoE switches, and lithium battery backup power stations.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by SKU, model, or hardware..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between space-y-4 transition-all group"
            >
              <div className="space-y-3">
                
                {/* Image & SKU Badge */}
                <div className="relative h-48 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-sm text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded border border-slate-800">
                    SKU: {product.sku}
                  </div>
                  <div className="absolute top-2 right-2 bg-emerald-950/90 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800/60">
                    {product.stock > 0 ? `${product.stock} In Stock` : 'Backorder'}
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{product.category}</span>
                    <span>Origin: <strong className="text-slate-300">{product.origin}</strong></span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Key Spec Snippets */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-[11px] space-y-1">
                  {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-[10px]">
                      <span className="text-slate-400">{key}:</span>
                      <span className="text-slate-200 font-medium truncate max-w-[160px]">{val}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Price & Action */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Unit Price</span>
                    <span className="text-xl font-black text-white">৳{product.priceBDT.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    onClick={() => setActiveSpecProduct(product)}
                    className="text-[11px] text-cyan-400 hover:underline font-semibold"
                  >
                    View Specs Sheet ➔
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onAddToCart?.(product)}
                    className="py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => onOpenQuote?.()}
                    className="py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl border border-slate-800"
                  >
                    Request Quote
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Technical Specs Sheet Modal */}
        {activeSpecProduct && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setActiveSpecProduct(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>

              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-slate-950 rounded-xl p-2 border border-slate-800 shrink-0 flex items-center justify-center">
                  <img src={activeSpecProduct.image} alt={activeSpecProduct.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{activeSpecProduct.sku}</span>
                  <h3 className="text-lg font-bold text-white">{activeSpecProduct.name}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">Manufacturer: {activeSpecProduct.manufacturer} ({activeSpecProduct.origin})</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Complete Technical Specifications</h4>
                <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800/80 text-xs">
                  {Object.entries(activeSpecProduct.specs).map(([key, val]) => (
                    <div key={key} className="p-2.5 flex justify-between">
                      <span className="text-slate-400 font-medium">{key}</span>
                      <span className="text-slate-200 font-semibold text-right">{val}</span>
                    </div>
                  ))}
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-400 font-medium">Warranty</span>
                    <span className="text-emerald-400 font-bold">{activeSpecProduct.warranty}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-slate-400 font-medium">Est. Local Delivery</span>
                    <span className="text-slate-200">{activeSpecProduct.deliveryDays}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => {
                    if (activeSpecProduct) onAddToCart?.(activeSpecProduct);
                    setActiveSpecProduct(null);
                  }}
                  className="px-5 py-2.5 bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-300"
                >
                  Add Hardware to Cart
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
