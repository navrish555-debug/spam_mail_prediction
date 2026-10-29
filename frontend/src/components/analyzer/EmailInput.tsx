import React, { useState } from 'react';
import { Sparkles, Trash2, Shield, Loader2, ArrowRight } from 'lucide-react';

interface EmailInputProps {
  onAnalyze: (payload: { subject?: string; email_text: string }) => Promise<void>;
  isLoading: boolean;
}

const SAMPLE_TEMPLATES = [
  {
    name: 'Phishing Alert',
    badge: 'Spam Sample',
    subject: 'URGENT: Microsoft 365 Account Suspended',
    body: 'Your account has been temporarily suspended due to suspicious sign-in activities. Please verify your credentials at http://security-verify-login.com immediately to restore access within 24 hours.',
  },
  {
    name: 'Lottery Winner',
    badge: 'Spam Sample',
    subject: 'Congratulations! You won $1,000,000 Cash Prize',
    body: 'You have been selected as the grand winner of the annual international promotional lottery draw! Contact our claims agent immediately with your bank account details to receive your transfer.',
  },
  {
    name: 'Sprint Planning',
    badge: 'Legitimate Sample',
    subject: 'Sprint Planning Agenda - Q4 Engineering Roadmap',
    body: 'Hi team, please find attached the agenda for our sprint planning session tomorrow at 10 AM. We will review customer feedback and discuss the new database schema migrations.',
  },
  {
    name: 'Meeting Invite',
    badge: 'Legitimate Sample',
    subject: 'Quarterly Architecture Sync & Tech Talk',
    body: 'Hello everyone, join us this Friday in conference room B for our engineering tech talk on Machine Learning and API design. Pizza and refreshments will be provided.',
  },
];

export const EmailInput: React.FC<EmailInputProps> = ({ onAnalyze, isLoading }) => {
  const [subject, setSubject] = useState('');
  const [emailText, setEmailText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleTemplateSelect = (tmpl: (typeof SAMPLE_TEMPLATES)[0]) => {
    setSubject(tmpl.subject);
    setEmailText(tmpl.body);
    setError(null);
  };

  const handleClear = () => {
    setSubject('');
    setEmailText('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim()) {
      setError('Please enter or paste the email body text to analyze.');
      return;
    }
    if (emailText.trim().length < 5) {
      setError('Email content is too short for accurate classification (minimum 5 characters).');
      return;
    }
    setError(null);
    await onAnalyze({
      subject: subject.trim() || undefined,
      email_text: emailText.trim(),
    });
  };

  return (
    <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-800 not-dark:border-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white not-dark:text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#7C5CFC]" />
            <span>Email Threat Inspection</span>
          </h2>
          <p className="text-xs text-slate-400 not-dark:text-slate-500">
            Paste an email header & body or select a preset security test case below
          </p>
        </div>

        {/* Clear Button */}
        {(subject || emailText) && (
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear form</span>
          </button>
        )}
      </div>

      {/* Preset sample buttons */}
      <div className="mb-6">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Test Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.name}
              type="button"
              onClick={() => handleTemplateSelect(tmpl)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-800 not-dark:border-slate-300 bg-slate-900/60 not-dark:bg-slate-50 hover:bg-[#7C5CFC]/15 hover:border-[#7C5CFC]/40 text-slate-300 not-dark:text-slate-700 transition-all text-left flex items-center gap-2"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  tmpl.badge.includes('Spam') ? 'bg-[#F87171]' : 'bg-[#22C7A9]'
                }`}
              />
              <span>{tmpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 not-dark:text-slate-700 uppercase tracking-wider mb-1.5">
            Email Subject <span className="text-slate-500 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isLoading}
            placeholder="e.g., URGENT: Action required on your account"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-300 text-sm text-white not-dark:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC] transition-colors"
          />
        </div>

        {/* Email body textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 not-dark:text-slate-700 uppercase tracking-wider">
              Email Content / Body <span className="text-red-400">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              {emailText.length} characters
            </span>
          </div>
          <textarea
            rows={7}
            value={emailText}
            onChange={(e) => {
              setEmailText(e.target.value);
              if (error) setError(null);
            }}
            disabled={isLoading}
            placeholder="Paste raw email text, headers, or suspicious messages here..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 not-dark:bg-slate-50 border border-slate-800 not-dark:border-slate-300 text-sm text-white not-dark:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC] transition-colors resize-y font-mono"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading || !emailText.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#6845F5] hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-[#7C5CFC]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running ML Analysis...</span>
              </>
            ) : (
              <>
                <span>Analyze with MailGuard AI</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
