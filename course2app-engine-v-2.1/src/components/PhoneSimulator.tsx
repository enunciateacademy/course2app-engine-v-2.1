import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  RotateCcw,
  ArrowLeft,
  RefreshCw,
  Wifi,
  Battery,
  AlertCircle,
  Play,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AppConfig } from '../types';

interface PhoneSimulatorProps {
  app: Partial<AppConfig>;
  className?: string;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ app, className = '' }) => {
  const [activeTab, setActiveTab] = useState<'app' | 'splash' | 'onboarding' | 'loading' | 'error'>('app');
  const [currentOnboardingIdx, setCurrentOnboardingIdx] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState('10:45');
  const [iframeKey, setIframeKey] = useState(1);
  const [showIframeWarning, setShowIframeWarning] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const instituteName = app.instituteName || 'Your Institute';
  const appName = app.appName || instituteName;
  const primaryColor = app.primaryColor || '#1e3a8a';
  const secondaryColor = app.secondaryColor || '#f59e0b';
  const headerStyle = app.headerStyle || 'brand';
  const courseUrl = app.courseUrl || 'https://academy.graphy.com/course/sainik-class-6';
  const onboardingScreens = app.onboardingScreens || [];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIframeKey((prev) => prev + 1);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleRestartPreview = () => {
    setActiveTab('splash');
    setTimeout(() => {
      if (app.enableOnboarding && onboardingScreens.length > 0) {
        setActiveTab('onboarding');
      } else {
        setActiveTab('app');
      }
    }, (app.splashDurationSeconds || 2) * 1000);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Simulator Control Tabs */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-1.5 rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-700 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('app')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
            activeTab === 'app' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <Smartphone className="h-3.5 w-3.5" />
          Live App
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('splash')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
            activeTab === 'splash' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Splash
        </button>
        {app.enableOnboarding && onboardingScreens.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('onboarding')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
              activeTab === 'onboarding' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Onboarding
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveTab('loading')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
            activeTab === 'loading' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Loading
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('error')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
            activeTab === 'error' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          <AlertCircle className="h-3.5 w-3.5" />
          Offline
        </button>
      </div>

      {/* Realistic Android Phone Mockup Frame */}
      <div className="relative mx-auto h-[610px] w-[305px] select-none rounded-[44px] bg-slate-950 p-[10px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)] ring-8 ring-slate-800">
        {/* Device Outer Details */}
        <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-white flex flex-col">
          {/* Status Bar */}
          <div
            className="flex h-7 w-full shrink-0 items-center justify-between px-5 text-[11px] font-semibold transition-colors z-30"
            style={{
              backgroundColor:
                activeTab === 'splash'
                  ? primaryColor
                  : headerStyle === 'brand'
                  ? primaryColor
                  : '#ffffff',
              color:
                activeTab === 'splash'
                  ? '#ffffff'
                  : headerStyle === 'brand'
                  ? '#ffffff'
                  : '#0f172a'
            }}
          >
            <span>{currentTime}</span>
            {/* Center Camera Punch Hole */}
            <div className="h-3.5 w-3.5 rounded-full bg-black/80 ring-1 ring-white/20"></div>
            <div className="flex items-center gap-1.5">
              <Wifi className="h-3 w-3" />
              <Battery className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Pull to refresh progress animation */}
          {isRefreshing && (
            <div className="h-1 w-full bg-slate-200 overflow-hidden z-40">
              <div
                className="h-full animate-pulse"
                style={{ backgroundColor: primaryColor }}
              ></div>
            </div>
          )}

          {/* SCREEN CONTENT AREA */}
          <div className="relative flex-1 w-full overflow-hidden bg-slate-50 flex flex-col">
            {/* 1. SPLASH SCREEN VIEW */}
            {activeTab === 'splash' && (
              <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {app.splashType === 'custom' && app.splashImageUrl ? (
                  <img
                    src={app.splashImageUrl}
                    alt="Custom Splash"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center animate-fade-in">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 p-2 shadow-lg backdrop-blur-xs">
                      {app.logoUrl || app.launcherIconUrl ? (
                        <img
                          src={app.logoUrl || app.launcherIconUrl}
                          alt="Logo"
                          className="h-full w-full rounded-xl object-contain"
                        />
                      ) : (
                        <span className="text-3xl font-extrabold text-white">
                          {instituteName.charAt(0) || 'A'}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-4 text-xl font-bold tracking-tight text-white">{appName}</h2>
                    <p className="mt-1 text-xs text-white/80 max-w-[200px] line-clamp-2">
                      {app.shortDescription || 'Course Learning Platform'}
                    </p>
                    <div className="mt-8 flex h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  </div>
                )}
              </div>
            )}

            {/* 2. ONBOARDING VIEW */}
            {activeTab === 'onboarding' && onboardingScreens.length > 0 && (
              <div className="absolute inset-0 z-20 flex flex-col justify-between bg-white p-6">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('app')}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-700"
                  >
                    Skip
                  </button>
                </div>

                <div className="flex flex-col items-center text-center my-auto">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold shadow-md"
                    style={{
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor
                    }}
                  >
                    {currentOnboardingIdx + 1}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {onboardingScreens[currentOnboardingIdx]?.title || 'Welcome'}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed px-2">
                    {onboardingScreens[currentOnboardingIdx]?.description ||
                      'Start learning with interactive video classes, tests, and mentorship.'}
                  </p>
                </div>

                <div>
                  <div className="mb-4 flex justify-center gap-1.5">
                    {onboardingScreens.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentOnboardingIdx
                            ? 'w-6 bg-blue-600'
                            : 'w-2 bg-slate-200'
                        }`}
                        style={{
                          backgroundColor: idx === currentOnboardingIdx ? primaryColor : '#e2e8f0'
                        }}
                      ></div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (currentOnboardingIdx < onboardingScreens.length - 1) {
                        setCurrentOnboardingIdx((prev) => prev + 1);
                      } else {
                        setActiveTab('app');
                        setCurrentOnboardingIdx(0);
                      }
                    }}
                    className="w-full rounded-xl py-3 text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {currentOnboardingIdx < onboardingScreens.length - 1 ? 'Next' : 'Get Started'}
                  </button>
                </div>
              </div>
            )}

            {/* 3. LOADING STATE VIEW */}
            {activeTab === 'loading' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white p-6 text-center">
                <div
                  className="h-10 w-10 animate-spin rounded-full border-3 border-slate-100"
                  style={{ borderTopColor: primaryColor }}
                ></div>
                <p className="mt-4 text-xs font-semibold text-slate-700">Connecting to Course Portal...</p>
                <span className="mt-1 text-[10px] text-slate-400 font-mono truncate max-w-[220px]">
                  {courseUrl}
                </span>
              </div>
            )}

            {/* 4. ERROR / OFFLINE VIEW */}
            {activeTab === 'error' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-3">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Unable to load course</h4>
                <p className="mt-1.5 text-xs text-slate-500">
                  Please check your internet connection or verify the URL settings.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleRefresh();
                    setActiveTab('app');
                  }}
                  className="mt-4 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  Retry Connection
                </button>
              </div>
            )}

            {/* 5. MAIN APP / LIVE WEBVIEW CONTAINER */}
            <div className="flex flex-col h-full w-full">
              {/* Optional App Top Bar Header */}
              {headerStyle !== 'hidden' && (
                <div
                  className="flex h-11 shrink-0 items-center justify-between px-3 shadow-xs z-10 transition-colors"
                  style={{
                    backgroundColor: headerStyle === 'brand' ? primaryColor : '#ffffff',
                    color: headerStyle === 'brand' ? '#ffffff' : '#0f172a'
                  }}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <button
                      type="button"
                      onClick={handleRefresh}
                      className="rounded-md p-1 hover:bg-black/10 active:scale-95"
                      title="Back"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    {app.logoUrl && (
                      <img src={app.logoUrl} alt="Logo" className="h-6 w-6 rounded-md object-contain" />
                    )}
                    <span className="truncate text-xs font-bold">{appName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleRefresh}
                      className={`rounded-md p-1 hover:bg-black/10 active:scale-95 ${
                        isRefreshing ? 'animate-spin' : ''
                      }`}
                      title="Reload"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Course Webview Frame */}
              <div className="relative flex-1 w-full bg-white overflow-hidden">
                {courseUrl ? (
                  <div className="relative h-full w-full">
                    <iframe
                      key={iframeKey}
                      src={courseUrl}
                      title="Course Preview"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      className="h-full w-full border-0"
                      onError={() => setShowIframeWarning(true)}
                    />
                    
                    {/* Floating Info Overlay about iframe security */}
                    <div className="absolute bottom-2 inset-x-2 rounded-lg bg-slate-900/85 p-2 text-white backdrop-blur-xs flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 truncate">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate font-mono">{courseUrl}</span>
                      </div>
                      <a
                        href={courseUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-blue-300 font-semibold hover:underline shrink-0 ml-1"
                      >
                        Open <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center text-slate-400">
                    <Smartphone className="h-10 w-10 text-slate-300 mb-2" />
                    <p className="text-xs font-medium">Enter a Course URL to view the live portal</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Android Bottom Navigation Pill */}
          <div className="flex h-5 w-full shrink-0 items-center justify-center bg-slate-950">
            <div className="h-1 w-24 rounded-full bg-slate-600"></div>
          </div>
        </div>
      </div>

      {/* Simulator Quick Action Buttons */}
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <button
          type="button"
          onClick={handleRestartPreview}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-600 shadow-xs hover:bg-slate-50"
        >
          <Play className="h-3 w-3 text-emerald-600" />
          Test App Launch
        </button>
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-600 shadow-xs hover:bg-slate-50"
        >
          <RotateCcw className="h-3 w-3 text-blue-600" />
          Reload
        </button>
      </div>
    </div>
  );
};
