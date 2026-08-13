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
  language: 'EN' | 'BN' | 'ZH';
  setLanguage: (lang: 'EN' | 'BN' | 'ZH') => void;
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

  const t = (en: string, bn: string, zh: string) => language === 'ZH' ? zh : language === 'BN' ? bn : en;

  const mainNavItems = [
    { id: 'home', label: t('Home', 'হোম', '主页') },
    { id: 'solutions', label: t('Solutions', 'সমাধান', '解决方案') },
    { id: 'packages', label: t('Packages', 'প্যাকেজ', '套餐') },
    { id: 'products', label: t('Hardware Store', 'হার্ডওয়্যার', '硬件商店') },
    { id: 'services', label: t('Services', 'সার্ভিস', '服务') },
    { id: 'planner', label: t('AI Planner', 'এআই প্ল্যানার', 'AI规划器'), isSpecial: true },
    { id: 'support', label: t('Support', 'সাপোর্ট', '支持') }
  ];

  const moreItems = [
    { id: 'supply-chain', label: t('Cross-Border Supply', 'ক্রস-বর্ডার সাপ্লাই', '跨境供应') },
    { id: 'compliance', label: t('Compliance', 'অনুমোদন ও তথ্য', '合规') },
    { id: 'impact', label: t('Community Impact', 'সামাজিক প্রভাব', '社区影响') }
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
      case 'technician': return t('Tech Field Ops', 'টেকনিশিয়ান প্যানেল', '现场技术');
      case 'admin':
      case 'operations': return t('Admin / Inventory', 'অ্যাডমিন / ইনভেন্টরি', '管理/库存');
      default: return t('My Dashboard', 'মাই ড্যাশবোর্ড', '我的仪表板');
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
              onClick={() => {
                if (activeTab === item.id) {
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm transition-all flex items-center ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white font-bold shadow-md'
                  : item.isSpecial
                  ? 'text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 font-semibold'
                  : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {item.isSpecial && (
                <Sparkles className={`w-3.5 h-3.5 inline mr-1 ${activeTab === item.id ? 'text-blue-200' : 'text-blue-600'}`} />
              )}
              <span>{item.label}</span>
            </button>
          ))}
          
          {/* More Items Dropdown */}
          <div className="relative group">
            <button className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm flex items-center transition-all ${
                moreItems.some(item => activeTab === item.id)
                  ? 'bg-blue-600 text-white font-bold shadow-md'
                  : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-100'
              }`}>
              <span>{t('About', 'সম্পর্কে', '关于我们')}</span>
              <ChevronDown className={`w-3 h-3 ml-1 transition-transform group-hover:rotate-180 ${moreItems.some(item => activeTab === item.id) ? 'text-blue-200' : 'text-slate-500'}`} />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1.5 overflow-hidden">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (activeTab === item.id) {
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`block w-full text-left px-4 py-2 text-xs xl:text-sm transition-colors ${
                    activeTab === item.id 
                      ? 'bg-blue-50 text-blue-700 font-bold' 
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
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
            {t('Request Quote', 'কোটেশন চান', '请求报价')}
          </button>

          {onShowGatewayPortal && (
            <button
              onClick={onShowGatewayPortal}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/80 transition-colors shadow-2xs flex items-center space-x-1"
              title="Return to Dual Entry Landing Page"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('Portal Entry', 'প্রবেশদ্বার', '门户入口')}</span>
            </button>
          )}

          <button
            onClick={onOpenAuthModal}
            className="p-2 text-slate-700 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors"
            title="My Account"
          >
            <User className="w-5 h-5" />
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
            onClick={onOpenAuthModal}
            className="p-2 text-slate-700 bg-slate-100 rounded-lg border border-slate-200"
            title="My Account"
          >
            <User className="w-5 h-5" />
          </button>
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
            {[...mainNavItems, ...moreItems].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (activeTab === item.id) {
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  } else {
                    setActiveTab(item.id);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium text-left ${
                  activeTab === item.id ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-700 hover:bg-slate-100'
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
              {t('Request Custom Quote', 'কাস্টম কোটেশন', '请求定制报价')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
