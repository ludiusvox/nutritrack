# 🕛 Midnight Reset - Visual Guide

## What Happens at Midnight

```
┌─────────────────────────────────────────────────────────────┐
│                    BEFORE MIDNIGHT                          │
│                   (11:59 PM Tuesday)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📱 Your Device                    ☁️  Google Calendar     │
│  ═════════════                     ═══════════════════      │
│                                                             │
│  Entries stored:                   (No entry yet)          │
│  ├─ Breakfast: 450 cal                                     │
│  ├─ Lunch: 650 cal                                         │
│  ├─ Snack: 200 cal                                         │
│  └─ Dinner: 800 cal                                        │
│                                                             │
│  Total: 2,100 calories                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                            ⏰ MIDNIGHT
                         (12:00 AM Wednesday)
                              ⬇️⬇️⬇️

┌─────────────────────────────────────────────────────────────┐
│              MIDNIGHT PROCESS (Auto-Sync ON)                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Step 1: Calculate Yesterday's Totals                      │
│  ─────────────────────────────────                         │
│    ✅ Tuesday total: 2,100 calories                        │
│    ✅ Fat: 70g, Carbs: 245g, Protein: 140g                 │
│                                                             │
│  Step 2: Sync to Google Calendar                           │
│  ───────────────────────────────                           │
│    📤 Uploading to calendar...                             │
│    ✅ "Daily Nutrition - 2,100 calories" event created     │
│                                                             │
│  Step 3: Clear Old Entries                                 │
│  ─────────────────────────                                 │
│    🗑️  Deleting all Tuesday entries...                     │
│    ✅ LocalStorage cleared                                 │
│                                                             │
│  Step 4: Reset Counters                                    │
│  ──────────────────────                                    │
│    🔄 Daily totals reset to 0                              │
│    ✅ Ready for Wednesday                                  │
│                                                             │
│  Notification: "Daily reset complete! Yesterday's          │
│                 entries cleared."                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                              ⬇️⬇️⬇️

┌─────────────────────────────────────────────────────────────┐
│                    AFTER MIDNIGHT                           │
│                  (12:01 AM Wednesday)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📱 Your Device                    ☁️  Google Calendar     │
│  ═════════════                     ═══════════════════      │
│                                                             │
│  Entries stored:                   Tuesday, Apr 8:         │
│  (Empty - no entries)              ┌──────────────────┐    │
│                                    │ Daily Nutrition  │    │
│  Total: 0 calories                 │ 2,100 calories   │    │
│                                    │                  │    │
│  Ready for new day!                │ Fat: 70g         │    │
│                                    │ Carbs: 245g      │    │
│                                    │ Protein: 140g    │    │
│                                    └──────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sidebar View Comparison

### Tuesday 11:59 PM

```
┌──────────────────────┐
│   Daily Summary      │
├──────────────────────┤
│                      │
│  Total Calories      │
│       2,100          │
│                      │
│  🔴 Fat:      70g    │
│  🔵 Carbs:   245g    │
│  🟢 Protein: 140g    │
│                      │
│  [Sync to Calendar]  │
│                      │
├──────────────────────┤
│   Recent Entries     │
├──────────────────────┤
│                      │
│  🍳 Breakfast        │
│     450 cal          │
│                      │
│  🍔 Lunch            │
│     650 cal          │
│                      │
│  🍪 Snack            │
│     200 cal          │
│                      │
│  🍝 Dinner           │
│     800 cal          │
│                      │
└──────────────────────┘
```

### Wednesday 12:01 AM (After Reset)

```
┌──────────────────────┐
│   Daily Summary      │
├──────────────────────┤
│                      │
│  Total Calories      │
│         0            │
│                      │
│  🔴 Fat:       0g    │
│  🔵 Carbs:     0g    │
│  🟢 Protein:   0g    │
│                      │
│  [Sync to Calendar]  │
│  (grayed out - 0 cal)│
│                      │
├──────────────────────┤
│   Recent Entries     │
├──────────────────────┤
│                      │
│   No entries yet.    │
│   Start by taking    │
│   a photo or adding  │
│   manually.          │
│                      │
│                      │
│                      │
│                      │
└──────────────────────┘
```

---

## Two Scenarios

### Scenario 1: Auto-Sync ENABLED ✅

```
11:59 PM → Device has data
   ↓
12:00 AM → Sync to calendar
   ↓
12:00 AM → Clear device
   ↓
12:01 AM → Device empty, calendar has history

Result: ✅ Historical data preserved in calendar
        ✅ Device is clean and fast
```

### Scenario 2: Auto-Sync DISABLED ❌

```
11:59 PM → Device has data
   ↓
12:00 AM → (No sync)
   ↓
12:00 AM → Clear device
   ↓
12:01 AM → Device empty, calendar empty

Result: ❌ Yesterday's data is lost forever
        ✅ Device is clean and fast
```

---

## Weekly View in Google Calendar

With auto-sync enabled, your calendar looks like:

```
Google Calendar - April 2026
═══════════════════════════════════════════

Monday, April 7
├─ Daily Nutrition - 2,240 calories
│  Fat: 75g, Carbs: 260g, Protein: 150g

Tuesday, April 8
├─ Daily Nutrition - 2,100 calories
│  Fat: 70g, Carbs: 245g, Protein: 140g

Wednesday, April 9
├─ Daily Nutrition - 2,350 calories
│  Fat: 80g, Carbs: 270g, Protein: 155g

Thursday, April 10
├─ Daily Nutrition - 2,180 calories
│  Fat: 72g, Carbs: 250g, Protein: 145g

Friday, April 11
├─ Daily Nutrition - 2,400 calories
│  Fat: 85g, Carbs: 280g, Protein: 160g

═══════════════════════════════════════════
Weekly Average: 2,254 calories/day
```

---

## Data Flow Diagram

```
┌─────────────┐
│   Add Entry │  ← You add food entries throughout the day
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  LocalStorage   │  ← Entries stored on your device
│  (Device only)  │
└──────┬──────────┘
       │
       │ (Accumulates all day)
       │
       ▼
┌─────────────────┐
│  11:59 PM       │  ← End of day
│  Daily totals   │
│  calculated     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  12:00 AM       │  ← Midnight hits
│  Trigger reset  │
└──────┬──────────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Auto-Sync?   │  │ Clear Device │
│              │  │              │
│ YES → Sync   │  │ Delete all   │
│ NO → Skip    │  │ old entries  │
└──────┬───────┘  └──────┬───────┘
       │                 │
       ▼                 │
┌──────────────┐         │
│ Google Cal   │         │
│ (Permanent)  │         │
└──────────────┘         │
                         │
       ┌─────────────────┘
       │
       ▼
┌─────────────────┐
│  12:01 AM       │
│  Fresh start    │
│  Total: 0 cal   │
│  Entries: []    │
└─────────────────┘
```

---

## Timeline: A Day in the Life

```
🌅 6:00 AM - Wake up
   └─ Open app → Empty (last night's reset)

🍳 7:00 AM - Breakfast
   └─ Add entry → Total: 450 cal

🥪 12:00 PM - Lunch
   └─ Add entry → Total: 1,100 cal

🍪 3:00 PM - Snack
   └─ Add entry → Total: 1,300 cal

🍝 7:00 PM - Dinner
   └─ Add entry → Total: 2,100 cal

😴 10:00 PM - Check totals
   └─ Review: 2,100/2,400 target
   └─ Leave app running

🕛 12:00 AM - Midnight (while you sleep)
   ├─ Auto-sync uploads to calendar
   ├─ All entries cleared
   └─ Totals reset to 0

🌅 6:00 AM - Wake up (next day)
   └─ Open app → Empty, ready for today!
```

---

## Quick Reference

| Time | Device Status | Calendar Status |
|------|---------------|-----------------|
| 6 AM | Empty (0 cal) | Has yesterday |
| 12 PM | Building up | Has yesterday |
| 6 PM | Almost complete | Has yesterday |
| 11:59 PM | Full day (2,100 cal) | Has yesterday |
| **12:00 AM** | **Syncing & clearing** | **Adding today** |
| 12:01 AM | Empty (0 cal) | Has yesterday + today |

---

## Important Reminders

### ✅ DO:
- Enable auto-sync to preserve history
- Keep app running overnight
- Check calendar for past days
- Review weekly trends in calendar

### ❌ DON'T:
- Close app before midnight if you want auto-sync
- Forget to enable auto-sync if you want history
- Expect to see yesterday's entries on device
- Worry if sidebar is empty in the morning

---

## Questions & Answers

**Q: Where did my entries go?**  
A: They were deleted at midnight (expected behavior). Check Google Calendar if auto-sync was enabled.

**Q: Can I recover deleted entries?**  
A: No from device. Yes from Google Calendar if auto-sync was enabled.

**Q: Why delete entries daily?**  
A: Clean interface, better performance, focus on today.

**Q: Can I keep entries on device?**  
A: Yes, by editing the code (see AUTO_SYNC_FEATURE.md "Advanced" section).

**Q: What if I forget to sync?**  
A: Enable auto-sync toggle and leave app running - it's automatic!

**Q: Does manual sync also clear entries?**  
A: No, only the midnight auto-reset clears entries.

---

**Remember: Midnight reset = Fresh start every day!** 🌟
