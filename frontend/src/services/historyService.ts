import { apiClient } from './api';
import { PredictionItem, PredictionListResponse } from '../types';

export interface HistoryParams {
  page?: number;
  size?: number;
  search?: string;
  label?: string;
  sort_order?: 'asc' | 'desc';
}

export const historyService = {
  async fetchPredictions(params: HistoryParams = {}): Promise<PredictionListResponse> {
    const cleanParams: Record<string, any> = {};
    if (params.page) cleanParams.page = params.page;
    if (params.size) cleanParams.size = params.size;
    if (params.search) cleanParams.search = params.search;
    if (params.label && params.label !== 'ALL') cleanParams.label = params.label;
    if (params.sort_order) cleanParams.sort_order = params.sort_order;

    const response = await apiClient.get<PredictionListResponse>('/predictions', {
      params: cleanParams,
    });
    return response.data;
  },

  async getPrediction(id: number): Promise<PredictionItem> {
    const response = await apiClient.get<PredictionItem>(`/predictions/${id}`);
    return response.data;
  },

  async deletePrediction(id: number): Promise<{ message: string; id: number }> {
    const response = await apiClient.delete(`/predictions/${id}`);
    return response.data;
  },

  async clearHistory(): Promise<{ message: string; deleted_count: number }> {
    const response = await apiClient.delete('/predictions');
    return response.data;
  },
};
