import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Upload,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { AppConfig, OnboardingScreen } from '../../types';
import { validateFileImage } from '../../utils/validation';

interface Step5OnboardingProps {
  appData: Partial<AppConfig>;
  onChange: (fields: Partial<AppConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step5Onboarding: React.FC<Step5OnboardingProps> = ({
  appData,
  onChange,
  onNext,
  onBack
}) => {
  const [enabled, setEnabled] = useState<boolean>(appData.enableOnboarding || false);
  const [screens, setScreens] = useState<OnboardingScreen[]>(
    appData.onboardingScreens || [
      {
        id: 'screen-1',
        title: `Welcome to ${appData.instituteName || 'Our Academy'}`,
        description: 'Access live interactive lectures, test series, and comprehensive study materials.',
        backgroundColor: appData.primaryColor || '#1e3a8a'
      }
    ]
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleToggleEnable = (val: boolean) => {
    setEnabled(val);
    onChange({
      enableOnboarding: val,
      onboardingScreens: val ? screens : []
    });
  };

  const handleAddScreen = () => {
    if (screens.length >= 5) return;
    const newScreen: OnboardingScreen = {
      id: `screen-${Date.now()}`,
      title: `Feature ${screens.length + 1}`,
      description: 'Learn anytime, anywhere on your mobile device with offline notes and quizzes.',
      backgroundColor: appData.primaryColor || '#1e3a8a'
    };
    const updated = [...screens, newScreen];
    setScreens(updated);
    onChange({ onboardingScreens: updated });
  };

  const handleDeleteScreen = (idx: number) => {
    const updated = screens.filter((_, i) => i !== idx);
    setScreens(updated);
    onChange({ onboardingScreens: updated });
  };

  const handleMoveScreen = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= screens.length) return;
    const copy = [...screens];
    const item = copy.splice(idx, 1)[0];
    copy.splice(targetIdx, 0, item);
    setScreens(copy);
    onChange({ onboardingScreens: copy });
  };

  const handleScreenFieldChange = (idx: number, field: keyof OnboardingScreen, val: any) => {
    const copy = [...screens];
    copy[idx] = { ...copy[idx], [field]: val };
    setScreens(copy);
    onChange({ onboardingScreens: copy });
  };

  const handleImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    const res = await validateFileImage(file, 'onboarding');
    if (!res.valid) {
      setErrorMsg(res.error || 'Invalid onboarding image');
      return;
    }
    if (res.dataUrl) {
      handleScreenFieldChange(idx, 'imageUrl', res.dataUrl);
      handleScreenFieldChange(idx, 'imageFileName', file.name);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            5
          </span>
          <h2 className="text-xl font-bold text-slate-900">Onboarding Screens (Optional)</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Show a short, friendly introduction carousel to students the first time they open your app.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Enable / Disable Toggle Card */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Enable Onboarding Walkthrough</h3>
          <p className="text-xs text-slate-500">
            {enabled
              ? 'Students will see introduction slides before the login page.'
              : 'Skipped. Students directly open the course website.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleToggleEnable(!enabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            enabled ? 'bg-blue-600' : 'bg-slate-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Screens List */}
      {enabled && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Configured Screens ({screens.length}/5)
            </span>
            {screens.length < 5 && (
              <button
                type="button"
                onClick={handleAddScreen}
                className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Screen
              </button>
            )}
          </div>

          {screens.map((screen, idx) => (
            <div
              key={screen.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800">Slide {idx + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveScreen(idx, 'up')}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === screens.length - 1}
                    onClick={() => handleMoveScreen(idx, 'down')}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  {screens.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteScreen(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                      title="Delete screen"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Slide Title</label>
                <input
                  type="text"
                  value={screen.title}
                  onChange={(e) => handleScreenFieldChange(idx, 'title', e.target.value)}
                  placeholder="e.g. Interactive Video Lectures"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Slide Description</label>
                <textarea
                  rows={2}
                  value={screen.description}
                  onChange={(e) => handleScreenFieldChange(idx, 'description', e.target.value)}
                  placeholder="Brief description for students..."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-hidden resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}

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
          Continue to Advanced Settings →
        </button>
      </div>
    </div>
  );
};
