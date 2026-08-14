import React from 'react';
import {
  Smartphone,
  Globe,
  Plus,
  Terminal,
  FileCode,
  BookOpen,
  Download,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export type NavView = 'apps' | 'courses' | 'builds' | 'template' | 'guide';

interface NavbarProps {
  currentView: NavView;
  onViewChange: (view: NavView) => void;
  onOpenCreateWizard: () => void;
  onOpenImportExport: () => void;
  appsCount: number;
  coursesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenCreateWizard,
  onOpenImportExport,
  appsCount,
  coursesCount
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onViewChange('apps')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                Course2App Engine
              </span>
              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200/50">
                Capacitor + Android
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              One Course URL → Multiple Branded Institute Apps
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="hidden lg:flex items-center gap-1 rounded-2xl bg-slate-100/80 p-1 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => onViewChange('apps')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
              currentView === 'apps'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            My Apps
            <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2">
              {appsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('courses')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
              currentView === 'courses'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            Course URLs
            <span className="rounded-full bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2">
              {coursesCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('builds')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
              currentView === 'builds'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            Build History
          </button>

          <button
            type="button"
            onClick={() => onViewChange('template')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
              currentView === 'template'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            Android Template & Workflows
          </button>

          <button
            type="button"
            onClick={() => onViewChange('guide')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all ${
              currentView === 'guide'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Play Store Guide
          </button>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenImportExport}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
            title="Import / Export JSON"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Backup / JSON</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateWizard}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create App</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-100 px-4 py-2 gap-1 no-scrollbar text-xs font-semibold">
        {[
          { id: 'apps', label: 'My Apps', icon: Smartphone },
          { id: 'courses', label: 'Course URLs', icon: Globe },
          { id: 'builds', label: 'Builds', icon: Terminal },
          { id: 'template', label: 'Template', icon: FileCode },
          { id: 'guide', label: 'Guide', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id as NavView)}
              className={`flex items-center gap-1.5 shrink-0 rounded-lg px-2.5 py-1.5 ${
                isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
