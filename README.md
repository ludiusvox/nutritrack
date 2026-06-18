# 📸 NutriTrack - Tactical Nutrition & Athletic Performance Dashboard

> A comprehensive diagnostic suite for tactical athletes, combining high-precision macro/stimulant tracking with doctrinal performance fueling strategies. Powered by computer vision analysis and baseline metabolic modeling.

[![Android](https://img.shields.io/badge/Android-APK-green)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)]()

---

## ✨ Full Feature Architecture

### 🛡️ Diagnostic Core
- **Snap Meal Analyzer**: Computer vision integration (Gemini-powered) for rapid composition decryption from photographs.
- **Mifflin-St Jeor Metabolic Engine**: "Gold standard" BMR and TDEE calculation for precise caloric baseline determination.
- **US Navy Body Fat % Estimator**: Circumference-based adiposity assessment for tracking body composition changes.
- **Concentric Daily Summary Rings**: Real-time visual telemetry of Fat, Carb, and Protein saturation relative to performance targets.

### ⚡ Performance & Stimulant Tracking
- **Dual Stimulant Matrix**: Dedicated tracking for **Caffeine (mg)** and **Nicotine (mg)** to monitor cognitive load and autonomic nervous system stress.
- **Macro Tweak Calculator**: Real-time calorie synchronization based on 9/4/4 cal/gram thermodynamic constants.
- **Daily Journal & Diary**: Comprehensive log history with meal categorization (Breakfast, Lunch, Dinner, Snacks).

### 📅 Tactical Scheduling & Export
- **Fueling Schedule & Weekly Sync**: Managed event-based fueling (Weightlifting, Biking, Running) with specific Pre-Load and Post-Load nutrient instructions.
- **Double-Ladder "W" Procedure**: Built-in rep-scheme reference (5-4-3-2-1-2-3-4-5) for high-density power maintenance training.
- **Diagnostics Compiler**: Export formatted **Markdown Reports** or **CSV Logs** directly to local storage or shared platforms.
- **Calendar Synchronization**: Integration settings for Google, iCloud, and Outlook calendars with Carb Load note export.

### 🏗️ Technical Specifications
- **Automatic Midnight Reset**: Force-reset of daily totals at 00:00 local time to ensure "Foundational (Proactive)" nutrition discipline.
- **Client-Side Security**: All diagnostics run strictly on-device to prevent unauthorized server leaks of biometric or nutritional records.
- **Native Waydroid Support**: Optimized for high-performance execution on Fedora and other Linux environments via Waydroid.

---

## 📖 Scientific Foundations & Sources

NutriTrack is architected upon the latest doctrinal standards for tactical athlete readiness and metabolic science.

### 📚 Primary Source Quotations

#### **NSCA - National Strength & Conditioning Association**
*Source: Essentials of Tactical Strength and Conditioning (TSAC)*
> "Tactical athletes cannot be lumped into a single group... each tactical athlete’s demands are based on incredibly different job functions. Therefore, it is important to treat each athlete as an individual when it comes to thinking through nutrition needs."

> "Employing optimal nutritional strategies in conjunction with good sleep hygiene can mitigate the deleterious effects of deployment and shift work on performance."

#### **U.S. Army Manual FM 7-22**
*Source: Holistic Health and Fitness (H2F), Chapter 8: Nutritional Readiness*
> "**Nutritional readiness** is the ability to recognize, select, and consume the requisite food and drink to meet the physical and nonphysical demands of any duty or combat position, accomplish the mission and come home healthy."

> "**Proactive nutrition** provides the foundation for baseline health and homeostasis... the proactive prevention of nutrition deficiency, chronic disease, and immune system compromise."

---

## 🚀 Installation & Setup

### Native Android / Waydroid
```bash
# Install Waydroid (Fedora)
sudo dnf install waydroid
sudo waydroid init
sudo systemctl start waydroid-container

# Install APK
waydroid app install android/app/build/outputs/apk/debug/app-debug.apk
```

### Development Environment
```bash
npm install
npm run dev   # Local Web View
npm run build # Production Compilation
npx cap sync  # Sync Native Assets
```

---

## 🧮 Thermodynamic Constants
- **Fat**: 9 kcal/g
- **Carbohydrates**: 4 kcal/g
- **Protein**: 4 kcal/g

---

## 🔐 Privacy & Sovereignty
- **Local Persistence**: Data is stored exclusively in Browser LocalStorage/Capacitor Filesystem.
- **No Cloud Leakage**: Zero external telemetry; biometric data remains under user control.

---
<p align="center">
  <i>"Accomplish the mission and come home healthy." — FM 7-22</i>
</p>
