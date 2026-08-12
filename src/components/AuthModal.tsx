import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, Phone, ShieldCheck, KeyRound, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onAuthSuccess: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLogout
}) => {
  if (!isOpen) return null;

  // Default tab is 'signup' for new visitors
  const [tab, setTab] = useState<'signup' | 'login' | 'admin' | 'forgot'>('signup');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [codeLoading, setCodeLoading] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState('');

  // Reset password states
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);

  // Messages & Loading
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendCode = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address first.');
      return;
    }
    setErrorMessage('');
    setVerificationNotice('');
    setCodeLoading(true);

    try {
      const res = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to send verification code.');
      }

      setVerificationNotice(`Verification code sent to email: [ ${data.code} ]`);
      setVerificationCode(data.code || '');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send code.');
    } finally {
      setCodeLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload: any = { email: email.trim().toLowerCase(), password };
      if (tab === 'admin' || secretKey) {
        payload.secretKey = secretKey;
      } else {
        payload.verificationCode = verificationCode.trim();
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check your credentials and verification code.');
      }

      setSuccessMessage('Login successful!');
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both password fields are identical.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: role === 'admin' ? 'customer' : role,
          organization: organization.trim(),
          phone: phone.trim(),
          district
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Signup failed.');
      }

      setSuccessMessage(`Account created successfully! A verification code (${data.verificationCode}) has been sent to your email.`);
      setTimeout(() => {
        setTab('login');
        setVerificationNotice(`Code sent to ${email}: ${data.verificationCode}`);
        setSuccessMessage('Account created. Please log in using the verification code sent to your email.');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create user account.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password reset request failed.');

      setSuccessMessage(`Reset token generated: ${data.demoResetToken || 'Sent to email'}`);
      if (data.demoResetToken) {
        setResetToken(data.demoResetToken);
        setResetStep(2);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initiate password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Password reset failed.');

      setSuccessMessage('Password reset successfully! You can now log in with your new password.');
      setTab('login');
      setResetStep(1);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">ConnectBD Security Portal</h3>
              <p className="text-xs text-slate-400">Authenticated Enterprise Access</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentUser && tab !== 'forgot' ? (
            <div className="py-2 space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/40 rounded-full flex items-center justify-center mx-auto text-blue-400 text-2xl font-bold shadow-md shadow-blue-500/10">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{currentUser.name}</h4>
                  <p className="text-xs text-slate-400">{currentUser.email}</p>
                  <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 mt-2 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Email Verified Customer</span>
                  </div>
                </div>
              </div>

              {/* Comprehensive User Profile Data Grid */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 text-xs text-slate-300">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-500 font-medium">Account ID:</span>
                  <span className="font-mono text-blue-400 font-semibold">{currentUser.id}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-500 font-medium">Account Role:</span>
                  <span className="capitalize font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{currentUser.role}</span>
                </div>
                {currentUser.phone && (
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-500 font-medium">Phone Number:</span>
                    <span className="text-slate-200 font-medium">{currentUser.phone}</span>
                  </div>
                )}
                {currentUser.district && (
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-500 font-medium">District / City:</span>
                    <span className="text-slate-200 font-medium">{currentUser.district}</span>
                  </div>
                )}
                {currentUser.organization && (
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-500 font-medium">Organization:</span>
                    <span className="text-slate-200 font-medium">{currentUser.organization}</span>
                  </div>
                )}
                {currentUser.createdAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Member Since:</span>
                    <span className="text-slate-400 text-[11px]">{new Date(currentUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 font-semibold text-xs rounded-xl border border-red-500/30 transition-colors flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Account</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Switcher */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6 text-xs">
                <button
                  onClick={() => { setTab('signup'); setErrorMessage(''); setSuccessMessage(''); }}
                  className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
                    tab === 'signup' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Customer Sign Up
                </button>
                <button
                  onClick={() => { setTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
                  className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
                    tab === 'login' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => { 
                    setTab('admin'); 
                    setEmail('');
                    setPassword('');
                    setSecretKey('');
                    setErrorMessage(''); 
                    setSuccessMessage(''); 
                  }}
                  className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
                    tab === 'admin' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Admin Access
                </button>
              </div>

              {/* Status Banner */}
              {errorMessage && (
                <div className="p-3 mb-4 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 mb-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Admin Access Direct Login */}
              {tab === 'admin' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 mb-2">
                    <strong>Administrator Access Portal</strong> — Verify administrator email, password, and secret key code.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-slate-300">Password</label>
                      <button 
                        type="button"
                        onClick={() => {
                          setTab('forgot');
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Secret Key Code</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-indigo-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        placeholder="Enter Secret Key Code"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{loading ? 'Verifying Admin...' : 'Verify Admin Credentials & Access'}</span>
                  </button>
                </form>
              )}

              {/* Login Form */}
              {tab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="user@example.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendCode}
                        disabled={codeLoading}
                        className="px-3 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                      >
                        {codeLoading ? 'Sending...' : 'Get Code'}
                      </button>
                    </div>
                  </div>

                  {verificationNotice && (
                    <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-mono font-semibold animate-pulse">
                      {verificationNotice}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Verification Code *</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-blue-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="w-full bg-slate-950 border border-blue-800/80 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-blue-300 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-slate-300">Password *</label>
                      <button 
                        type="button"
                        onClick={() => {
                          setTab('forgot');
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md shadow-blue-600/20"
                  >
                    {loading ? 'Authenticating...' : 'Secure Log In'}
                  </button>
                </form>
              )}

              {/* Signup Form */}
              {tab === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-3">
                  <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-[11px] text-blue-200 leading-relaxed">
                    <strong>New Customer Registration</strong> — Passwords are encrypted with <code className="text-blue-300">bcrypt</code> before database storage. New accounts are immediately persistent and granted access.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Md. Sazzad Hossain"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="customer@example.com"
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
                          type="password"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                          type="password"
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Account Category</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="customer">Customer (Edu/Community)</option>
                        <option value="business">Business / Corporate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">District</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
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

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Organization / School</label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="School or Company"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+880 1711-223344"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md mt-2 flex items-center justify-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>{loading ? 'Hashing Password & Registering...' : 'Register Customer Account'}</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
                      className="text-[11px] text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      Already have an account? <span className="text-blue-400 underline font-semibold">Log in here</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Reset Password Form */}
              {tab === 'forgot' && (
                <div className="space-y-4">
                  {resetStep === 1 ? (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Email Address</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rafiq@abcedu.bd"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md"
                      >
                        {loading ? 'Generating Token...' : 'Generate Password Reset Token'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Reset Token</label>
                        <input
                          type="text"
                          required
                          value={resetToken}
                          onChange={(e) => setResetToken(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password (at least 6 characters)"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md"
                      >
                        {loading ? 'Updating Password...' : 'Save New Password & Login'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
