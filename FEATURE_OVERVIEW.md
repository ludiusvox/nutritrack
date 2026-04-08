# NutriTrack - Complete Feature Overview

## 🎯 Four Main Tabs

### 1. 📸 Camera Tab
**Purpose**: Capture photos of your meals

**Features**:
- Live camera preview
- Capture button with visual feedback
- Photo preview after capture
- Photos attached to nutrition entries

**How to Use**:
1. Click "Camera" tab
2. Allow camera permission
3. Position your food in frame
4. Click capture button
5. Switch to "Calculator" tab to add nutrition details

---

### 2. 🧮 Calculator Tab
**Purpose**: Add nutrition entries manually

**Features**:
- Food name input
- Manual macro entry (fat, carbs, protein)
- Automatic calorie calculation
  - Fat: 9 calories per gram
  - Carbs: 4 calories per gram
  - Protein: 4 calories per gram
- Photo attachment from camera
- Entries saved with timestamp

**How to Use**:
1. Enter food name (e.g., "Chicken Breast")
2. Enter macros in grams
3. See calories calculate automatically
4. Click "Add Entry"
5. Entry appears in sidebar

---

### 3. 🎯 BMR Calc Tab ⭐ **NEW**
**Purpose**: Calculate daily calorie and macro targets

**The Science**:
Uses the **Mifflin St. Jeor equation** - the gold standard for calorie calculation.

**Input Fields**:
- **Age** (years)
- **Gender** (Male/Female)
- **Height** (cm)
- **Weight** (kg)
- **Goal**:
  - Lose Weight (-500 cal/day)
  - Maintain Weight (TDEE)
  - Gain Weight (+300 cal/day)
- **Activity Level**:
  - Sedentary (1.2x)
  - Lightly Active (1.375x)
  - Moderately Active (1.55x)
  - Very Active (1.725x)
  - Extra Active (1.9x)

**Results Shown**:
1. **BMR** - Basal Metabolic Rate (calories at rest)
2. **TDEE** - Total Daily Energy Expenditure
3. **Target Calories** - Daily calorie goal
4. **Macro Breakdown**:
   - Protein (grams & %)
   - Carbs (grams & %)
   - Fat (grams & %)

**Visual Features**:
- Color-coded progress bars
- Goal-specific icons
- Personalized tips based on goal
- Formula explanation

**Example Use Case**:
```
Input:
- Age: 28
- Gender: Male
- Height: 178 cm
- Weight: 82 kg
- Goal: Lose Weight
- Activity: Moderately Active

Output:
- BMR: 1,852 cal
- TDEE: 2,871 cal
- Target: 2,371 cal (-500 for weight loss)
- Protein: 180g (31%)
- Carbs: 270g (46%)
- Fat: 74g (23%)
```

---

### 4. 📅 Calendar Tab
**Purpose**: Sync nutrition data to Google Calendar

**Features**:
- Google OAuth integration
- API key & Client ID configuration
- Manual sync button
- **Automatic midnight sync** toggle
- Connection status indicator

**Auto-Sync Feature**:
- Toggle ON to enable
- At midnight, yesterday's totals automatically upload
- Creates calendar event with:
  - Total calories
  - Macro breakdown
  - Timestamp
- App must be running at midnight

**How to Set Up**:
1. Get credentials from Google Cloud Console
2. Enter Client ID and API Key
3. Click "Save Configuration"
4. Click "Sign In with Google"
5. Toggle "Automatic Midnight Sync" ON

---

## 📊 Left Sidebar

### Daily Summary Card
**Shows**:
- Total calories for TODAY
- Fat total (red indicator)
- Carbs total (blue indicator)
- Protein total (green indicator)
- "Sync to Google Calendar" button (if authenticated)

**Behavior**:
- Resets at midnight
- Only counts today's entries
- Previous entries preserved but don't affect totals

### Recent Entries List
**Shows**:
- All entries (past and present)
- Most recent first
- Entry cards with:
  - Photo thumbnail
  - Food name
  - Calorie count
  - Macro breakdown (F/C/P)

### Responsive Design
- Retractable on mobile (hamburger menu)
- Always visible on desktop
- Smooth slide animation

---

## 🌓 Theme Toggle

**Location**: Top right corner

**Modes**:
- ☀️ Light mode (default)
- 🌙 Dark mode

**Persistence**: Saved to localStorage

---

## ⏰ Automatic Features

### Midnight Reset
**What Happens**:
1. Timer calculates milliseconds until midnight
2. At 12:00 AM:
   - Daily totals reset to 0
   - Sidebar shows 0 calories
   - Yesterday's entries still in "Recent Entries"
3. Timer reschedules for next midnight

**No Manual Action Needed**: Fully automatic!

### Midnight Sync (Optional)
**Requirements**:
- Auto-sync toggle ON
- Signed in to Google Calendar
- App running at midnight
- Has entries from yesterday

**What Happens**:
1. Checks if sync needed
2. Creates calendar event for yesterday
3. Includes all totals and macros
4. Shows success notification
5. Marks as synced to prevent duplicates

---

## 💾 Data Storage

### LocalStorage Keys

| Key | Purpose | Data Type |
|-----|---------|-----------|
| `nutrition-entries` | All nutrition entries | Array |
| `google-calendar-config` | API credentials | Object |
| `auto-sync-enabled` | Auto-sync preference | Boolean |
| `last-calendar-sync` | Last sync date | String (YYYY-MM-DD) |
| `theme` | Light/dark mode | String |

### Entry Structure
```typescript
{
  id: "1712345678901",        // Unique ID
  name: "Grilled Chicken",    // Food name
  fat: 5,                     // Grams
  carbs: 0,                   // Grams
  protein: 35,                // Grams
  calories: 180,              // Calculated
  photo: "data:image/...",    // Base64 or URL
  timestamp: 1712345678901,   // Unix timestamp
  date: "2026-04-08"          // ISO date string
}
```

---

## 🔄 Complete Workflow Example

### Morning Routine
```
1. Open app
2. Go to BMR Calc tab
3. Calculate targets (if first time):
   - Enter age, gender, height, weight
   - Set goal and activity level
   - Note target: 2,400 calories
   
4. Targets for today:
   - Calories: 2,400
   - Protein: 180g
   - Carbs: 270g
   - Fat: 75g
```

### Adding Breakfast
```
1. Go to Camera tab
2. Take photo of breakfast
3. Go to Calculator tab
4. Enter:
   - Name: "Oatmeal with Berries"
   - Fat: 8g
   - Carbs: 54g
   - Protein: 12g
5. Click "Add Entry"
6. Check sidebar:
   - Current: 312 calories
   - Remaining: 2,088 calories
```

### Throughout the Day
```
Repeat for lunch, snacks, dinner:
1. Camera → Take photo
2. Calculator → Enter macros
3. Sidebar → Check progress

Current totals update in real-time!
```

### Evening Review
```
Check sidebar:
- Total: 2,380 calories (99% of target)
- Protein: 175g (97% of target)
- Carbs: 268g (99% of target)
- Fat: 73g (97% of target)

✅ On track!
```

### Midnight (Automatic)
```
App runs in background:
1. Clock hits 12:00 AM
2. Yesterday's data (2,380 cal) syncs to calendar
3. Daily totals reset to 0
4. Ready for new day!
```

---

## 🎨 Design Features

### Color Scheme
- **Primary**: Dynamic (changes with theme)
- **Fat**: Red (#ef4444)
- **Carbs**: Blue (#3b82f6)
- **Protein**: Green (#10b981)

### Responsive Layout
- **Mobile**: Stacked, retractable sidebar
- **Tablet**: Side-by-side with toggle
- **Desktop**: Full sidebar always visible

### Animations
- Smooth transitions
- Fade effects
- Progress bar fills
- Button states

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

---

## 🚀 Progressive Web App (PWA)

### Features
- **Install on Home Screen**: Acts like native app
- **Offline Support**: Service worker caches files
- **Fast Loading**: Pre-cached assets
- **App Icon**: Custom green camera icon

### How to Install
1. Open in Chrome browser
2. Tap menu (⋮)
3. Select "Add to Home screen"
4. Confirm
5. App icon appears on home screen!

### Benefits
- ✅ No app store needed
- ✅ Updates instantly
- ✅ Works offline
- ✅ Less storage than native app
- ✅ Camera access works
- ✅ Notifications (if enabled)

---

## 📱 Android APK (Optional)

### Using Capacitor
Converts web app to native Android app.

**Advantages**:
- Full native experience
- Better performance
- More reliable camera access
- Background sync more reliable
- Can distribute via APK file

**Build Process**:
```bash
npm run build        # Build web app
npm run cap:sync     # Sync to Android
# Then build in Android Studio
```

---

## 🔐 Privacy & Security

### Data Storage
- ✅ All data stored **locally** on your device
- ✅ No external servers
- ✅ Photos stored as base64 in localStorage

### Google Calendar
- ✅ OAuth 2.0 authentication
- ✅ Only syncs when you authorize
- ✅ You control what's synced
- ✅ Can revoke access anytime

### No Tracking
- ❌ No analytics
- ❌ No third-party scripts (except Google API)
- ❌ No data collection
- ❌ No ads

---

## 📖 Documentation Index

| File | Purpose |
|------|---------|
| `QUICK_START.md` | ⭐ Start here! |
| `BMR_CALCULATOR_GUIDE.md` | BMR calc detailed guide |
| `AUTO_SYNC_FEATURE.md` | Midnight sync explanation |
| `TERMUX_SETUP.md` | Termux installation |
| `ANDROID_BUILD.md` | APK building guide |
| `GOOGLE_CALENDAR_SETUP.md` | Calendar API setup |
| `FIXES_APPLIED.md` | Recent fixes log |
| `FEATURE_OVERVIEW.md` | This file |

---

## 🎯 Key Metrics You Can Track

1. **Daily Calories** - Stay within target
2. **Protein Intake** - Hit muscle-building goals
3. **Carb Timing** - Fuel workouts
4. **Fat Balance** - Hormone health
5. **Meal Photos** - Visual food diary
6. **Weekly Trends** - Via Google Calendar
7. **Weight Progress** - Update BMR calc monthly

---

## 💡 Pro Tips

### For Best Results
1. **Calculate BMR first** - Know your targets
2. **Be consistent** - Track every day
3. **Take photos** - Visual reference helps
4. **Weigh food** - More accurate than eyeballing
5. **Sync to calendar** - Review weekly patterns
6. **Adjust monthly** - Recalculate BMR as weight changes

### Time-Saving Tricks
1. **Use favorites** - Common meals can be templated
2. **Batch photo** - Take all meal photos at once
3. **Round macros** - 10.3g → 10g is fine
4. **Pre-plan** - Calculate day's meals in morning

### Accuracy Tips
1. **Use kitchen scale** - Grams > volume
2. **Track condiments** - They add up!
3. **Don't forget drinks** - Calories count
4. **Check labels** - Serving sizes vary
5. **Log immediately** - Don't forget meals

---

## 🎊 You're Ready!

Your NutriTrack app includes:
- ✅ Camera for meal photos
- ✅ Calculator for macro tracking
- ✅ BMR calculator for goal setting
- ✅ Google Calendar integration
- ✅ Automatic midnight reset
- ✅ Beautiful dark mode
- ✅ PWA installation
- ✅ Complete documentation

**Start tracking your nutrition journey today!** 🚀
