import React, { useState, useRef } from 'react';
import { Sparkles, Upload, ArrowLeft, Trash2, Clock, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { AppConfig } from '../../types';
import { validateFileImage } from '../../utils/validation';

interface Step4SplashProps {
  appData: Partial<AppConfig>;
  onChange: (fields: Partial<AppConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4Splash: React.FC<Step4SplashProps> = ({
  appData,
  onChange,
  onNext,
  onBack
}) => {
  const [splashType, setSplashType] = useState<'auto' | 'custom'>(appData.splashType || 'auto');
  const [splashPreview, setSplashPreview] = useState<string>(appData.splashImageUrl || '');
  const [duration, setDuration] = useState<number>(appData.splashDurationSeconds || 2);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const splashInputRef = useRef<HTMLInputElement>(null);

  const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    const res = await validateFileImage(file, 'splash');
    if (!res.valid) {
      setErrorMsg(res.error || 'Invalid splash image');
      return;
    }
    if (res.dataUrl) {
      setSplashPreview(res.dataUrl);
      onChange({
        splashType: 'custom',
        splashImageUrl: res.dataUrl,
        splashFileName: file.name
      });
    }
  };

  const handleTypeChange = (type: 'auto' | 'custom') => {
    setSplashType(type);
    onChange({ splashType: type });
  };

  const handleDurationChange = (val: number) => {
    setDuration(val);
    onChange({ splashDurationSeconds: val });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            4
          </span>
          <h2 className="text-xl font-bold text-slate-900">Splash Screen</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          The splash screen is shown instantly when students open the app while the course environment prepares.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Choice: Auto vs Custom */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Auto Generated */}
        <button
          type="button"
          onClick={() => handleTypeChange('auto')}
          className={`flex flex-col rounded-2xl border p-4 text-left transition-all ${
            splashType === 'auto'
              ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-bold text-slate-900">Automatic Splash</span>
            </div>
            {splashType === 'auto' && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Automatically created from your institute logo, app name, and brand color palette. Recommended for pristine native rendering.
          </p>
        </button>

        {/* Custom Upload */}
        <button
          type="button"
          onClick={() => handleTypeChange('custom')}
          className={`flex flex-col rounded-2xl border p-4 text-left transition-all ${
            splashType === 'custom'
              ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-bold text-slate-900">Custom Splash Image / GIF</span>
            </div>
            {splashType === 'custom' && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Upload custom artwork (PNG max 2MB, GIF max 5MB, recommended dimensions: 1280 × 1920).
          </p>
        </button>
      </div>

      {/* Custom Upload Area */}
      {splashType === 'custom' && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Upload Artwork</h4>
              <p className="text-[11px] text-slate-500">1280 × 1920 portrait PNG (2MB max) or GIF (5MB max)</p>
            </div>
            {splashPreview && (
              <button
                type="button"
                onClick={() => {
                  setSplashPreview('');
                  onChange({ splashImageUrl: undefined, splashFileName: undefined });
                }}
                className="text-slate-400 hover:text-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white overflow-hidden shadow-xs">
              {splashPreview ? (
                <img src={splashPreview} alt="Custom Splash" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-7 w-7 text-slate-300" />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <input
                ref={splashInputRef}
                type="file"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleCustomUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => splashInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                <Upload className="h-3.5 w-3.5" />
                Select Splash Image or GIF
              </button>
              <span className="text-[11px] text-slate-400">
                {appData.splashFileName || 'No custom file selected yet'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Duration Slider */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <label className="text-xs font-bold text-slate-800">
              Splash Screen Display Duration
            </label>
          </div>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
            {duration} Second{duration > 1 ? 's' : ''}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={duration}
          onChange={(e) => handleDurationChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>1s (Instant)</span>
          <span>2s (Recommended)</span>
          <span>5s (Extended)</span>
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
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
        >
          Continue to Onboarding Screens →
        </button>
      </div>
    </div>
  );
};
