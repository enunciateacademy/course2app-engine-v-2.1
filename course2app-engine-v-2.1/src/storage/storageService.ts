import { AppConfig, SavedCourse, BuildLogRecord } from '../types';
import { INITIAL_APPS, INITIAL_SAVED_COURSES, INITIAL_BUILD_LOGS } from './sampleData';

const STORAGE_KEYS = {
  APPS: 'c2a_apps_v1',
  COURSES: 'c2a_courses_v1',
  BUILDS: 'c2a_builds_v1',
  DRAFT: 'c2a_current_draft_v1',
  SETTINGS: 'c2a_settings_v1'
};

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // APPS CRUD
  public async getApps(): Promise<AppConfig[]> {
    if (!this.isBrowser()) return INITIAL_APPS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPS);
      if (!data) {
        // Seed with initial sample data
        await this.saveApps(INITIAL_APPS);
        return INITIAL_APPS;
      }
      return JSON.parse(data) as AppConfig[];
    } catch (e) {
      console.error('Error loading apps from storage:', e);
      return INITIAL_APPS;
    }
  }

  public async getAppById(id: string): Promise<AppConfig | null> {
    const apps = await this.getApps();
    return apps.find((a) => a.id === id) || null;
  }

  public async saveApps(apps: AppConfig[]): Promise<void> {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
    } catch (e) {
      console.error('Error saving apps to storage:', e);
    }
  }

  public async saveApp(app: AppConfig): Promise<AppConfig> {
    const apps = await this.getApps();
    const existingIndex = apps.findIndex((a) => a.id === app.id);
    const updatedApp = {
      ...app,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      apps[existingIndex] = updatedApp;
    } else {
      apps.unshift(updatedApp);
    }

    await this.saveApps(apps);
    return updatedApp;
  }

  public async deleteApp(id: string): Promise<void> {
    const apps = await this.getApps();
    const filtered = apps.filter((a) => a.id !== id);
    await this.saveApps(filtered);
  }

  public async duplicateApp(id: string, newInstituteName?: string): Promise<AppConfig | null> {
    const original = await this.getAppById(id);
    if (!original) return null;

    const baseName = newInstituteName || `${original.instituteName} (Copy)`;
    const cleanId = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    
    const newApp: AppConfig = {
      ...original,
      id: `app-${Date.now()}-${uniqueSuffix}`,
      instituteName: baseName,
      appName: baseName,
      packageId: `com.course2app.${cleanId || 'app'}${uniqueSuffix}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastBuiltAt: undefined,
      lastAabFileName: undefined
    };

    const apps = await this.getApps();
    apps.unshift(newApp);
    await this.saveApps(apps);
    return newApp;
  }

  // SAVED COURSES CRUD
  public async getCourses(): Promise<SavedCourse[]> {
    if (!this.isBrowser()) return INITIAL_SAVED_COURSES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COURSES);
      if (!data) {
        await this.saveCourses(INITIAL_SAVED_COURSES);
        return INITIAL_SAVED_COURSES;
      }
      return JSON.parse(data) as SavedCourse[];
    } catch (e) {
      console.error('Error loading courses:', e);
      return INITIAL_SAVED_COURSES;
    }
  }

  public async saveCourses(courses: SavedCourse[]): Promise<void> {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error('Error saving courses:', e);
    }
  }

  public async saveCourse(course: SavedCourse): Promise<SavedCourse> {
    const courses = await this.getCourses();
    const existingIndex = courses.findIndex((c) => c.id === course.id);
    const updated = {
      ...course,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      courses[existingIndex] = updated;
    } else {
      courses.unshift(updated);
    }

    await this.saveCourses(courses);
    return updated;
  }

  public async deleteCourse(id: string): Promise<void> {
    const courses = await this.getCourses();
    const filtered = courses.filter((c) => c.id !== id);
    await this.saveCourses(filtered);
  }

  // BUILD LOGS
  public async getBuildLogs(): Promise<BuildLogRecord[]> {
    if (!this.isBrowser()) return INITIAL_BUILD_LOGS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUILDS);
      if (!data) {
        await this.saveBuildLogs(INITIAL_BUILD_LOGS);
        return INITIAL_BUILD_LOGS;
      }
      return JSON.parse(data) as BuildLogRecord[];
    } catch (e) {
      console.error('Error loading build logs:', e);
      return INITIAL_BUILD_LOGS;
    }
  }

  public async saveBuildLogs(logs: BuildLogRecord[]): Promise<void> {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.BUILDS, JSON.stringify(logs));
    } catch (e) {
      console.error('Error saving build logs:', e);
    }
  }

  public async addBuildLog(record: BuildLogRecord): Promise<void> {
    const logs = await this.getBuildLogs();
    logs.unshift(record);
    await this.saveBuildLogs(logs);
  }

  // DRAFT PERSISTENCE
  public saveDraft(draft: Partial<AppConfig>): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft));
    } catch (e) {
      console.warn('Failed to save draft:', e);
    }
  }

  public getDraft(): Partial<AppConfig> | null {
    if (!this.isBrowser()) return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DRAFT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public clearDraft(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
  }

  // EXPORT / IMPORT ALL
  public async exportAllData(): Promise<string> {
    const apps = await this.getApps();
    const courses = await this.getCourses();
    const builds = await this.getBuildLogs();

    const payload = {
      engine: 'Course2App Engine',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      apps,
      courses,
      builds
    };

    return JSON.stringify(payload, null, 2);
  }

  public async importData(
    jsonData: string
  ): Promise<{ success: boolean; importedAppsCount: number; message: string }> {
    try {
      const parsed = JSON.parse(jsonData);

      // Handle single app JSON or full backup
      if (parsed.packageId && parsed.appName && parsed.courseUrl) {
        // Single app import
        const singleApp: AppConfig = {
          ...parsed,
          id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          updatedAt: new Date().toISOString()
        };
        await this.saveApp(singleApp);
        return { success: true, importedAppsCount: 1, message: `Successfully imported "${singleApp.appName}"!` };
      }

      if (Array.isArray(parsed.apps)) {
        // Full backup
        await this.saveApps(parsed.apps);
        if (Array.isArray(parsed.courses)) {
          await this.saveCourses(parsed.courses);
        }
        if (Array.isArray(parsed.builds)) {
          await this.saveBuildLogs(parsed.builds);
        }
        return {
          success: true,
          importedAppsCount: parsed.apps.length,
          message: `Successfully imported ${parsed.apps.length} apps and ${parsed.courses?.length || 0} courses!`
        };
      }

      return { success: false, importedAppsCount: 0, message: 'Unrecognized JSON format.' };
    } catch (e: any) {
      return { success: false, importedAppsCount: 0, message: `Import error: ${e.message || 'Invalid JSON'}` };
    }
  }

  public async resetToDefaults(): Promise<void> {
    await this.saveApps(INITIAL_APPS);
    await this.saveCourses(INITIAL_SAVED_COURSES);
    await this.saveBuildLogs(INITIAL_BUILD_LOGS);
    this.clearDraft();
  }
}

export const storageService = new StorageService();
