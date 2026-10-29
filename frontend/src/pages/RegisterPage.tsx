import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, AtSign, Briefcase, ArrowRight, Loader2, AlertCircle, ShieldPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Security Analyst');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await register({
        username: username.trim().toLowerCase(),
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Username or email might already be registered.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C18] text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-[#7C5CFC]/30 selection:text-white relative overflow-hidden cyber-grid">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-[#7C5CFC]/20 via-[#22C7A9]/15 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-[350px] h-[350px] bg-[#22C7A9]/10 blur-[100px] pointer-events-none" />

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
          Register New Security Analyst Account
        </p>
      </div>

      {/* Main Registration Card - Grand Cyber Glassmorphic Pod */}
      <div className="cyber-card rounded-3xl w-full max-w-md p-6 sm:p-8 relative z-10 space-y-5 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldPlus className="w-5 h-5 text-[#22C7A9]" />
              Create Analyst Profile
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose your username and password credentials
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#7C5CFC]/15 text-[#9B82FD] border border-[#7C5CFC]/30">
            RBAC Ready
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Username <span className="text-slate-500 font-normal">(alphanumeric, e.g. jdoe)</span>
            </label>
            <div className="relative">
              <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                minLength={3}
                maxLength={50}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_.-]/g, ''))}
                placeholder="analyst_john"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC]/50 transition-all font-mono"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Alex Vance"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC]/50 transition-all font-medium"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Corporate Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@organization.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC]/50 transition-all font-medium"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Security Role / Title
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC]/50 transition-all font-medium"
              >
                <option value="Security Operations Lead">Security Operations Lead</option>
                <option value="Security Analyst">Security Analyst</option>
                <option value="Threat Researcher">Threat Intelligence Researcher</option>
                <option value="IT Administrator">IT Systems Administrator</option>
                <option value="Compliance Officer">Compliance & Audit Officer</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Password <span className="text-slate-500 font-normal">(min 6 characters)</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC]/50 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#22C7A9] via-[#7C5CFC] to-[#6845F5] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-[#7C5CFC]/30 transition-all disabled:opacity-50 group"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account & Issuing Token...</span>
              </>
            ) : (
              <>
                <span>Complete Registration & Launch Console</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          Already have credentials?{' '}
          <Link to="/login" className="text-[#7C5CFC] font-bold hover:underline">
            Sign In with Username & Password
          </Link>
        </div>
      </div>
    </div>
  );
};
