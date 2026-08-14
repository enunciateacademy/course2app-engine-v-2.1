import React, { useState } from 'react';
import { Building2, Smartphone, FileText, CheckCircle2, ArrowLeft, HelpCircle } from 'lucide-react';
import { AppConfig } from '../../types';
import { sanitizePackageName } from '../../utils/validation';

interface Step2InstituteProps {
  appData: Partial<AppConfig>;
  onChange: (fields: Partial<AppConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Institute: React.FC<Step2InstituteProps> = ({
  appData,
  onChange,
  onNext,
  onBack
}) => {
  const [instituteName, setInstituteName] = useState(appData.instituteName || '');
  const [appName, setAppName] = useState(appData.appName || appData.instituteName || '');
  const [description, setDescription] = useState(appData.shortDescription || '');
  const [hasManuallyEditedAppName, setHasManuallyEditedAppName] = useState(
    Boolean(appData.appName && appData.appName !== appData.instituteName)
  );

  const handleInstituteChange = (val: string) => {
    setInstituteName(val);
    const updates: Partial<AppConfig> = { instituteName: val };
    
    // If user hasn't typed a distinct app name, keep them in sync
    if (!hasManuallyEditedAppName) {
      setAppName(val);
      updates.appName = val;
    }

    // Auto-update package name if not manually customized
    if (!appData.packageId || appData.packageId.startsWith('com.course2app.')) {
      updates.packageId = sanitizePackageName(val || 'app');
    }

    onChange(updates);
  };

  const handleAppNameChange = (val: string) => {
    setHasManuallyEditedAppName(true);
    setAppName(val);
    onChange({ appName: val });
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    onChange({ shortDescription: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instituteName.trim() || !appName.trim()) return;
    onNext();
  };

  const suggestedPackage = appData.packageId || sanitizePackageName(instituteName || 'app');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            2
          </span>
          <h2 className="text-xl font-bold text-slate-900">Institute & App Name</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Enter your institute branding details. We will automatically generate your app identity and configuration.
        </p>
      </div>

      {/* 1. Institute Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-800">
          Institute Name <span className="text-rose-500">*</span>
        </label>
        <div className="mt-1.5 relative rounded-xl shadow-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Building2 className="h-4 w-4" />
          </div>
          <input
            type="text"
            required
            value={instituteName}
            onChange={(e) => handleInstituteChange(e.target.value)}
            placeholder="e.g. Enunciate Academy"
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          This is the institute name students will see inside the app headers and splash screen.
        </p>
      </div>

      {/* 2. App Name */}
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-slate-800">
            App Name <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs text-slate-400">{appName.length}/30 characters</span>
        </div>
        <div className="mt-1.5 relative rounded-xl shadow-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Smartphone className="h-4 w-4" />
          </div>
          <input
            type="text"
            required
            maxLength={30}
            value={appName}
            onChange={(e) => handleAppNameChange(e.target.value)}
            placeholder="e.g. Enunciate Academy"
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          This name will appear under the app icon on the student's Android home screen.
        </p>
      </div>

      {/* 3. Short Description */}
      <div>
        <label className="block text-sm font-semibold text-slate-800">
          Short Description <span className="text-xs font-normal text-slate-400">(Optional)</span>
        </label>
        <div className="mt-1.5 relative rounded-xl shadow-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <FileText className="h-4 w-4" />
          </div>
          <input
            type="text"
            maxLength={60}
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="e.g. Sainik School Entrance Coaching"
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          Briefly describe your institute or target entrance examination.
        </p>
      </div>

      {/* Automatic Android Package Name Badge */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">Generated Android Application ID:</span>
          <span className="font-mono text-blue-700 font-bold">{suggestedPackage}</span>
        </div>
        <p className="mt-1 text-slate-500">
          Automatically generated for the Google Play Store. You can fine-tune this later in Advanced Settings if needed.
        </p>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          type="submit"
          disabled={!instituteName.trim() || !appName.trim()}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all"
        >
          Continue to Branding & Colors →
        </button>
      </div>
    </form>
  );
};
