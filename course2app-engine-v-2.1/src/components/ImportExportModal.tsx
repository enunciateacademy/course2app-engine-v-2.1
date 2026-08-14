import React, { useState } from 'react';
import { X, Download, Upload, CheckCircle2, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { storageService } from '../storage/storageService';
import { saveAs } from 'file-saver';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  onDataChanged
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      const dataStr = await storageService.exportAllData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const filename = `course2app_backup_${new Date().toISOString().split('T')[0]}.json`;
      saveAs(blob, filename);
      setStatusMsg({ type: 'success', text: `Exported full backup to ${filename}!` });
    } catch (e: any) {
      setStatusMsg({ type: 'error', text: `Export failed: ${e.message}` });
    }
  };

  const handleImport = async () => {
    if (!jsonInput.trim()) {
      setStatusMsg({ type: 'error', text: 'Please paste JSON data or select a file to import.' });
      return;
    }

    const result = await storageService.importData(jsonInput);
    if (result.success) {
      setStatusMsg({ type: 'success', text: result.message });
      onDataChanged();
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setStatusMsg({ type: 'error', text: result.message });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  const handleResetToDemo = async () => {
    if (window.confirm('Reset all apps and courses to initial sample data?')) {
      await storageService.resetToDefaults();
      onDataChanged();
      setStatusMsg({ type: 'success', text: 'Restored sample institute apps!' });
      setTimeout(() => onClose(), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Backup, Export & Import</h3>
              <p className="text-xs text-slate-500">Manage your course configurations & institute apps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {statusMsg && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="mt-5 space-y-5">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 transition-all"
            >
              <Download className="h-4 w-4 text-blue-600" />
              Export All Apps (JSON)
            </button>

            <button
              type="button"
              onClick={handleResetToDemo}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            >
              <RefreshCw className="h-4 w-4 text-slate-500" />
              Reset Demo Presets
            </button>
          </div>

          {/* Import Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Import JSON (Single App or Full Backup)
              </label>
              <label className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline">
                <span>Upload .json file</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <textarea
              rows={5}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste app-config.json or backup payload here..."
              className="w-full rounded-xl border border-slate-300 p-3 font-mono text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Upload className="h-4 w-4" />
            Import Now
          </button>
        </div>
      </div>
    </div>
  );
};
