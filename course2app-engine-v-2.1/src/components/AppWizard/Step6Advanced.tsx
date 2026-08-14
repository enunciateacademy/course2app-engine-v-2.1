import React, { useState } from 'react';
import {
  Settings,
  ArrowLeft,
  RefreshCw,
  Edit2,
  Mail,
  Phone,
  Globe,
  Camera,
  Mic,
  MapPin,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { AppConfig } from '../../types';
import { sanitizePackageName, validatePackageName } from '../../utils/validation';

interface Step6AdvancedProps {
  appData: Partial<AppConfig>;
  onChange: (fields: Partial<AppConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step6Advanced: React.FC<Step6AdvancedProps> = ({
  appData,
  onChange,
  onNext,
  onBack
}) => {
  const [packageId, setPackageId] = useState<string>(
    appData.packageId || sanitizePackageName(appData.instituteName || 'app')
  );
  const [isEditingPackage, setIsEditingPackage] = useState<boolean>(false);
  const [packageError, setPackageError] = useState<string>('');

  const [versionName, setVersionName] = useState<string>(appData.versionName || '1.0.0');
  const [versionCode, setVersionCode] = useState<number>(appData.versionCode || 1);

  const [supportEmail, setSupportEmail] = useState<string>(appData.supportEmail || '');
  const [supportPhone, setSupportPhone] = useState<string>(appData.supportPhone || '');
  const [websiteUrl, setWebsiteUrl] = useState<string>(appData.websiteUrl || '');

  // Capabilities
  const [allowCamera, setAllowCamera] = useState<boolean>(appData.allowCamera ?? true);
  const [allowMic, setAllowMic] = useState<boolean>(appData.allowMicrophone ?? true);
  const [allowGeo, setAllowGeo] = useState<boolean>(appData.allowGeolocation ?? false);
  const [allowUpload, setAllowUpload] = useState<boolean>(appData.allowFileUpload ?? true);
  const [allowDownload, setAllowDownload] = useState<boolean>(appData.allowDownloads ?? true);
  const [pullToRefresh, setPullToRefresh] = useState<boolean>(appData.enablePullToRefresh ?? true);
  const [offlineCache, setOfflineCache] = useState<boolean>(appData.enableOfflineCache ?? true);

  const handlePackageChange = (val: string) => {
    setPackageId(val);
    const check = validatePackageName(val);
    setPackageError(check.valid ? '' : check.error || '');
    onChange({ packageId: val });
  };

  const handleRegeneratePackage = () => {
    const auto = sanitizePackageName(appData.instituteName || 'app');
    setPackageId(auto);
    setPackageError('');
    setIsEditingPackage(false);
    onChange({ packageId: auto });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validatePackageName(packageId);
    if (!check.valid) {
      setPackageError(check.error || 'Please enter a valid Android Package Name');
      setIsEditingPackage(true);
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            6
          </span>
          <h2 className="text-xl font-bold text-slate-900">Advanced Android Settings</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Standard safe defaults have been configured automatically. You can customize them if needed.
        </p>
      </div>

      {/* 1. Android Package Name */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-bold text-slate-900">
              Android Package Name (Application ID)
            </label>
            <p className="text-xs text-slate-500">
              Automatically generated. Unique identifier for Google Play Store.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditingPackage ? (
              <button
                type="button"
                onClick={() => setIsEditingPackage(true)}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                <Edit2 className="h-3 w-3" /> Edit Manually
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegeneratePackage}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <RefreshCw className="h-3 w-3" /> Auto-Generate
              </button>
            )}
          </div>
        </div>

        <div>
          <input
            type="text"
            disabled={!isEditingPackage}
            value={packageId}
            onChange={(e) => handlePackageChange(e.target.value.toLowerCase())}
            placeholder="com.course2app.enunciateacademy"
            className={`w-full rounded-xl border px-3 py-2.5 font-mono text-xs ${
              isEditingPackage
                ? 'border-blue-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-100'
                : 'border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed'
            }`}
          />
          {packageError && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{packageError}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Versioning */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <label className="block text-xs font-bold text-slate-800">
            Version Name (Displayed to Students)
          </label>
          <p className="text-[11px] text-slate-500 mb-2">e.g. 1.0.0</p>
          <input
            type="text"
            required
            value={versionName}
            onChange={(e) => {
              setVersionName(e.target.value);
              onChange({ versionName: e.target.value });
            }}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-hidden"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <label className="block text-xs font-bold text-slate-800">
            Build Number (Version Code)
          </label>
          <p className="text-[11px] text-slate-500 mb-2">Must increment for each update</p>
          <input
            type="number"
            min={1}
            required
            value={versionCode}
            onChange={(e) => {
              const num = parseInt(e.target.value) || 1;
              setVersionCode(num);
              onChange({ versionCode: num });
            }}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-hidden"
          />
        </div>
      </div>

      {/* 3. Support Details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Institute Support & Contact Info</h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700">Support Email</label>
            <div className="mt-1 relative rounded-lg">
              <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => {
                  setSupportEmail(e.target.value);
                  onChange({ supportEmail: e.target.value });
                }}
                placeholder="support@academy.com"
                className="w-full rounded-xl border border-slate-300 py-2 pl-8 pr-2 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Support Phone</label>
            <div className="mt-1 relative rounded-lg">
              <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="tel"
                value={supportPhone}
                onChange={(e) => {
                  setSupportPhone(e.target.value);
                  onChange({ supportPhone: e.target.value });
                }}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-slate-300 py-2 pl-8 pr-2 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Official Website</label>
            <div className="mt-1 relative rounded-lg">
              <Globe className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => {
                  setWebsiteUrl(e.target.value);
                  onChange({ websiteUrl: e.target.value });
                }}
                placeholder="https://academy.com"
                className="w-full rounded-xl border border-slate-300 py-2 pl-8 pr-2 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Hardware & WebView Capabilities */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Android Hardware & Web Permissions</h3>
        
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {[
            { id: 'camera', label: 'Camera Access', desc: 'For live classes & photo uploads', val: allowCamera, set: setAllowCamera, key: 'allowCamera' },
            { id: 'mic', label: 'Microphone Access', desc: 'For student speech & audio tests', val: allowMic, set: setAllowMic, key: 'allowMicrophone' },
            { id: 'upload', label: 'File & Homework Upload', desc: 'Allow PDF and image submission', val: allowUpload, set: setAllowUpload, key: 'allowFileUpload' },
            { id: 'download', label: 'Document Downloads', desc: 'Download notes & syllabus PDFs', val: allowDownload, set: setAllowDownload, key: 'allowDownloads' },
            { id: 'pull', label: 'Pull-to-Refresh Gesture', desc: 'Swipe down to refresh course view', val: pullToRefresh, set: setPullToRefresh, key: 'enablePullToRefresh' },
            { id: 'cache', label: 'Offline Asset Caching', desc: 'Faster loads on weak mobile data', val: offlineCache, set: setOfflineCache, key: 'enableOfflineCache' }
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={item.val}
                onChange={(e) => {
                  item.set(e.target.checked);
                  onChange({ [item.key]: e.target.checked });
                }}
                className="mt-0.5 h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800">{item.label}</span>
                <p className="text-slate-500 text-[11px] mt-0.5">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
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
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
        >
          Continue to Final Review →
        </button>
      </div>
    </form>
  );
};
