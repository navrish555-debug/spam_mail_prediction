import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import { PredictionItem } from '../../types';
import { formatDate } from '../../lib/utils';

interface RecentPredictionsProps {
  items: PredictionItem[];
}

export const RecentPredictions: React.FC<RecentPredictionsProps> = ({ items }) => {
  return (
    <div className="cyber-card rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Recent Predictions
          </h3>
          <p className="text-xs text-slate-400">
            Latest classifications processed by the ML engine
          </p>
        </div>
        <Link
          to="/history"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#7C5CFC] hover:text-[#9B82FD] transition-colors"
        >
          <span>View All History</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-xs">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-400" />
          <p className="font-medium text-slate-300">No email predictions recorded yet.</p>
          <Link
            to="/analyzer"
            className="inline-block mt-3 px-3.5 py-1.5 rounded-xl bg-[#7C5CFC]/20 text-[#9B82FD] hover:bg-[#7C5CFC]/30 border border-[#7C5CFC]/40 font-semibold"
          >
            Scan your first email
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider font-mono">
                <th className="pb-3 px-2">Verdict</th>
                <th className="pb-3 px-2">Subject / Preview</th>
                <th className="pb-3 px-2 text-right">Confidence</th>
                <th className="pb-3 px-2 text-right">Analyzed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {items.map((item) => {
                const isSpam = item.predicted_label === 'SPAM';
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isSpam
                            ? 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30 shadow-sm shadow-[#F87171]/10'
                            : 'bg-[#22C7A9]/15 text-[#22C7A9] border border-[#22C7A9]/30 shadow-sm shadow-[#22C7A9]/10'
                        }`}
                      >
                        {isSpam ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-[#F87171]" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#22C7A9]" />
                        )}
                        {isSpam ? 'SPAM THREAT' : 'LEGITIMATE'}
                      </span>
                    </td>
                    <td className="py-3 px-2 max-w-xs sm:max-w-md truncate">
                      <div className="font-semibold text-slate-200 truncate">
                        {item.subject || '(No subject provided)'}
                      </div>
                      <div className="text-slate-400 truncate text-[11px]">
                        {item.email_text}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-200">
                        {item.confidence ? `${(item.confidence * 100).toFixed(1)}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right whitespace-nowrap text-slate-400 font-mono">
                      {formatDate(item.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
