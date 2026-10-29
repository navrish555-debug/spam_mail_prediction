import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { EmailInput } from '../components/analyzer/EmailInput';
import { PredictionResult } from '../components/analyzer/PredictionResult';
import { predictionService } from '../services/predictionService';
import { PredictionItem, PredictionPayload } from '../types';
import { AlertCircle } from 'lucide-react';

export const AnalyzerPage: React.FC = () => {
  const [result, setResult] = useState<PredictionItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (payload: PredictionPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictionService.predictEmail(payload);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Inference request failed. Please check backend status.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <PageContainer
      title="Email Threat Analyzer"
      subtitle="Deep content inspection & spam classification"
    >
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result ? (
        <PredictionResult result={result} onReset={handleReset} />
      ) : (
        <EmailInput onAnalyze={handleAnalyze} isLoading={loading} />
      )}
    </PageContainer>
  );
};
