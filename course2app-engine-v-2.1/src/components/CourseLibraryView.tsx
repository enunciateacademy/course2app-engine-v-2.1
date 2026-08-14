import React, { useState } from 'react';
import {
  Globe,
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SavedCourse, AppConfig } from '../types';
import { validateCourseUrl } from '../utils/validation';

interface CourseLibraryViewProps {
  courses: SavedCourse[];
  apps: AppConfig[];
  onSaveCourse: (course: SavedCourse) => void;
  onDeleteCourse: (id: string) => void;
  onCreateAppForCourse: (courseUrl: string, courseId: string) => void;
}

export const CourseLibraryView: React.FC<CourseLibraryViewProps> = ({
  courses,
  apps,
  onSaveCourse,
  onDeleteCourse,
  onCreateAppForCourse
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCourse, setEditingCourse] = useState<SavedCourse | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formCategory, setFormCategory] = useState('Entrance Exams');
  const [formDesc, setFormDesc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormTitle('');
    setFormUrl('');
    setFormCategory('Entrance Exams');
    setFormDesc('');
    setErrorMsg('');
    setIsAdding(true);
  };

  const handleOpenEdit = (c: SavedCourse) => {
    setEditingCourse(c);
    setFormTitle(c.title);
    setFormUrl(c.url);
    setFormCategory(c.category || 'Entrance Exams');
    setFormDesc(c.description || '');
    setErrorMsg('');
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateCourseUrl(formUrl);
    if (!check.valid) {
      setErrorMsg(check.error || 'Invalid Course URL');
      return;
    }

    const courseToSave: SavedCourse = {
      id: editingCourse?.id || `course-${Date.now()}`,
      title: formTitle.trim(),
      url: formUrl.trim(),
      category: formCategory.trim(),
      description: formDesc.trim(),
      createdAt: editingCourse?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveCourse(courseToSave);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Globe className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Master Course URLs Library</h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-xl">
            Save and organize your master course website URLs once. Create dozens of distinct institute apps without having to re-enter links.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Master Course URL
        </button>
      </div>

      {/* Add / Edit Course Form Modal */}
      {isAdding && (
        <div className="rounded-3xl border border-blue-200 bg-blue-50/40 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              {editingCourse ? 'Edit Master Course URL' : 'Add New Master Course URL'}
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Course Name</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Sainik School Class 6 Entrance"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Category / Exam Type</label>
              <input
                type="text"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g. Entrance Exams, Defense Schools, K-12"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">Master Website / Course URL</label>
              <input
                type="url"
                required
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://academy.graphy.com/course/sainik-class-6"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">Description / Syllabus Notes</label>
              <input
                type="text"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Brief description or target audience..."
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                {editingCourse ? 'Save Changes' : 'Save Course to Library'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {courses.map((course) => {
          const linkedApps = apps.filter(
            (a) => a.courseId === course.id || a.courseUrl === course.url
          );

          return (
            <div
              key={course.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {course.category || 'Course'}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-1">{course.title}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(course)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50"
                      title="Edit Course"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete course "${course.title}"?`)) {
                          onDeleteCourse(course.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50"
                      title="Delete Course"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {course.description || 'Master course URL configured for institute app wrapping.'}
                </p>

                {/* Course Link Display */}
                <div className="rounded-xl bg-slate-50 p-2.5 text-xs font-mono text-slate-700 flex items-center justify-between gap-2 border border-slate-100">
                  <span className="truncate">{course.url}</span>
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800 shrink-0"
                    title="Open URL in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Footer: Linked Apps & CTA */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Smartphone className="h-3.5 w-3.5 text-blue-600" />
                  <span className="font-bold">{linkedApps.length}</span> Branded App{linkedApps.length === 1 ? '' : 's'}
                </div>

                <button
                  type="button"
                  onClick={() => onCreateAppForCourse(course.url, course.id)}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create App for this Course
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
