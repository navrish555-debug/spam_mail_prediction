import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  MailSearch,
  History,
  BarChart3,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Home,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export const AppSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Email Analyzer', path: '/analyzer', icon: MailSearch },
    { label: 'Prediction History', path: '/history', icon: History },
    { label: 'Threat Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Model Architecture', path: '/model-info', icon: Cpu },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-slate-800/80 bg-[#080C18] text-slate-100 transition-all duration-300 z-30 select-none shadow-2xl',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 bg-[#080C18]/60">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C5CFC] via-[#9B82FD] to-[#22C7A9] p-0.5 shadow-md shadow-[#7C5CFC]/25 shrink-0">
            <div className="flex items-center justify-center w-full h-full bg-[#080C18] rounded-[10px]">
              <Shield className="w-5 h-5 text-[#22C7A9] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white leading-none">
                MailGuard<span className="text-[#7C5CFC]">.AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mt-1">
                Threat Defense
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 font-mono">
          {!collapsed ? 'Console Navigation' : '•••'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative',
                isActive
                  ? 'bg-gradient-to-r from-[#7C5CFC]/25 to-[#7C5CFC]/10 text-white border border-[#7C5CFC]/40 shadow-md shadow-[#7C5CFC]/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive ? 'text-[#9B82FD]' : 'text-slate-400 group-hover:text-white'
                )}
              />
              {!collapsed && <span>{item.label}</span>}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#7C5CFC] rounded-l-full shadow-[0_0_8px_#7C5CFC]" />
              )}
            </NavLink>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 font-mono">
            {!collapsed ? 'Resources' : '•••'}
          </div>
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all"
            title={collapsed ? 'Landing Page' : undefined}
          >
            <Home className="w-4 h-4 shrink-0 text-slate-400" />
            {!collapsed && <span>Landing Page</span>}
          </NavLink>
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all"
            title={collapsed ? 'Swagger Docs' : undefined}
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
            {!collapsed && <span>Swagger API Docs</span>}
          </a>
        </div>
      </div>

      {/* Model Engine Badge */}
      {!collapsed && (
        <div className="p-3 mx-3 mb-3 rounded-2xl bg-gradient-to-r from-slate-950 via-[#111A30] to-slate-950 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C7A9] animate-pulse" />
              <span className="text-[11px] font-bold text-slate-200">ML Engine Online</span>
            </div>
            <span className="text-[10px] font-mono text-[#22C7A9] font-bold">98.5% Acc</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">TF-IDF + Naive Bayes · v1.0</p>
        </div>
      )}

      {/* User Status / Login Options */}
      {!collapsed ? (
        user ? (
          <div className="p-3 mx-3 mb-3 rounded-2xl bg-[#111A30]/80 border border-slate-800 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C5CFC] to-[#22C7A9] p-0.5 shadow-md shadow-[#7C5CFC]/20 shrink-0">
                <div className="w-full h-full bg-[#080C18] rounded-[10px] flex items-center justify-center font-bold text-xs text-[#22C7A9]">
                  {user.full_name ? user.full_name[0].toUpperCase() : 'A'}
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">
                  {user.full_name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  @{user.username || 'analyst'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-3 mx-3 mb-3 rounded-2xl bg-gradient-to-br from-[#111A30] to-slate-950 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#7C5CFC]" />
              <span>Analyst Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6845F5] text-white text-[11px] font-bold transition-all shadow-sm"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 text-[11px] font-bold transition-all"
              >
                <UserPlus className="w-3 h-3 text-[#22C7A9]" />
                <span>Register</span>
              </Link>
            </div>
          </div>
        )
      ) : null}

      {/* Collapse Toggle Button */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};
