/**
 * scripts/inject-branding.js
 * Automatically runs during GitHub Actions, server builds, or local CLI
 * Reads the specified app-config.json and updates Android resources,
 * package identifiers, strings.xml, colors.xml, and web assets.
 */
const fs = require('fs');
const path = require('path');

const configArg = process.argv[2] || 'app-config.json';
let configPath = path.resolve(configArg);

if (!fs.existsSync(configPath)) {
  configPath = path.resolve('configs', `${configArg}.json`);
}

if (!fs.existsSync(configPath)) {
  // Try finding any app-config.json or matching id
  const fallback = path.resolve('app-config.json');
  if (fs.existsSync(fallback)) {
    configPath = fallback;
  } else {
    console.warn(`[Warning] App config not found at ${configPath}. Creating default config.`);
    configPath = path.resolve('app-config.json');
    fs.writeFileSync(configPath, JSON.stringify({
      packageId: 'com.course2app.enunciateacademy',
      appName: 'Enunciate Academy',
      instituteName: 'Enunciate Academy',
      courseUrl: 'https://academy.graphy.com',
      primaryColor: '#1e3a8a',
      secondaryColor: '#f59e0b',
      backgroundColor: '#ffffff',
      versionName: '1.0.0',
      versionCode: 1,
      splashDurationSeconds: 2
    }, null, 2));
  }
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
console.log(`[Course2App Engine] Applying branding for: "${config.appName}" (${config.packageId})`);

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
  const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${config.appName}</string>
    <string name="title_activity_main">${config.appName}</string>
    <string name="package_name">${config.packageId}</string>
    <string name="custom_url_scheme">${config.packageId.replace(/[^a-z0-9]/g, '')}</string>
</resources>`;
  fs.writeFileSync(stringsPath, stringsXml);
}

// 3. Update Android colors.xml
const colorsPath = path.resolve('android/app/src/main/res/values/colors.xml');
if (fs.existsSync(colorsPath)) {
  const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">${config.primaryColor || '#1e3a8a'}</color>
    <color name="colorPrimaryDark">${config.primaryColor || '#1e3a8a'}</color>
    <color name="colorAccent">${config.secondaryColor || '#f59e0b'}</color>
    <color name="windowBackground">${config.backgroundColor || '#ffffff'}</color>
</resources>`;
  fs.writeFileSync(colorsPath, colorsXml);
}

// 4. Write active-app-config.json
const runtimeConfigPath = path.resolve('dist/active-app-config.json');
try {
  fs.mkdirSync(path.dirname(runtimeConfigPath), { recursive: true });
  fs.writeFileSync(runtimeConfigPath, JSON.stringify(config, null, 2));
} catch (e) {
  // Dist might not exist yet
}

console.log('✓ Android resources and Capacitor configs updated successfully.');
