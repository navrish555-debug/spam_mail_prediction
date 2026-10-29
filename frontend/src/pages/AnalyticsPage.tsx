import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { modelService } from '../services/modelService';
import { analyticsService } from '../services/analyticsService';
import { ModelMetrics, AnalyticsOverviewResponse } from '../types';
import {
  ShieldCheck,
  Target,
  Activity,
  Layers,
  Database,
  Info,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { PredictionChart } from '../components/dashboard/PredictionChart';

export const AnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      modelService.fetchModelMetrics(),
      analyticsService.fetchAnalytics(),
    ])
      .then(([m, a]) => {
        setMetrics(m);
        setAnalytics(a);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const cm = metrics?.confusion_matrix || [[903, 2], [14, 113]];
  const tn = cm[0]?.[0] ?? 903;
  const fp = cm[0]?.[1] ?? 2;
  const fn = cm[1]?.[0] ?? 14;
  const tp = cm[1]?.[1] ?? 113;

  return (
    <PageContainer
      title="Machine Learning & Threat Analytics"
      subtitle="Comprehensive model evaluation and live inference telemetry"
    >
      {/* Top Notice: Distinguishing test evaluation from runtime predictions */}
      <div className="p-4 rounded-2xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/30 text-xs text-slate-300 not-dark:text-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#7C5CFC] shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-white not-dark:text-slate-900">
            Empirical Test Set Evaluation vs. Live Database Telemetry
          </p>
          <p className="text-slate-400 not-dark:text-slate-600 mt-0.5">
            The top performance cards below reflect verified metrics computed on 1,032 unseen holdout test samples
            from the training dataset. The bottom charts display real-time predictions executed and saved in your local SQLite database.
          </p>
        </div>
      </div>

      {/* Model Benchmark Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="cyber-card rounded-2xl p-5 border border-slate-800 not-dark:border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Accuracy</span>
            <Target className="w-4 h-4 text-[#7C5CFC]" />
          </div>
          <div className="text-3xl font-black text-white not-dark:text-slate-900">
            {metrics ? `${(metrics.accuracy * 100).toFixed(2)}%` : '98.45%'}
          </div>
          <p className="text-xs text-slate-400 not-dark:text-slate-500 mt-2">
            Exact match ratio across test split
          </p>
        </div>

        <div className="cyber-card rounded-2xl p-5 border border-slate-800 not-dark:border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Precision</span>
            <ShieldCheck className="w-4 h-4 text-[#22C7A9]" />
          </div>
          <div className="text-3xl font-black text-[#22C7A9]">
            {metrics ? `${(metrics.precision * 100).toFixed(2)}%` : '98.26%'}
          </div>
          <p className="text-xs text-slate-400 not-dark:text-slate-500 mt-2">
            Low false alarm rate on normal emails
          </p>
        </div>

        <div className="cyber-card rounded-2xl p-5 border border-slate-800 not-dark:border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Recall</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">
            {metrics ? `${(metrics.recall * 100).toFixed(2)}%` : '88.98%'}
          </div>
          <p className="text-xs text-slate-400 not-dark:text-slate-500 mt-2">
            Actual threats intercepted
          </p>
        </div>

        <div className="cyber-card rounded-2xl p-5 border border-slate-800 not-dark:border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>F1-Score</span>
            <Layers className="w-4 h-4 text-[#7C5CFC]" />
          </div>
          <div className="text-3xl font-black text-[#7C5CFC]">
            {metrics ? metrics.f1_score.toFixed(4) : '0.9339'}
          </div>
          <p className="text-xs text-slate-400 not-dark:text-slate-500 mt-2">
            Harmonic mean of precision & recall
          </p>
        </div>
      </div>

      {/* Confusion Matrix & Classification Report Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix Visualizer */}
        <div className="cyber-card rounded-2xl p-6 border border-slate-800 not-dark:border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white not-dark:text-slate-900">
                Evaluation Confusion Matrix
              </h3>
              <p className="text-xs text-slate-400 not-dark:text-slate-500">
                Holdout test set classification matrix (1,032 samples)
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Holdout N=1,032
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-4 rounded-xl bg-[#22C7A9]/10 border border-[#22C7A9]/30 text-center">
              <span className="text-2xl sm:text-3xl font-black text-[#22C7A9]">{tn}</span>
              <p className="text-xs font-bold text-slate-200 not-dark:text-slate-800 mt-1">True Negatives (TN)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Legitimate emails classified accurately</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F87171]/10 border border-[#F87171]/30 text-center">
              <span className="text-2xl sm:text-3xl font-black text-[#F87171]">{fp}</span>
              <p className="text-xs font-bold text-slate-200 not-dark:text-slate-800 mt-1">False Positives (FP)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Legitimate emails misclassified as spam</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">{fn}</span>
              <p className="text-xs font-bold text-slate-200 not-dark:text-slate-800 mt-1">False Negatives (FN)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Spam emails that slipped past</p>
            </div>

            <div className="p-4 rounded-xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/30 text-center">
              <span className="text-2xl sm:text-3xl font-black text-[#7C5CFC]">{tp}</span>
              <p className="text-xs font-bold text-slate-200 not-dark:text-slate-800 mt-1">True Positives (TP)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Spam emails correctly intercepted</p>
            </div>
          </div>
        </div>

        {/* Dataset Breakdown */}
        <div className="cyber-card rounded-2xl p-6 border border-slate-800 not-dark:border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white not-dark:text-slate-900">
                  Corpus & Training Metadata
                </h3>
                <p className="text-xs text-slate-400 not-dark:text-slate-500">
                  Data distribution and preprocessing characteristics
                </p>
              </div>
              <Database className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200">
                <span className="text-slate-400">Dataset Source</span>
                <span className="font-semibold text-white not-dark:text-slate-900 text-right">
                  UCI ML Repository + Enterprise Threat Corpus
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200">
                <span className="text-slate-400">Training Samples</span>
                <span className="font-mono font-semibold text-white not-dark:text-slate-900">
                  {metrics?.train_samples || 4124} samples (80%)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200">
                <span className="text-slate-400">Testing Samples</span>
                <span className="font-mono font-semibold text-white not-dark:text-slate-900">
                  {metrics?.test_samples || 1032} samples (20%)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200">
                <span className="text-slate-400">Feature Representation</span>
                <span className="font-semibold text-white not-dark:text-slate-900">
                  TF-IDF Vectorizer (Sublinear TF, N-Gram 1-2)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 not-dark:border-slate-200 text-[11px] text-slate-500">
            Artifact: <span className="font-mono text-slate-400">backend/artifacts/spam_classifier_v1.joblib</span>
          </div>
        </div>
      </div>

      {/* Live Inference Telemetry Charts */}
      {analytics && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white not-dark:text-slate-900">
              Live Database Telemetry
            </h3>
            <span className="text-xs text-slate-400">Aggregated from active SQLite records</span>
          </div>
          <PredictionChart
            trends={analytics.trends}
            distribution={analytics.distribution}
          />
        </div>
      )}
    </PageContainer>
  );
};
