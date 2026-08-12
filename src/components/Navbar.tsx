import React, { useState } from 'react';
import { 
  Wifi, 
  Globe, 
  ShoppingCart, 
  User, 
  ChevronDown, 
  ShieldCheck, 
  Menu, 
  X, 
  Cpu, 
  FileText, 
  Wrench, 
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  onSwitchRole: (role: UserRole) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenQuote: () => void;
  language: 'EN' | 'BN';
  setLanguage: (lang: 'EN' | 'BN') => void;
  onShowGatewayPortal?: () => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchRole,
  cartCount,
  onOpenCart,
  onOpenQuote,
  language,
  setLanguage,
  onShowGatewayPortal,
  onOpenAuthModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { id: 'home', label: language === 'EN' ? 'Home' : 'হোম' },
    { id: 'solutions', label: language === 'EN' ? 'Solutions' : 'সমাধান' },
    { id: 'packages', label: language === 'EN' ? 'Packages' : 'প্যাকেজ' },
    { id: 'products', label: language === 'EN' ? 'Hardware Store' : 'হার্ডওয়্যার' },
    { id: 'services', label: language === 'EN' ? 'Services' : 'সার্ভিস' },
    { id: 'planner', label: language === 'EN' ? 'AI Planner' : 'এআই প্ল্যানার', isSpecial: true },
    { id: 'supply-chain', label: language === 'EN' ? 'Cross-Border Supply' : 'ক্রস-বর্ডার সাপ্লাই' },
    { id: 'compliance', label: language === 'EN' ? 'Compliance' : 'অনুমোদন ও তথ্য' },
    { id: 'impact', label: language === 'EN' ? 'Community Impact' : 'সামাজিক প্রভাব' },
    { id: 'support', label: language === 'EN' ? 'Support' : 'সাপোর্ট' }
  ];

  if (currentUser.role === 'admin') {
    mainNavItems.push({
      id: 'admin-dashboard',
      label: language === 'EN' ? 'Admin / Inventory' : 'অ্যাডমিন / ইনভেন্টরি',
      isSpecial: true // Give it a special highlighted style
    });
  }

  const getDashboardTab = () => {
    switch (currentUser.role) {
      case 'technician': return 'technician-dashboard';
      case 'admin':
      case 'operations': return 'admin-dashboard';
      default: return 'customer-dashboard';
    }
  };

  const getDashboardLabel = () => {
    switch (currentUser.role) {
      case 'technician': return language === 'EN' ? 'Tech Field Ops' : 'টেকনিশিয়ান প্যানেল';
      case 'admin':
      case 'operations': return language === 'EN' ? 'Control Tower' : 'অ্যাডমিন প্যানেল';
      default: return language === 'EN' ? 'My Dashboard' : 'মাই ড্যাশবোর্ড';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-blue-600 p-0.5 shadow-md shadow-blue-500/10 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Wifi className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900">CONNECT<span className="text-blue-600">BD</span></span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-200">TECH</span>
            </div>
            <p className="text-[10px] text-slate-500 tracking-wide font-medium">Cross-Border Connectivity Solutions</p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-2xs'
                  : item.isSpecial
                  ? 'text-blue-700 bg-blue-50/80 border border-blue-200 hover:bg-blue-100 flex items-center space-x-1 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {item.isSpecial && <Sparkles className="w-3.5 h-3.5 text-blue-600 inline mr-1" />}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center space-x-2.5">
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-700 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors"
            title="View Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenQuote}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-2xs"
          >
            {language === 'EN' ? 'Request Quote' : 'কোটেশন চান'}
          </button>

          {onShowGatewayPortal && (
            <button
              onClick={onShowGatewayPortal}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/80 transition-colors shadow-2xs flex items-center space-x-1"
              title="Return to Dual Entry Landing Page"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'EN' ? 'Portal Entry' : 'প্রবেশদ্বার'}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab(getDashboardTab())}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 ${
              activeTab.includes('dashboard')
                ? 'bg-blue-700 text-white hover:bg-blue-800 shadow-blue-500/20'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{getDashboardLabel()}</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-700 bg-slate-100 rounded-lg border border-slate-200"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 bg-slate-100 rounded-lg border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium text-left ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => {
                setActiveTab(getDashboardTab());
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-blue-600 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{getDashboardLabel()}</span>
            </button>
            <button
              onClick={() => {
                onOpenQuote();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-300"
            >
              {language === 'EN' ? 'Request Custom Quote' : 'কাস্টম কোটেশন'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
