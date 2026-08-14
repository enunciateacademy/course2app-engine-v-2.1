import { AppConfig, SavedCourse, BuildLogRecord } from '../types';

export const INITIAL_SAVED_COURSES: SavedCourse[] = [
  {
    id: 'course-sainik-6',
    title: 'Sainik School Entrance Class 6',
    url: 'https://academy.graphy.com/course/sainik-class-6',
    category: 'Entrance Exams',
    description: 'Complete coaching for AISSEE Class 6 including Mathematics, Intelligence, Language & GK.',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'course-navodaya-6',
    title: 'JNVST Navodaya Vidyalaya Class 6',
    url: 'https://academy.graphy.com/course/navodaya-class-6',
    category: 'Entrance Exams',
    description: 'Mental Ability, Arithmetic, and Language test modules with mock test series.',
    createdAt: '2026-01-12T11:30:00.000Z',
    updatedAt: '2026-01-12T11:30:00.000Z'
  },
  {
    id: 'course-rms-6',
    title: 'Rashtriya Military School (RMS) CET',
    url: 'https://academy.graphy.com/course/rms-class-6',
    category: 'Defense Schools',
    description: 'Comprehensive preparation for RMS Class 6 and 9 Common Entrance Test.',
    createdAt: '2026-01-15T14:00:00.000Z',
    updatedAt: '2026-01-15T14:00:00.000Z'
  },
  {
    id: 'course-rimc',
    title: 'RIMC Dehradun Entrance Foundation',
    url: 'https://academy.graphy.com/course/rimc-foundation',
    category: 'Defense Schools',
    description: 'Subjective Maths, English writing, and GK preparation for RIMC aspirants.',
    createdAt: '2026-01-20T09:15:00.000Z',
    updatedAt: '2026-01-20T09:15:00.000Z'
  }
];

export const INITIAL_APPS: AppConfig[] = [
  {
    id: 'app-enunciate',
    instituteName: 'Enunciate Academy',
    appName: 'Enunciate Academy',
    shortDescription: 'Premier Sainik & Military School Entrance Coaching',
    courseUrl: 'https://academy.graphy.com/course/sainik-class-6',
    courseId: 'course-sainik-6',
    primaryColor: '#1e3a8a', // Deep navy
    secondaryColor: '#f59e0b', // Amber
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    headerStyle: 'brand',
    splashType: 'auto',
    splashDurationSeconds: 2,
    enableOnboarding: true,
    onboardingScreens: [
      {
        id: 'ob-1',
        title: 'Welcome to Enunciate Academy',
        description: 'Access live interactive classes, video lectures, and daily practice papers.',
        backgroundColor: '#1e3a8a'
      },
      {
        id: 'ob-2',
        title: 'Mock Tests & Performance Reports',
        description: 'Evaluate your readiness with timed mock tests and personalized performance reports.',
        backgroundColor: '#1e40af'
      }
    ],
    packageId: 'com.course2app.enunciateacademy',
    versionName: '1.0.0',
    versionCode: 1,
    supportEmail: 'support@enunciateacademy.com',
    supportPhone: '+91 98765 43210',
    websiteUrl: 'https://enunciateacademy.com',
    allowCamera: true,
    allowMicrophone: true,
    allowGeolocation: false,
    allowFileUpload: true,
    allowDownloads: true,
    enablePullToRefresh: true,
    enableOfflineCache: true,
    clearCacheOnExit: false,
    status: 'ready',
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z',
    lastBuiltAt: '2026-02-01T10:30:00.000Z',
    lastAabFileName: 'enunciate-academy-v1.0.0-build1.aab'
  },
  {
    id: 'app-abc-sainik',
    instituteName: 'ABC Sainik Academy',
    appName: 'ABC Sainik Academy',
    shortDescription: 'Dedicated coaching for Sainik School aspirants',
    courseUrl: 'https://academy.graphy.com/course/sainik-class-6', // SAME MASTER URL
    courseId: 'course-sainik-6',
    primaryColor: '#047857', // Forest green
    secondaryColor: '#10b981',
    backgroundColor: '#ffffff',
    textColor: '#064e3b',
    headerStyle: 'brand',
    splashType: 'auto',
    splashDurationSeconds: 2,
    enableOnboarding: false,
    onboardingScreens: [],
    packageId: 'com.course2app.abcsainikacademy',
    versionName: '1.0.0',
    versionCode: 1,
    supportEmail: 'contact@abcsainik.com',
    supportPhone: '+91 91234 56789',
    websiteUrl: 'https://abcsainik.com',
    allowCamera: true,
    allowMicrophone: false,
    allowGeolocation: false,
    allowFileUpload: true,
    allowDownloads: true,
    enablePullToRefresh: true,
    enableOfflineCache: true,
    clearCacheOnExit: false,
    status: 'ready',
    createdAt: '2026-02-05T12:00:00.000Z',
    updatedAt: '2026-02-05T12:00:00.000Z'
  },
  {
    id: 'app-xyz-academy',
    instituteName: 'XYZ Academy',
    appName: 'XYZ Academy',
    shortDescription: 'Smart Learning Platform for Defense Exams',
    courseUrl: 'https://academy.graphy.com/course/sainik-class-6', // SAME MASTER URL
    courseId: 'course-sainik-6',
    primaryColor: '#7c3aed', // Purple
    secondaryColor: '#ec4899',
    backgroundColor: '#ffffff',
    textColor: '#1e1b4b',
    headerStyle: 'white',
    splashType: 'auto',
    splashDurationSeconds: 2,
    enableOnboarding: false,
    onboardingScreens: [],
    packageId: 'com.course2app.xyzacademy',
    versionName: '1.0.0',
    versionCode: 1,
    supportEmail: 'hello@xyzacademy.org',
    supportPhone: '+91 99887 76655',
    websiteUrl: 'https://xyzacademy.org',
    allowCamera: true,
    allowMicrophone: true,
    allowGeolocation: false,
    allowFileUpload: true,
    allowDownloads: true,
    enablePullToRefresh: true,
    enableOfflineCache: true,
    clearCacheOnExit: false,
    status: 'draft',
    createdAt: '2026-02-08T15:30:00.000Z',
    updatedAt: '2026-02-08T15:30:00.000Z'
  }
];

export const INITIAL_BUILD_LOGS: BuildLogRecord[] = [
  {
    id: 'build-log-1',
    appId: 'app-enunciate',
    appName: 'Enunciate Academy',
    instituteName: 'Enunciate Academy',
    packageId: 'com.course2app.enunciateacademy',
    versionName: '1.0.0',
    versionCode: 1,
    status: 'successful',
    startedAt: '2026-02-01T10:28:00.000Z',
    completedAt: '2026-02-01T10:30:42.000Z',
    durationMs: 162000,
    artifactAabName: 'enunciate-academy-v1.0.0-build1.aab',
    artifactApkName: 'enunciate-academy-v1.0.0-debug.apk',
    artifactSizeMb: 14.8,
    logs: [
      '[00:00] Run actions/checkout@v4',
      '[00:04] Set up Java Development Kit (JDK 17)',
      '[00:12] Set up Android SDK & Build Tools 34.0.0',
      '[00:25] Reading configuration for: com.course2app.enunciateacademy',
      '[00:28] Injecting Branding: Name="Enunciate Academy", Color="#1e3a8a"',
      '[00:32] Generating adaptive Android launcher icons & notification drawables',
      '[00:41] Injecting AndroidManifest.xml package identifier and security permissions',
      '[00:46] Capacitor sync android...',
      '[00:58] Executing ./gradlew bundleRelease...',
      '[02:15] Task :app:compileReleaseJavaWithJavac UP-TO-DATE',
      '[02:28] Task :app:packageReleaseBundle SUCCESS',
      '[02:35] Signing Android App Bundle with Keystore',
      '[02:40] Verifying AAB signature & Play Store zip alignment',
      '[02:42] Artifact generated: enunciate-academy-v1.0.0-build1.aab (14.8 MB)',
      '[02:42] BUILD SUCCESSFUL in 2m 42s'
    ]
  }
];
