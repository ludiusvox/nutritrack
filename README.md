# 📸 NutriTrack - Photography & Nutrition Tracking App

> Complete nutrition tracking app with camera, BMR calculator, and macro tracking. Optimized for native performance.

[![Android](https://img.shields.io/badge/Android-APK-green)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)]()

---

## ✨ Features

### 🎯 Core Tools

| Tab | Purpose | Key Feature |
|-----|---------|-------------|
| 📸 **Camera** | Capture meal photos | Live preview, instant capture |
| 🧮 **Calculator** | Track macros | Dictionaryless input & auto calculation |
| 🎯 **BMR Calc** | Set daily targets | Mifflin St. Jeor equation |

### 🔥 Key Functionalities

- ✅ **Photography Integration** - Take photos of every meal
- ✅ **Macro Tracking** - Fat, carbs, protein in grams
- ✅ **Stimulant Tracking** - Monitor Caffeine and Nicotine intake
- ✅ **Auto Calorie Calculation** - Standard formula (9/4/4 cal/gram)
- ✅ **BMR Calculator** - Mifflin St. Jeor equation for TDEE
- ✅ **Daily Reset** - All entries cleared at midnight (fresh start daily)
- ✅ **Retractable Sidebar** - Daily summary & today's entries
- ✅ **Light/Dark Mode** - Easy on the eyes
- ✅ **Offline Storage** - LocalStorage persistence
- ✅ **Responsive Design** - Mobile-first interface

---

## 🚀 Native Fedora (Waydroid) Setup

Run NutriTrack with native performance on Fedora using Waydroid.

### 1. Install Waydroid
```bash
sudo dnf install waydroid
```

### 2. Initialize & Start
```bash
sudo waydroid init
sudo systemctl start waydroid-container
```

### 3. Install NutriTrack
```bash
waydroid app install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| **[QUICK_START.md](QUICK_START.md)** | ⭐ **Start here!** Setup guide |
| **[FEATURE_OVERVIEW.md](FEATURE_OVERVIEW.md)** | Detailed feature documentation |
| **[BMR_CALCULATOR_GUIDE.md](BMR_CALCULATOR_GUIDE.md)** | BMR calculator science & usage |
| **[CAMERA_TROUBLESHOOTING.md](CAMERA_TROUBLESHOOTING.md)** | Camera access & permissions |
| **[TERMUX_SETUP.md](TERMUX_SETUP.md)** | Termux installation guide |

---

## 🧮 Nutrition Science

Uses the **Mifflin St. Jeor equation** for BMR and standard macro-to-calorie conversions.

- **Fat**: 9 calories per gram
- **Carbohydrates**: 4 calories per gram
- **Protein**: 4 calories per gram

---

## 🔐 Privacy

- **Local Only**: All data stays on your device in LocalStorage.
- **No Tracking**: No analytics, no accounts, no cloud sync.
- **Auto-Cleanup**: Data clears daily at midnight for privacy and performance.

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Sync with Capacitor
npx cap sync android
```

---

<p align="center">
  Made with ❤️ for specialized nutrition tracking
</p>
