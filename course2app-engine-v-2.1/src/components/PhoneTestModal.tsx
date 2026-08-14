import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  Download,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  Terminal,
  HelpCircle,
  FileCode,
  Share2,
  Package,
  Github,
  Laptop
} from 'lucide-react';
import { AppConfig } from '../types';
import { createAndDownloadProjectZip, startServerBuild, getBuildStatus, getBuildDownloadUrl } from '../utils/androidGenerator';

interface PhoneTestModalProps {
  app: AppConfig | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneTestModal: React.FC<PhoneTestModalProps> = ({
  app,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'aab' | 'apk' | 'cloud' | 'instructions'>('qr');
  const [isZipping, setIsZipping] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  if (!isOpen || !app) return null;

  // Build the live test runner URL
  const testUrl = `${window.location.origin}${window.location.pathname}?testAppId=${encodeURIComponent(app.id)}#mobile-runner`;

  useEffect(() => {
    // Generate high-resolution QR code
    QRCode.toDataURL(
      testUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [testUrl, app.id]);

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await createAndDownloadProjectZip(app);
    } catch (err) {
      console.error('Failed to download project zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(testUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div
          className="p-6 text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${app.primaryColor || '#1e3a8a'} 0%, #0f172a 100%)`
          }}
        >
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 p-1 text-2xl font-bold text-white shadow-inner backdrop-blur-xs overflow-hidden border border-white/20"
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
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-400/30">
                    Mobile Testing & Distribution Center
                  </span>
                  <span className="font-mono text-xs text-white/70">v{app.versionName || '1.0.0'}</span>
                </div>
                <h2 className="text-xl font-extrabold tracking-tight mt-1">{app.appName}</h2>
                <p className="text-xs text-white/80 font-medium">{app.instituteName} • {app.packageId}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50/75 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'qr'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="h-4 w-4 text-emerald-600" />
            1. Scan QR & Mobile Test
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cloud')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'cloud'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Github className="h-4 w-4 text-indigo-600" />
            2. 1-Click Cloud Build (.AAB / .APK)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('instructions')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'instructions'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Laptop className="h-4 w-4 text-purple-600" />
            3. Local Android Studio Build
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* TAB 1: SCAN QR & MOBILE TEST */}
          {activeTab === 'qr' && (
            <div className="flex flex-col md:flex-row items-center gap-8 py-2">
              <div className="flex flex-col items-center justify-center rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
                {qrDataUrl ? (
                  <div className="rounded-2xl bg-white p-3 shadow-inner">
                    <img src={qrDataUrl} alt="App QR Code" className="h-48 w-48 rounded-lg" />
                  </div>
                ) : (
                  <div className="flex h-48 w-48 items-center justify-center text-xs text-slate-400">
                    Generating QR Code...
                  </div>
                )}
                <span className="mt-3 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
                  Scan with any Android phone camera
                </span>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    Instant Full-Screen Mobile Testing
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Test your custom splash screen, color theme ({app.primaryColor}), navigation header, and course URL ({app.courseUrl}) instantly in your mobile browser.
                  </p>
                </div>

                {/* Direct Link Box */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Direct Mobile Test Link
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={testUrl}
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-700 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                    >
                      {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedLink ? 'Copied' : 'Copy'}
                    </button>
                    <a
                      href={testUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open
                    </a>
                  </div>
                </div>

                {/* PWA / WebAPK installation tip */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-emerald-900">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Install to Android Home Screen (WebAPK):
                  </span>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    When opened in Chrome on Android, tap the three dots (⋮) $\rightarrow$ tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong> to create a native shortcut with your branding!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLOUD BUILD (GITHUB ACTIONS) */}
          {activeTab === 'cloud' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-900 p-4 text-white text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <Terminal className="h-4 w-4" />
                    GitHub Actions Cloud Build Pipeline
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">.github/workflows/android-build.yml</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  The project ZIP includes a complete GitHub Actions CI/CD workflow that compiles both production <strong>.AAB</strong> (for Play Store) and signed <strong>.APK</strong> (for direct device distribution) using Java 17 and Android SDK 34.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                <span className="font-bold text-slate-900 block">How to build real .AAB and .APK on GitHub:</span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px]">
                  <li>Download the project ZIP and push it to your GitHub repository.</li>
                  <li>In GitHub, click the <strong>Actions</strong> tab $\rightarrow$ select <strong>"Build Branded Android App (.AAB)"</strong>.</li>
                  <li>Select build type (<code>aab</code>, <code>apk</code>, or <code>both</code>) and click <strong>"Run workflow"</strong>.</li>
                  <li>In ~2 minutes, your compiled ~15MB release .aab and .apk files will be available for direct download under <strong>Artifacts</strong>!</li>
                </ol>
              </div>

              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 p-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {isZipping ? 'Packaging Project ZIP...' : 'Download Android Studio Project (ZIP)'}
              </button>
            </div>
          )}

          {/* TAB 3: LOCAL ANDROID STUDIO BUILD */}
          {activeTab === 'instructions' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  1-Command Local Compilation (Gradle 8.7 + Java 17)
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-900">Download and extract the project:</strong>
                      <p className="text-slate-500 text-[11px]">
                        Download the full project ZIP and unzip it on your computer.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-900">Run the build script:</strong>
                      <p className="text-slate-500 text-[11px]">
                        Open terminal in the project folder and run <code>chmod +x build-aab.sh && ./build-aab.sh</code>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-900">Output Location:</strong>
                      <p className="text-slate-500 text-[11px]">
                        The genuine bundle will be generated at <code>android/app/build/outputs/bundle/release/app-release.aab</code>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-blue-50 p-4 border border-blue-200">
                <div>
                  <span className="font-bold text-blue-950 block">Ready to compile?</span>
                  <span className="text-[11px] text-blue-700">Download the complete source codebase now.</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  {isZipping ? 'Packaging...' : 'Download Project ZIP'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Target SDK 34 • Android 14+ Ready</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {isZipping ? 'Packaging...' : 'Download Project ZIP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
