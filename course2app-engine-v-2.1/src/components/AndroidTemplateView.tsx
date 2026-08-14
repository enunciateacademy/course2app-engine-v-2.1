import React, { useState } from 'react';
import {
  FileCode,
  Download,
  Copy,
  Check,
  Shield,
  Layers,
  Terminal,
  ExternalLink,
  Sparkles,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { AppConfig } from '../types';
import {
  generateAppConfigJson,
  generateCapacitorConfig,
  generateAndroidManifest,
  generateMainActivityJava,
  generateAppBuildGradle,
  generateRootBuildGradle,
  generateSettingsGradle,
  generateVariablesGradle,
  generateKeystoreScript,
  generateBuildLocalScript,
  createAndDownloadProjectZip
} from '../utils/androidGenerator';
import {
  GITHUB_ANDROID_BUILD_YML,
  GITHUB_DEPLOY_PAGES_YML,
  INJECT_BRANDING_SCRIPT
} from '../utils/githubWorkflows';

interface AndroidTemplateViewProps {
  sampleApp: AppConfig;
}

export const AndroidTemplateView: React.FC<AndroidTemplateViewProps> = ({ sampleApp }) => {
  const [selectedFile, setSelectedFile] = useState<string>('capacitor.config.json');
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const fileMap: Record<string, { label: string; lang: string; content: string }> = {
    'capacitor.config.json': {
      label: 'capacitor.config.json',
      lang: 'json',
      content: generateCapacitorConfig(sampleApp)
    },
    'AndroidManifest.xml': {
      label: 'android/app/src/main/AndroidManifest.xml',
      lang: 'xml',
      content: generateAndroidManifest(sampleApp)
    },
    'MainActivity.java': {
      label: 'android/.../MainActivity.java',
      lang: 'java',
      content: generateMainActivityJava(sampleApp)
    },
    'app/build.gradle': {
      label: 'android/app/build.gradle',
      lang: 'groovy',
      content: generateAppBuildGradle(sampleApp)
    },
    'root/build.gradle': {
      label: 'android/build.gradle',
      lang: 'groovy',
      content: generateRootBuildGradle()
    },
    'variables.gradle': {
      label: 'android/variables.gradle',
      lang: 'groovy',
      content: generateVariablesGradle()
    },
    'settings.gradle': {
      label: 'android/settings.gradle',
      lang: 'groovy',
      content: generateSettingsGradle()
    },
    'scripts/build-local.sh': {
      label: 'scripts/build-local.sh',
      lang: 'bash',
      content: generateBuildLocalScript()
    },
    'scripts/generate-keystore.sh': {
      label: 'scripts/generate-keystore.sh',
      lang: 'bash',
      content: generateKeystoreScript(sampleApp)
    },
    'inject-branding.js': {
      label: 'scripts/inject-branding.js',
      lang: 'javascript',
      content: INJECT_BRANDING_SCRIPT
    },
    'android-build.yml': {
      label: '.github/workflows/android-build.yml',
      lang: 'yaml',
      content: GITHUB_ANDROID_BUILD_YML
    },
    'app-config.json': {
      label: 'configs/app-config.json',
      lang: 'json',
      content: generateAppConfigJson(sampleApp)
    }
  };

  const currentFile = fileMap[selectedFile] || fileMap['capacitor.config.json'];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await createAndDownloadProjectZip(sampleApp);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FileCode className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Reusable Android Template & GitHub Engine</h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            Inspect the production-grade Capacitor Android container codebase and GitHub Actions automated build scripts.
          </p>
        </div>

        <button
          type="button"
          disabled={isZipping}
          onClick={handleDownloadZip}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all shrink-0"
        >
          <Download className="h-3.5 w-3.5" />
          {isZipping ? 'Generating ZIP...' : 'Download Full Android Project ZIP'}
        </button>
      </div>

      {/* Code Inspector & File Switcher */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: File Tree */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-2">
            Template Architecture Files
          </div>

          {Object.entries(fileMap).map(([key, item]) => {
            const isSelected = selectedFile === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedFile(key)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-mono text-xs transition-colors ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{key}</span>
                </div>
                {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
              </button>
            );
          })}
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-950 p-5 shadow-2xl text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="text-blue-400 font-semibold">{currentFile.label}</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>

          <pre className="max-h-[500px] overflow-auto font-mono text-xs leading-relaxed text-emerald-400/90 scrollbar-thin p-1">
            <code>{currentFile.content}</code>
          </pre>
        </div>
      </div>

      {/* GitHub Secrets Security Card (Zero browser credential storage) */}
      <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            GitHub Actions Keystore Signing Secrets
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          For maximum security, Android release signing keys and keystore passwords are never stored in browser JavaScript. They are configured securely inside your private GitHub Repository Secrets:
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <span className="font-bold text-slate-900 block">ANDROID_KEYSTORE_BASE64</span>
            <span className="text-slate-500 text-[11px]">Base64 encoded string of your release.keystore file</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <span className="font-bold text-slate-900 block">KEYSTORE_PASSWORD</span>
            <span className="text-slate-500 text-[11px]">Password used when creating the Java KeyStore</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <span className="font-bold text-slate-900 block">KEY_ALIAS</span>
            <span className="text-slate-500 text-[11px]">Alias key name inside your keystore (e.g. key0)</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <span className="font-bold text-slate-900 block">KEY_PASSWORD</span>
            <span className="text-slate-500 text-[11px]">Private alias password</span>
          </div>
        </div>
      </div>
    </div>
  );
};
