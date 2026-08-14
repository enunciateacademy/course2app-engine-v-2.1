import React, { useState } from 'react';
import {
  Smartphone,
  Copy,
  Edit2,
  Trash2,
  Download,
  Rocket,
  Plus,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  FileCode,
  Layers,
  ChevronRight,
  Eye,
  QrCode
} from 'lucide-react';
import { AppConfig, SavedCourse } from '../types';
import { createAndDownloadProjectZip, generateAppConfigJson } from '../utils/androidGenerator';
import { saveAs } from 'file-saver';
import { PhoneSimulator } from './PhoneSimulator';
import { PhoneTestModal } from './PhoneTestModal';

interface MyAppsViewProps {
  apps: AppConfig[];
  courses: SavedCourse[];
  onOpenCreateWizard: () => void;
  onEditApp: (app: AppConfig) => void;
  onDuplicateApp: (app: AppConfig) => void;
  onDeleteApp: (id: string) => void;
  onBuildApp: (app: AppConfig) => void;
}

export const MyAppsView: React.FC<MyAppsViewProps> = ({
  apps,
  courses,
  onOpenCreateWizard,
  onEditApp,
  onDuplicateApp,
  onDeleteApp,
  onBuildApp
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [previewModalApp, setPreviewModalApp] = useState<AppConfig | null>(null);
  const [phoneTestApp, setPhoneTestApp] = useState<AppConfig | null>(null);
  const [zippingAppId, setZippingAppId] = useState<string | null>(null);

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.instituteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.courseUrl.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse =
      selectedCourseFilter === 'all' ||
      app.courseId === selectedCourseFilter ||
      app.courseUrl === selectedCourseFilter;

    return matchesSearch && matchesCourse;
  });

  const handleDownloadZip = async (app: AppConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    setZippingAppId(app.id);
    try {
      await createAndDownloadProjectZip(app);
    } finally {
      setZippingAppId(null);
    }
  };

  const handleDownloadJson = (app: AppConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    const json = generateAppConfigJson(app);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, `${app.packageId}-config.json`);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Engine Value Proposition */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-900 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-blue-500/20 px-3 py-0.5 text-xs font-bold text-blue-300 border border-blue-400/30">
                Single Master Course Architecture
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              One Course URL → Infinite Branded Android Apps
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-blue-100/85 leading-relaxed">
              Enter your master course or LMS website once. Generate distinct, branded Play Store-ready Android applications for every partner institute in seconds.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCreateWizard}
            className="flex items-center gap-2 rounded-2xl bg-blue-500 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-400 active:scale-95 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            Create New Institute App
          </button>
        </div>

        {/* Decorative Background Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl" />
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Branded Apps</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Smartphone className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{apps.length}</div>
          <span className="text-[11px] text-slate-400 font-medium">Distinct Android Packages</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Master Courses Linked</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{courses.length}</div>
          <span className="text-[11px] text-slate-400 font-medium">Centralized Course URLs</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Android Build Engine</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Rocket className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">Capacitor v6</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Target SDK 34 Ready
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by institute, app name, or package ID..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden shadow-xs w-full sm:w-auto"
          >
            <option value="all">All Master Courses ({apps.length})</option>
            {courses.map((c) => (
              <option key={c.id} value={c.url}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Apps Grid */}
      {filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
            <Smartphone className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No applications found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            {searchQuery
              ? 'No applications match your search query. Try clearing your filters.'
              : 'Get started by creating your first institute branded Android app!'}
          </p>
          <button
            type="button"
            onClick={onOpenCreateWizard}
            className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create First App
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div>
                {/* App Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm text-lg font-bold text-white overflow-hidden p-0.5"
                      style={{ backgroundColor: app.primaryColor || '#1e3a8a' }}
                    >
                      {app.launcherIconUrl || app.logoUrl ? (
                        <img
                          src={app.launcherIconUrl || app.logoUrl}
                          alt={app.appName}
                          className="h-full w-full object-cover rounded-xl"
                        />
                      ) : (
                        app.instituteName.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {app.appName}
                      </h3>
                      <p className="truncate text-xs text-slate-500 font-medium">{app.instituteName}</p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                    v{app.versionName || '1.0.0'}
                  </span>
                </div>

                {/* Package ID & Course URL Badges */}
                <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Package:</span>
                    <span className="font-mono text-slate-700 font-semibold truncate max-w-[170px]" title={app.packageId}>
                      {app.packageId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Course URL:</span>
                    <a
                      href={app.courseUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-mono text-blue-600 truncate max-w-[170px] hover:underline"
                      title={app.courseUrl}
                    >
                      {app.courseUrl.replace(/^https?:\/\//, '')}
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Branding:</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-3 w-3 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: app.primaryColor }}
                      />
                      <span className="font-mono text-[10px] text-slate-600">{app.primaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {/* Test Simulator */}
                  <button
                    type="button"
                    onClick={() => setPreviewModalApp(app)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-slate-100 p-2 text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                    title="Open Live Phone Simulator"
                  >
                    <Eye className="h-3.5 w-3.5 text-blue-600" />
                    Preview
                  </button>

                  {/* 1-Click Duplicate for another institute */}
                  <button
                    type="button"
                    onClick={() => onDuplicateApp(app)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-blue-50 p-2 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                    title="1-Click Duplicate with same course URL"
                  >
                    <Copy className="h-3.5 w-3.5 text-blue-600" />
                    Duplicate
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => onEditApp(app)}
                    className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 p-2 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    title="Edit App Details"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                    Edit
                  </button>
                </div>

                {/* Primary Test & Build Actions */}
                <div className="flex items-center justify-between gap-1.5 text-xs mb-1.5">
                  <button
                    type="button"
                    onClick={() => setPhoneTestApp(app)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-[11px] font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all"
                    title="Direct .APK Download & Mobile QR Test"
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    Test .APK / QR
                  </button>

                  <button
                    type="button"
                    onClick={() => onBuildApp(app)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2 text-[11px] font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
                    title="Open Google Play Store Build Wizard"
                  >
                    <Rocket className="h-3.5 w-3.5" />
                    Build .AAB
                  </button>
                </div>

                {/* Secondary Project Export Actions */}
                <div className="grid grid-cols-2 gap-1.5 text-xs pt-1">
                  <button
                    type="button"
                    disabled={zippingAppId === app.id}
                    onClick={(e) => handleDownloadZip(app, e)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2 text-[10px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                    title="Download Complete Android Studio Gradle Project ZIP"
                  >
                    <Download className="h-3 w-3 text-blue-600" />
                    {zippingAppId === app.id ? 'Packaging...' : 'Android Project (ZIP)'}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDownloadJson(app, e)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2 text-[10px] font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
                    title="Download app-config.json"
                  >
                    <FileCode className="h-3 w-3 text-indigo-600" />
                    <span>Config JSON</span>
                  </button>
                </div>

                {/* Bottom Quick Tools */}
                <div className="flex items-center justify-between gap-1 text-xs pt-1 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    onClick={(e) => handleDownloadJson(app, e)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 py-1 px-2 text-[10px] font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                    title="Download app-config.json"
                  >
                    <FileCode className="h-3 w-3" />
                    <span>Config</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${app.appName}"?`)) {
                        onDeleteApp(app.id);
                      }
                    }}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 py-1 px-2 text-[10px] font-medium text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    title="Delete App"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Phone Preview Modal */}
      {previewModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs">
          <div className="relative flex max-h-[92vh] flex-col items-center rounded-3xl bg-slate-900 p-6 shadow-2xl border border-slate-800">
            <div className="flex w-full items-center justify-between mb-3 text-white">
              <div>
                <h3 className="text-sm font-bold">{previewModalApp.appName}</h3>
                <p className="text-[11px] text-slate-400 font-mono">{previewModalApp.packageId}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalApp(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>
            <PhoneSimulator app={previewModalApp} />
          </div>
        </div>
      )}

      {/* Instant Phone Test & APK Download Modal */}
      <PhoneTestModal
        app={phoneTestApp}
        isOpen={!!phoneTestApp}
        onClose={() => setPhoneTestApp(null)}
      />
    </div>
  );
};
