import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Rocket,
  Download,
  FileCode,
  ShieldCheck,
  Building2,
  Globe,
  Smartphone,
  Palette
} from 'lucide-react';
import { AppConfig } from '../../types';
import { runFullAppValidation } from '../../utils/validation';

interface Step7ReviewProps {
  appData: Partial<AppConfig>;
  onBuild: () => void;
  onBack: () => void;
  onDownloadConfig: () => void;
}

export const Step7Review: React.FC<Step7ReviewProps> = ({
  appData,
  onBuild,
  onBack,
  onDownloadConfig
}) => {
  const fullApp = appData as AppConfig;
  const validationChecks = runFullAppValidation(fullApp);
  const hasErrors = validationChecks.some((c) => !c.isValid);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            7
          </span>
          <h2 className="text-xl font-bold text-slate-900">Review & Build Verification</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Everything is verified and ready for the Android build engine. Review your app configuration below.
        </p>
      </div>

      {/* Validation Checklist Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          App Build Readiness Checklist
        </h3>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {validationChecks.map((check) => (
            <div
              key={check.id}
              className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${
                check.isValid
                  ? 'border-emerald-100 bg-emerald-50/40 text-emerald-950'
                  : 'border-rose-100 bg-rose-50/50 text-rose-950'
              }`}
            >
              {check.isValid ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0 flex-1">
                <div className="font-bold">{check.label}</div>
                <div className="truncate text-slate-500 text-[11px] mt-0.5">
                  {check.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Summary Card */}
      <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-slate-900 to-blue-950 p-6 text-white shadow-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xs font-bold text-lg shadow-inner"
              style={{ color: fullApp.secondaryColor || '#ffffff' }}
            >
              {fullApp.launcherIconUrl || fullApp.logoUrl ? (
                <img
                  src={fullApp.launcherIconUrl || fullApp.logoUrl}
                  alt="App Icon"
                  className="h-full w-full rounded-2xl object-cover p-1"
                />
              ) : (
                fullApp.instituteName?.charAt(0) || 'A'
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{fullApp.appName}</h3>
              <p className="text-xs text-blue-200">{fullApp.instituteName}</p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-300 border border-emerald-500/30">
            Ready to Build
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
          <div>
            <span className="text-white/60 block text-[11px]">Master Course URL</span>
            <span className="font-mono text-white truncate block mt-0.5" title={fullApp.courseUrl}>
              {fullApp.courseUrl}
            </span>
          </div>

          <div>
            <span className="text-white/60 block text-[11px]">Android Package ID</span>
            <span className="font-mono text-white truncate block mt-0.5">{fullApp.packageId}</span>
          </div>

          <div>
            <span className="text-white/60 block text-[11px]">Version & Build</span>
            <span className="font-mono text-white block mt-0.5">
              v{fullApp.versionName || '1.0.0'} (#{fullApp.versionCode || 1})
            </span>
          </div>

          <div>
            <span className="text-white/60 block text-[11px]">Primary Brand Color</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="h-3.5 w-3.5 rounded-full border border-white/20"
                style={{ backgroundColor: fullApp.primaryColor }}
              />
              <span className="font-mono text-white">{fullApp.primaryColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Config Download Note */}
      <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <span>Need offline configuration backup?</span>
        <button
          type="button"
          onClick={onDownloadConfig}
          className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
        >
          <Download className="h-3.5 w-3.5" /> Download app-config.json
        </button>
      </div>

      {/* Footer Navigation & CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          type="button"
          disabled={hasErrors}
          onClick={onBuild}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 active:scale-95 transition-all"
        >
          <Rocket className="h-4 w-4" />
          CREATE ANDROID BUILD (.AAB)
        </button>
      </div>
    </div>
  );
};
