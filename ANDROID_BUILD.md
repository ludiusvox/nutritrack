# Packaging NutriTrack as Android App

## Recommended: Using Capacitor

Capacitor is the modern way to turn web apps into native Android apps.

### 1. Install Capacitor (in Termux)

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

### 2. Initialize Capacitor

```bash
npx cap init
```

When prompted:
- **App name**: NutriTrack
- **App ID**: com.nutritrack.app
- **Web directory**: dist

### 3. Update package.json

Add build script if not present:
```json
{
  "scripts": {
    "build": "vite build",
    "cap:sync": "npm run build && npx cap sync"
  }
}
```

### 4. Add Android Platform

```bash
npx cap add android
```

### 5. Configure Capacitor

Create/update `capacitor.config.json`:
```json
{
  "appId": "com.nutritrack.app",
  "appName": "NutriTrack",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000
    },
    "Camera": {
      "permissions": ["camera", "photos"]
    }
  }
}
```

### 6. Build the Web App

```bash
npm run build
```

### 7. Sync with Android

```bash
npx cap sync android
```

### 8. Install Android Build Tools (on PC)

⚠️ **Note**: Building APKs in Termux is very difficult. You have two options:

#### Option A: Build on PC (Recommended)

1. Install [Android Studio](https://developer.android.com/studio) on PC
2. Transfer `android` folder from phone to PC
3. Open in Android Studio
4. Build > Generate Signed Bundle / APK
5. Transfer APK back to phone

#### Option B: Use Online Build Service

1. **Capacitor Cloud**: https://capacitorjs.com/cloud
2. **Expo Application Services**: https://expo.dev/eas
3. **GitHub Actions** (free): Auto-build on push

#### Option C: Termux Build (Advanced, Not Recommended)

```bash
# Install required packages
pkg install apt apksigner

# Install Android SDK (very large!)
pkg install android-sdk

# Set environment variables
export ANDROID_HOME=$PREFIX/share/android-sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# This is complex and may fail on 4GB RAM
cd android
./gradlew assembleDebug
```

## Alternative: Progressive Web App (PWA)

Much easier and works great on Android!

### 1. Create PWA Manifest

Create `public/manifest.json`:
```json
{
  "name": "NutriTrack",
  "short_name": "NutriTrack",
  "description": "Photography & Nutrition Tracker",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. Add to index.html

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#000000">
<meta name="mobile-web-app-capable" content="yes">
```

### 3. Add Service Worker

Create `public/sw.js`:
```javascript
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  // Basic caching strategy
});
```

### 4. Install PWA

1. Open app in Chrome on your phone
2. Menu > "Add to Home Screen"
3. Acts like native app!

## Google OAuth Configuration for Android App

### Update Google Cloud Console

Add these to authorized redirect URIs:
- `com.nutritrack.app:/oauth2redirect`
- `http://localhost:5173` (for testing)

### Update OAuth Code

If using Capacitor, install plugin:
```bash
npm install @codetrix-studio/capacitor-google-auth
```

## Permissions Required

In `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## My Recommendation for Your Samsung A15

**Start with PWA:**
1. ✅ No build tools needed
2. ✅ Works in Termux
3. ✅ Installs like native app
4. ✅ Camera access works
5. ✅ Much smaller file size
6. ✅ Easy updates

**Later, if needed, build APK:**
- Use GitHub Actions (free)
- Or use a PC with Android Studio

## Automated GitHub Actions Build

If you push to GitHub, I can create a workflow that auto-builds APKs for you!

Would you like me to set up:
- [ ] PWA configuration
- [ ] Capacitor configuration
- [ ] GitHub Actions build workflow
