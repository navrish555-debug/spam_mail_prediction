import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="p-4 rounded-3xl bg-red-500/10 border border-red-500/30 text-[#F87171] mb-6 glow-coral">
        <ShieldAlert className="w-16 h-16" />
      </div>

      <span className="font-mono text-sm font-bold text-[#7C5CFC] tracking-widest uppercase mb-2">
        HTTP Error 404
      </span>

      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
        Resource Out of Scope
      </h1>

      <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        The route or intelligence audit you requested does not exist on this security node.
        Please return to the operational dashboard.
      </p>

      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7C5CFC] hover:bg-[#6845F5] text-white text-xs font-bold shadow-lg shadow-[#7C5CFC]/25 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Landing Page</span>
        </Link>
      </div>
    </div>
  );
};
