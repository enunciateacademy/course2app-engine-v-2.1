import React, { useState, useEffect } from 'react';
import { Globe, BookOpen, AlertCircle, CheckCircle2, Plus, Sparkles, ExternalLink } from 'lucide-react';
import { AppConfig, SavedCourse } from '../../types';
import { validateCourseUrl } from '../../utils/validation';
import { storageService } from '../../storage/storageService';

interface Step1CourseProps {
  appData: Partial<AppConfig>;
  onChange: (fields: Partial<AppConfig>) => void;
  onNext: () => void;
}

export const Step1Course: React.FC<Step1CourseProps> = ({ appData, onChange, onNext }) => {
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(appData.courseId || '');
  const [inputUrl, setInputUrl] = useState<string>(appData.courseUrl || '');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);

  useEffect(() => {
    storageService.getCourses().then(setSavedCourses);
  }, []);

  const handleUrlChange = (val: string) => {
    setInputUrl(val);
    setSelectedCourseId('');
    onChange({ courseUrl: val, courseId: undefined });
    if (touched) {
      const check = validateCourseUrl(val);
      setErrorMsg(check.valid ? '' : check.error || '');
    }
  };

  const handleSelectSavedCourse = (course: SavedCourse) => {
    setSelectedCourseId(course.id);
    setInputUrl(course.url);
    setErrorMsg('');
    onChange({
      courseUrl: course.url,
      courseId: course.id
    });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const check = validateCourseUrl(inputUrl);
    if (!check.valid) {
      setErrorMsg(check.error || 'Please provide a valid HTTPS course URL.');
      return;
    }
    setErrorMsg('');
    onNext();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            1
          </span>
          <h2 className="text-xl font-bold text-slate-900">Course Website URL</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Paste the course or learning website that this app should open. The same course URL can be used across multiple branded institute apps!
        </p>
      </div>

      {/* Quick Select from Saved Master Courses */}
      {savedCourses.length > 0 && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
              <BookOpen className="h-4 w-4 text-blue-600" />
              Use an Existing Course URL
            </div>
            <span className="text-[11px] font-medium text-blue-700">
              {savedCourses.length} Master Courses Saved
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {savedCourses.map((c) => {
              const isSelected = selectedCourseId === c.id || inputUrl === c.url;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectSavedCourse(c)}
                  className={`flex flex-col rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-white text-blue-900 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white/80 text-slate-700 hover:border-blue-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{c.title}</span>
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0 ml-1" />}
                  </div>
                  <span className="mt-1 font-mono text-[11px] text-slate-500 truncate">{c.url}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual URL Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-800">
          Course Website URL <span className="text-rose-500">*</span>
        </label>
        <div className="mt-1.5 relative rounded-xl shadow-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Globe className="h-4 w-4" />
          </div>
          <input
            type="url"
            required
            value={inputUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            onBlur={() => {
              setTouched(true);
              const check = validateCourseUrl(inputUrl);
              setErrorMsg(check.valid ? '' : check.error || '');
            }}
            placeholder="https://academy.graphy.com/course/sainik-class-6"
            className={`w-full rounded-xl border bg-white py-3 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden ${
              errorMsg
                ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }`}
          />
          {inputUrl && validateCourseUrl(inputUrl).valid && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          )}
        </div>

        {errorMsg ? (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-500">
            Example: <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded font-mono">https://academy.graphy.com/course/sainik-class-6</code>
          </p>
        )}
      </div>

      {/* Safety & Compliance Information Note */}
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5 text-xs text-emerald-900 leading-relaxed flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-emerald-950">Safe & Authorized Browser Container:</strong> The generated app securely opens your authorized website or LMS URL directly inside a high-performance Android WebView without scraping or tampering with login DRM.
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-end pt-4 border-t border-slate-100">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
        >
          Continue to Institute Details →
        </button>
      </div>
    </form>
  );
};
