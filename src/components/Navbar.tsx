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
  setLanguage
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles: { role: UserRole; label: string; icon: string }[] = [
    { role: 'customer', label: 'Customer (Community/Edu)', icon: '👤' },
    { role: 'business', label: 'Business / Enterprise', icon: '🏢' },
    { role: 'technician', label: 'Field Service Technician', icon: '🔧' },
    { role: 'operations', label: 'Operations Staff', icon: '📦' },
    { role: 'admin', label: 'Admin / System Executive', icon: '👑' }
  ];

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
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-xs py-1.5 px-4 text-slate-300 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold border border-blue-400/30 text-[10px] tracking-wide">
              CHINA ➔ BANGLADESH
            </span>
            <span>
              {language === 'EN' 
                ? 'Cross-Border Connectivity Solutions & Managed Network Infrastructure' 
                : 'চীন-বাংলাদেশ ক্রস-বর্ডার কানেক্টিভিটি টেকনোলজি ও ম্যানেজড নেটওয়ার্ক'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setActiveTab('compliance')} 
              className="hover:underline flex items-center space-x-1 text-slate-300 hover:text-white"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'EN' ? 'Regulatory Status: BTRC Processing' : 'অনুমোদন স্থিতি'}</span>
            </button>
            <span className="text-slate-700">|</span>
            <div className="relative">
              <button 
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded text-xs font-medium text-blue-300 border border-slate-700"
              >
                <span>Persona: <strong className="text-white capitalize">{currentUser.role}</strong></span>
                <ChevronDown className="w-3 h-3 text-blue-400" />
              </button>
              
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-1 text-[11px] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                    Switch Demo User Persona
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        onSwitchRole(r.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center space-x-2 hover:bg-slate-800 transition-colors ${
                        currentUser.role === r.role ? 'bg-blue-950/60 text-blue-300 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <span className="text-base">{r.icon}</span>
                      <span className="flex-1">{r.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-slate-700">|</span>
            <button 
              onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
              className="flex items-center space-x-1 text-slate-300 hover:text-white font-medium bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700"
            >
              <Globe className="w-3 h-3 text-blue-400" />
              <span>{language === 'EN' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

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
