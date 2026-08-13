import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Wifi, 
  Key, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Building, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  Cpu, 
  X,
  AlertCircle
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface LandingPortalProps {
  onLoginSuccess: (user: UserProfile) => void;
  onExplorePublicGuest: () => void;
  language: 'EN' | 'BN' | 'ZH';
  setLanguage: (lang: 'EN' | 'BN' | 'ZH') => void;
}

export const LandingPortal: React.FC<LandingPortalProps> = ({
  onLoginSuccess,
  onExplorePublicGuest,
  language,
  setLanguage
}) => {
  const [selectedPortal, setSelectedPortal] = useState<'none' | 'admin' | 'customer_login' | 'customer_signup'>('none');

  const t = (en: string, bn: string, zh: string) => language === 'ZH' ? zh : language === 'BN' ? bn : en;
  
  // Admin Form States
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [secretKey, setSecretKey] = useState('S@ZZAD50509');
  
  // Customer Form States
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custConfirmPassword, setCustConfirmPassword] = useState('');
  const [custVerificationCode, setCustVerificationCode] = useState('');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custDistrict, setCustDistrict] = useState('Dhaka');
  const [custOrganization, setCustOrganization] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState('');

  // Status Messages
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Requesting Email Verification Code
  const handleRequestVerificationCode = async () => {
    if (!custEmail.trim()) {
      setErrorMessage('অনুগ্রহ করে প্রথমে আপনার ইমেইল এড্রেস প্রদান করুন। (Please enter your email first)');
      return;
    }

    setErrorMessage('');
    setVerificationNotice('');
    setCodeLoading(true);

    try {
      const res = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: custEmail.trim().toLowerCase() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'ভেরিফিকেশন কোড পাঠাতে ব্যর্থ হয়েছে।');
      }

      setVerificationNotice(`ভেরিফিকেশন কোড সফলভাবে পাঠানো হয়েছে: [ ${data.code} ]`);
      setCustVerificationCode(data.code || '');
    } catch (err: any) {
      setErrorMessage(err.message || 'কোড পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setCodeLoading(false);
    }
  };

  // Handle Admin Login (Server-side verified)
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!secretKey) {
      setErrorMessage('Admin Secret Key Code is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
          secretKey: secretKey.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Admin authentication failed');
      }
      if (data.token) localStorage.setItem('token', data.token);

      setSuccessMessage('Admin authentication verified! Access granted.');
      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Customer Signup
  const handleCustomerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!custName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার পুরো নাম লিখুন। (Please enter your full name)');
      return;
    }

    if (!custEmail.trim()) {
      setErrorMessage('অনুগ্রহ করে সঠিক জিমেইল/ইমেইল এড্রেস লিখুন। (Please enter your email)');
      return;
    }

    if (custPassword.length < 4) {
      setErrorMessage('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে। (Password must be at least 4 characters)');
      return;
    }

    if (custPassword !== custConfirmPassword) {
      setErrorMessage('পাসওয়ার্ড দুটি মিলে নাই! অনুগ্রহ করে উভয় পাসওয়ার্ড ফিল্ড চেক করুন। (Passwords do not match)');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: custName.trim(),
          email: custEmail.trim().toLowerCase(),
          password: custPassword,
          role: 'customer',
          phone: custPhone.trim(),
          district: custDistrict,
          organization: custOrganization.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'কাস্টমার অ্যাকাউন্ট খুলতে সমস্যা হয়েছে।');
      }

      setSuccessMessage(`অভিনন্দন! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। আপনার ইমেইলে একটি ভেরিফিকেশন কোড পাঠানো হয়েছে: ${data.verificationCode}`);
      setTimeout(() => {
        setSelectedPortal('customer_login');
        setVerificationNotice(`ইমেইলে কোড পাঠানো হয়েছে: ${data.verificationCode}`);
        setSuccessMessage('অ্যাকাউন্ট তৈরি সম্পন্ন। অনুগ্রহ করে ইমেইল, ভেরিফিকেশন কোড এবং পাসওয়ার্ড দিয়ে লগইন করুন।');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'সাইন আপ ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  // Handle Customer Login
  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!custEmail.trim() || !custPassword) {
      setErrorMessage('অনুগ্রহ করে আপনার জিমেইল/ইমেইল এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    if (!custVerificationCode.trim()) {
      setErrorMessage('অনুগ্রহ করে ইমেইলে প্রাপ্ত ৬ ডিজিটের ভেরিফিকেশন কোডটি দিন। (Click "Get Code")');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: custEmail.trim().toLowerCase(),
          password: custPassword,
          verificationCode: custVerificationCode.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'ইমেইল, কোড অথবা পাসওয়ার্ড ভুল হয়েছে।');
      }
      if (data.token) localStorage.setItem('token', data.token);

      setSuccessMessage('সফলভাবে লগইন হয়েছে! ওয়েবসাইট ও প্যানেলে প্রবেশ করা হচ্ছে...');
      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'কাস্টমার লগইন ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Tech Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-800/60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Wifi className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white">Connect<span className="text-cyan-400">BD</span></span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wide">Bangladesh Connectivity Gateway</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                language === 'EN'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('BN')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                language === 'BN'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              BN
            </button>
            <button
              onClick={() => setLanguage('ZH')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                language === 'ZH'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              ZH
            </button>
          </div>

          <button
            onClick={onExplorePublicGuest}
            className="text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/40 bg-slate-900/50 hidden sm:flex"
          >
            <span>{t('Explore Public Site', 'ওয়েবসাইট ভিজিট করুন', '探索公共网站')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </header>

      {/* Main Gateway Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center text-center">
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('Select Portal Entry', 'ওয়েবসাইট প্রবেশদ্বার নির্বাচন করুন', '选择门户入口')}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
          {t('Welcome to ', 'স্বাগতম ', '欢迎来到 ')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">ConnectBD</span>{t(' Platform', ' প্ল্যাটফর্মে', ' 平台')}
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          {t('Please select your portal to continue. You can log in to the Customer Portal or access the Admin Control Tower.', 'অনুগ্রহ করে আপনার পোর্টাল নির্বাচন করুন। অ্যাডমিন প্যানেল অথবা কাস্টমার পোর্টালে সাইন আপ / লগইন করে প্রবেশ করুন।', '请选择您的门户以继续。您可以登录客户门户或访问管理控制塔。')}
        </p>

        {/* Dual Portal Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-10">
          
          {/* Card 1: Admin Portal */}
          <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-cyan-500/30 p-8 flex flex-col justify-between text-left hover:border-cyan-400 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 group relative">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-cyan-400">
                  {t('Admin Option', 'অ্যাডমিন অপশন', '管理员选项')}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Admin Control Tower</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {t('Manage products, pricing, SEO keywords, update order statuses, and maintain regulatory records securely.', 'নতুন প্রোডাক্ট আপলোড, প্রাইসিং তালিকা, এসইও (SEO) কিওয়ার্ড সেটআপ, অর্ডারের স্ট্যাটাস আপডেট এবং রেগুলেটরি রেকর্ডস ম্যানেজ করুন।', '安全地管理产品、定价、SEO关键字，更新订单状态，并维护监管记录。')}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-cyan-300 font-semibold">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('Admin Secret Key Required', 'অ্যাডমিন সিক্রেট কি আবশ্যক', '需要管理员密钥')}</span>
                </div>
                <p className="text-slate-400">
                  {t('Entering the admin portal requires an authorized secret key.', 'অ্যাডমিন হিসেবে ঢুকতে পাসওয়ার্ড এবং সিক্রেট কি প্রদান করতে হবে।', '进入管理员门户需要授权的密钥。')}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedPortal('admin');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="mt-6 w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>{t('Enter Admin Portal', 'অ্যাডমিন লগইন', '进入管理员门户')}</span>
            </button>
          </div>

          {/* Card 2: Customer Portal */}
          <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-blue-500/30 p-8 flex flex-col justify-between text-left hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group relative">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800/80 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-blue-400">
                  {t('Customer Option', 'কাস্টমার অপশন', '客户选项')}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Customer Portal</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {t('Log in or sign up to purchase broadband packages, track hardware orders, and use the Smart Network Planner.', 'ব্রডব্যান্ড ইন্টারনেট প্যাকেজ, হার্ডওয়্যার শপ, স্মার্ট নেটওয়ার্ক প্ল্যানার এবং ইনস্টলেশন ট্র্যাকিং ব্যবহার করতে সাইন আপ বা লগইন করুন।', '登录或注册以购买宽带套餐、跟踪硬件订单，并使用智能网络规划器。')}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-blue-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t('Secure Customer Account', 'নিরাপদ কাস্টমার অ্যাকাউন্ট', '安全客户帐户')}</span>
                </div>
                <p className="text-slate-400">
                  {t('Sign up with your email, name, and phone number for immediate verified access.', 'জিমেইল আইডি, নাম, ঠিকানা এবং ফোন নম্বর দিয়ে সাইন আপ করার পর তাতক্ষণিক ভেরিফাইড অ্যাক্সেস মিলবে।', '使用您的电子邮件、姓名和电话号码注册即可获得即时验证访问权限。')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6">
              <button
                onClick={() => {
                  setSelectedPortal('customer_login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all border border-slate-700 text-center"
              >
                {t('Login', 'লগইন (Login)', '登录')}
              </button>

              <button
                onClick={() => {
                  setSelectedPortal('customer_signup');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/20 text-center flex items-center justify-center space-x-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('Sign Up', 'সাইন আপ (Sign Up)', '注册')}</span>
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-500 border-t border-slate-800/60">
        ConnectBD • BTRC Licensed Broadband & Hardware Infrastructure Engine • Bangladesh
      </footer>

      {/* ========================================================= */}
      {/* MODAL DIALOGS FOR SELECTED PORTAL */}
      {/* ========================================================= */}

      {selectedPortal !== 'none' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedPortal('none')}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Status Messages */}
            {errorMessage && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* --------------------------------------------------- */}
            {/* 1. ADMIN LOGIN FORM */}
            {/* --------------------------------------------------- */}
            {selectedPortal === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>অ্যাডমিন পোর্টাল প্রবেশদ্বার</span>
                  </div>
                  <h2 className="text-xl font-black text-white">Admin Portal Login</h2>
                  <p className="text-xs text-slate-400">
                    Enter your authorized admin credentials and secret key code.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Admin Password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl space-y-1">
                  <label className="block text-xs font-bold text-cyan-300">
                    Secret Key Code (সিক্রেট কি কোড) *
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      placeholder="Enter Secret Key Code"
                      className="w-full bg-slate-950 border border-cyan-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    অ্যাডমিন প্যানেল ভেরিফিকেশনের জন্য সিক্রেট কি প্রদান আবশ্যক।
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Verifying Admin Secret Key...' : 'অ্যাডমিন প্যানেলে ঢুকুন (Enter Admin)'}</span>
                </button>
              </form>
            )}

            {/* --------------------------------------------------- */}
            {/* 2. CUSTOMER LOGIN FORM */}
            {/* --------------------------------------------------- */}
            {selectedPortal === 'customer_login' && (
              <form onSubmit={handleCustomerLogin} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1 text-xs font-bold text-blue-400">
                    <Users className="w-4 h-4" />
                    <span>কাস্টমার পোর্টাল লগইন</span>
                  </div>
                  <h2 className="text-xl font-black text-white">Customer Sign In</h2>
                  <p className="text-xs text-slate-400">
                    আপনার সাইন আপ করা জিমেইল এবং পাসওয়ার্ড দিয়ে প্রবেশ করুন।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gmail / Email Address *</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="sazzad@gmail.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRequestVerificationCode}
                      disabled={codeLoading}
                      className="px-3 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                    >
                      {codeLoading ? 'কোড পাঠানো হচ্ছে...' : 'কোড পাঠান (Get Code)'}
                    </button>
                  </div>
                </div>

                {verificationNotice && (
                  <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-mono font-semibold animate-pulse">
                    {verificationNotice}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Verification Code (ভেরিফিকেশন কোড) *</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-blue-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={custVerificationCode}
                      onChange={(e) => setCustVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit verification code"
                      className="w-full bg-slate-950 border border-blue-800/80 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-blue-300 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    লগইন করার আগে "কোড পাঠান" বাটনে ক্লিক করে কোড রিসিভ করুন।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={custPassword}
                      onChange={(e) => setCustPassword(e.target.value)}
                      placeholder="Your Password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>{loading ? 'Verifying Account...' : 'লগইন করুন (Log In)'}</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setSelectedPortal('customer_signup'); setErrorMessage(''); setSuccessMessage(''); }}
                    className="text-[11px] text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    নতুন কাস্টমার? <span className="text-blue-400 underline font-semibold">এখানে সাইন আপ করুন (Sign Up)</span>
                  </button>
                </div>
              </form>
            )}

            {/* --------------------------------------------------- */}
            {/* 3. CUSTOMER SIGNUP FORM */}
            {/* --------------------------------------------------- */}
            {selectedPortal === 'customer_signup' && (
              <form onSubmit={handleCustomerSignup} className="space-y-3 max-h-[80vh] overflow-y-auto pr-1">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1 text-xs font-bold text-blue-400">
                    <User className="w-4 h-4" />
                    <span>নতুন কাস্টমার নিবন্ধন</span>
                  </div>
                  <h2 className="text-xl font-black text-white">Create Customer Account</h2>
                  <p className="text-xs text-slate-400">
                    আপনার জিমেইল, নাম, ফোন নম্বর এবং পাসওয়ার্ড দিয়ে সাইন আপ করুন।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name (নাম) *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="Md. Sazzad Hossain"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gmail / Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      placeholder="sazzad@gmail.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        minLength={6}
                        value={custPassword}
                        onChange={(e) => setCustPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        minLength={6}
                        value={custConfirmPassword}
                        onChange={(e) => setCustConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Bangladeshi Phone *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="+880 1711-223344"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">District (জেলা) *</label>
                    <select
                      value={custDistrict}
                      onChange={(e) => setCustDistrict(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Bogura">Bogura</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Mymensingh">Mymensingh</option>
                      <option value="Cox's Bazar">Cox's Bazar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Organization / School (Optional)</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={custOrganization}
                      onChange={(e) => setCustOrganization(e.target.value)}
                      placeholder="School / Company Name"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 mt-2"
                >
                  <User className="w-4 h-4" />
                  <span>{loading ? 'Creating Hashed Password Account...' : 'সাইন আপ ও অ্যাকাউন্ট খুলুন (Register)'}</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setSelectedPortal('customer_login'); setErrorMessage(''); setSuccessMessage(''); }}
                    className="text-[11px] text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    আগে থেকেই অ্যাকাউন্ট আছে? <span className="text-blue-400 underline font-semibold">এখানে লগইন করুন (Log In)</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
