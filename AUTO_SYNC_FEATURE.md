# Automatic Midnight Sync & Daily Reset Feature

## ✨ What's New

Your NutriTrack app now includes:

✅ **Automatic Midnight Reset** - Daily calorie totals reset at midnight  
✅ **Automatic Calendar Sync** - Daily totals uploaded to Google Calendar at midnight  
✅ **Complete Data Clear** - All yesterday's entries are deleted at midnight  
✅ **Today's View** - Sidebar shows only today's nutrition entries

## How It Works

### 📊 Daily Totals

**Now**: Only today's entries count toward your daily totals

- The sidebar shows "Daily Summary" with **today's totals only**
- At midnight, the totals automatically reset to 0
- **All previous days' entries are permanently deleted**
- You start fresh every day

### 🕛 Automatic Midnight Reset & Clear

**What Happens at Midnight**:

1. **If auto-sync is enabled**:
   - Yesterday's nutrition totals upload to Google Calendar
   - Calendar event created with all macros
   
2. **Data is cleared**:
   - All entries from yesterday are **permanently deleted**
   - LocalStorage is cleared of old entries
   - Sidebar resets to 0 calories
   - "Recent Entries" list is empty

3. **Fresh Start**:
   - You begin the new day with a clean slate
   - No clutter from previous days
   - Only today's entries will be visible

### 🔧 How to Enable Auto-Sync

1. **Go to Calendar tab**
2. **Sign in with Google** (if not already signed in)
3. **Toggle "Automatic Midnight Sync"** ON
4. That's it! 

The app will now automatically:
- Sync yesterday's data to calendar at midnight
- Clear all old entries
- Reset daily totals to 0

## Important Notes

### ⚠️ Data is Deleted Daily

**Important**: At midnight, **all previous entries are permanently deleted** from your device.

- ✅ If auto-sync is enabled: Data is saved to Google Calendar first
- ❌ If auto-sync is disabled: Yesterday's data is lost forever
- 💡 **Recommendation**: Enable auto-sync to keep historical records

### ⚠️ App Must Be Running

For midnight reset to work:
- ✅ The app must be **open** or **running in background**
- ✅ Your phone must have **internet connection** (for sync)
- ✅ You must be **signed in to Google Calendar** (for sync)

**On Termux**: 
```bash
# Keep app running in background
termux-wake-lock
npm run dev
```

**On PWA**: Keep the app tab open in Chrome

### 📱 What Happens If App Is Closed?

If the app is closed at midnight:
- Reset happens when you **next open the app**
- Old entries are cleared on first load of the new day
- Auto-sync will still attempt (if data exists)

### 🔄 Manual Sync

You can **always manually sync** even with auto-sync enabled:
1. Open the sidebar (left panel)
2. Click **"Sync to Google Calendar"** button
3. This syncs **today's** current totals immediately
4. **Does not clear entries** - only manual sync

## Data Flow

### Timeline Example

**11:30 PM - Tuesday**:
```
Entries in app:
- Breakfast: 400 cal
- Lunch: 650 cal
- Dinner: 800 cal
Total: 1,850 cal
```

**12:00 AM - Wednesday** (Midnight):
```
1. Auto-sync uploads Tuesday's data to calendar
2. All Tuesday entries deleted from device
3. Daily totals reset to 0
4. Notification: "Daily reset complete!"
```

**12:01 AM - Wednesday**:
```
Entries in app: (empty)
Total: 0 cal
Fresh start for Wednesday!
```

### Google Calendar Record

Your calendar will have:
```
Date: Tuesday, April 8, 2026
Title: Daily Nutrition - 1,850 calories

Total Calories: 1,850
Fat: 65g
Carbs: 185g
Protein: 145g

Automatically synced at midnight
```

## Data Storage

### LocalStorage Keys

The app uses these localStorage keys:

- `nutrition-entries` - **Today's entries only** (cleared at midnight)
- `last-calendar-sync` - Date of last automatic sync/reset
- `auto-sync-enabled` - Auto-sync on/off preference
- `google-calendar-config` - Your Google API credentials

### Entry Lifecycle

```
Created → Stored → Displayed → Midnight → Synced → Deleted
                                    ↓
                          Google Calendar (permanent)
```

## Why This Design?

### Benefits of Daily Reset

1. **Clean Interface**: No clutter from past days
2. **Performance**: Less data = faster app
3. **Privacy**: Old data not stored on device
4. **Focus**: See only today's progress
5. **Simple**: One day at a time approach

### Historical Data

- **In Google Calendar**: All past days preserved
- **On Device**: Only today's data
- **Access History**: View past days in Google Calendar

## Configuration Options

### Option 1: Auto-Sync Enabled (Recommended)

```
✅ Yesterday's data synced to calendar
✅ Old entries cleared at midnight
✅ Historical data preserved in calendar
✅ Clean slate every day
```

**Best for**: People who want historical tracking

### Option 2: Auto-Sync Disabled

```
❌ No calendar sync
✅ Old entries cleared at midnight
❌ Yesterday's data is lost
✅ Clean slate every day
```

**Best for**: People who only track current day

## Troubleshooting

### Data disappeared?

**Check:**
1. ✅ Did midnight pass?
2. ✅ This is expected behavior
3. ✅ Check Google Calendar for history (if auto-sync enabled)

### Want to keep entries longer?

**Solutions:**
1. **Enable auto-sync** - Saves to calendar before deleting
2. **Manual sync** - Sync before midnight if app will be closed
3. **Export manually** - Copy data from localStorage before midnight

### Reset not happening?

**Fix:**
1. Refresh the page
2. Check console for errors (F12 → Console)
3. Verify app was running at midnight
4. Check `last-calendar-sync` date in localStorage

### Accidentally cleared?

**Recovery:**
- ❌ Cannot recover from device (deleted)
- ✅ Check Google Calendar if auto-sync was enabled
- 💡 Data is permanently deleted at midnight

## Advanced: Disable Auto-Clear

If you want to keep historical entries on device:

1. **Edit** `/src/app/pages/home.tsx`
2. **Comment out** the entry clearing code:
```typescript
// Clear old entries (not from today)
// if (lastSync !== today) {
//   const todayDate = getTodayDateString();
//   setEntries(prevEntries => {
//     const todayEntries = prevEntries.filter(entry => entry.date === todayDate);
//     return todayEntries;
//   });
// }
```

**Note**: Sidebar will still show only today's totals, but "Recent Entries" will show all history.

## Best Practices

### Daily Tracking Routine

**Morning**:
1. Open app (yesterday's data auto-cleared)
2. Check Google Calendar to review yesterday
3. Start adding today's meals

**Throughout Day**:
1. Add entries after each meal
2. Monitor progress in sidebar
3. Stay on track with targets

**Evening**:
1. Review day's totals
2. Manually sync if desired
3. Leave app running overnight for auto-sync

### Data Management

1. **Enable auto-sync**: Never lose historical data
2. **Keep app running**: Ensure midnight sync works
3. **Review calendar weekly**: Track long-term trends
4. **Backup credentials**: Save API keys safely

## Privacy & Storage

### Device Storage

- **Only today's data** stored on device
- **Minimal storage** used (KB, not MB)
- **Automatic cleanup** every night
- **No data accumulation**

### Google Calendar

- **Your data only** (not shared)
- **Your calendar** (under your control)
- **Can delete** past events anytime
- **OAuth secured** connection

---

## Summary

🕛 **At midnight every day**:
1. Yesterday's totals sync to Google Calendar (if enabled)
2. All old entries deleted from device
3. Daily totals reset to 0
4. You start fresh

✅ **Benefits**:
- Clean interface
- Fast performance
- Historical data in calendar
- Privacy-focused

⚠️ **Remember**:
- Enable auto-sync to preserve history
- Keep app running overnight
- Data deletion is permanent

**Enjoy automatic daily tracking!** 🎉