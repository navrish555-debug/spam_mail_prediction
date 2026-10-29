import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { modelService } from '../services/modelService';
import { ModelMetrics } from '../types';
import {
  Cpu,
  Layers,
  Database,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileCode,
  Shield,
  Sliders,
} from 'lucide-react';
import { formatDate } from '../lib/utils';

export const ModelInfoPage: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    modelService
      .fetchModelMetrics()
      .then(setMetrics)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer
      title="Machine Learning Architecture & Model Spec"
      subtitle="Model provenance, hyperparameters, and operational limitations"
    >
      {/* Top Architecture Card */}
      <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-800 not-dark:border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 not-dark:border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#7C5CFC]/20 text-[#7C5CFC]">
              <Cpu className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#22C7A9]/20 text-[#22C7A9]">
                  Active Model
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Version: {metrics?.model_version || 'v1.0'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white not-dark:text-slate-900 tracking-tight mt-1">
                TF-IDF + Multinomial Naive Bayes Pipeline
              </h2>
            </div>
          </div>
        </div>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Sliders className="w-4 h-4 text-[#7C5CFC]" />
              <span>Classifier Algorithm</span>
            </div>
            <div className="text-base font-bold text-white not-dark:text-slate-900">
              MultinomialNB (α=0.1)
            </div>
            <p className="text-xs text-slate-400 not-dark:text-slate-500 mt-1">
              Laplace smoothing parameter tuned for sparse high-dimensional n-gram feature spaces.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4 text-[#22C7A9]" />
              <span>Vectorization</span>
            </div>
            <div className="text-base font-bold text-white not-dark:text-slate-900">
              TF-IDF (1-2 N-grams)
            </div>
            <p className="text-xs text-slate-400 not-dark:text-slate-500 mt-1">
              Sublinear term frequency scaling with English stopword filtering and 6,000 max features.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Trained Date & Corpus</span>
            </div>
            <div className="text-base font-bold text-white not-dark:text-slate-900 truncate">
              {metrics?.trained_at ? formatDate(metrics.trained_at) : 'Active Session'}
            </div>
            <p className="text-xs text-slate-400 not-dark:text-slate-500 mt-1">
              UCI SMS Spam Collection + Enterprise Cybersecurity Threat Corpus.
            </p>
          </div>
        </div>
      </div>

      {/* Operational Strengths & Known Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="cyber-card rounded-2xl p-6 border border-teal-500/20 bg-teal-950/10 not-dark:bg-white not-dark:border-slate-200">
          <h3 className="text-base font-bold text-white not-dark:text-slate-900 flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-[#22C7A9]" />
            <span>Architecture Advantages</span>
          </h3>
          <ul className="space-y-3 text-xs text-slate-300 not-dark:text-slate-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C7A9] mt-1.5 shrink-0" />
              <span><strong>Sub-millisecond inference latency:</strong> Naive Bayes computes log-likelihood sums with zero heavy GPU overhead.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C7A9] mt-1.5 shrink-0" />
              <span><strong>High Precision (98.26%):</strong> Minimal risk of classifying legitimate business communications as spam.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C7A9] mt-1.5 shrink-0" />
              <span><strong>Self-Contained Artifact:</strong> Scikit-learn Pipeline serializes both vectorizer vocabulary and model weights in a single reproducible `.joblib` file.</span>
            </li>
          </ul>
        </div>

        {/* Limitations */}
        <div className="cyber-card rounded-2xl p-6 border border-amber-500/20 bg-amber-950/10 not-dark:bg-white not-dark:border-slate-200">
          <h3 className="text-base font-bold text-white not-dark:text-slate-900 flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Known Model Limitations</span>
          </h3>
          <ul className="space-y-3 text-xs text-slate-300 not-dark:text-slate-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span><strong>Conditional Independence Assumption:</strong> Naive Bayes assumes word independence, which ignores deep semantic context or long-range dependencies.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span><strong>Language Constraint:</strong> Primary vectorizer vocabulary is trained on English text and corporate headers; multi-lingual email may require specific language models.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span><strong>Adversarial Evasion:</strong> Heavily obfuscated characters (e.g., zero-width spaces or homoglyphs) should be pre-filtered prior to vectorization.</span>
            </li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
};
