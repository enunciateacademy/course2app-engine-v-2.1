import React from 'react';
import {
  Globe,
  Building2,
  Palette,
  Sparkles,
  Layers,
  Settings,
  CheckCircle2,
  Rocket
} from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

export const WIZARD_STEPS = [
  { id: 1, title: 'Course', icon: Globe, desc: 'Master Website URL' },
  { id: 2, title: 'Institute', icon: Building2, desc: 'App & Institute Names' },
  { id: 3, title: 'Branding', icon: Palette, desc: 'Logo, Icons & Colors' },
  { id: 4, title: 'Splash', icon: Sparkles, desc: 'Loading Screen' },
  { id: 5, title: 'Onboarding', icon: Layers, desc: 'Introduction Slides' },
  { id: 6, title: 'Advanced', icon: Settings, desc: 'Package & Permissions' },
  { id: 7, title: 'Review', icon: CheckCircle2, desc: 'Validation & Summary' },
  { id: 8, title: 'Build', icon: Rocket, desc: 'Android AAB & Project' }
];

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  onStepClick,
  completedSteps
}) => {
  return (
    <div className="w-full border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between overflow-x-auto no-scrollbar py-1">
        {WIZARD_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id) || currentStep > step.id;
          const isAccessible = isCompleted || step.id === currentStep || step.id <= Math.max(...completedSteps, 1) + 1;

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                disabled={!isAccessible}
                onClick={() => onStepClick(step.id)}
                className={`group flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-left transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/30'
                    : isAccessible
                    ? 'text-slate-600 hover:bg-slate-50'
                    : 'cursor-not-allowed text-slate-300'
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : isAccessible
                      ? 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      : 'bg-slate-50 text-slate-300'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold leading-none">{step.title}</div>
                  <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                    Step {step.id}
                  </div>
                </div>
              </button>

              {idx < WIZARD_STEPS.length - 1 && (
                <div
                  className={`hidden md:block h-0.5 flex-1 max-w-[28px] mx-1 transition-colors ${
                    currentStep > step.id ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
