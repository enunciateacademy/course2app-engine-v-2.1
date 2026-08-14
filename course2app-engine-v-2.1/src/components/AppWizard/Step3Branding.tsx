import React, { useState, useRef } from 'react';
import {
  Palette,
  Upload,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Bell,
  Sliders,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from 'lucide-react';
import { AppConfig } from '../../types';
import { validateFileImage } from '../../utils/validation';
import { IconGeneratorModal } from '../IconGeneratorModal';

interface Step3BrandingProps {
  appData: Partial<AppConfig>;
  onChange: (fields: Partial<AppConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESET_PALETTES = [
  { name: 'Navy Blue', primary: '#1e3a8a', secondary: '#f59e0b', bg: '#ffffff', text: '#0f172a' },
  { name: 'Forest Green', primary: '#047857', secondary: '#10b981', bg: '#ffffff', text: '#064e3b' },
  { name: 'Royal Purple', primary: '#7c3aed', secondary: '#ec4899', bg: '#ffffff', text: '#1e1b4b' },
  { name: 'Crimson Red', primary: '#be123c', secondary: '#fbbf24', bg: '#ffffff', text: '#1c1917' },
  { name: 'Modern Teal', primary: '#0f766e', secondary: '#06b6d4', bg: '#ffffff', text: '#134e4a' },
  { name: 'Graphite Dark', primary: '#18181b', secondary: '#3b82f6', bg: '#ffffff', text: '#09090b' }
];

export const Step3Branding: React.FC<Step3BrandingProps> = ({
  appData,
  onChange,
  onNext,
  onBack
}) => {
  const [logoPreview, setLogoPreview] = useState<string>(appData.logoUrl || '');
  const [launcherPreview, setLauncherPreview] = useState<string>(appData.launcherIconUrl || '');
  const [notifPreview, setNotifPreview] = useState<string>(appData.notificationIconUrl || '');
  const [primaryColor, setPrimaryColor] = useState<string>(appData.primaryColor || '#1e3a8a');
  const [secondaryColor, setSecondaryColor] = useState<string>(appData.secondaryColor || '#f59e0b');
  const [headerStyle, setHeaderStyle] = useState<AppConfig['headerStyle']>(appData.headerStyle || 'brand');
  const [showAdvancedBranding, setShowAdvancedBranding] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Icon generator modal state
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [iconModalTarget, setIconModalTarget] = useState<'launcher' | 'logo'>('launcher');

  const logoInputRef = useRef<HTMLInputElement>(null);
  const launcherInputRef = useRef<HTMLInputElement>(null);
  const notifInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    const res = await validateFileImage(file, 'logo');
    if (!res.valid) {
      setErrorMsg(res.error || 'Invalid logo image');
      return;
    }
    if (res.dataUrl) {
      setLogoPreview(res.dataUrl);
      onChange({ logoUrl: res.dataUrl, logoFileName: file.name });
      // If launcher icon is empty, set as default
      if (!launcherPreview) {
        setLauncherPreview(res.dataUrl);
        onChange({ launcherIconUrl: res.dataUrl, launcherIconFileName: file.name });
      }
    }
  };

  const handleLauncherUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    const res = await validateFileImage(file, 'launcher');
    if (!res.valid) {
      setErrorMsg(res.error || 'Invalid launcher icon');
      return;
    }
    if (res.dataUrl) {
      setLauncherPreview(res.dataUrl);
      onChange({ launcherIconUrl: res.dataUrl, launcherIconFileName: file.name });
    }
  };

  const handleNotifUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    const res = await validateFileImage(file, 'notification');
    if (!res.valid) {
      setErrorMsg(res.error || 'Invalid notification icon');
      return;
    }
    if (res.dataUrl) {
      setNotifPreview(res.dataUrl);
      onChange({ notificationIconUrl: res.dataUrl, notificationIconFileName: file.name });
    }
  };

  const handleApplyPalette = (palette: typeof PRESET_PALETTES[0]) => {
    setPrimaryColor(palette.primary);
    setSecondaryColor(palette.secondary);
    onChange({
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      backgroundColor: palette.bg,
      textColor: palette.text
    });
  };

  const handleColorChange = (key: 'primaryColor' | 'secondaryColor', val: string) => {
    if (key === 'primaryColor') setPrimaryColor(val);
    if (key === 'secondaryColor') setSecondaryColor(val);
    onChange({ [key]: val });
  };

  const handleOpenIconGenerator = (type: 'launcher' | 'logo') => {
    setIconModalTarget(type);
    setIsIconModalOpen(true);
  };

  const handleApplyGeneratedIcon = (dataUrl: string, type: 'launcher' | 'logo') => {
    if (type === 'launcher') {
      setLauncherPreview(dataUrl);
      onChange({ launcherIconUrl: dataUrl, launcherIconFileName: 'generated-launcher-1024.png' });
    } else {
      setLogoPreview(dataUrl);
      onChange({ logoUrl: dataUrl, logoFileName: 'generated-logo.png' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            3
          </span>
          <h2 className="text-xl font-bold text-slate-900">App Branding & Colors</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Upload your institute logo, app launcher icon, and pick your signature brand colors.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Grid: App Logo & Launcher Icon */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* 1. App Logo */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">App Logo</h3>
              <p className="text-[11px] text-slate-500">Square PNG, JPG, or WebP</p>
            </div>
            {logoPreview && (
              <button
                type="button"
                onClick={() => {
                  setLogoPreview('');
                  onChange({ logoUrl: undefined, logoFileName: undefined });
                }}
                className="text-slate-400 hover:text-rose-600"
                title="Remove logo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="App Logo" className="h-full w-full object-contain p-1" />
              ) : (
                <ImageIcon className="h-8 w-8 text-slate-300" />
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload Logo
              </button>
              <button
                type="button"
                onClick={() => handleOpenIconGenerator('logo')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate Logo
              </button>
            </div>
          </div>
        </div>

        {/* 2. Launcher Icon (1024x1024) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">App Icon (Home Screen)</h3>
              <p className="text-[11px] text-slate-500">1024 × 1024 PNG (Max 1MB)</p>
            </div>
            {launcherPreview && (
              <button
                type="button"
                onClick={() => {
                  setLauncherPreview('');
                  onChange({ launcherIconUrl: undefined, launcherIconFileName: undefined });
                }}
                className="text-slate-400 hover:text-rose-600"
                title="Remove launcher icon"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
              {launcherPreview ? (
                <img src={launcherPreview} alt="Launcher Icon" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-300">
                  <Palette className="h-7 w-7" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <input
                ref={launcherInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleLauncherUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => launcherInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload 1024×1024
              </button>
              <button
                type="button"
                onClick={() => handleOpenIconGenerator('launcher')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Auto-Generate HD Icon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Color Presets */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          Institute Color Palette
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {PRESET_PALETTES.map((p) => {
            const isSelected = primaryColor.toLowerCase() === p.primary.toLowerCase();
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPalette(p)}
                className={`flex flex-col items-center rounded-xl border p-2.5 transition-all text-center ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1 mb-1.5">
                  <div
                    className="h-5 w-5 rounded-full shadow-xs ring-1 ring-black/10"
                    style={{ backgroundColor: p.primary }}
                  />
                  <div
                    className="h-4 w-4 rounded-full shadow-xs ring-1 ring-black/10"
                    style={{ backgroundColor: p.secondary }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-800">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Primary App Color (Headers, Splash, Buttons)
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
              className="h-10 w-10 cursor-pointer rounded-xl border border-slate-200 p-0.5 bg-white"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-mono text-slate-900 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Accent / Secondary Color
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
              className="h-10 w-10 cursor-pointer rounded-xl border border-slate-200 p-0.5 bg-white"
            />
            <input
              type="text"
              value={secondaryColor}
              onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-mono text-slate-900 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* App Header Bar Style */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          App Navigation Header Bar
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { id: 'brand', label: 'Brand Color', desc: 'Institute color top bar' },
            { id: 'white', label: 'Clean White', desc: 'White bar with dark text' },
            { id: 'minimal', label: 'Minimal', desc: 'Compact navigation' },
            { id: 'hidden', label: 'Hidden / Fullscreen', desc: 'Direct web portal view' }
          ].map((hs) => (
            <button
              key={hs.id}
              type="button"
              onClick={() => {
                setHeaderStyle(hs.id as AppConfig['headerStyle']);
                onChange({ headerStyle: hs.id as AppConfig['headerStyle'] });
              }}
              className={`rounded-xl border p-2.5 text-left transition-colors ${
                headerStyle === hs.id
                  ? 'border-blue-600 bg-blue-50/60 text-blue-900 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold">{hs.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{hs.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Branding Toggle */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <button
          type="button"
          onClick={() => setShowAdvancedBranding(!showAdvancedBranding)}
          className="flex w-full items-center justify-between text-xs font-bold text-slate-700"
        >
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-blue-600" />
            Advanced Branding (Notification Icon & Transparencies)
          </div>
          {showAdvancedBranding ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showAdvancedBranding && (
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Android Notification Icon</h4>
                <p className="text-[11px] text-slate-500">72 × 72 PNG transparent silhouette (Auto-falls back if empty)</p>
              </div>
              {notifPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setNotifPreview('');
                    onChange({ notificationIconUrl: undefined, notificationIconFileName: undefined });
                  }}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                {notifPreview ? (
                  <img src={notifPreview} alt="Notif Icon" className="h-7 w-7 object-contain" />
                ) : (
                  <Bell className="h-5 w-5 text-white/80" />
                )}
              </div>
              <input
                ref={notifInputRef}
                type="file"
                accept="image/png"
                onChange={handleNotifUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => notifInputRef.current?.click()}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Upload Notification Icon
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Icon Generator Modal */}
      <IconGeneratorModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        instituteName={appData.instituteName || 'Enunciate Academy'}
        primaryColor={primaryColor}
        targetType={iconModalTarget}
        onApplyIcon={handleApplyGeneratedIcon}
      />

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
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
        >
          Continue to Splash Screen →
        </button>
      </div>
    </div>
  );
};
