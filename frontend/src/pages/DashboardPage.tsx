import React, { useEffect, useState } from 'react';
import { Mail, ShieldAlert, ShieldCheck, Percent, RefreshCw, AlertCircle } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { StatCard } from '../components/dashboard/StatCard';
import { PredictionChart } from '../components/dashboard/PredictionChart';
import { RecentPredictions } from '../components/dashboard/RecentPredictions';
import { analyticsService } from '../services/analyticsService';
import { historyService } from '../services/historyService';
import { AnalyticsOverviewResponse, PredictionItem } from '../types';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsOverviewResponse | null>(null);
  const [recent, setRecent] = useState<PredictionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setError(null);
      const [analyticsData, historyData] = await Promise.all([
        analyticsService.fetchAnalytics(),
        historyService.fetchPredictions({ page: 1, size: 5, sort_order: 'desc' }),
      ]);
      setData(analyticsData);
      setRecent(historyData.items);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to MailGuard backend service');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <PageContainer
      title="Security Operations Dashboard"
      subtitle="Real-time threat monitoring and email telemetry"
    >
      {/* Top action toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Threat Landscape Overview
          </h2>
          <p className="text-xs text-slate-400">
            Real-time inference metrics from SQLite persistence
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#7C5CFC]' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>

      {/* Error state alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/35 text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="underline font-semibold hover:text-red-200"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Emails Analyzed"
          value={loading ? '...' : data?.overview.total_emails ?? 0}
          subtitle="Total verified through engine"
          icon={Mail}
          variant="violet"
        />
        <StatCard
          title="Spam Intercepted"
          value={loading ? '...' : data?.overview.spam_count ?? 0}
          subtitle="Threats flagged & contained"
          icon={ShieldAlert}
          variant="coral"
        />
        <StatCard
          title="Legitimate Emails"
          value={loading ? '...' : data?.overview.not_spam_count ?? 0}
          subtitle="Verified genuine messages"
          icon={ShieldCheck}
          variant="teal"
        />
        <StatCard
          title="Spam Incident Rate"
          value={loading ? '...' : `${data?.overview.spam_percentage ?? 0}%`}
          subtitle="Proportion of malicious emails"
          icon={Percent}
          variant="slate"
        />
      </div>

      {/* Charts Section */}
      <PredictionChart
        trends={data?.trends || []}
        distribution={data?.distribution || []}
      />

      {/* Recent Predictions Table */}
      <RecentPredictions items={recent} />
    </PageContainer>
  );
};
