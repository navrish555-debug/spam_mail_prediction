import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, PlusCircle, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { modelService } from '../../services/modelService';
import { SystemHealth } from '../../types';

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ title, subtitle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const res = await modelService.fetchHealth();
        if (isMounted) setHealth(res);
      } catch {
        if (isMounted) {
          setHealth({
            status: 'degraded',
            database_connected: false,
            model_loaded: false,
            model_version: null,
            app_version: '1.0.0',
            timestamp: new Date().toISOString(),
          });
        }
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <header className="h-16 px-6 border-b border-slate-800/80 bg-[#080C18]/90 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20">
      {/* Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mb-0.5">
          <Link to="/dashboard" className="hover:text-[#7C5CFC] transition-colors">
            MailGuard
          </Link>
          {pathParts.map((part) => (
            <React.Fragment key={part}>
              <span className="text-slate-600">/</span>
              <span className="capitalize text-slate-300 font-medium">{part}</span>
            </React.Fragment>
          ))}
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight leading-none flex items-center gap-2">
          {title || 'Security Operations'}
          {subtitle && (
            <span className="text-xs font-normal text-slate-400 hidden sm:inline">
              — {subtitle}
            </span>
          )}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* System Health Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            health?.status === 'healthy'
              ? 'bg-[#22C7A9]/10 text-[#22C7A9] border-[#22C7A9]/30 shadow-sm shadow-[#22C7A9]/10'
              : 'bg-[#F87171]/10 text-[#F87171] border-[#F87171]/30 shadow-sm shadow-[#F87171]/10'
          }`}
          title={health?.status === 'healthy' ? 'ML Engine and SQLite Database connected' : 'Connecting to API...'}
        >
          {health?.status === 'healthy' ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C7A9]" />
              <span className="tracking-wide">ML Engine Online</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-[#F87171]" />
              <span className="tracking-wide">API Offline</span>
            </>
          )}
        </div>

        {/* Quick Action Button */}
        <Link
          to="/analyzer"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7C5CFC] to-[#6845F5] hover:opacity-95 text-white shadow-md shadow-[#7C5CFC]/25 transition-all hover:scale-105"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Scan Email</span>
        </Link>

        {/* User Pill / Login & Register Options */}
        {user ? (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C5CFC] to-[#22C7A9] p-0.5 shadow-md shadow-[#7C5CFC]/20">
                <div className="w-full h-full bg-[#080C18] rounded-[10px] flex items-center justify-center font-bold text-xs text-[#22C7A9]">
                  {user.full_name ? user.full_name[0].toUpperCase() : 'A'}
                </div>
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-white tracking-tight leading-none">
                  {user.full_name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                  @{user.username || 'analyst'} · {user.role}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
              title="Sign Out of Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 hover:border-[#7C5CFC] hover:text-white transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-[#7C5CFC]" />
              <span>Sign In</span>
            </Link>
            <Link
              to="/register"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#6845F5] hover:opacity-95 text-white transition-all shadow-sm shadow-[#7C5CFC]/20"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
