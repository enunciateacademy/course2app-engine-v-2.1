import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  RotateCw,
  Share2,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Download
} from 'lucide-react';
import { AppConfig } from '../types';
import { createAndDownloadProjectZip } from '../utils/androidGenerator';

interface MobileAppRunnerProps {
  app: AppConfig;
  onExitRunner?: () => void;
}

export const MobileAppRunner: React.FC<MobileAppRunnerProps> = ({ app, onExitRunner }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [iframeKey, setIframeKey] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, (app.splashDurationSeconds || 2) * 1000);
    return () => clearTimeout(timer);
  }, [app.splashDurationSeconds]);

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleDownloadProject = async () => {
    setIsDownloading(true);
    try {
      await createAndDownloadProjectZip(app);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col font-sans overflow-hidden">
      {/* Native Splash Screen Overlay */}
      {showSplash && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center text-white transition-opacity duration-500 p-6"
          style={{ backgroundColor: app.primaryColor || '#1e3a8a' }}
        >
          <div className="flex flex-col items-center space-y-4 animate-fade-in text-center">
            <div className="h-24 w-24 rounded-3xl bg-white/20 p-2 shadow-2xl backdrop-blur-md overflow-hidden flex items-center justify-center border border-white/30">
              {app.launcherIconUrl || app.logoUrl ? (
                <img
                  src={app.launcherIconUrl || app.logoUrl}
                  alt={app.appName}
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                <span className="text-4xl font-black">{app.instituteName.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{app.appName}</h1>
              <p className="text-sm text-white/80 font-medium">{app.instituteName}</p>
            </div>
            <div className="mt-8 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white animate-ping" />
              <span className="text-xs text-white/80 font-mono">Loading Course Engine...</span>
            </div>
          </div>
        </div>
      )}

      {/* Branded Native Header Bar */}
      <header
        className="flex h-14 items-center justify-between px-4 text-white shadow-md z-40 shrink-0"
        style={{ backgroundColor: app.primaryColor || '#1e3a8a' }}
      >
        <div className="flex items-center gap-2.5">
          {onExitRunner && (
            <button
              type="button"
              onClick={onExitRunner}
              className="rounded-full p-1.5 hover:bg-white/20 active:scale-95 transition-all"
              title="Exit Mobile Test"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-white/20 overflow-hidden flex items-center justify-center p-0.5 border border-white/20">
              {app.launcherIconUrl || app.logoUrl ? (
                <img
                  src={app.launcherIconUrl || app.logoUrl}
                  alt={app.appName}
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <span className="text-xs font-bold">{app.appName.charAt(0)}</span>
              )}
            </div>
            <span className="font-bold text-sm truncate max-w-[170px]">{app.appName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReload}
            className="rounded-full p-2 hover:bg-white/20 active:rotate-180 transition-all"
            title="Reload Webview"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleDownloadProject}
            disabled={isDownloading}
            className="flex items-center gap-1 rounded-xl bg-white/20 px-2.5 py-1 text-xs font-bold hover:bg-white/30 active:scale-95 transition-all"
            title="Download Android Project Codebase (ZIP)"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isDownloading ? 'Packaging...' : 'Project ZIP'}</span>
          </button>
        </div>
      </header>

      {/* Main WebView Container */}
      <main className="flex-1 w-full h-full bg-white relative">
        <iframe
          key={iframeKey}
          src={app.courseUrl}
          title={app.appName}
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; camera; microphone; geolocation"
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation"
        />
      </main>

      {/* Bottom Floating App Install & Share Bar */}
      <div className="bg-slate-950/90 text-white px-4 py-2 text-xs flex items-center justify-between border-t border-slate-800 backdrop-blur-xs">
        <div className="flex items-center gap-2 text-slate-300 truncate">
          <Smartphone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{app.packageId}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={app.courseUrl}
            target="_blank"
            rel="noreferrer"
            className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
          >
            <ExternalLink className="h-3 w-3" />
            Browser
          </a>
        </div>
      </div>
    </div>
  );
};
