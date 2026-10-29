import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'violet' | 'teal' | 'coral' | 'slate';
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'violet',
  trend,
}) => {
  const variantStyles = {
    violet: {
      border: 'border-[#7C5CFC]/30 hover:border-[#7C5CFC]/60',
      iconBg: 'bg-[#7C5CFC]/20 text-[#9B82FD] ring-1 ring-[#7C5CFC]/40 shadow-sm shadow-[#7C5CFC]/30',
      glow: 'hover:shadow-[0_0_30px_rgba(124,92,252,0.25)]',
      accentColor: 'text-[#9B82FD]',
      badgeBg: 'bg-[#7C5CFC]/15 text-[#9B82FD] border border-[#7C5CFC]/30',
    },
    teal: {
      border: 'border-[#22C7A9]/30 hover:border-[#22C7A9]/60',
      iconBg: 'bg-[#22C7A9]/20 text-[#22C7A9] ring-1 ring-[#22C7A9]/40 shadow-sm shadow-[#22C7A9]/30',
      glow: 'hover:shadow-[0_0_30px_rgba(34,199,169,0.25)]',
      accentColor: 'text-[#22C7A9]',
      badgeBg: 'bg-[#22C7A9]/15 text-[#22C7A9] border border-[#22C7A9]/30',
    },
    coral: {
      border: 'border-[#F87171]/30 hover:border-[#F87171]/60',
      iconBg: 'bg-[#F87171]/20 text-[#F87171] ring-1 ring-[#F87171]/40 shadow-sm shadow-[#F87171]/30',
      glow: 'hover:shadow-[0_0_30px_rgba(248,113,113,0.25)]',
      accentColor: 'text-[#F87171]',
      badgeBg: 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30',
    },
    slate: {
      border: 'border-slate-800 hover:border-slate-600',
      iconBg: 'bg-slate-800 text-slate-300 ring-1 ring-slate-700',
      glow: 'hover:shadow-lg',
      accentColor: 'text-slate-300',
      badgeBg: 'bg-slate-800 text-slate-400 border border-slate-700',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={cn(
        'cyber-card rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group',
        style.border,
        style.glow
      )}
    >
      {/* Ambient corner light */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 font-mono">
            {title}
          </span>
          <div className={cn('p-2.5 rounded-xl transition-transform group-hover:scale-110', style.iconBg)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                'text-[11px] font-bold px-2 py-0.5 rounded-md font-mono',
                trend.isPositive
                  ? 'bg-[#22C7A9]/15 text-[#22C7A9] border border-[#22C7A9]/30'
                  : 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30'
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      </div>

      {subtitle && (
        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-medium">
            {subtitle}
          </p>
          <span className={cn('w-2 h-2 rounded-full', style.iconBg)} />
        </div>
      )}
    </div>
  );
};
