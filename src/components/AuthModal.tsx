import React, { useState } from 'react';
import { X, Mail, Phone, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useFoodora } from '../context/FoodoraContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginUser,
    showToast
  } = useFoodora();

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [rememberMe, setRememberMe] = useState(true);

  if (!isAuthModalOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length < 6) {
      showToast('Enter valid phone number', undefined, 'error');
      return;
    }
    setAuthModalMode('otp');
    showToast('OTP sent!', `A 6-digit code was sent to ${phoneNumber}`, 'info');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      showToast('Enter a valid email address', undefined, 'error');
      return;
    }
    loginUser(email, name || 'Alexander Wright');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 4) {
      showToast('Please enter the 6-digit code', undefined, 'error');
      return;
    }
    loginUser(phoneNumber || '9876543210', name || 'Alexander Wright');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = val;
    setOtpDigits(newDigits);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSocialGoogleLogin = () => {
    loginUser('alex.wright@gmail.com', 'Alexander Wright');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="auth-modal"
        className="relative w-full max-w-md bg-white dark:bg-[#121212] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 overflow-hidden"
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {authModalMode === 'otp' ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-[#FF523B]/10 text-[#FF523B] dark:text-[#FF8E3B] flex items-center justify-center mx-auto mb-3 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">
                Verify Mobile Number
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Enter the 6-digit code sent to <span className="font-semibold text-slate-800 dark:text-zinc-200">{phoneNumber || '+1 555-0192'}</span>
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex justify-center gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-900 dark:text-white focus:border-[#FF523B] focus:bg-white dark:focus:bg-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF523B]/20"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 dark:text-zinc-500">Didn't receive code?</span>
                <button
                  type="button"
                  onClick={() => showToast('New code sent!', undefined, 'info')}
                  className="font-bold text-[#FF523B] hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white font-bold text-sm shadow-md shadow-[#FF523B]/20 transition-all cursor-pointer"
              >
                Verify & Continue
              </button>

              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 font-medium cursor-pointer"
              >
                ← Change Phone Number
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit'] block">
                FOOD<span className="text-[#FF523B]">ORA</span>
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {authModalMode === 'login' ? 'Sign in to your account' : 'Create your Foodora account'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Unlock exclusive discounts, live tracking, and easy reorders.
              </p>
            </div>

            {/* Switch Mode Tabs */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 mb-5">
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authModalMode === 'login'
                    ? 'bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthModalMode('signup')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authModalMode === 'signup'
                    ? 'bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Phone or Email selector */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setAuthMethod('phone')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  authMethod === 'phone'
                    ? 'border-[#FF523B] bg-orange-50/50 dark:bg-[#FF523B]/10 text-[#FF523B] font-bold'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Phone OTP</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  authMethod === 'email'
                    ? 'border-[#FF523B] bg-orange-50/50 dark:bg-[#FF523B]/10 text-[#FF523B] font-bold'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email & Password</span>
              </button>
            </div>

            {/* Form */}
            {authMethod === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                {authModalMode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Alexander Wright"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white font-bold text-xs shadow-md shadow-[#FF523B]/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Send One-Time Password</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {authModalMode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Alexander Wright"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="alex.wright@foodora.demo"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                      Password
                    </label>
                    {authModalMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => showToast('Password reset link dispatched', 'Check your demo inbox', 'info')}
                        className="text-[11px] text-[#FF523B] hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-xs text-slate-800 dark:text-zinc-200 focus:border-[#FF523B] focus:outline-none"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#FF523B] focus:ring-[#FF523B]"
                  />
                  <label htmlFor="remember-me">Remember me on this browser</label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#FF523B] hover:bg-[#ff3b20] text-white font-bold text-xs shadow-md shadow-[#FF523B]/20 transition-all cursor-pointer"
                >
                  {authModalMode === 'login' ? 'Sign In to Foodora' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Social Divider */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-white/10" />
              </div>
              <span className="relative px-3 bg-white dark:bg-[#121212] text-[11px] text-slate-400 dark:text-zinc-500">
                Or continue with
              </span>
            </div>

            {/* Google 1-Click Login */}
            <button
              type="button"
              onClick={handleSocialGoogleLogin}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-semibold text-slate-700 dark:text-zinc-200 flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
