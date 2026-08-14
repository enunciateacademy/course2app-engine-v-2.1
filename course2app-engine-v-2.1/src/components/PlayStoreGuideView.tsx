import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const PlayStoreGuideView: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const steps = [
    {
      id: 'step-1',
      title: '1. Google Play Developer Account Setup',
      desc: 'One-time registration on Google Play Console ($25 registration fee).',
      checklist: [
        'Register developer account on play.google.com/console',
        'Verify identity with official government ID & business details',
        'Configure merchant payout account if charging for subscriptions'
      ]
    },
    {
      id: 'step-2',
      title: '2. Store Listing Assets Preparation',
      desc: 'Prepare the visual marketing graphics required by Google Play.',
      checklist: [
        'App Name (max 30 characters) & Short description (max 80 characters)',
        'Full description (up to 4000 characters with course syllabus keywords)',
        'App Icon: 512 × 512 px PNG with transparent background',
        'Feature Graphic: 1024 × 500 px JPG or PNG (no transparency)',
        'Phone Screenshots: Minimum 2 screenshots (recommended: 1080 × 1920 px portrait)'
      ]
    },
    {
      id: 'step-3',
      title: '3. Data Safety & Privacy Policy Declaration',
      desc: 'Google Play mandatory compliance declarations for educational apps.',
      checklist: [
        'Provide public HTTPS Privacy Policy link (hosted on your academy website)',
        'Declare Data Collection: Specify login email/phone and crash logs',
        'Target Audience: Select appropriate age range (e.g., 13+ or Families/Kids if applicable)',
        'Government Apps / Financial Apps: Mark "No" unless you are an official entity'
      ]
    },
    {
      id: 'step-4',
      title: '4. Compiling & Uploading Genuine .AAB Release',
      desc: 'Build and upload the authentic compiled Android App Bundle (.AAB) binary (10–20 MB).',
      checklist: [
        'Push downloaded project to GitHub and trigger the automated GitHub Actions workflow (.github/workflows/android-build.yml) or run ./scripts/build-local.sh locally',
        'Download the real compiled release .aab artifact (~15 MB with compiled DEX & AAPT2 protobufs)',
        'In Play Console, navigate to "Production" or "Internal testing" -> Click "Create new release"',
        'Upload your .aab file and verify Target SDK 34 is detected',
        'Review release notes, rollout percentage (100%), and click "Save and Publish"'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <BookOpen className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Google Play Store Publishing Guide & Checklist
          </h1>
        </div>
        <p className="mt-1 text-xs text-slate-500 max-w-2xl">
          Follow this proven checklist to get your branded institute Android app approved and live on the Google Play Store without friction.
        </p>
      </div>

      {/* Checklist Sections */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
              <p className="text-xs text-slate-500 mb-4">{step.desc}</p>

              <div className="space-y-2">
                {step.checklist.map((item, idx) => {
                  const checkId = `${step.id}-${idx}`;
                  const isDone = !!checkedItems[checkId];
                  return (
                    <label
                      key={checkId}
                      className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 text-xs text-slate-700 cursor-pointer hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleCheck(checkId)}
                        className="mt-0.5 h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={isDone ? 'line-through text-slate-400' : 'text-slate-700'}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Best Practices & Anti-Rejection Tips */}
      <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 text-amber-950">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <h3 className="text-sm font-bold">Important Google Play Policy Requirements</h3>
        </div>
        <ul className="list-disc pl-5 text-xs text-amber-900 space-y-1.5 leading-relaxed">
          <li>
            <strong>Account Deletion:</strong> Ensure your course website provides a simple in-app link or web page allowing students to request account deletion.
          </li>
          <li>
            <strong>Digital Goods Billing:</strong> If selling courses directly in Android, ensure compliance with Google Play In-App Billing or reader app guidelines.
          </li>
          <li>
            <strong>Testing credentials:</strong> Provide a demo student login in Play Console "App Access" section so Google reviewers can test your course environment.
          </li>
        </ul>
      </div>
    </div>
  );
};
