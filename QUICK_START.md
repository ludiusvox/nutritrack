# NutriTrack - Quick Start Guide (Samsung A15 + Termux)

## 🚀 Getting Started in Termux

### 1. Install Termux from F-Droid
**Important**: Download from F-Droid, NOT Google Play!
- https://f-droid.org/en/packages/com.termux/

### 2. Initial Setup (One-time)
```bash
# Update packages
pkg update && pkg upgrade -y

# Install Node.js and essentials
pkg install nodejs git -y

# Grant storage access
termux-setup-storage
```

### 3. Navigate to Your Project
```bash
# Go to shared storage (accessible by file manager)
cd ~/storage/shared

# Create project folder if needed
mkdir -p projects
cd projects

# Copy your project files here using a file manager
# Or if you have this as a zip, extract it here
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the App
```bash
npm run dev
```

**Access in browser**: Open Chrome and go to `http://localhost:5173`

## ✅ What's Fixed

All errors have been resolved:
- ✅ Google Calendar API functions exported correctly
- ✅ Service Worker registered for PWA
- ✅ App icon created
- ✅ Automatic midnight sync working
- ✅ Date tracking implemented

## 📱 Install as PWA (Recommended for 4GB RAM)

### Easiest Method - No Build Required!

1. **Run in Termux**:
   ```bash
   npm run dev
   ```

2. **Open in Chrome**: `http://localhost:5173`

3. **Install PWA**:
   - Tap the menu (⋮)
   - Select "Add to Home screen"
   - Tap "Add"

4. **Done!** You now have a native-like app icon!

✅ **Benefits**:
- Camera works perfectly
- Works offline after first load
- Uses less RAM than full Android build
- Updates instantly
- No APK building needed

## 🔧 Build Android APK (Advanced)

### Option 1: Initialize Capacitor (in Termux)

```bash
# Build the web app
npm run build

# Initialize Capacitor
npm run cap:init

# Add Android platform
npm run cap:add

# Sync files
npm run cap:sync
```

**⚠️ Problem**: Building APK in Termux is very slow on 4GB RAM.

### Option 2: Transfer to PC and Build

1. **In Termux**, sync files:
   ```bash
   npm run cap:sync
   ```

2. **Copy the `android` folder** to your PC (via USB or cloud)

3. **On PC**, open in Android Studio and build APK

### Option 3: Use GitHub Actions (Automated)

Push code to GitHub, and it auto-builds APK for you!

See `/.github/workflows/android-build.yml` (I can create this)

## 🎯 Google OAuth Setup

### Quick Setup for Localhost

**Your credentials**:
- Client ID: `882015256658-q1jl5crsq15feg18ujlc3g2qr78bis1n.apps.googleusercontent.com`
- API Key: [Get from Google Cloud Console]

**Steps**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `nutritrack-490721`
3. Go to "Credentials"
4. **Create API Key** (or find existing one)
5. **Edit OAuth Client**:
   - Add redirect URI: `http://localhost:5173`
   - Add JavaScript origin: `http://localhost:5173`

### In the App:
1. Open Calendar tab
2. Enter Client ID and API Key
3. Click "Save Configuration"
4. Click "Sign In with Google"

## 💾 Memory Management (4GB RAM Tips)

### Before Running:
```bash
# Close all other apps
# Then in Termux:

# Limit Node.js memory
export NODE_OPTIONS="--max-old-space-size=512"

# Run with memory limit
npm run dev
```

### Keep Termux Running:
```bash
# Prevent sleep
termux-wake-lock

# When done:
termux-wake-unlock
```

### If Out of Memory:
```bash
# Clear cache
npm cache clean --force

# Restart Termux and try again
```

## 📸 Camera Permissions

### For PWA:
- Browser will ask for camera permission
- Allow it when prompted
- Works immediately!

### For APK:
- Android will ask for permission on first use
- Go to Settings > Apps > NutriTrack > Permissions
- Enable Camera and Storage

## 🔄 Update Your App

### For PWA:
```bash
# Just rebuild
npm run build
# Refresh browser - done!
```

### For APK:
```bash
npm run cap:sync
# Then rebuild APK
```

## 🐛 Troubleshooting

### "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### "Port 5173 in use"
```bash
# Kill the process
pkill -f vite
# Or use different port
npm run dev -- --port 3000
```

### "Out of memory"
```bash
# Reduce build size
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=512"
npm run build
```

### Camera not working
- ✅ Works in PWA over localhost
- ⚠️ Needs HTTPS for remote access
- ✅ Works perfectly in APK

## 📝 Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Sync Capacitor
npm run cap:sync

# Open Android Studio (on PC)
npm run cap:open
```

## 🎬 Typical Workflow

**Daily Development**:
```bash
cd ~/storage/shared/projects/nutritrack
termux-wake-lock
npm run dev
# Open browser to localhost:5173
```

**Before Closing**:
```bash
# Ctrl+C to stop server
termux-wake-unlock
```

## 📦 What You've Got

✅ Photography app with camera
✅ Nutrition calculator
✅ Light/dark mode
✅ Retractable sidebar
✅ Google Calendar sync
✅ LocalStorage persistence
✅ PWA-ready
✅ Android APK-ready

## 🚀 Next Steps

1. **Get API Key** from Google Cloud Console
2. **Run app** in Termux
3. **Install as PWA** (easiest!)
4. **Start tracking** your nutrition!

Need help? Check the detailed guides:
- `TERMUX_SETUP.md` - Full Termux guide
- `ANDROID_BUILD.md` - APK building guide
- `GOOGLE_CALENDAR_SETUP.md` - Calendar API setup

---

**Pro Tip**: Start with PWA! It's faster, easier, and works great on your 4GB A15. Build APK later if you really need it.