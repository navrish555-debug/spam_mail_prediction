import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, Loader2, Zap, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password) {
      setError('Please provide your username (or email) and password.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await login(usernameOrEmail.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your username/email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setIsDemoSubmitting(true);
    try {
      await demoLogin();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Demo sign in failed.');
    } finally {
      setIsDemoSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsernameOrEmail('analyst');
    setPassword('Password123!');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#080C18] text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-[#7C5CFC]/30 selection:text-white relative overflow-hidden cyber-grid">
      {/* Grand cyber ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-[#7C5CFC]/20 via-[#22C7A9]/15 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-[350px] h-[350px] bg-[#7C5CFC]/10 blur-[100px] pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-6 text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C5CFC] via-[#9B82FD] to-[#22C7A9] p-0.5 shadow-xl shadow-[#7C5CFC]/30">
            <div className="flex items-center justify-center w-full h-full bg-[#080C18] rounded-[14px]">
              <Shield className="w-6 h-6 text-[#22C7A9] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
            MailGuard<span className="text-[#7C5CFC]">.AI</span>
          </span>
        </Link>
        <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide">
          Enterprise Email Spam & Phishing Defense Platform
        </p>
      </div>

      {/* Main Login Card - Grand Cyber Glassmorphic Pod */}
      <div className="cyber-card rounded-3xl w-full max-w-md p-6 sm:p-8 relative z-10 space-y-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#7C5CFC]" />
              Analyst Console Login
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your credentials or click 1-Click Demo
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#22C7A9]/15 text-[#22C7A9] border border-[#22C7A9]/30">
            SOC Secure
          </span>
        </div>

        {/* 1-Click Demo Sign-in Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={isDemoSubmitting || isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#22C7A9]/20 via-[#7C5CFC]/25 to-[#22C7A9]/20 hover:from-[#22C7A9]/30 hover:to-[#7C5CFC]/35 border border-[#22C7A9]/40 text-[#22C7A9] hover:text-white font-bold text-xs shadow-lg shadow-[#22C7A9]/10 transition-all group"
          >
            {isDemoSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#22C7A9]" />
                <span>Authenticating Lead Analyst...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-[#22C7A9] group-hover:scale-120 transition-transform" />
                <span>1-Click Instant Sign In (Demo Analyst)</span>
              </>
            )}
          </button>

          {/* Quick Credential Card */}
          <div
            onClick={fillDemoCredentials}
            className="cursor-pointer p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#7C5CFC]/50 transition-colors flex items-center justify-between text-[11px] text-slate-400 font-mono"
            title="Click to auto-fill form with demo credentials"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C7A9]" />
              <span>Demo Account:</span>
              <span className="text-slate-200 font-semibold">analyst</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-200 font-semibold">Password123!</span>
            </div>
            <span className="text-[10px] text-[#7C5CFC] font-semibold underline">Auto-fill</span>
          </div>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-[#111A30] px-3 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            Or Sign In With Username
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Username or Corporate Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="analyst or user@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC]/50 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC]/50 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isDemoSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#6845F5] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-[#7C5CFC]/30 transition-all disabled:opacity-50 group"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Analyst Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In with Username & Password</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          Need a new security analyst account?{' '}
          <Link to="/register" className="text-[#22C7A9] font-bold hover:underline">
            Register New Account
          </Link>
        </div>
      </div>
    </div>
  );
};
