import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { useTheme } from '../components/layout/ThemeContext';
import { modelService } from '../services/modelService';
import { historyService } from '../services/historyService';
import { SystemHealth } from '../types';
import {
  Settings,
  Sun,
  Moon,
  Database,
  Trash2,
  HardDrive,
  Info,
  Check,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [clearStatus, setClearStatus] = useState<string | null>(null);

  useEffect(() => {
    modelService.fetchHealth().then(setHealth).catch(() => {});
  }, []);

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all prediction history?')) return;
    setIsClearing(true);
    setClearStatus(null);
    try {
      const res = await historyService.clearHistory();
      setClearStatus(`Successfully deleted ${res.deleted_count} prediction records.`);
    } catch (err: any) {
      setClearStatus(`Error clearing history: ${err.message}`);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <PageContainer
      title="System Preferences & Settings"
      subtitle="Theme customization, database maintenance, and environment diagnostics"
    >
      <div className="max-w-4xl space-y-6">
        {/* Theme Settings Card */}
        <div className="cyber-card rounded-2xl p-6 border border-slate-800 not-dark:border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white not-dark:text-slate-900">
              Interface Appearance
            </h3>
          </div>
          <p className="text-xs text-slate-400 not-dark:text-slate-500">
            Choose your preferred color scheme for high-contrast threat auditing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                theme === 'dark'
                  ? 'border-[#7C5CFC] bg-[#7C5CFC]/10 ring-1 ring-[#7C5CFC]'
                  : 'border-slate-800 not-dark:border-slate-300 bg-slate-900/60 not-dark:bg-slate-50 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[#9B82FD]" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white not-dark:text-slate-900">Midnight Dark</div>
                  <div className="text-[11px] text-slate-400">Cybersecurity SaaS Theme</div>
                </div>
              </div>
              {theme === 'dark' && <Check className="w-4 h-4 text-[#7C5CFC]" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                theme === 'light'
                  ? 'border-[#7C5CFC] bg-[#7C5CFC]/10 ring-1 ring-[#7C5CFC]'
                  : 'border-slate-800 not-dark:border-slate-300 bg-slate-900/60 not-dark:bg-slate-50 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <div className="text-xs font-bold text-white not-dark:text-slate-900">Clean Light</div>
                  <div className="text-[11px] text-slate-400">High Contrast Day Mode</div>
                </div>
              </div>
              {theme === 'light' && <Check className="w-4 h-4 text-[#7C5CFC]" />}
            </button>
          </div>
        </div>

        {/* Database & Storage Maintenance Card */}
        <div className="cyber-card rounded-2xl p-6 border border-slate-800 not-dark:border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#22C7A9]" />
            <h3 className="text-base font-bold text-white not-dark:text-slate-900">
              Database Maintenance
            </h3>
          </div>
          <p className="text-xs text-slate-400 not-dark:text-slate-500">
            Manage local SQLite database records and telemetry logs.
          </p>

          <div className="p-4 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-white not-dark:text-slate-900">
                Purge All Email Records
              </div>
              <div className="text-[11px] text-slate-400">
                Resets the predictions table. The trained ML model artifact is unaffected.
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearHistory}
              disabled={isClearing}
              className="px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isClearing ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span>Clear History Database</span>
            </button>
          </div>

          {clearStatus && (
            <div className="p-3 rounded-xl bg-[#22C7A9]/10 border border-[#22C7A9]/30 text-[#22C7A9] text-xs font-medium">
              {clearStatus}
            </div>
          )}
        </div>

        {/* Environment & Diagnostic Information */}
        <div className="cyber-card rounded-2xl p-6 border border-slate-800 not-dark:border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#7C5CFC]" />
            <h3 className="text-base font-bold text-white not-dark:text-slate-900">
              System Environment Diagnostics
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200 flex justify-between">
              <span className="text-slate-400">Application</span>
              <span className="font-semibold text-white not-dark:text-slate-900">MailGuard AI v1.0.0</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200 flex justify-between">
              <span className="text-slate-400">Backend API</span>
              <span className="font-semibold text-white not-dark:text-slate-900">Python FastAPI + Uvicorn</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200 flex justify-between">
              <span className="text-slate-400">Database Engine</span>
              <span className="font-semibold text-white not-dark:text-slate-900">SQLite + SQLAlchemy ORM</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200 flex justify-between">
              <span className="text-slate-400">Database File</span>
              <span className="font-mono text-slate-300 not-dark:text-slate-700">backend/data/mailguard.db</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200 flex justify-between">
              <span className="text-slate-400">Model Artifact</span>
              <span className="font-mono text-slate-300 not-dark:text-slate-700">artifacts/spam_classifier_v1.joblib</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-200 flex justify-between">
              <span className="text-slate-400">Backend Status</span>
              <span className={`font-semibold ${health?.status === 'healthy' ? 'text-[#22C7A9]' : 'text-red-400'}`}>
                {health?.status === 'healthy' ? 'Online & Healthy' : 'Connecting / Degraded'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
