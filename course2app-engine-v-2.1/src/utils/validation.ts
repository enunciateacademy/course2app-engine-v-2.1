import { AppConfig, ValidationCheck } from '../types';

export function sanitizePackageName(rawName: string): string {
  if (!rawName) return 'com.course2app.app';
  // Remove non-alphanumeric, convert to lowercase
  const clean = rawName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
  
  const finalSegment = clean.length > 0 ? clean : 'app';
  return `com.course2app.${finalSegment}`;
}

export function validatePackageName(pkg: string): { valid: boolean; error?: string } {
  if (!pkg) {
    return { valid: false, error: 'Android Package Name cannot be empty.' };
  }

  // Java/Android package regex: dot-separated identifiers starting with letters
  const regex = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/;
  if (!regex.test(pkg)) {
    return {
      valid: false,
      error: 'Package name must have at least 2 segments separated by dots (e.g., com.institute.app) and contain only lowercase letters, numbers, or underscores.'
    };
  }

  // Check reserved keywords
  const reserved = [
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const',
    'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float',
    'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native',
    'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
    'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void',
    'volatile', 'while', 'true', 'false', 'null'
  ];

  const segments = pkg.split('.');
  for (const seg of segments) {
    if (reserved.includes(seg)) {
      return { valid: false, error: `Package segment "${seg}" is a reserved Java keyword.` };
    }
  }

  return { valid: true };
}

export function validateCourseUrl(url: string): { valid: boolean; error?: string } {
  if (!url || !url.trim()) {
    return { valid: false, error: 'Course Website URL is required.' };
  }

  const trimmed = url.trim();

  // Dangerous schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('file:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('blob:')
  ) {
    return { valid: false, error: 'Invalid URL scheme. Please enter a valid website link.' };
  }

  if (!lower.startsWith('https://')) {
    return { valid: false, error: 'Course URL must start with secure HTTPS (e.g. https://...)' };
  }

  try {
    const parsed = new URL(trimmed);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return { valid: false, error: 'Please enter a complete domain name (e.g. academy.graphy.com).' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Please enter a valid, complete web URL.' };
  }
}

export function validateFileImage(
  file: File,
  type: 'logo' | 'launcher' | 'notification' | 'splash' | 'onboarding'
): Promise<{ valid: boolean; error?: string; width?: number; height?: number; dataUrl?: string }> {
  return new Promise((resolve) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      resolve({
        valid: false,
        error: `Unsupported file type (${file.type}). Please upload a PNG, JPG, WebP, or GIF image.`
      });
      return;
    }

    // Size limits based on Graphy & Android specs
    let maxSizeBytes = 2 * 1024 * 1024; // 2MB default
    if (type === 'launcher' || type === 'notification') {
      maxSizeBytes = 1 * 1024 * 1024; // 1MB
    } else if (type === 'splash' && file.type === 'image/gif') {
      maxSizeBytes = 5 * 1024 * 1024; // 5MB for GIF
    }

    if (file.size > maxSizeBytes) {
      const maxMb = maxSizeBytes / (1024 * 1024);
      resolve({
        valid: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum allowed limit of ${maxMb} MB.`
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        resolve({
          valid: true,
          width: img.width,
          height: img.height,
          dataUrl
        });
      };
      img.onerror = () => {
        resolve({ valid: false, error: 'Failed to read image data.' });
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      resolve({ valid: false, error: 'Could not read file.' });
    };
    reader.readAsDataURL(file);
  });
}

export function runFullAppValidation(app: AppConfig): ValidationCheck[] {
  const checks: ValidationCheck[] = [];

  // 1. Course URL
  const urlCheck = validateCourseUrl(app.courseUrl);
  checks.push({
    id: 'courseUrl',
    label: 'Course Website URL',
    isValid: urlCheck.valid,
    message: urlCheck.error || app.courseUrl
  });

  // 2. Institute Name
  const hasInstitute = Boolean(app.instituteName && app.instituteName.trim().length > 0);
  checks.push({
    id: 'instituteName',
    label: 'Institute Name',
    isValid: hasInstitute,
    message: hasInstitute ? app.instituteName : 'Institute name is required'
  });

  // 3. App Name
  const hasAppName = Boolean(app.appName && app.appName.trim().length > 0);
  checks.push({
    id: 'appName',
    label: 'App Name',
    isValid: hasAppName,
    message: hasAppName ? app.appName : 'App name displayed on phone is required'
  });

  // 4. Branding & App Icon
  const hasLauncher = Boolean(app.launcherIconUrl || app.logoUrl);
  checks.push({
    id: 'appIcon',
    label: 'App Icon / Logo',
    isValid: hasLauncher,
    isWarning: !app.launcherIconUrl && Boolean(app.logoUrl),
    message: app.launcherIconUrl
      ? 'Custom 1024x1024 App Icon configured'
      : app.logoUrl
      ? 'Using Logo as default launcher icon'
      : 'Auto-generating branded lettermark icon'
  });

  // 5. Package Name
  const pkgCheck = validatePackageName(app.packageId);
  checks.push({
    id: 'packageId',
    label: 'Android Package Name',
    isValid: pkgCheck.valid,
    message: pkgCheck.error || app.packageId
  });

  // 6. Versioning
  const validVersion = Boolean(app.versionName && app.versionCode >= 1);
  checks.push({
    id: 'version',
    label: 'App Version & Build Number',
    isValid: validVersion,
    message: `v${app.versionName || '1.0.0'} (Build #${app.versionCode || 1})`
  });

  // 7. Branding Colors
  checks.push({
    id: 'branding',
    label: 'Brand Colors & Theme',
    isValid: Boolean(app.primaryColor),
    message: `Primary: ${app.primaryColor}`
  });

  // 8. Splash Configuration
  checks.push({
    id: 'splash',
    label: 'Splash Screen',
    isValid: true,
    message: app.splashType === 'custom' && app.splashImageUrl ? 'Custom splash image set' : 'Auto-generated splash with logo & brand color'
  });

  return checks;
}
