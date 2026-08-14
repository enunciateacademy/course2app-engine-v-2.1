import React, { useState } from 'react';
import {
  Terminal,
  Download,
  Package,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { BuildLogRecord } from '../types';

interface BuildHistoryViewProps {
  buildLogs: BuildLogRecord[];
  onTriggerNewBuild: () => void;
}

export const BuildHistoryView: React.FC<BuildHistoryViewProps> = ({
  buildLogs,
  onTriggerNewBuild
}) => {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(
    buildLogs[0]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const handleDownloadAab = (record: BuildLogRecord) => {
    // If build was performed by the backend build runner
    const downloadUrl = `/api/build/download/${record.id}/aab`;
    window.location.href = downloadUrl;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Terminal className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Build History & AAB Artifacts</h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-xl">
            Audit build execution logs, download compiled Android App Bundles (.AAB), and inspect GitHub Actions compilation records.
          </p>
        </div>

        <button
          type="button"
          onClick={onTriggerNewBuild}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Create New Build
        </button>
      </div>

      {/* Builds Feed */}
      {buildLogs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
          <Terminal className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <p className="text-xs font-medium">No builds generated yet. Create an app to trigger your first Android build!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {buildLogs.map((record) => {
            const isExpanded = expandedLogId === record.id;
            const isSuccess = record.status === 'successful';

            return (
              <div
                key={record.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition-all overflow-hidden"
              >
                {/* Header Summary */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                        isSuccess
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isSuccess ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{record.appName}</h3>
                        <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          v{record.versionName} (#{record.versionCode})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-sm">
                        {record.packageId} • {record.instituteName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {isSuccess && (
                      <button
                        type="button"
                        onClick={() => handleDownloadAab(record)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download .AAB ({record.artifactSizeMb || '14.2'} MB)
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleExpand(record.id)}
                      className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      <span>Logs</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Meta details bar */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(record.startedAt).toLocaleString()}
                  </span>
                  <span>Duration: ~{Math.round((record.durationMs || 58000) / 1000)}s</span>
                  <span className="font-mono">Runner: GitHub Actions (ubuntu-latest, JDK 17)</span>
                </div>

                {/* Expanded Terminal Logs */}
                {isExpanded && (
                  <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-emerald-400 font-mono text-[11px] leading-relaxed shadow-inner">
                    <div className="flex items-center justify-between text-slate-500 pb-2 mb-2 border-b border-slate-800 text-[10px]">
                      <span>Execution Trace Log</span>
                      <span>Gradle Daemon v8.5</span>
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto scrollbar-thin">
                      {record.logs.map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
