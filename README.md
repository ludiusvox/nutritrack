<a href="https://play.google.com/store/apps/details?id=com.nutritrack.official">
  <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" width="200">
</a>

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# 📸 NutriTrack - Tactical Nutrition & Athletic Performance Dashboard

> A comprehensive diagnostic suite for tactical athletes, combining high-precision macro/stimulant tracking with doctrinal performance fueling strategies. Powered by computer vision analysis and baseline metabolic modeling.

---

## ✨ Full Feature Architecture

### 🛡️ Diagnostic Core
- **Snap Meal Analyzer**: Computer vision integration (Gemini-powered) for rapid composition decryption from photographs.
- **Mifflin-St Jeor Metabolic Engine**: "Gold standard" BMR and TDEE calculation for precise caloric baseline determination.
- **US Navy Body Fat % Estimator**: Circumference-based adiposity assessment for tracking body composition changes.
- **Concentric Daily Summary Rings**: Real-time visual telemetry of Fat, Carb, and Protein saturation relative to performance targets.

### ⚡ Performance & Training Plan (New in v1.28/v1.29)
- **Redesigned Training Plan**: Centralized hub for scheduling **Weightlifting, Biking, and Running** activities.
- **Fasting Protocols**: Integrated support for **5/2 and 16/8** intermittent fasting schedules.
- **Dynamic Nutrient Scaling**: Real-time calorie synchronization and scaling of Pre-Load/Post-Load carb and protein requirements based on your specific daily goal.
- **Advanced Stats Visualization**: High-precision weekly caloric averaging charts with localized calendar logic to ensure accuracy across time zones.

### ⚡ Performance & Stimulant Tracking
- **Dual Stimulant Matrix**: Dedicated tracking for **Caffeine (mg)** and **Nicotine (mg)** to monitor cognitive load and autonomic nervous system stress.
- **Macro Tweak Calculator**: Real-time calorie synchronization based on 9/4/4 cal/gram thermodynamic constants.
- **Daily Journal & Diary**: Comprehensive log history with automated local-time midnight resets for "Foundational" discipline.

### 📅 Tactical Scheduling & Export
- **Fueling Schedule & Weekly Sync**: Managed event-based fueling with specific nutrient instructions.
- **Double-Ladder "W" Procedure**: Built-in rep-scheme reference (5-4-3-2-1-2-3-4-5) for high-density power maintenance training.
- **Diagnostics Compiler**: Export formatted **Markdown Reports** or **CSV Logs** directly to local storage.
- **Calendar Synchronization**: Integration for Google, iCloud, and Outlook calendars with Carb Load note export.

### 🏗️ Technical Specifications
- **Automatic Local Reset**: Force-reset of daily totals at 00:00 local time (v1.29) to ensure proactive nutrition discipline.
- **Client-Side Security**: All diagnostics run strictly on-device to prevent unauthorized server leaks of biometric or nutritional records.
- **Native Waydroid Support**: Optimized for high-performance execution on Fedora and other Linux environments via Waydroid.

---

## 📖 Scientific Foundations & Sources

NutriTrack is architected upon the latest doctrinal standards for tactical athlete readiness and metabolic science.

### 📚 Primary Source Quotations

#### **NSCA - National Strength & Conditioning Association**
*Source: Essentials of Tactical Strength and Conditioning (TSAC)*
> "Tactical athletes cannot be lumped into a single group... each tactical athlete’s demands are based on incredibly different job functions. Therefore, it is important to treat each athlete as an individual when it comes to thinking through nutrition needs."

#### **U.S. Army Manual FM 7-22**
*Source: Holistic Health and Fitness (H2F), Chapter 8: Nutritional Readiness*
> "**Nutritional readiness** is the ability to recognize, select, and consume the requisite food and drink to meet the physical and nonphysical demands of any duty or combat position, accomplish the mission and come home healthy."

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
1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **API Configuration**:
    Set your `GEMINI_API_KEY` in `.env.local` to enable computer vision meal analysis.
3.  **Run Locally**:
    ```bash
    npm run dev   # Local Web View
    npm run build # Production Compilation
    npx cap sync  # Sync Native Assets
    ```

---

## 🔐 Privacy & Sovereignty
- **Local Persistence**: Data is stored exclusively in Browser LocalStorage/Capacitor Filesystem.
- **No Cloud Leakage**: Zero external telemetry; biometric data remains under user control.

---
<p align="center">
  <i>"Accomplish the mission and come home healthy." — FM 7-22</i>
</p>
