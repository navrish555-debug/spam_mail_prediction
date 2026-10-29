import { apiClient } from './api';
import { AnalyticsOverviewResponse, TrendItem, DistributionItem, OverviewStats } from '../types';

export const analyticsService = {
  async fetchAnalytics(): Promise<AnalyticsOverviewResponse> {
    const response = await apiClient.get<AnalyticsOverviewResponse>('/analytics/overview');
    return response.data;
  },

  async fetchStats(): Promise<OverviewStats> {
    const response = await apiClient.get<OverviewStats>('/analytics/stats');
    return response.data;
  },

  async fetchTrends(days: number = 7): Promise<TrendItem[]> {
    const response = await apiClient.get<TrendItem[]>('/analytics/trends', {
      params: { days },
    });
    return response.data;
  },

  async fetchDistribution(): Promise<DistributionItem[]> {
    const response = await apiClient.get<DistributionItem[]>('/analytics/distribution');
    return response.data;
  },
};
