# Automatic Midnight Sync & Daily Reset Feature

## ✨ What's New

Your NutriTrack app now includes:

✅ **Automatic Midnight Reset** - Daily calorie totals reset at midnight  
✅ **Automatic Calendar Sync** - Daily totals uploaded to Google Calendar at midnight  
✅ **Today's View** - Sidebar shows only today's nutrition entries

## How It Works

### 📊 Daily Totals

**Before**: All entries were summed together forever  
**Now**: Only today's entries count toward your daily totals

- The sidebar shows "Daily Summary" with **today's totals only**
- At midnight, the totals automatically reset to 0
- Previous days' entries are saved but don't count toward today

### 🕛 Automatic Midnight Sync

When enabled:
1. **At midnight**, the app automatically uploads yesterday's nutrition totals to Google Calendar
2. A calendar event is created with:
   - **Total calories** for the day
   - **Macro breakdown** (fat, carbs, protein)
   - Timestamp showing when it was synced
3. You'll see a success notification if sync completes

### 🔧 How to Enable Auto-Sync

1. **Go to Calendar tab**
2. **Sign in with Google** (if not already signed in)
3. **Toggle "Automatic Midnight Sync"** switch to ON
4. That's it! 

The app will now automatically sync at midnight every day.

## Important Notes

### ⚠️ App Must Be Running

For auto-sync to work at midnight:
- ✅ The app must be **open** or **running in background**
- ✅ Your phone must have **internet connection**
- ✅ You must be **signed in to Google Calendar**

**On Termux**: 
```bash
# Keep app running in background
termux-wake-lock
npm run dev
```

**On PWA**: Keep the app tab open in Chrome

### 📱 What Happens If App Is Closed?

If the app is closed at midnight:
- Auto-sync **will not run** for that day
- You can still **manually sync** using the "Sync to Google Calendar" button in the sidebar
- Auto-sync will resume the next day when the app is running

### 🔄 Manual Sync

You can **always manually sync** even with auto-sync enabled:
1. Open the sidebar (left panel)
2. Click **"Sync to Google Calendar"** button
3. This syncs **today's** current totals immediately

## Data Storage

### LocalStorage Keys

The app uses these localStorage keys:

- `nutrition-entries` - All your nutrition entries (past and present)
- `last-calendar-sync` - Date of last automatic sync
- `auto-sync-enabled` - Auto-sync on/off preference
- `google-calendar-config` - Your Google API credentials

### Entry Structure

Each entry now includes:
```typescript
{
  id: "1234567890",
  name: "Breakfast",
  fat: 10,
  carbs: 45,
  protein: 20,
  calories: 350,
  photo: "data:image/...",
  timestamp: 1234567890123,
  date: "2026-03-19" // NEW: ISO date for daily filtering
}
```

## Technical Details

### Midnight Detection

The app uses a smart timer system:
1. Calculates milliseconds until next midnight
2. Sets a timer to trigger at exactly midnight
3. When timer fires:
   - Checks if yesterday's data needs syncing
   - Uploads to Google Calendar if auto-sync is enabled
   - Reschedules for next midnight

### Date Filtering

```typescript
// Today's date in YYYY-MM-DD format
const today = getTodayDateString(); // "2026-03-19"

// Filter entries for today only
const todayEntries = entries.filter(entry => entry.date === today);

// Calculate today's totals
const totals = todayEntries.reduce(/* sum macros */);
```

### Calendar Event Format

Events created in Google Calendar:
```
Title: Daily Nutrition - 2,150 calories

Description:
Total Calories: 2,150
Fat: 75g
Carbs: 250g
Protein: 120g

Automatically synced at midnight
```

## Troubleshooting

### Auto-sync not working?

**Check:**
1. ✅ Is auto-sync toggle **ON** in Calendar tab?
2. ✅ Are you **signed in** to Google Calendar?
3. ✅ Is the app **running**?
4. ✅ Did you have **entries** from yesterday?
5. ✅ Check console for errors (F12 → Console)

### Totals not resetting?

**Fix:**
1. Refresh the page
2. Check if entries have `date` field
3. Old entries might be missing the `date` field - they won't show in today's totals

### Want to view previous days?

Currently, the sidebar shows **all entries** in "Recent Entries" section, but only **today's entries** count toward the daily total.

**Future enhancement**: Add a calendar view to see past days' totals.

## Configuration

### Disable Auto-Sync

1. Go to **Calendar tab**
2. Toggle **"Automatic Midnight Sync"** to OFF
3. Your daily totals will still reset, but won't upload to calendar

### Change Sync Time

Currently fixed to midnight. To change:
1. Edit `/src/app/utils/date-helpers.ts`
2. Modify `getMillisecondsUntilMidnight()` function

### Delete Old Entries

To clear old entries:
1. Open browser console (F12)
2. Run: `localStorage.removeItem('nutrition-entries')`
3. Refresh page

## Privacy & Data

- ✅ All data stored **locally** on your device (localStorage)
- ✅ Only synced to **your Google Calendar** when you enable it
- ✅ No third-party servers
- ✅ You control when data is synced

## Tips

### For Best Results:

1. **Enable auto-sync** if you track nutrition daily
2. **Keep app running** in background on your phone
3. **Use manual sync** if you forget to open the app at midnight
4. **Check Calendar tab** to verify sync status

### Battery Optimization

On Android:
1. Go to **Settings → Apps → Chrome (or your browser)**
2. **Battery → Unrestricted**
3. This prevents Android from killing the app at night

### Termux Users

```bash
# Start app and prevent sleep
termux-wake-lock
npm run dev

# Optional: Set up cron job for daily restart
# (Advanced - see Termux documentation)
```

---

**Enjoy automatic nutrition tracking!** 🎉

Your daily totals now reset at midnight and automatically sync to Google Calendar, making long-term tracking effortless.
