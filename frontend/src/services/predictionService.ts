import { apiClient } from './api';
import { PredictionItem, PredictionPayload } from '../types';

export const predictionService = {
  async predictEmail(payload: PredictionPayload): Promise<PredictionItem> {
    const response = await apiClient.post<PredictionItem>('/predictions', payload);
    return response.data;
  },

  async explainWithGemini(predictionId: number): Promise<{ success: boolean; model?: string; analysis?: string; error?: string }> {
    const response = await apiClient.post(`/predictions/${predictionId}/gemini-explain`);
    return response.data;
  },
};
