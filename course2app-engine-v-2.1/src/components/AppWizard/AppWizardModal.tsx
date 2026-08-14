import React, { useState, useEffect } from 'react';
import { X, Save, ArrowLeft, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';
import { AppConfig } from '../../types';
import { WizardProgress } from './WizardProgress';
import { Step1Course } from './Step1Course';
import { Step2Institute } from './Step2Institute';
import { Step3Branding } from './Step3Branding';
import { Step4Splash } from './Step4Splash';
import { Step5Onboarding } from './Step5Onboarding';
import { Step6Advanced } from './Step6Advanced';
import { Step7Review } from './Step7Review';
import { Step8Success } from './Step8Success';
import { PhoneSimulator } from '../PhoneSimulator';
import { storageService } from '../../storage/storageService';
import { sanitizePackageName } from '../../utils/validation';
import { generateAppConfigJson } from '../../utils/androidGenerator';
import { saveAs } from 'file-saver';

interface AppWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppCreated: (app: AppConfig) => void;
  initialApp?: Partial<AppConfig> | null;
  defaultCourseUrl?: string;
}

const DEFAULT_NEW_APP: Partial<AppConfig> = {
  instituteName: '',
  appName: '',
  shortDescription: '',
  courseUrl: '',
  primaryColor: '#1e3a8a',
  secondaryColor: '#f59e0b',
  backgroundColor: '#ffffff',
  textColor: '#0f172a',
  headerStyle: 'brand',
  splashType: 'auto',
  splashDurationSeconds: 2,
  enableOnboarding: false,
  onboardingScreens: [],
  packageId: '',
  versionName: '1.0.0',
  versionCode: 1,
  allowCamera: true,
  allowMicrophone: true,
  allowGeolocation: false,
  allowFileUpload: true,
  allowDownloads: true,
  enablePullToRefresh: true,
  enableOfflineCache: true,
  clearCacheOnExit: false,
  status: 'draft'
};

export const AppWizardModal: React.FC<AppWizardModalProps> = ({
  isOpen,
  onClose,
  onAppCreated,
  initialApp,
  defaultCourseUrl
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [appData, setAppData] = useState<Partial<AppConfig>>(DEFAULT_NEW_APP);
  const [savedNotification, setSavedNotification] = useState<string>('');

  useEffect(() => {
    if (initialApp) {
      setAppData({ ...DEFAULT_NEW_APP, ...initialApp });
      setCurrentStep(1);
    } else if (defaultCourseUrl) {
      setAppData({
        ...DEFAULT_NEW_APP,
        courseUrl: defaultCourseUrl,
        packageId: sanitizePackageName('')
      });
      setCurrentStep(2); // Jump to Institute details if course already provided
    } else {
      // Check for saved local draft
      const draft = storageService.getDraft();
      if (draft && Object.keys(draft).length > 0) {
        setAppData({ ...DEFAULT_NEW_APP, ...draft });
      } else {
        setAppData(DEFAULT_NEW_APP);
      }
      setCurrentStep(1);
    }
  }, [initialApp, defaultCourseUrl, isOpen]);

  if (!isOpen) return null;

  const handleDataChange = (fields: Partial<AppConfig>) => {
    setAppData((prev) => {
      const updated = { ...prev, ...fields };
      storageService.saveDraft(updated);
      return updated;
    });
  };

  const handleNextStep = (stepNumber: number) => {
    setCompletedSteps((prev) => Array.from(new Set([...prev, currentStep])));
    setCurrentStep(stepNumber);
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleSaveDraft = () => {
    storageService.saveDraft(appData);
    setSavedNotification('Draft saved locally!');
    setTimeout(() => setSavedNotification(''), 2500);
  };

  const handleDownloadConfigJson = () => {
    const fullApp = {
      ...DEFAULT_NEW_APP,
      ...appData,
      id: appData.id || `app-${Date.now()}`,
      createdAt: appData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as AppConfig;

    const json = generateAppConfigJson(fullApp);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, `${fullApp.packageId || 'app'}-config.json`);
  };

  const handleCreateBuild = async () => {
    const fullApp: AppConfig = {
      ...DEFAULT_NEW_APP,
      ...appData,
      id: appData.id || `app-${Date.now()}`,
      packageId:
        appData.packageId || sanitizePackageName(appData.instituteName || 'app'),
      status: 'successful',
      createdAt: appData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastBuiltAt: new Date().toISOString()
    } as AppConfig;

    await storageService.saveApp(fullApp);
    storageService.clearDraft();
    onAppCreated(fullApp);
    setCurrentStep(8); // Go to Success Screen
  };

  const handleCreateAnotherWithSameCourse = () => {
    const currentCourse = appData.courseUrl || '';
    setAppData({
      ...DEFAULT_NEW_APP,
      courseUrl: currentCourse,
      primaryColor: '#047857' // Suggest fresh secondary institute color
    });
    setCurrentStep(2); // Jump to Institute Step
    setCompletedSteps([1]);
  };

  const handleCreateAnotherNew = () => {
    setAppData(DEFAULT_NEW_APP);
    setCurrentStep(1);
    setCompletedSteps([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative flex max-h-[96vh] w-full max-w-6xl flex-col rounded-3xl bg-slate-50 shadow-2xl overflow-hidden border border-slate-200">
        {/* Wizard Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 leading-tight">
                {appData.appName || appData.instituteName
                  ? `${appData.appName || appData.instituteName} Setup`
                  : 'Create Branded Android App'}
              </h1>
              <p className="text-xs text-slate-500">
                Turn your master course URL into a native Android application
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedNotification && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="h-3.5 w-3.5" /> {savedNotification}
              </span>
            )}
            {currentStep < 8 && (
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                <Save className="h-3.5 w-3.5 text-slate-400" />
                Save Draft
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Wizard Step Progress Tracker */}
        <WizardProgress
          currentStep={currentStep}
          totalSteps={8}
          onStepClick={handleStepClick}
          completedSteps={completedSteps}
        />

        {/* Wizard Main Content Grid: Form (Left) & Simulator (Right) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Form Step Wizard */}
            <div className={`space-y-6 ${currentStep === 8 ? 'lg:col-span-12' : 'lg:col-span-7'}`}>
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                {currentStep === 1 && (
                  <Step1Course
                    appData={appData}
                    onChange={handleDataChange}
                    onNext={() => handleNextStep(2)}
                  />
                )}

                {currentStep === 2 && (
                  <Step2Institute
                    appData={appData}
                    onChange={handleDataChange}
                    onNext={() => handleNextStep(3)}
                    onBack={() => setCurrentStep(1)}
                  />
                )}

                {currentStep === 3 && (
                  <Step3Branding
                    appData={appData}
                    onChange={handleDataChange}
                    onNext={() => handleNextStep(4)}
                    onBack={() => setCurrentStep(2)}
                  />
                )}

                {currentStep === 4 && (
                  <Step4Splash
                    appData={appData}
                    onChange={handleDataChange}
                    onNext={() => handleNextStep(5)}
                    onBack={() => setCurrentStep(3)}
                  />
                )}

                {currentStep === 5 && (
                  <Step5Onboarding
                    appData={appData}
                    onChange={handleDataChange}
                    onNext={() => handleNextStep(6)}
                    onBack={() => setCurrentStep(4)}
                  />
                )}

                {currentStep === 6 && (
                  <Step6Advanced
                    appData={appData}
                    onChange={handleDataChange}
                    onNext={() => handleNextStep(7)}
                    onBack={() => setCurrentStep(5)}
                  />
                )}

                {currentStep === 7 && (
                  <Step7Review
                    appData={appData}
                    onBuild={handleCreateBuild}
                    onBack={() => setCurrentStep(6)}
                    onDownloadConfig={handleDownloadConfigJson}
                  />
                )}

                {currentStep === 8 && (
                  <Step8Success
                    app={appData as AppConfig}
                    onCreateAnotherWithSameCourse={handleCreateAnotherWithSameCourse}
                    onCreateAnotherNew={handleCreateAnotherNew}
                    onGoToDashboard={onClose}
                  />
                )}
              </div>
            </div>

            {/* Right Column: Live Interactive Android Phone Simulator */}
            {currentStep < 8 && (
              <div className="lg:col-span-5 flex flex-col items-center sticky top-2">
                <div className="w-full text-center mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Live Android Device Preview
                  </span>
                </div>
                <PhoneSimulator app={appData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
