import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Download,
  Package,
  FileCode,
  Sparkles,
  ArrowRight,
  Terminal,
  Layers,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Github,
  Laptop,
  Smartphone,
  QrCode,
  RefreshCw,
  Clock
} from 'lucide-react';
import { AppConfig, BuildLogRecord } from '../../types';
import {
  createAndDownloadProjectZip,
  startServerBuild,
  getBuildStatus,
  getBuildDownloadUrl
} from '../../utils/androidGenerator';
import { storageService } from '../../storage/storageService';
import { PhoneTestModal } from '../PhoneTestModal';

interface Step8SuccessProps {
  app: AppConfig;
  onCreateAnotherWithSameCourse: () => void;
  onCreateAnotherNew: () => void;
  onGoToDashboard: () => void;
}

export const Step8Success: React.FC<Step8SuccessProps> = ({
  app,
  onCreateAnotherWithSameCourse,
  onCreateAnotherNew,
  onGoToDashboard
}) => {
  const [buildId, setBuildId] = useState<string | null>(null);
  const [buildStatus, setBuildStatus] = useState<
    'idle' | 'validating' | 'preparing' | 'syncing' | 'building' | 'signing' | 'completed' | 'failed'
  >('validating');
  const [stepMessage, setStepMessage] = useState<string>('Scaffolding native Android Studio codebase & Gradle 8.7...');
  const [progressPercent, setProgressPercent] = useState<number>(15);
  const [logs, setLogs] = useState<string[]>([]);
  const [hasRealAab, setHasRealAab] = useState<boolean>(false);
  const [hasRealApk, setHasRealApk] = useState<boolean>(false);
  const [aabSizeMb, setAabSizeMb] = useState<number | undefined>(undefined);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [showFullLogs, setShowFullLogs] = useState<boolean>(true);
  const [isPhoneTestModalOpen, setIsPhoneTestModalOpen] = useState<boolean>(false);
  const [activeBuildTab, setActiveBuildTab] = useState<'cloud' | 'local' | 'specs'>('cloud');
  const [copiedGit, setCopiedGit] = useState<boolean>(false);
  const [copiedLocal, setCopiedLocal] = useState<boolean>(false);
  const terminalBottomRef = useRef<HTMLDivElement | null>(null);

  // Trigger real server-side build pipeline on mount
  useEffect(() => {
    let isMounted = true;
    let pollInterval: any = null;

    const initiateBuild = async () => {
      try {
        const res = await startServerBuild(app, 'both');
        if (!isMounted) return;

        if (res.success && res.buildId) {
          setBuildId(res.buildId);
          setBuildStatus('validating');

          // Poll build status
          pollInterval = setInterval(async () => {
            if (!res.buildId) return;
            const statusData = await getBuildStatus(res.buildId);
            if (!statusData || !isMounted) return;

            setBuildStatus(statusData.status);
            setStepMessage(statusData.stepMessage || 'Processing Android project build...');
            setProgressPercent(statusData.progressPercent || 50);
            if (statusData.logs && statusData.logs.length > 0) {
              setLogs(statusData.logs);
            }
            if (statusData.hasRealAab) {
              setHasRealAab(true);
              setAabSizeMb(statusData.aabSizeMb);
            }
            if (statusData.hasRealApk) {
              setHasRealApk(true);
            }

            if (statusData.status === 'completed' || statusData.status === 'failed') {
              clearInterval(pollInterval);

              if (statusData.status === 'completed') {
                try {
                  confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 }
                  });
                } catch (e) {}

                // Save to history
                const buildRecord: BuildLogRecord = {
                  id: res.buildId,
                  appId: app.id,
                  appName: app.appName,
                  instituteName: app.instituteName,
                  packageId: app.packageId,
                  versionName: app.versionName,
                  versionCode: app.versionCode,
                  status: 'successful',
                  startedAt: statusData.startedAt || new Date().toISOString(),
                  completedAt: statusData.completedAt || new Date().toISOString(),
                  durationMs: 4000,
                  artifactAabName: `${app.packageId.replace(/[^a-z0-9]/g, '_')}_v${app.versionName}_release.aab`,
                  artifactApkName: `${app.packageId.replace(/[^a-z0-9]/g, '_')}_v${app.versionName}_test.apk`,
                  artifactSizeMb: statusData.aabSizeMb || 15.4,
                  logs: statusData.logs || []
                };
                storageService.addBuildLog(buildRecord);
              }
            }
          }, 800);
        } else {
          setBuildStatus('failed');
          setStepMessage(res.error || 'Failed to start build engine.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        setBuildStatus('failed');
        setStepMessage(err.message || 'Build initialization failed.');
      }
    };

    initiateBuild();

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [app]);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await createAndDownloadProjectZip(app);
    } catch (e) {
      console.error('Error generating zip:', e);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadRealAab = () => {
    if (buildId) {
      window.location.href = getBuildDownloadUrl(buildId, 'aab');
    }
  };

  const handleDownloadRealApk = () => {
    if (buildId) {
      window.location.href = getBuildDownloadUrl(buildId, 'apk');
    }
  };

  const gitCommands = `# 1. Extract the downloaded ZIP and open the folder in terminal
cd ${app.packageId.replace(/[^a-z0-9]/g, '_')}_android_project

# 2. Push to your GitHub repository
git init
git add .
git commit -m "Branded Android App for ${app.instituteName}"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main

# 3. In GitHub -> Click "Actions" -> "Build Branded Android App (.AAB)" -> "Run workflow"
# The real signed .aab bundle will be compiled by Java 17 + Gradle 8.7 and uploaded as an artifact!`;

  const localCommands = `# 1. Extract ZIP and navigate to the project directory
cd ${app.packageId.replace(/[^a-z0-9]/g, '_')}_android_project

# 2. Build genuine .AAB with the included build script
chmod +x build-aab.sh
./build-aab.sh

# Or compile using Gradle wrapper directly:
cd android
chmod +x gradlew
./gradlew bundleRelease --stacktrace`;

  const copyGitCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedGit(true);
    setTimeout(() => setCopiedGit(false), 2000);
  };

  const copyLocalCommands = () => {
    navigator.clipboard.writeText(localCommands);
    setCopiedLocal(true);
    setTimeout(() => setCopiedLocal(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 text-white shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {buildStatus === 'completed'
              ? 'ANDROID PROJECT READY 🎉'
              : buildStatus === 'failed'
              ? 'BUILD ENGINE NOTICE'
              : 'Generating Android Codebase...'}
          </h2>
          <p className="mt-1.5 text-sm text-emerald-200 max-w-md">
            {app.appName} ({app.instituteName}) for{' '}
            <span className="font-mono text-white text-xs">{app.courseUrl}</span>
          </p>

          {/* Progress Bar during generation */}
          {buildStatus !== 'completed' && buildStatus !== 'failed' && (
            <div className="mt-6 w-full max-w-md">
              <div className="flex justify-between text-xs text-emerald-200 font-semibold mb-1.5">
                <span className="truncate pr-2">{stepMessage}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Build Engine Terminal Logs */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-200">
              Android Build Engine v6.0 Pipeline {buildId ? `[${buildId}]` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Clock className="h-3 w-3" />
              {buildStatus}
            </span>
            <button
              type="button"
              onClick={() => setShowFullLogs(!showFullLogs)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              {showFullLogs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {showFullLogs && (
          <div className="p-4 font-mono text-xs text-slate-300 max-h-56 overflow-y-auto space-y-1 bg-black/40">
            {logs.length === 0 ? (
              <div className="text-slate-500 italic">Initializing build pipeline...</div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    log.includes('ERROR') || log.includes('FAILED')
                      ? 'text-rose-400 font-bold'
                      : log.includes('SUCCESS') || log.includes('✓')
                      ? 'text-emerald-400 font-bold'
                      : log.includes('Notice') || log.includes('Notice')
                      ? 'text-amber-300'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
            <div ref={terminalBottomRef} />
          </div>
        )}
      </div>

      {/* Action Cards: Real AAB / APK / Project Codebase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Play Store .AAB Bundle Card */}
        <div className="rounded-3xl border-2 border-indigo-500 bg-linear-to-br from-indigo-50 via-blue-50/50 to-white p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                <Package className="h-3 w-3" /> Play Store Release
              </span>
              <span className="text-[11px] font-bold text-indigo-800">Target SDK 34</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              {hasRealAab ? 'Download .AAB Bundle' : 'Build .AAB Bundle'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {hasRealAab
                ? `Genuine compiled Android App Bundle (${aabSizeMb} MB) verified on disk. Ready for direct Google Play submission.`
                : 'Scaffolded for Gradle 8.7 bundleRelease with Android 14 requirements. Compile via 1-click GitHub Actions or local CLI.'}
            </p>
          </div>

          <div className="mt-4">
            {hasRealAab ? (
              <button
                type="button"
                onClick={handleDownloadRealAab}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                <Download className="h-4 w-4" />
                Download Verified .AAB ({aabSizeMb} MB)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveBuildTab('cloud')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                <Github className="h-4 w-4" />
                Build .AAB via GitHub Cloud
              </button>
            )}
          </div>
        </div>

        {/* 2. Instant Phone Test & APK Download Card */}
        <div className="rounded-3xl border-2 border-emerald-500 bg-linear-to-br from-emerald-50 to-teal-50/50 p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                <Smartphone className="h-3 w-3" /> Phone Sideloading
              </span>
              <span className="text-[11px] font-bold text-emerald-800">Mobile Ready</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Phone Test & Mobile QR
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Test your branded app instantly on your Android phone using live QR scanning or Gradle assembleRelease APK.
            </p>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
            {hasRealApk ? (
              <button
                type="button"
                onClick={handleDownloadRealApk}
                className="flex-1 w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 px-3 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all"
              >
                <Download className="h-4 w-4" />
                Download .APK
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsPhoneTestModalOpen(true)}
                className="flex-1 w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 px-3 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all"
              >
                <QrCode className="h-4 w-4" />
                Scan Phone QR
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsPhoneTestModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1 rounded-xl border border-emerald-300 bg-white py-3 px-3 text-xs font-bold text-emerald-800 hover:bg-emerald-100/50 active:scale-95 transition-all"
              title="Open Mobile Testing Center"
            >
              <Smartphone className="h-4 w-4 text-emerald-600" />
              Testing Center
            </button>
          </div>
        </div>

        {/* 3. Full Source Codebase Project (ZIP) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                <FileCode className="h-3 w-3" /> Android Studio
              </span>
              <span className="text-[11px] font-bold text-blue-800">Gradle 8.7</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Complete Project (ZIP)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full native Android Studio project with Capacitor 6.0 engine, <code>build-aab.sh</code> script, and automated GitHub Actions workflow.
            </p>
          </div>

          <div className="mt-4">
            <button
              type="button"
              disabled={isZipping}
              onClick={handleDownloadZip}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 px-4 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all"
            >
              <Download className="h-4 w-4" />
              {isZipping ? 'Packaging ZIP...' : 'Download Project ZIP'}
            </button>
          </div>
        </div>
      </div>

      {/* HOW TO COMPILE THE PRODUCTION .AAB (Cloud vs Local vs Play Store Specs) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-600" />
              How to Generate the Genuine .AAB Bundle for Google Play
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Google Play Console requires a compiled binary bundle (compiled with Android SDK 34, AAPT2, Java 17 bytecodes, and signed with your release Keystore).
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <button
            type="button"
            onClick={() => setActiveBuildTab('cloud')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeBuildTab === 'cloud'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Github className="h-4 w-4 text-emerald-600" />
            Option 1: 1-Click Free Cloud Build (GitHub Actions)
          </button>
          <button
            type="button"
            onClick={() => setActiveBuildTab('local')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeBuildTab === 'local'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Laptop className="h-4 w-4 text-blue-600" />
            Option 2: 1-Command Local Build (Terminal / Android Studio)
          </button>
          <button
            type="button"
            onClick={() => setActiveBuildTab('specs')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeBuildTab === 'specs'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-purple-600" />
            Play Store Requirements Diagnostic
          </button>
        </div>

        {/* TAB 1: CLOUD BUILD (GITHUB ACTIONS) */}
        {activeBuildTab === 'cloud' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <Sparkles className="h-4 w-4" />
                Recommended: No Android Studio or Local SDK Installation Required!
              </div>
              <p className="leading-relaxed">
                The generated project ZIP contains a ready-to-run <strong>GitHub Actions CI/CD pipeline</strong> (<code>.github/workflows/android-build.yml</code>). When you push the project to GitHub, GitHub's Ubuntu runners run Java 17, Android SDK 34, and <code>./gradlew bundleRelease</code> in ~2 minutes for free.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
                <span>Terminal Quick Push Commands:</span>
                <button
                  type="button"
                  onClick={copyGitCommands}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                >
                  {copiedGit ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedGit ? 'Copied to Clipboard!' : 'Copy Commands'}
                </button>
              </div>
              <pre className="rounded-2xl bg-slate-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                <code>{gitCommands}</code>
              </pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs space-y-1">
                <span className="font-bold text-slate-900 block">Step 1: Download & Push</span>
                <p className="text-slate-500 text-[11px]">Download ZIP and push code to your private or public GitHub repo.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs space-y-1">
                <span className="font-bold text-slate-900 block">Step 2: Run Workflow</span>
                <p className="text-slate-500 text-[11px]">Navigate to GitHub "Actions" tab and trigger "Build Branded Android App".</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs space-y-1">
                <span className="font-bold text-slate-900 block">Step 3: Download Real .AAB</span>
                <p className="text-slate-500 text-[11px]">Download the ~15MB release .aab artifact from GitHub Artifacts and upload directly to Play Console!</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOCAL BUILD */}
        {activeBuildTab === 'local' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              If you have Java JDK 17 and Android Studio installed on your machine, you can compile the genuine .AAB bundle locally:
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
                <span>Local Build Terminal Commands:</span>
                <button
                  type="button"
                  onClick={copyLocalCommands}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                >
                  {copiedLocal ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedLocal ? 'Copied to Clipboard!' : 'Copy Commands'}
                </button>
              </div>
              <pre className="rounded-2xl bg-slate-950 p-4 font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed">
                <code>{localCommands}</code>
              </pre>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
              <span className="font-bold">Output Location:</span>{' '}
              <code className="text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                android/app/build/outputs/bundle/release/app-release.aab
              </code>
            </div>
          </div>
        )}

        {/* TAB 3: PLAY STORE SPECS */}
        {activeBuildTab === 'specs' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Target SDK 34 (Android 14)
                </span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Complies with Google Play 2024-2026 mandates requiring Target API 34 for all new app and update submissions.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Package ID & Scheme Isolation
                </span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Package <code>{app.packageId}</code> is fully isolated. Multiple institute apps can be published under distinct developer accounts simultaneously.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Capacitor 6.0 Native Bridge
                </span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Hardware back button routing, deep links, native splash screen, offline error handling, and camera/microphone permissions.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Google Play Console Ready
                </span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Generates <code>BundleConfig.pb</code>, <code>AndroidManifest.xml</code>, <code>strings.xml</code>, and <code>colors.xml</code> natively compatible with Google Play Console.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onGoToDashboard}
          className="w-full sm:w-auto rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          ← Back to Institute Apps
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCreateAnotherWithSameCourse}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
          >
            Create Another App (Same Course)
          </button>

          <button
            type="button"
            onClick={onCreateAnotherNew}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
          >
            Create New Course App →
          </button>
        </div>
      </div>

      {/* Phone Test Modal */}
      <PhoneTestModal
        app={app}
        isOpen={isPhoneTestModalOpen}
        onClose={() => setIsPhoneTestModalOpen(false)}
      />
    </div>
  );
};
