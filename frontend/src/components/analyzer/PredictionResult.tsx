import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  RotateCcw,
  Tag,
  Calendar,
  Binary,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { PredictionItem } from '../../types';
import { formatDate } from '../../lib/utils';
import { predictionService } from '../../services/predictionService';

interface PredictionResultProps {
  result: PredictionItem;
  onReset: () => void;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({ result, onReset }) => {
  const isSpam = result.predicted_label === 'SPAM';
  const confidencePercent = result.confidence ? Math.round(result.confidence * 100) : 95;

  const [geminiAnalysis, setGeminiAnalysis] = useState<string | null>(null);
  const [isGeneratingGemini, setIsGeneratingGemini] = useState(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);

  const handleCopy = () => {
    const text = `MailGuard AI Threat Verdict: ${result.predicted_label}\nConfidence: ${confidencePercent}%\nSubject: ${result.subject || 'N/A'}\nModel: ${result.model_version}`;
    navigator.clipboard.writeText(text);
  };

  const handleGeminiExplain = async () => {
    setIsGeneratingGemini(true);
    setGeminiError(null);
    try {
      const res = await predictionService.explainWithGemini(result.id);
      if (res.success && res.analysis) {
        setGeminiAnalysis(res.analysis);
      } else {
        setGeminiError(res.error || 'Failed to generate analysis.');
      }
    } catch (err: any) {
      setGeminiError(err.message || 'Error connecting to Gemini AI.');
    } finally {
      setIsGeneratingGemini(false);
    }
  };

  return (
    <div
      className={`cyber-card rounded-2xl p-6 sm:p-8 border transition-all animate-in fade-in-50 duration-300 ${
        isSpam
          ? 'border-red-500/30 bg-red-950/10 shadow-[0_0_30px_rgba(248,113,113,0.15)]'
          : 'border-teal-500/30 bg-teal-950/10 shadow-[0_0_30px_rgba(34,199,169,0.15)]'
      }`}
    >
      {/* Top Banner Verdict */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 not-dark:border-slate-200">
        <div className="flex items-center gap-4">
          <div
            className={`p-3.5 rounded-2xl ${
              isSpam
                ? 'bg-[#F87171]/20 text-[#F87171] ring-2 ring-[#F87171]/30'
                : 'bg-[#22C7A9]/20 text-[#22C7A9] ring-2 ring-[#22C7A9]/30'
            }`}
          >
            {isSpam ? <ShieldAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isSpam
                    ? 'bg-[#F87171]/20 text-[#F87171]'
                    : 'bg-[#22C7A9]/20 text-[#22C7A9]'
                }`}
              >
                Classification Verdict
              </span>
              <span className="text-xs text-slate-400 not-dark:text-slate-500 font-mono">
                Record #{result.id}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white not-dark:text-slate-900 tracking-tight mt-1">
              {isSpam ? 'SPAM / THREAT DETECTED' : 'LEGITIMATE COMMUNICATION'}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 not-dark:border-slate-300 bg-slate-900/60 not-dark:bg-slate-100 hover:bg-slate-800 text-xs font-semibold text-slate-300 not-dark:text-slate-700 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Verdict</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7C5CFC]/20 hover:bg-[#7C5CFC]/30 text-xs font-semibold text-[#7C5CFC] dark:text-[#9B82FD] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another</span>
          </button>
        </div>
      </div>

      {/* Confidence & Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Model Confidence Bar */}
        <div className="p-4 rounded-xl bg-slate-900/40 not-dark:bg-slate-50 border border-slate-800/80 not-dark:border-slate-200">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-300 not-dark:text-slate-700">
              Model Confidence Score
            </span>
            <span
              className={`font-mono font-bold ${
                isSpam ? 'text-[#F87171]' : 'text-[#22C7A9]'
              }`}
            >
              {confidencePercent}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 not-dark:bg-slate-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isSpam
                  ? 'bg-gradient-to-r from-orange-500 to-[#F87171]'
                  : 'bg-gradient-to-r from-emerald-500 to-[#22C7A9]'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 not-dark:text-slate-500 mt-2">
            Calculated via Scikit-Learn Multinomial Naive Bayes posterior probability.
          </p>
        </div>

        {/* Security Interpretation */}
        <div className="p-4 rounded-xl bg-slate-900/40 not-dark:bg-slate-50 border border-slate-800/80 not-dark:border-slate-200 flex items-start gap-3">
          {isSpam ? (
            <AlertTriangle className="w-5 h-5 text-[#F87171] shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#22C7A9] shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <h4 className="font-bold text-white not-dark:text-slate-900">
              {isSpam ? 'Caution Recommended' : 'Safe to Proceed'}
            </h4>
            <p className="text-slate-400 not-dark:text-slate-600 mt-1 leading-relaxed">
              {isSpam
                ? 'This message exhibits typical scam, phishing, or unsolicited marketing patterns. Avoid clicking hyperlinks or sharing credentials.'
                : 'This message exhibits typical business or personal correspondence patterns. No anomalous malicious indicators found.'}
            </p>
          </div>
        </div>
      </div>

      {/* Detected Threat Indicators / Tokens */}
      {result.indicators && result.indicators.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-slate-900/40 not-dark:bg-slate-50 border border-slate-800/80 not-dark:border-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 not-dark:text-slate-700 uppercase tracking-wider mb-2">
            <Tag className="w-3.5 h-3.5 text-[#7C5CFC]" />
            <span>Identified Threat Keywords & Patterns:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.indicators.map((ind, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gemini Deep Threat Intelligence Card */}
      <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-[#7C5CFC]/10 via-[#131B30] to-[#22C7A9]/10 border border-[#7C5CFC]/30 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#7C5CFC] to-[#22C7A9] text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white not-dark:text-slate-900 tracking-wide uppercase">
                Deep Threat Breakdown · Google Gemini
              </h4>
              <p className="text-[11px] text-slate-400">
                Generative AI security audit identifying social engineering tactics
              </p>
            </div>
          </div>

          {!geminiAnalysis && (
            <button
              type="button"
              onClick={handleGeminiExplain}
              disabled={isGeneratingGemini}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#22C7A9] hover:opacity-95 text-white font-semibold text-xs shadow-md shadow-[#7C5CFC]/20 transition-all disabled:opacity-50 self-end sm:self-auto"
            >
              {isGeneratingGemini ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Consulting Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain with Gemini AI</span>
                </>
              )}
            </button>
          )}
        </div>

        {geminiError && (
          <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
            {geminiError}
          </div>
        )}

        {geminiAnalysis && (
          <div className="mt-3 p-4 rounded-xl bg-[#0B1020]/80 not-dark:bg-white border border-slate-700/60 not-dark:border-slate-200 text-xs text-slate-200 not-dark:text-slate-800 leading-relaxed font-sans space-y-2 whitespace-pre-wrap animate-in fade-in-50">
            {geminiAnalysis}
          </div>
        )}
      </div>

      {/* Technical Details Footer */}
      <div className="pt-4 border-t border-slate-800 not-dark:border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-400 not-dark:text-slate-500 gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Binary className="w-3.5 h-3.5 text-slate-400" />
            <span>Model: {result.model_version}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Analyzed: {formatDate(result.created_at)}</span>
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Database: SQLite (backend/data/mailguard.db)
        </span>
      </div>
    </div>
  );
};
