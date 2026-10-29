import React, { useEffect, useState } from 'react';
import {
  Search,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Tag,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { historyService, HistoryParams } from '../services/historyService';
import { PredictionItem, PredictionListResponse } from '../types';
import { formatDate } from '../lib/utils';

export const HistoryPage: React.FC = () => {
  const [data, setData] = useState<PredictionListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [label, setLabel] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<PredictionItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async (params: HistoryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await historyService.fetchPredictions({
        page: params.page ?? page,
        size: 10,
        search: params.search ?? (search || undefined),
        label: params.label ?? (label !== 'ALL' ? label : undefined),
        sort_order: 'desc',
      });
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load prediction history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory({ page: 1 });
  }, [label]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadHistory({ page: 1, search });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadHistory({ page: newPage });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Delete prediction record #${id}?`)) return;
    setIsDeleting(id);
    try {
      await historyService.deletePrediction(id);
      if (selectedItem?.id === id) setSelectedItem(null);
      await loadHistory();
    } catch (err: any) {
      alert(err.message || 'Failed to delete record.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleClearAll = async () => {
    try {
      await historyService.clearHistory();
      setShowClearModal(false);
      setSelectedItem(null);
      await loadHistory({ page: 1 });
    } catch (err: any) {
      alert(err.message || 'Failed to clear history.');
    }
  };

  return (
    <PageContainer
      title="Prediction History & Audit Logs"
      subtitle="Search, audit, and manage classified email records"
    >
      {/* Top Filter and Search Bar */}
      <div className="cyber-card rounded-2xl p-4 sm:p-5 border border-slate-800 not-dark:border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject or email content..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-300 text-xs text-white not-dark:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC] transition-colors"
            />
          </form>

          {/* Classification Filter Tabs & Clear Action */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center p-1 rounded-xl bg-slate-900/80 not-dark:bg-slate-100 border border-slate-800 not-dark:border-slate-300 text-xs">
              {(['ALL', 'SPAM', 'NOT_SPAM'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setLabel(tab);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    label === tab
                      ? 'bg-[#7C5CFC] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white not-dark:hover:text-slate-900'
                  }`}
                >
                  {tab === 'ALL' ? 'All' : tab === 'SPAM' ? 'Spam' : 'Legit'}
                </button>
              ))}
            </div>

            {data && data.total > 0 && (
              <button
                type="button"
                onClick={() => setShowClearModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors"
                title="Clear all saved history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="cyber-card rounded-2xl border border-slate-800 not-dark:border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <RotateCcw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#7C5CFC]" />
            <span>Loading records from SQLite...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-400">
            <p>{error}</p>
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-medium text-slate-300 not-dark:text-slate-700">No predictions found</p>
            <p className="text-[11px] mt-1">Try adjusting your search terms or classification filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 not-dark:border-slate-200 bg-slate-900/40 not-dark:bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Classification</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4 text-center">Confidence</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 not-dark:divide-slate-200">
                {data.items.map((item) => {
                  const isSpam = item.predicted_label === 'SPAM';
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/20 not-dark:hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono text-slate-400">#{item.id}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isSpam
                              ? 'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20'
                              : 'bg-[#22C7A9]/10 text-[#22C7A9] border border-[#22C7A9]/20'
                          }`}
                        >
                          {isSpam ? (
                            <ShieldAlert className="w-3 h-3 text-[#F87171]" />
                          ) : (
                            <ShieldCheck className="w-3 h-3 text-[#22C7A9]" />
                          )}
                          {isSpam ? 'SPAM' : 'LEGIT'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate">
                        <span className="font-medium text-slate-200 not-dark:text-slate-800">
                          {item.subject || '(No subject)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap font-mono text-slate-300 not-dark:text-slate-700">
                        {item.confidence ? `${(item.confidence * 100).toFixed(1)}%` : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 not-dark:text-slate-500">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 rounded-lg border border-slate-800 not-dark:border-slate-300 hover:bg-slate-800 not-dark:hover:bg-slate-100 text-slate-300 not-dark:text-slate-700 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={isDeleting === item.id}
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {data && data.total_pages > 1 && (
          <div className="p-4 border-t border-slate-800 not-dark:border-slate-200 flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing Page <span className="font-semibold text-white not-dark:text-slate-900">{data.page}</span> of{' '}
              <span className="font-semibold text-white not-dark:text-slate-900">{data.total_pages}</span> ({data.total} total)
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => handlePageChange(data.page - 1)}
                className="p-1.5 rounded-lg border border-slate-800 not-dark:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 not-dark:hover:bg-slate-100 text-white not-dark:text-slate-900"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={data.page >= data.total_pages}
                onClick={() => handlePageChange(data.page + 1)}
                className="p-1.5 rounded-lg border border-slate-800 not-dark:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 not-dark:hover:bg-slate-100 text-white not-dark:text-slate-900"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50">
          <div className="cyber-card rounded-2xl max-w-xl w-full p-6 border border-slate-700 not-dark:border-slate-300 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 not-dark:border-slate-200">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    selectedItem.predicted_label === 'SPAM'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-teal-500/20 text-teal-400'
                  }`}
                >
                  {selectedItem.predicted_label}
                </span>
                <span className="text-xs font-mono text-slate-400">Record #{selectedItem.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white not-dark:hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Subject
              </div>
              <div className="text-sm font-semibold text-white not-dark:text-slate-900">
                {selectedItem.subject || '(None provided)'}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Email Content
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 not-dark:bg-slate-100 border border-slate-800 not-dark:border-slate-200 text-xs font-mono text-slate-300 not-dark:text-slate-800 max-h-56 overflow-y-auto whitespace-pre-wrap">
                {selectedItem.email_text}
              </div>
            </div>

            {selectedItem.indicators && selectedItem.indicators.length > 0 && (
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                  Threat Triggers Detected
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.indicators.map((ind, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-mono"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 not-dark:border-slate-200 flex items-center justify-between text-xs text-slate-400">
              <span>Confidence: {selectedItem.confidence ? `${(selectedItem.confidence * 100).toFixed(1)}%` : 'N/A'}</span>
              <span>Logged: {formatDate(selectedItem.created_at)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50">
          <div className="cyber-card rounded-2xl max-w-md w-full p-6 border border-red-500/30 shadow-2xl relative text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white not-dark:text-slate-900">
              Clear All Prediction History?
            </h3>
            <p className="text-xs text-slate-400 not-dark:text-slate-600">
              This action will permanently delete all saved email records from SQLite. Dashboard counters and metrics will be reset to zero. This cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-800 not-dark:border-slate-300 text-xs font-semibold text-slate-300 not-dark:text-slate-700 hover:bg-slate-800 not-dark:hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-md shadow-red-500/20"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
