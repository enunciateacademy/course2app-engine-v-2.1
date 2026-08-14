export interface AppConfig {
  id: string;
  // Core Info
  instituteName: string;
  appName: string;
  shortDescription?: string;
  courseUrl: string;
  courseId?: string; // Reference to saved course if selected
  
  // Branding
  logoUrl?: string; // Data URL or asset path
  logoFileName?: string;
  launcherIconUrl?: string; // Data URL for 1024x1024 launcher icon
  launcherIconFileName?: string;
  notificationIconUrl?: string; // Data URL for 72x72 transparent icon
  notificationIconFileName?: string;
  
  // Theme Colors
  primaryColor: string; // e.g. #1e40af
  secondaryColor: string; // e.g. #ffffff
  backgroundColor: string; // e.g. #f8fafc
  textColor: string; // e.g. #0f172a
  headerStyle: 'brand' | 'white' | 'minimal' | 'hidden';
  
  // Splash Screen
  splashType: 'auto' | 'custom';
  splashImageUrl?: string;
  splashFileName?: string;
  splashDurationSeconds: number;
  
  // Onboarding
  enableOnboarding: boolean;
  onboardingScreens: OnboardingScreen[];
  
  // Android Specific Settings
  packageId: string; // e.g. com.course2app.enunciateacademy
  versionName: string; // e.g. 1.0.0
  versionCode: number; // e.g. 1
  
  // Support Details
  supportEmail?: string;
  supportPhone?: string;
  websiteUrl?: string;
  
  // Advanced WebView Capabilities
  allowCamera: boolean;
  allowMicrophone: boolean;
  allowGeolocation: boolean;
  allowFileUpload: boolean;
  allowDownloads: boolean;
  enablePullToRefresh: boolean;
  enableOfflineCache: boolean;
  clearCacheOnExit: boolean;
  
  // Metadata & Status
  status: 'draft' | 'ready' | 'building' | 'successful' | 'failed';
  createdAt: string;
  updatedAt: string;
  lastBuiltAt?: string;
  lastAabFileName?: string;
}

export interface OnboardingScreen {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageFileName?: string;
  backgroundColor?: string;
}

export interface SavedCourse {
  id: string;
  title: string;
  url: string;
  category?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuildLogRecord {
  id: string;
  appId: string;
  appName: string;
  instituteName: string;
  packageId: string;
  versionName: string;
  versionCode: number;
  status: 'queued' | 'building' | 'successful' | 'failed';
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  logs: string[];
  artifactAabName?: string;
  artifactApkName?: string;
  artifactSizeMb?: number;
}

export interface ValidationCheck {
  id: string;
  label: string;
  isValid: boolean;
  message?: string;
  isWarning?: boolean;
}
