export const GITHUB_DEPLOY_PAGES_YML = `name: Deploy Course2App Engine to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Web Application
        run: npm run build
        env:
          VITE_BASE_PATH: '/course2app-engine/'

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

export const GITHUB_ANDROID_BUILD_YML = `name: Build Branded Android App (.AAB)

on:
  workflow_dispatch:
    inputs:
      app_config_id:
        description: 'App ID or Package Name to Build'
        required: true
        default: 'com.course2app.enunciateacademy'
      build_type:
        description: 'Target Output (AAB for Play Store, APK for Direct Testing)'
        required: true
        default: 'aab'
        type: choice
        options:
          - 'aab'
          - 'apk'
          - 'both'

jobs:
  build-android:
    runs-on: ubuntu-latest
    name: Build Android App Bundle / APK

    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Set up Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Inject App Configuration & Branding
        run: |
          echo "Injecting configuration for \${{ github.event.inputs.app_config_id }}..."
          node scripts/inject-branding.js \${{ github.event.inputs.app_config_id }}

      - name: Sync Capacitor Android Project
        run: |
          npx cap sync android

      - name: Decode Android Release Keystore (if configured)
        if: env.ANDROID_KEYSTORE_BASE64 != ''
        env:
          ANDROID_KEYSTORE_BASE64: \${{ secrets.ANDROID_KEYSTORE_BASE64 }}
        run: |
          echo "$ANDROID_KEYSTORE_BASE64" | base64 --decode > android/app/release.keystore

      - name: Build Android Bundle (AAB)
        if: github.event.inputs.build_type == 'aab' || github.event.inputs.build_type == 'both'
        working-directory: android
        run: |
          chmod +x ./gradlew
          ./gradlew bundleRelease --stacktrace

      - name: Build Android Package (APK)
        if: github.event.inputs.build_type == 'apk' || github.event.inputs.build_type == 'both'
        working-directory: android
        run: |
          chmod +x ./gradlew
          ./gradlew assembleRelease --stacktrace

      - name: Sign Android App Bundle (.AAB)
        if: (github.event.inputs.build_type == 'aab' || github.event.inputs.build_type == 'both') && env.KEYSTORE_PASSWORD != ''
        uses: r0adkll/sign-android-release@v1
        id: sign_aab
        with:
          releaseDirectory: android/app/build/outputs/bundle/release
          signingKey: \${{ secrets.ANDROID_KEYSTORE_BASE64 }}
          keyStorePassword: \${{ secrets.KEYSTORE_PASSWORD }}
          alias: \${{ secrets.KEY_ALIAS }}
          keyPassword: \${{ secrets.KEY_PASSWORD }}
        env:
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD }}

      - name: Upload Android App Bundle (.AAB) Artifact
        if: github.event.inputs.build_type == 'aab' || github.event.inputs.build_type == 'both'
        uses: actions/upload-artifact@v4
        with:
          name: branded-android-app-aab
          path: android/app/build/outputs/bundle/release/*.aab
          retention-days: 30

      - name: Upload Android APK Artifact
        if: github.event.inputs.build_type == 'apk' || github.event.inputs.build_type == 'both'
        uses: actions/upload-artifact@v4
        with:
          name: branded-android-app-apk
          path: android/app/build/outputs/apk/release/*.apk
          retention-days: 30
`;

export const INJECT_BRANDING_SCRIPT = `/**
 * scripts/inject-branding.js
 * Automatically runs during GitHub Actions or local CLI build
 * Reads the specified app-config.json and updates Android resources,
 * package identifiers, strings.xml, colors.xml, and web assets.
 */
const fs = require('fs');
const path = require('path');

const configArg = process.argv[2] || 'app-config.json';
let configPath = path.resolve(configArg);

if (!fs.existsSync(configPath)) {
  configPath = path.resolve('configs', \`\${configArg}.json\`);
}

if (!fs.existsSync(configPath)) {
  console.error(\`[Error] App configuration file not found at: \${configPath}\`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
console.log(\`Applying branding for: \${config.instituteName} (\${config.packageId})\`);

// 1. Update capacitor.config.json
const capConfigPath = path.resolve('capacitor.config.json');
const capConfig = {
  appId: config.packageId,
  appName: config.appName,
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: (config.splashDurationSeconds || 2) * 1000,
      backgroundColor: config.primaryColor || '#1e3a8a',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      spinnerColor: '#ffffff'
    }
  }
};
fs.writeFileSync(capConfigPath, JSON.stringify(capConfig, null, 2));

// 2. Update Android strings.xml
const stringsPath = path.resolve('android/app/src/main/res/values/strings.xml');
if (fs.existsSync(stringsPath)) {
  const stringsXml = \`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">\${config.appName}</string>
    <string name="title_activity_main">\${config.appName}</string>
    <string name="package_name">\${config.packageId}</string>
    <string name="custom_url_scheme">\${config.packageId.replace(/[^a-z0-9]/g, '')}</string>
</resources>\`;
  fs.writeFileSync(stringsPath, stringsXml);
}

// 3. Update Android colors.xml
const colorsPath = path.resolve('android/app/src/main/res/values/colors.xml');
if (fs.existsSync(colorsPath)) {
  const colorsXml = \`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">\${config.primaryColor || '#1e3a8a'}</color>
    <color name="colorPrimaryDark">\${config.primaryColor || '#1e3a8a'}</color>
    <color name="colorAccent">\${config.secondaryColor || '#f59e0b'}</color>
    <color name="windowBackground">\${config.backgroundColor || '#ffffff'}</color>
</resources>\`;
  fs.writeFileSync(colorsPath, colorsXml);
}

// 4. Write active-app-config.json for webview runtime
const runtimeConfigPath = path.resolve('dist/active-app-config.json');
fs.mkdirSync(path.dirname(runtimeConfigPath), { recursive: true });
fs.writeFileSync(runtimeConfigPath, JSON.stringify(config, null, 2));

console.log('✓ Branding and configuration successfully injected!');
`;
