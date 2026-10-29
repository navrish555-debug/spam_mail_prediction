import { apiClient } from './api';
import { ModelInfo, ModelMetrics, SystemHealth } from '../types';

export const modelService = {
  async fetchModelInfo(): Promise<ModelInfo> {
    const response = await apiClient.get<ModelInfo>('/model/info');
    return response.data;
  },

  async fetchModelMetrics(): Promise<ModelMetrics> {
    const response = await apiClient.get<ModelMetrics>('/model/metrics');
    return response.data;
  },

  async fetchHealth(): Promise<SystemHealth> {
    const response = await apiClient.get<SystemHealth>('/health');
    return response.data;
  },
};
