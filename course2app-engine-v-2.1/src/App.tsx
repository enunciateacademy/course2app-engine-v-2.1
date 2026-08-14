/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavView } from './components/Navbar';
import { MyAppsView } from './components/MyAppsView';
import { CourseLibraryView } from './components/CourseLibraryView';
import { BuildHistoryView } from './components/BuildHistoryView';
import { AndroidTemplateView } from './components/AndroidTemplateView';
import { PlayStoreGuideView } from './components/PlayStoreGuideView';
import { AppWizardModal } from './components/AppWizard/AppWizardModal';
import { ImportExportModal } from './components/ImportExportModal';
import { AppConfig, SavedCourse, BuildLogRecord } from './types';
import { storageService } from './storage/storageService';
import { sanitizePackageName } from './utils/validation';
import { MobileAppRunner } from './components/MobileAppRunner';

export default function App() {
  const [currentView, setCurrentView] = useState<NavView>('apps');
  const [apps, setApps] = useState<AppConfig[]>([]);
  const [courses, setCourses] = useState<SavedCourse[]>([]);
  const [buildLogs, setBuildLogs] = useState<BuildLogRecord[]>([]);

  // Mobile QR Direct Test Mode
  const [standaloneTestApp, setStandaloneTestApp] = useState<AppConfig | null>(null);

  // Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [editingApp, setEditingApp] = useState<Partial<AppConfig> | null>(null);
  const [wizardCourseUrl, setWizardCourseUrl] = useState<string | undefined>(undefined);

  // Import/Export Modal
  const [isImportExportOpen, setIsImportExportOpen] = useState<boolean>(false);

  // Refresh data from storageService
  const refreshData = async () => {
    const loadedApps = await storageService.getApps();
    const loadedCourses = await storageService.getCourses();
    const loadedLogs = await storageService.getBuildLogs();
    setApps(loadedApps);
    setCourses(loadedCourses);
    setBuildLogs(loadedLogs);

    // Check for testAppId query param
    const params = new URLSearchParams(window.location.search);
    const testAppId = params.get('testAppId');
    if (testAppId) {
      const match = loadedApps.find((a) => a.id === testAppId);
      if (match) {
        setStandaloneTestApp(match);
      }
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Wizard Open Actions
  const handleOpenNewApp = () => {
    setEditingApp(null);
    setWizardCourseUrl(undefined);
    setIsWizardOpen(true);
  };

  const handleEditApp = (app: AppConfig) => {
    setEditingApp(app);
    setWizardCourseUrl(undefined);
    setIsWizardOpen(true);
  };

  // 1-Click Fast Duplication with same master course URL
  const handleDuplicateApp = (sourceApp: AppConfig) => {
    const clone: Partial<AppConfig> = {
      ...sourceApp,
      id: `app-${Date.now()}`,
      appName: `${sourceApp.appName} (Partner)`,
      instituteName: `${sourceApp.instituteName} Branch`,
      packageId: sanitizePackageName(`${sourceApp.instituteName}partner`),
      primaryColor: sourceApp.primaryColor === '#1e3a8a' ? '#047857' : '#7c3aed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditingApp(clone);
    setWizardCourseUrl(sourceApp.courseUrl);
    setIsWizardOpen(true);
  };

  const handleCreateAppForCourse = (courseUrl: string, courseId: string) => {
    setEditingApp({
      courseUrl,
      courseId,
      instituteName: '',
      appName: '',
      packageId: ''
    });
    setWizardCourseUrl(courseUrl);
    setIsWizardOpen(true);
  };

  const handleBuildApp = (app: AppConfig) => {
    setEditingApp(app);
    setIsWizardOpen(true);
  };

  const handleDeleteApp = async (id: string) => {
    await storageService.deleteApp(id);
    refreshData();
  };

  const handleSaveCourse = async (course: SavedCourse) => {
    await storageService.saveCourse(course);
    refreshData();
  };

  const handleDeleteCourse = async (id: string) => {
    await storageService.deleteCourse(id);
    refreshData();
  };

  if (standaloneTestApp) {
    return (
      <MobileAppRunner
        app={standaloneTestApp}
        onExitRunner={() => {
          setStandaloneTestApp(null);
          window.history.pushState({}, '', window.location.pathname);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenCreateWizard={handleOpenNewApp}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        appsCount={apps.length}
        coursesCount={courses.length}
      />

      {/* Main View Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {currentView === 'apps' && (
          <MyAppsView
            apps={apps}
            courses={courses}
            onOpenCreateWizard={handleOpenNewApp}
            onEditApp={handleEditApp}
            onDuplicateApp={handleDuplicateApp}
            onDeleteApp={handleDeleteApp}
            onBuildApp={handleBuildApp}
          />
        )}

        {currentView === 'courses' && (
          <CourseLibraryView
            courses={courses}
            apps={apps}
            onSaveCourse={handleSaveCourse}
            onDeleteCourse={handleDeleteCourse}
            onCreateAppForCourse={handleCreateAppForCourse}
          />
        )}

        {currentView === 'builds' && (
          <BuildHistoryView
            buildLogs={buildLogs}
            onTriggerNewBuild={handleOpenNewApp}
          />
        )}

        {currentView === 'template' && (
          <AndroidTemplateView
            sampleApp={
              apps[0] || {
                id: 'app-sample',
                instituteName: 'Enunciate Academy',
                appName: 'Enunciate Academy',
                courseUrl: 'https://academy.graphy.com/course/sainik-class-6',
                primaryColor: '#1e3a8a',
                secondaryColor: '#f59e0b',
                backgroundColor: '#ffffff',
                textColor: '#0f172a',
                packageId: 'com.course2app.enunciateacademy',
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
                status: 'successful',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            }
          />
        )}

        {currentView === 'guide' && <PlayStoreGuideView />}
      </main>

      {/* App Creation & Build Wizard Modal */}
      <AppWizardModal
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setEditingApp(null);
          setWizardCourseUrl(undefined);
          refreshData();
        }}
        onAppCreated={(createdApp) => {
          refreshData();
        }}
        initialApp={editingApp}
        defaultCourseUrl={wizardCourseUrl}
      />

      {/* Backup, Import & Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onDataChanged={refreshData}
      />

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span>Course2App Engine</span>
            <span>•</span>
            <span className="text-slate-500 font-normal">Capacitor Android Architecture</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Target Android SDK 34 • Gradle 8.5 • Play Store Ready
          </div>
        </div>
      </footer>
    </div>
  );
}
