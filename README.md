# 📸 NutriTrack - Photography & Nutrition Tracking App

> Complete nutrition tracking app with camera, BMR calculator, and Google Calendar sync. Built for Samsung A15 with Termux support.

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-success)](https://web.dev/progressive-web-apps/)
[![Android](https://img.shields.io/badge/Android-APK-green)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)]()

---

## ✨ Features

### 🎯 Four Powerful Tools

| Tab | Purpose | Key Feature |
|-----|---------|-------------|
| 📸 **Camera** | Capture meal photos | Live preview, instant capture |
| 🧮 **Calculator** | Track macros | Auto calorie calculation |
| 🎯 **BMR Calc** | Set daily targets | Mifflin St. Jeor equation |
| 📅 **Calendar** | Sync to Google | Automatic midnight upload |

### 🔥 Core Features

- ✅ **Photography Integration** - Take photos of every meal
- ✅ **Macro Tracking** - Fat, carbs, protein in grams
- ✅ **Auto Calorie Calculation** - Standard formula (9/4/4 cal/gram)
- ✅ **BMR Calculator** - Gold standard Mifflin St. Jeor equation
- ✅ **Google Calendar API** - OAuth 2.0 integration
- ✅ **Automatic Midnight Sync** - Daily totals uploaded automatically
- ✅ **Daily Reset** - All entries cleared at midnight (fresh start daily)
- ✅ **Retractable Sidebar** - Daily summary & today's entries
- ✅ **Light/Dark Mode** - Easy on the eyes
- ✅ **PWA Support** - Install like a native app
- ✅ **Offline Storage** - LocalStorage persistence
- ✅ **Responsive Design** - Mobile, tablet, desktop

---

## 🚀 Quick Start

### For Termux Users (Samsung A15)

```bash
# 1. Install Termux from F-Droid
# Download: https://f-droid.org/en/packages/com.termux/

# 2. Update & Install Node.js
pkg update && pkg upgrade -y
pkg install nodejs git -y
termux-setup-storage

# 3. Navigate to project
cd ~/storage/shared/projects/nutritrack

# 4. Install dependencies
npm install

# 5. Run the app
npm run dev

# 6. Open Chrome browser
# Go to: http://localhost:5173
```

### For Desktop Users

```bash
# 1. Clone repository
git clone <your-repo-url>
cd nutritrack

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open browser
# Go to: http://localhost:5173
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| **[QUICK_START.md](QUICK_START.md)** | ⭐ **Start here!** Complete setup guide |
| **[FEATURE_OVERVIEW.md](FEATURE_OVERVIEW.md)** | Detailed feature documentation |
| **[BMR_CALCULATOR_GUIDE.md](BMR_CALCULATOR_GUIDE.md)** | BMR calculator science & usage |
| **[AUTO_SYNC_FEATURE.md](AUTO_SYNC_FEATURE.md)** | Automatic midnight sync explained |
| **[TERMUX_SETUP.md](TERMUX_SETUP.md)** | Full Termux installation guide |
| **[ANDROID_BUILD.md](ANDROID_BUILD.md)** | APK building instructions |
| **[GOOGLE_CALENDAR_SETUP.md](GOOGLE_CALENDAR_SETUP.md)** | Calendar API configuration |

---

## 🧮 BMR Calculator

Uses the **Mifflin St. Jeor equation** - the gold standard for calorie calculation.

### Formula

**Men:** `BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5`  
**Women:** `BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161`

### Activity Multipliers

| Level | Multiplier | Description |
|-------|------------|-------------|
| Sedentary | 1.2 | Little/no exercise |
| Light | 1.375 | 1-3 days/week |
| Moderate | 1.55 | 3-5 days/week |
| Very Active | 1.725 | 6-7 days/week |
| Extra Active | 1.9 | Daily intense exercise |

### Goal Adjustments

- **Lose Weight**: -500 cal/day (≈1 lb/week)
- **Maintain**: No adjustment (TDEE)
- **Gain Weight**: +300 cal/day (lean gain)

---

## 📅 Google Calendar Integration

### Setup Steps

1. **Get Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Project: `nutritrack-490721`
   - Create API Key + OAuth Client ID

2. **Configure App**:
   - Open Calendar tab
   - Enter Client ID & API Key
   - Click "Save Configuration"
   - Click "Sign In with Google"

3. **Enable Auto-Sync** (Optional):
   - Toggle "Automatic Midnight Sync" ON
   - Daily totals upload at midnight
   - App must be running

### Redirect URIs

Add these to Google Cloud Console:
- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `com.nutritrack.app:/oauth2redirect` (for APK)

---

## 📱 Installation Options

### Option 1: PWA (Recommended for 4GB RAM)

**Advantages**:
- ✅ No building required
- ✅ Uses less memory
- ✅ Updates instantly
- ✅ Camera works perfectly
- ✅ Works offline

**How to Install**:
1. Run `npm run dev`
2. Open in Chrome
3. Menu (⋮) → "Add to Home screen"
4. Done!

### Option 2: Android APK

**Advantages**:
- ✅ Full native experience
- ✅ Better performance
- ✅ Can distribute via file

**How to Build**:
```bash
npm run build        # Build web app
npm run cap:sync     # Sync to Capacitor
# Transfer to PC and build in Android Studio
```

See [ANDROID_BUILD.md](ANDROID_BUILD.md) for details.

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool

### Components
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **next-themes** - Dark mode
- **Sonner** - Toast notifications

### APIs & Storage
- **Google Calendar API** - Calendar integration
- **Google Identity Services** - OAuth 2.0
- **LocalStorage** - Client-side persistence
- **MediaDevices API** - Camera access

### Build & Deploy
- **Capacitor** - Native app wrapper
- **Service Worker** - PWA offline support
- **Vite** - Fast HMR & builds

---

## 📂 Project Structure

```
nutritrack/
├── public/
│   ├── icon.svg              # App icon
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── camera.tsx
│   │   │   ├── calculator.tsx
│   │   │   ├── bmr-calculator.tsx      ⭐ NEW
│   │   │   ├── nutrition-sidebar.tsx
│   │   │   ├── google-calendar-setup.tsx
│   │   │   └── ui/                      # Radix UI components
│   │   ├── pages/
│   │   │   └── home.tsx                 # Main page
│   │   ├── types/
│   │   │   └── nutrition.ts
│   │   ├── utils/
│   │   │   ├── google-calendar.ts
│   │   │   └── date-helpers.ts          ⭐ NEW
│   │   ├── App.tsx
│   │   ├── providers.tsx
│   │   └── routes.ts
│   ├── styles/
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   └── theme.css
│   └── main.tsx
├── index.html
├── capacitor.config.json
├── package.json
├── vite.config.ts
└── Documentation/                        # All .md files
```

---

## 🎯 Usage Workflow

### 1. Set Your Targets (BMR Calc Tab)
```
Input: Age, gender, height, weight, goal, activity
Output: Target calories & macros
Example: 2,400 cal/day (180g P, 270g C, 75g F)
```

### 2. Track Meals (Camera + Calculator)
```
Breakfast:
  1. Camera → Take photo
  2. Calculator → Enter macros
  3. Sidebar → Check progress (312/2,400 cal)

Repeat for lunch, snacks, dinner...
```

### 3. Review Progress (Sidebar)
```
End of day:
  - Total: 2,380 cal (99% of target)
  - Protein: 175g (97%)
  - Carbs: 268g (99%)
  - Fat: 73g (97%)
```

### 4. Automatic Sync (Midnight)
```
App running in background:
  → 12:00 AM hits
  → Data syncs to Google Calendar
  → Daily totals reset to 0
  → Ready for new day!
```

---

## 💾 Data Storage

### LocalStorage Keys

```javascript
"nutrition-entries"         // All entries (array)
"google-calendar-config"    // API credentials (object)
"auto-sync-enabled"         // Auto-sync preference (boolean)
"last-calendar-sync"        // Last sync date (string)
"theme"                     // Light/dark mode (string)
```

### Entry Structure

```typescript
{
  id: "1712345678901",
  name: "Grilled Chicken",
  fat: 5,              // grams
  carbs: 0,            // grams
  protein: 35,         // grams
  calories: 180,       // auto-calculated
  photo: "data:image/...",
  timestamp: 1712345678901,
  date: "2026-04-08"   // YYYY-MM-DD
}
```

---

## 🔐 Privacy & Security

### ✅ What We Do
- Store all data locally on your device
- Use OAuth 2.0 for Google Calendar
- No external servers or databases
- No analytics or tracking
- No ads

### ❌ What We Don't Do
- Don't send data to third parties
- Don't collect personal information
- Don't track your activity
- Don't require account creation

### 🔒 Your Control
- You own your data
- Can delete anytime (clear localStorage)
- Can revoke Google Calendar access
- Can export data from localStorage

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Capacitor commands
npm run cap:init     # Initialize Capacitor
npm run cap:add      # Add Android platform
npm run cap:sync     # Sync web → native
npm run cap:open     # Open Android Studio
```

### Environment Requirements

- **Node.js**: 18+ recommended
- **npm**: 9+ recommended
- **Browser**: Chrome/Edge for best PWA support
- **Android Studio**: For APK builds (optional)

---

## 📊 Key Metrics Tracked

1. **Daily Calories** - Total caloric intake
2. **Macronutrients** - Fat, carbs, protein (grams)
3. **Meal Photos** - Visual food diary
4. **BMR/TDEE** - Metabolic rate calculations
5. **Weekly Trends** - Via Google Calendar export
6. **Goal Progress** - Target vs actual comparison

---

## 🤝 Contributing

This is a personal project, but feel free to:
- Fork and customize
- Report issues
- Suggest features
- Share improvements

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 🙏 Credits

### APIs & Libraries
- **Google Calendar API** - Calendar integration
- **Bodybuilding.com** - Mifflin St. Jeor equation reference
- **Radix UI** - Accessible components
- **Tailwind CSS** - Styling framework

### Resources
- Mifflin St. Jeor equation research
- Nutrition science guidelines
- PWA best practices

---

## 📞 Support

### Need Help?

1. **Check Documentation**:
   - Start with [QUICK_START.md](QUICK_START.md)
   - Review [FEATURE_OVERVIEW.md](FEATURE_OVERVIEW.md)

2. **Common Issues**:
   - See troubleshooting in [QUICK_START.md](QUICK_START.md)
   - Check [FIXES_APPLIED.md](FIXES_APPLIED.md) for recent updates

3. **Google Calendar**:
   - Detailed setup: [GOOGLE_CALENDAR_SETUP.md](GOOGLE_CALENDAR_SETUP.md)
   - Auto-sync: [AUTO_SYNC_FEATURE.md](AUTO_SYNC_FEATURE.md)

---

## 🎉 Ready to Start!

Your complete nutrition tracking solution is ready:

```bash
# Quick start:
npm install
npm run dev
# Open http://localhost:5173
```

**Happy tracking!** 🚀📸🥗

---

<p align="center">
  Made with ❤️ for Samsung A15 + Termux
</p>