import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { AppConfig } from '../types';
import { GITHUB_ANDROID_BUILD_YML, GITHUB_DEPLOY_PAGES_YML, INJECT_BRANDING_SCRIPT } from './githubWorkflows';

export function generateAppConfigJson(app: AppConfig): string {
  return JSON.stringify(
    {
      id: app.id,
      appName: app.appName,
      instituteName: app.instituteName,
      courseUrl: app.courseUrl,
      packageId: app.packageId,
      versionName: app.versionName,
      versionCode: app.versionCode,
      primaryColor: app.primaryColor,
      secondaryColor: app.secondaryColor,
      backgroundColor: app.backgroundColor,
      textColor: app.textColor,
      headerStyle: app.headerStyle,
      splashType: app.splashType,
      splashDurationSeconds: app.splashDurationSeconds,
      enableOnboarding: app.enableOnboarding,
      onboardingScreens: app.onboardingScreens,
      supportEmail: app.supportEmail || '',
      supportPhone: app.supportPhone || '',
      websiteUrl: app.websiteUrl || '',
      allowCamera: app.allowCamera,
      allowMicrophone: app.allowMicrophone,
      allowGeolocation: app.allowGeolocation,
      allowFileUpload: app.allowFileUpload,
      allowDownloads: app.allowDownloads,
      enablePullToRefresh: app.enablePullToRefresh,
      enableOfflineCache: app.enableOfflineCache,
      clearCacheOnExit: app.clearCacheOnExit
    },
    null,
    2
  );
}

export function generateCapacitorConfig(app: AppConfig): string {
  return JSON.stringify(
    {
      appId: app.packageId,
      appName: app.appName,
      webDir: 'dist',
      bundledWebRuntime: false,
      server: {
        androidScheme: 'https',
        cleartext: false
      },
      plugins: {
        SplashScreen: {
          launchShowDuration: (app.splashDurationSeconds || 2) * 1000,
          backgroundColor: app.primaryColor || '#1e3a8a',
          showSpinner: true,
          androidSpinnerStyle: 'large',
          spinnerColor: '#ffffff'
        }
      }
    },
    null,
    2
  );
}

export function generateAndroidManifest(app: AppConfig): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="${app.packageId}">

    <!-- Core Internet & Network Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Technical Permissions (Enabled per App Configuration) -->
    ${app.allowCamera ? '<uses-permission android:name="android.permission.CAMERA" />' : ''}
    ${app.allowMicrophone ? '<uses-permission android:name="android.permission.RECORD_AUDIO" />' : ''}
    ${app.allowMicrophone ? '<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />' : ''}
    ${app.allowGeolocation ? '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />\n    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />' : ''}
    ${app.allowFileUpload || app.allowDownloads ? '<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />\n    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />\n    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />' : ''}

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="false"
        tools:targetApi="34">

        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:exported="true"
            android:label="@string/title_activity_main"
            android:launchMode="singleTask"
            android:theme="@style/AppTheme.NoActionBarLaunch">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Safe URL Scheme Handling for Instant App Deeplinks -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="@string/custom_url_scheme" />
            </intent-filter>
        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>

</manifest>`;
}

export function generateMainActivityJava(app: AppConfig): string {
  const pkgName = app.packageId;
  return `package ${pkgName};

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.CookieManager;
import android.view.KeyEvent;
import android.view.View;
import android.widget.ProgressBar;
import com.getcapacitor.BridgeActivity;

/**
 * Reusable Course2App Android Container
 * Institute: ${app.instituteName}
 * Target Course: ${app.courseUrl}
 */
public class MainActivity extends BridgeActivity {

    private WebView webView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Enable persistent cookies and safe WebStorage
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(getBridge().getWebView(), true);
        
        configureWebViewSettings();
    }

    private void configureWebViewSettings() {
        if (getBridge() != null && getBridge().getWebView() != null) {
            this.webView = getBridge().getWebView();
            WebSettings settings = this.webView.getSettings();
            
            // Modern HTML5 & Course Platform Compatibility
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            settings.setLoadsImagesAutomatically(true);
            settings.setMediaPlaybackRequiresUserGesture(false);
            settings.setAllowFileAccess(true);
            settings.setAllowContentAccess(true);
            settings.setSupportZoom(true);
            settings.setBuiltInZoomControls(true);
            settings.setDisplayZoomControls(false);
            settings.setUseWideViewPort(true);
            settings.setLoadWithOverviewMode(true);
            
            // Mixed content security rule: Always prioritize HTTPS
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        }
    }

    /**
     * Hardware Android Back Button Handler
     * Seamlessly navigates back through course pages before exiting app
     */
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (event.getAction() == KeyEvent.ACTION_DOWN) {
            if (keyCode == KeyEvent.KEYCODE_BACK) {
                if (this.webView != null && this.webView.canGoBack()) {
                    this.webView.goBack();
                    return true;
                }
            }
        }
        return super.onKeyDown(keyCode, event);
    }
}
`;
}

export function generateAppBuildGradle(app: AppConfig): string {
  return `apply plugin: 'com.android.application'

android {
    namespace "${app.packageId}"
    compileSdk 34

    defaultConfig {
        applicationId "${app.packageId}"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode ${app.versionCode || 1}
        versionName "${app.versionName || '1.0.0'}"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        aaptOptions {
             // Files and dirs to omit from the packaged assets
             ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~'
        }
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

repositories {
    flatDir{
        dirs '../capacitor-cordova-android-plugins/src/main/libs', 'libs'
    }
}

dependencies {
    implementation fileTree(include: ['*.jar'], dir: 'libs')
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.coordinatorlayout:coordinatorlayout:1.2.0'
    implementation 'androidx.core:core-splashscreen:1.0.1'
    implementation project(':capacitor-android')
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}

apply from: 'capacitor.build.gradle'
`;
}

export function generateWebWrapperHtml(app: AppConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>${app.appName}</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <!-- Dynamic Splash Screen -->
  <div id="splash-container" class="splash-screen" style="background-color: ${app.primaryColor};">
    <div class="splash-content">
      <div class="splash-logo-box">
        ${
          app.splashImageUrl
            ? `<img src="${app.splashImageUrl}" class="splash-img" alt="Logo" />`
            : `<div class="splash-text-logo">${app.instituteName.charAt(0)}</div>`
        }
      </div>
      <h1 class="splash-title">${app.appName}</h1>
      <p class="splash-subtitle">${app.shortDescription || 'Powered by Course2App'}</p>
      <div class="splash-spinner"></div>
    </div>
  </div>

  <!-- Onboarding Flow (if enabled) -->
  ${
    app.enableOnboarding && app.onboardingScreens.length > 0
      ? `
  <div id="onboarding-container" class="onboarding-modal hidden">
    <div class="onboarding-slider" id="onboarding-slider">
      ${app.onboardingScreens
        .map(
          (screen, idx) => `
        <div class="onboarding-slide" data-index="${idx}">
          <div class="onboarding-icon">${idx + 1}</div>
          <h2>${screen.title}</h2>
          <p>${screen.description}</p>
        </div>
      `
        )
        .join('')}
    </div>
    <div class="onboarding-footer">
      <div class="dots-indicator" id="dots-container"></div>
      <button id="btn-next-onboarding" class="btn-primary" style="background-color: ${app.primaryColor};">
        Get Started
      </button>
    </div>
  </div>
  `
      : ''
  }

  <!-- App Header Bar -->
  <header id="app-header" class="app-header ${app.headerStyle === 'hidden' ? 'hidden' : ''}" style="background-color: ${app.headerStyle === 'brand' ? app.primaryColor : '#ffffff'}; color: ${app.headerStyle === 'brand' ? '#ffffff' : '#0f172a'};">
    <div class="header-left">
      <button id="btn-back" class="nav-icon-btn" title="Back">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <span class="header-title">${app.appName}</span>
    </div>
    <div class="header-right">
      <button id="btn-refresh" class="nav-icon-btn" title="Reload">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
      </button>
    </div>
  </header>

  <!-- Pull to Refresh Bar -->
  <div id="refresh-progress" class="refresh-bar hidden" style="background-color: ${app.primaryColor};"></div>

  <!-- Main Course Frame / Container -->
  <main id="webview-container" class="webview-wrap">
    <iframe
      id="course-frame"
      src="${app.courseUrl}"
      allow="camera; microphone; geolocation; fullscreen; clipboard-read; clipboard-write;"
      class="course-iframe"
      title="${app.appName} Portal">
    </iframe>

    <!-- Offline / Error Recovery Screen -->
    <div id="error-screen" class="error-screen hidden">
      <div class="error-card">
        <div class="error-icon">⚠️</div>
        <h3>Unable to connect</h3>
        <p>Please check your internet connection and tap retry.</p>
        <button id="btn-retry" class="btn-retry" style="background-color: ${app.primaryColor};">
          Retry Connection
        </button>
      </div>
    </div>
  </main>

  <script src="app.js"></script>
</body>
</html>
`;
}

export function generateWebWrapperCss(app: AppConfig): string {
  return `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

body, html {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: ${app.backgroundColor || '#ffffff'};
  color: ${app.textColor || '#0f172a'};
}

/* Splash Screen */
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.splash-screen.fade-out {
  opacity: 0;
  visibility: hidden;
}

.splash-content {
  text-align: center;
  padding: 24px;
}

.splash-logo-box {
  width: 96px;
  height: 96px;
  margin: 0 auto 16px auto;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.splash-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.splash-text-logo {
  font-size: 42px;
  font-weight: 800;
  color: #ffffff;
}

.splash-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 6px;
}

.splash-subtitle {
  font-size: 14px;
  opacity: 0.85;
  margin-bottom: 24px;
}

.splash-spinner {
  width: 32px;
  height: 32px;
  margin: 0 auto;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* App Header */
.app-header {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  position: relative;
}

.app-header.hidden {
  display: none;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

.nav-icon-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.nav-icon-btn:active {
  opacity: 0.7;
}

/* Webview Container */
.webview-wrap {
  width: 100%;
  height: calc(100% - ${app.headerStyle === 'hidden' ? '0px' : '54px'});
  position: relative;
}

.course-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Error Screen */
.error-screen {
  position: absolute;
  inset: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  z-index: 50;
}

.error-screen.hidden {
  display: none;
}

.error-card {
  max-width: 320px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.btn-retry {
  margin-top: 18px;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

/* Onboarding */
.onboarding-modal {
  position: fixed;
  inset: 0;
  background: #ffffff;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px 24px;
}

.onboarding-modal.hidden {
  display: none;
}

.onboarding-slide {
  text-align: center;
  padding: 40px 0;
}

.onboarding-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px auto;
  border-radius: 50%;
  background: ${app.primaryColor}15;
  color: ${app.primaryColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
}
`;
}

export function generateWebWrapperJs(): string {
  return `// Course2App Engine Runtime Client
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash-container');
  const iframe = document.getElementById('course-frame');
  const btnBack = document.getElementById('btn-back');
  const btnRefresh = document.getElementById('btn-refresh');
  const errorScreen = document.getElementById('error-screen');
  const btnRetry = document.getElementById('btn-retry');

  // Hide splash after configured timeout
  setTimeout(() => {
    if (splash) {
      splash.classList.add('fade-out');
      setTimeout(() => splash.remove(), 400);
    }
  }, 2200);

  // Navigation handlers
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      try {
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.history.back();
        }
      } catch (e) {
        window.history.back();
      }
    });
  }

  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      if (iframe) {
        iframe.src = iframe.src;
      }
    });
  }

  if (btnRetry) {
    btnRetry.addEventListener('click', () => {
      if (errorScreen) errorScreen.classList.add('hidden');
      if (iframe) iframe.src = iframe.src;
    });
  }
});
`;
}

export function generateRootBuildGradle(): string {
  return `// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.3.1'
        classpath 'com.google.gms:google-services:4.4.1'
    }
}

apply from: "variables.gradle"

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

tasks.register('clean', Delete) {
    delete rootProject.buildDir
}
`;
}

export function generateSettingsGradle(): string {
  return `include ':app'
rootProject.name = 'Course2App-Android'

// Capacitor Plugins include
apply from: 'capacitor.settings.gradle'
`;
}

export function generateVariablesGradle(): string {
  return `ext {
    minSdkVersion = 22
    compileSdkVersion = 34
    targetSdkVersion = 34
    androidxActivityVersion = '1.8.2'
    androidxAppCompatVersion = '1.6.1'
    androidxCoordinatorLayoutVersion = '1.2.0'
    androidxCoreVersion = '1.12.0'
    androidxFragmentVersion = '1.6.2'
    coreSplashScreenVersion = '1.0.1'
    androidxWebkitVersion = '1.10.0'
    junitVersion = '4.13.2'
    androidxJunitVersion = '1.1.5'
    androidxEspressoCoreVersion = '3.5.1'
}
`;
}

export function generateGradleProperties(): string {
  return `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
android.nonTransitiveRClass=true
`;
}

export function generateGradleWrapperProperties(): string {
  return `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`;
}

export function generateStylesXml(app: AppConfig): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Base Application Theme -->
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="colorPrimary">${app.primaryColor || '#1e3a8a'}</item>
        <item name="colorPrimaryDark">${app.primaryColor || '#1e3a8a'}</item>
        <item name="colorAccent">${app.secondaryColor || '#f59e0b'}</item>
        <item name="android:windowBackground">${app.backgroundColor || '#ffffff'}</item>
        <item name="android:windowLightStatusBar">true</item>
    </style>

    <style name="AppTheme.NoActionBar" parent="AppTheme">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
    </style>

    <style name="AppTheme.NoActionBarLaunch" parent="AppTheme.NoActionBar">
        <item name="android:windowBackground">@drawable/splash</item>
    </style>
</resources>
`;
}

export function generateFilePathsXml(): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <external-path name="my_images" path="." />
    <files-path name="internal_files" path="." />
    <cache-path name="cache_files" path="." />
</paths>
`;
}

export function generateProguardRules(): string {
  return `# Course2App Android Proguard / R8 Rules
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class com.getcapacitor.** { *; }
-dontwarn com.getcapacitor.**
`;
}

export function generateKeystoreScript(app: AppConfig): string {
  const pkgAlias = app.appName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `#!/usr/bin/env bash
# Generate a Production Android Release KeyStore for Google Play Console
echo "Generating Release KeyStore for ${app.appName}..."
keytool -genkey -v -keystore release.keystore -alias "${pkgAlias}" -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=${app.instituteName}, OU=Mobile, O=${app.instituteName}, L=City, S=State, C=IN"
echo ""
echo "KeyStore created successfully at: ./release.keystore"
echo "To convert to Base64 for GitHub Actions Secret (ANDROID_KEYSTORE_BASE64):"
echo "base64 -w 0 release.keystore > release_keystore_base64.txt"
`;
}

export function generateBuildLocalScript(): string {
  return `#!/usr/bin/env bash
set -e
echo "============================================="
echo " Course2App Engine - Local AAB Build Script  "
echo "============================================="

echo "[1/4] Installing dependencies..."
npm install

echo "[2/4] Syncing Capacitor Android project..."
npx cap sync android

echo "[3/4] Building Production Android App Bundle (.AAB)..."
cd android
chmod +x ./gradlew
./gradlew bundleRelease --stacktrace

echo "============================================="
echo "BUILD SUCCESSFUL!"
echo "Your production .AAB is located at:"
echo "android/app/build/outputs/bundle/release/app-release.aab"
echo "============================================="
`;
}

export async function createAndDownloadProjectZip(app: AppConfig): Promise<void> {
  const zip = new JSZip();

  // Root configuration
  zip.file('app-config.json', generateAppConfigJson(app));
  zip.file('capacitor.config.json', generateCapacitorConfig(app));
  zip.file(
    'README.md',
    `# ${app.appName} - Course2App Engine Android Template

Generated for: **${app.instituteName}**
Target URL: \`${app.courseUrl}\`
Package ID: \`${app.packageId}\`
Version: \`${app.versionName}\` (Build #${app.versionCode})

---

## 🚀 How to Build a Genuine Production .AAB for Google Play Console

Google Play Console requires a **compiled binary Android App Bundle (.AAB)** (usually 10-20 MB) built by the Android SDK and Gradle with compiled DEX bytecodes.

Choose one of two quick methods:

### Option 1: 1-Click Free Cloud Build (GitHub Actions) — Recommended (No Android Studio required)
1. Create a new GitHub repository (public or private).
2. Push this extracted folder to your repository:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit for ${app.appName}"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   \`\`\`
3. On GitHub, click the **Actions** tab.
4. Select **"Build Branded Android App (.AAB)"** and click **"Run workflow"**.
5. When finished (~2 minutes), download your production-ready, signed \`.aab\` bundle under **Artifacts**!

---

### Option 2: Local Build with Terminal or Android Studio
Ensure you have Node.js 18+ and Java JDK 17 installed:
\`\`\`bash
# 1. Run local automated build script
chmod +x scripts/build-local.sh
./scripts/build-local.sh

# Or manually:
npm install
npx cap sync android
cd android
./gradlew bundleRelease
\`\`\`
Your generated bundle will be located at:
\`android/app/build/outputs/bundle/release/app-release.aab\`

---

## 🔐 Generating Release Keystore
Run the included keystore script:
\`\`\`bash
chmod +x scripts/generate-keystore.sh
./scripts/generate-keystore.sh
\`\`\`
`
  );

  zip.file(
    'package.json',
    JSON.stringify(
      {
        name: app.packageId.replace(/\./g, '-'),
        version: app.versionName || '1.0.0',
        private: true,
        dependencies: {
          '@capacitor/android': '^6.0.0',
          '@capacitor/core': '^6.0.0',
          '@capacitor/splash-screen': '^6.0.0'
        },
        devDependencies: {
          '@capacitor/cli': '^6.0.0'
        },
        scripts: {
          build: 'echo "Web distribution ready in dist/"',
          sync: 'cap sync android',
          'open:android': 'cap open android',
          'build:aab': 'cap sync android && cd android && ./gradlew bundleRelease',
          'build:apk': 'cap sync android && cd android && ./gradlew assembleRelease'
        }
      },
      null,
      2
    )
  );

  // Scripts
  zip.file('scripts/inject-branding.js', INJECT_BRANDING_SCRIPT);
  zip.file('scripts/generate-keystore.sh', generateKeystoreScript(app));
  zip.file('scripts/build-local.sh', generateBuildLocalScript());

  // GitHub Workflows
  zip.file('.github/workflows/android-build.yml', GITHUB_ANDROID_BUILD_YML);
  zip.file('.github/workflows/deploy-pages.yml', GITHUB_DEPLOY_PAGES_YML);

  // Web distribution wrapper
  zip.file('dist/index.html', generateWebWrapperHtml(app));
  zip.file('dist/style.css', generateWebWrapperCss(app));
  zip.file('dist/app.js', generateWebWrapperJs());
  zip.file('dist/active-app-config.json', generateAppConfigJson(app));

  // Android Root Gradle Project Files
  zip.file('android/build.gradle', generateRootBuildGradle());
  zip.file('android/settings.gradle', generateSettingsGradle());
  zip.file('android/variables.gradle', generateVariablesGradle());
  zip.file('android/gradle.properties', generateGradleProperties());
  zip.file('android/gradle/wrapper/gradle-wrapper.properties', generateGradleWrapperProperties());

  // Android App Gradle & Manifest
  zip.file('android/app/build.gradle', generateAppBuildGradle(app));
  zip.file('android/app/proguard-rules.pro', generateProguardRules());
  zip.file('android/app/src/main/AndroidManifest.xml', generateAndroidManifest(app));
  zip.file(`android/app/src/main/java/${app.packageId.replace(/\./g, '/')}/MainActivity.java`, generateMainActivityJava(app));

  // Android XML Resources
  zip.file(
    'android/app/src/main/res/values/strings.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${app.appName}</string>
    <string name="title_activity_main">${app.appName}</string>
    <string name="package_name">${app.packageId}</string>
    <string name="custom_url_scheme">${app.packageId.replace(/[^a-z0-9]/g, '')}</string>
</resources>`
  );

  zip.file(
    'android/app/src/main/res/values/colors.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">${app.primaryColor || '#1e3a8a'}</color>
    <color name="colorPrimaryDark">${app.primaryColor || '#1e3a8a'}</color>
    <color name="colorAccent">${app.secondaryColor || '#f59e0b'}</color>
    <color name="windowBackground">${app.backgroundColor || '#ffffff'}</color>
</resources>`
  );

  zip.file('android/app/src/main/res/values/styles.xml', generateStylesXml(app));
  zip.file('android/app/src/main/res/xml/file_paths.xml', generateFilePathsXml());

  // Executable direct build scripts
  zip.file(
    'build-aab.sh',
    `#!/usr/bin/env bash
# ==============================================================================
# Course2App Engine - Build Genuine Release AAB (.aab) with Gradle
# Target: Android 14 (Target SDK 34)
# ==============================================================================
set -e
echo "🚀 Building genuine Android App Bundle for: ${app.appName} (${app.packageId})"

# 1. Check dependencies
if ! command -v java &> /dev/null; then
    echo "❌ Error: Java JDK 17+ is required. Please install Java 17."
    exit 1
fi

echo "📦 Syncing Capacitor Android assets..."
npx cap sync android

echo "🔨 Running Gradle bundleRelease..."
cd android
chmod +x ./gradlew
./gradlew bundleRelease --stacktrace --no-daemon

echo "✅ SUCCESS! Genuine Android App Bundle (.aab) created at:"
echo "👉 $(pwd)/app/build/outputs/bundle/release/app-release.aab"
`
  );

  zip.file(
    'build-apk.sh',
    `#!/usr/bin/env bash
# ==============================================================================
# Course2App Engine - Build Genuine Test APK with Gradle
# Target: Android 14 (Target SDK 34)
# ==============================================================================
set -e
echo "🚀 Building genuine Android APK for: ${app.appName} (${app.packageId})"

if ! command -v java &> /dev/null; then
    echo "❌ Error: Java JDK 17+ is required. Please install Java 17."
    exit 1
fi

echo "📦 Syncing Capacitor Android assets..."
npx cap sync android

echo "🔨 Running Gradle assembleRelease..."
cd android
chmod +x ./gradlew
./gradlew assembleRelease --stacktrace --no-daemon

echo "✅ SUCCESS! Genuine Android APK created at:"
echo "👉 $(pwd)/app/build/outputs/apk/release/app-release.apk"
`
  );

  const content = await zip.generateAsync({ type: 'blob' });
  const fileName = `${app.packageId.replace(/[^a-z0-9]/g, '_')}_android_project.zip`;
  saveAs(content, fileName);
}

/**
 * Real Build Pipeline Client Service:
 * Initiates the build on the backend build engine
 */
export async function startServerBuild(
  app: AppConfig,
  buildType: 'aab' | 'apk' | 'both' = 'aab'
): Promise<{ success: boolean; buildId?: string; status?: string; error?: string }> {
  try {
    const res = await fetch('/api/build/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appConfig: app, buildType })
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Could not connect to build server.'
    };
  }
}

/**
 * Real Build Pipeline Client Service:
 * Polls the current build status and real-time logs
 */
export async function getBuildStatus(buildId: string): Promise<any> {
  try {
    const res = await fetch(`/api/build/status/${buildId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.build;
  } catch (e) {
    return null;
  }
}

/**
 * Real Build Pipeline Client Service:
 * Downloads the verified genuine artifact from the backend
 */
export function getBuildDownloadUrl(buildId: string, type: 'aab' | 'apk'): string {
  return `/api/build/download/${buildId}/${type}`;
}

