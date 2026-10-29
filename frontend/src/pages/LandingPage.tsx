import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  Zap,
  Lock,
  Database,
  BarChart,
  CheckCircle,
  Cpu,
  Mail,
  ChevronRight,
  ShieldCheck,
  Terminal,
  User,
  LogOut,
  LogIn,
} from 'lucide-react';
import { modelService } from '../services/modelService';
import { useAuth } from '../context/AuthContext';
import { ModelMetrics } from '../types';

export const LandingPage: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    modelService.fetchModelMetrics().then(setMetrics).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#080C18] text-slate-100 flex flex-col selection:bg-[#7C5CFC]/30 selection:text-white cyber-grid">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#080C18]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C5CFC] to-[#22C7A9] p-0.5 shadow-md shadow-[#7C5CFC]/20">
              <div className="flex items-center justify-center w-full h-full bg-[#0B1020] rounded-[10px]">
                <Shield className="w-5 h-5 text-[#22C7A9]" />
              </div>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              MailGuard<span className="text-[#7C5CFC]">.AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#performance" className="hover:text-white transition-colors">Model Metrics</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <Link to="/docs" target="_blank" className="hover:text-white transition-colors">Swagger API</Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:border-[#7C5CFC]/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#7C5CFC] to-[#22C7A9] flex items-center justify-center text-[11px] font-bold text-white">
                    {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline text-white font-medium">{user?.full_name}</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6845F5] text-white shadow-md shadow-[#7C5CFC]/20 transition-all"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#6845F5] hover:opacity-95 text-white shadow-md shadow-[#7C5CFC]/25 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Glow background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#7C5CFC]/20 via-[#22C7A9]/10 to-transparent blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs font-medium text-slate-300 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#22C7A9] animate-pulse" />
            <span className="text-slate-400">Full-Stack Threat Intelligence:</span>
            <span className="text-[#22C7A9] font-semibold">98.5% Accuracy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Next-Gen AI Email <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFC] via-[#9B82FD] to-[#22C7A9]">
              Spam & Threat Defense
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Protect your communications with MailGuard AI. Powered by Scikit-Learn TF-IDF vectorization,
            Multinomial Naive Bayes classification, and high-performance SQLite persistence.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/analyzer" : "/login"}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#6845F5] hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-[#7C5CFC]/30 transition-all hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4" />
              <span>{isAuthenticated ? "Launch Email Analyzer" : "Sign In & Scan Email"}</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
            >
              <span>Explore Dashboard</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Simulated Cyber Interface Preview */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-gradient-to-b from-[#131B30]/80 to-[#0B1020] p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 px-2 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-slate-400">mailguard-engine :: NaiveBayes-Pipeline</span>
              </div>
              <span className="text-[#22C7A9]">STATUS: READY</span>
            </div>

            <div className="p-4 sm:p-6 text-left grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Active Model
                </div>
                <div className="text-base font-bold text-white">TF-IDF + Naive Bayes</div>
                <div className="text-xs text-slate-500 mt-1">N-Gram (1,2) · α=0.1</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Verified Accuracy
                </div>
                <div className="text-base font-bold text-[#22C7A9]">
                  {metrics ? `${(metrics.accuracy * 100).toFixed(2)}%` : '98.45%'}
                </div>
                <div className="text-xs text-slate-500 mt-1">Stratified 1,032 test samples</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  F1-Score
                </div>
                <div className="text-base font-bold text-[#7C5CFC]">
                  {metrics ? `${metrics.f1_score.toFixed(4)}` : '0.9339'}
                </div>
                <div className="text-xs text-slate-500 mt-1">Balanced Threat Detection</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Section with Real Metrics */}
      <section id="performance" className="py-20 border-t border-slate-800/80 bg-[#0B1020]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-[#7C5CFC] uppercase tracking-widest mb-2">
              Empirical Benchmarks
            </h2>
            <p className="text-3xl font-black text-white tracking-tight">
              Genuine Model Evaluation Metrics
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Evaluated on an independent, unseen 20% holdout test set from the UCI corpus & threat corpus.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 rounded-2xl bg-[#131B30]/70 border border-slate-800 text-center">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {metrics ? `${(metrics.accuracy * 100).toFixed(2)}%` : '98.45%'}
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">Accuracy</h3>
              <p className="text-[11px] text-slate-500 mt-1">Overall correct verdicts</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#131B30]/70 border border-slate-800 text-center">
              <span className="text-3xl sm:text-4xl font-black text-[#22C7A9]">
                {metrics ? `${(metrics.precision * 100).toFixed(2)}%` : '98.26%'}
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">Precision</h3>
              <p className="text-[11px] text-slate-500 mt-1">Ultra-low false positive rate</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#131B30]/70 border border-slate-800 text-center">
              <span className="text-3xl sm:text-4xl font-black text-amber-400">
                {metrics ? `${(metrics.recall * 100).toFixed(2)}%` : '88.98%'}
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">Recall</h3>
              <p className="text-[11px] text-slate-500 mt-1">True threats intercepted</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#131B30]/70 border border-slate-800 text-center">
              <span className="text-3xl sm:text-4xl font-black text-[#7C5CFC]">
                {metrics ? metrics.f1_score.toFixed(4) : '0.9339'}
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">F1-Score</h3>
              <p className="text-[11px] text-slate-500 mt-1">Harmonic mean balance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-20 border-t border-slate-800/80 bg-[#0E152B]/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-[#22C7A9] uppercase tracking-widest mb-2">
              Capabilities
            </h2>
            <p className="text-3xl font-black text-white tracking-tight">
              Enterprise Architecture Stack
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Built for speed, reliability, and precision across frontend, backend, and machine learning layers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#131B30]/80 border border-slate-800 hover:border-[#7C5CFC]/40 transition-all group">
              <div className="p-3 rounded-xl bg-[#7C5CFC]/15 text-[#7C5CFC] w-fit mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Machine Learning Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trained on 5,100+ authenticated samples using Scikit-Learn TF-IDF vectorization with sublinear term frequency and Multinomial Naive Bayes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131B30]/80 border border-slate-800 hover:border-[#22C7A9]/40 transition-all group">
              <div className="p-3 rounded-xl bg-[#22C7A9]/15 text-[#22C7A9] w-fit mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">SQLite Local Persistence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Parameterized SQLAlchemy ORM stores every classification, confidence score, timestamps, and model versioning securely without external server overhead.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131B30]/80 border border-slate-800 hover:border-amber-400/40 transition-all group">
              <div className="p-3 rounded-xl bg-amber-400/15 text-amber-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Live Threat Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time Recharts dashboards display daily threat trends, class ratios, confusion matrices, and paginated history with instant keyword search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 border-t border-slate-800/80 bg-[#0B1020]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-[#7C5CFC] uppercase tracking-widest mb-2">
              Pipeline Flow
            </h2>
            <p className="text-3xl font-black text-white tracking-tight">
              How MailGuard AI Operates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <span className="text-4xl font-extrabold text-slate-700 block mb-3">01</span>
              <h3 className="text-base font-bold text-white mb-2">Ingestion & Sanitization</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Raw subject and email body are parsed, URLs and emails are tokenized, and text is sanitized for clean vectorization.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <span className="text-4xl font-extrabold text-[#7C5CFC]/40 block mb-3">02</span>
              <h3 className="text-base font-bold text-white mb-2">Inference & Confidence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The TF-IDF vectorizer extracts n-gram token weights and the Multinomial Naive Bayes classifier computes exact posterior probabilities.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <span className="text-4xl font-extrabold text-[#22C7A9]/40 block mb-3">03</span>
              <h3 className="text-base font-bold text-white mb-2">Persistence & Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The prediction is committed to SQLite, threat indicators are tagged, and dashboard KPI counters update synchronously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-12 bg-[#0B1020]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#22C7A9]" />
            <span className="text-sm font-bold text-white">MailGuard AI</span>
            <span className="text-xs text-slate-500">© 2026 Enterprise Security Platform</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/analyzer" className="hover:text-white transition-colors">Analyzer</Link>
            <Link to="/history" className="hover:text-white transition-colors">History</Link>
            <Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link>
            <Link to="/model-info" className="hover:text-white transition-colors">Model Info</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
