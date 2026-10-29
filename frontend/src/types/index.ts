export type PredictionLabel = 'SPAM' | 'NOT_SPAM';

export interface User {
  id: number;
  username?: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface PredictionItem {
  id: number;
  subject: string | null;
  email_text: string;
  predicted_label: PredictionLabel;
  confidence: number | null;
  model_version: string;
  created_at: string;
  indicators: string[];
}

export interface PredictionPayload {
  subject?: string;
  email_text: string;
}

export interface PredictionListResponse {
  items: PredictionItem[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

export interface OverviewStats {
  total_emails: number;
  spam_count: number;
  not_spam_count: number;
  spam_percentage: number;
  avg_confidence: number;
}

export interface TrendItem {
  date: string;
  spam: number;
  legitimate: number;
  total: number;
}

export interface DistributionItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface AnalyticsOverviewResponse {
  overview: OverviewStats;
  trends: TrendItem[];
  distribution: DistributionItem[];
}

export interface ModelInfo {
  model_version: string;
  algorithm: string;
  dataset_name: string;
  trained_at: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  is_active: boolean;
}

export interface ModelMetrics extends ModelInfo {
  confusion_matrix: number[][];
  classification_report: Record<string, any>;
  train_samples: number;
  test_samples: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded';
  database_connected: boolean;
  model_loaded: boolean;
  model_version: string | null;
  app_version: string;
  timestamp: string;
}
