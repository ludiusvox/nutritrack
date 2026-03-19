# Google Calendar API Setup Guide

This guide will help you set up Google Calendar integration for NutriTrack.

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "NutriTrack")
5. Click "Create"

### 2. Enable Google Calendar API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scope: `https://www.googleapis.com/auth/calendar.events`
   - Add your email as a test user
   - Save and continue
4. Back in Credentials, click "Create Credentials" → "OAuth client ID"
5. Select "Web application"
6. Add these Authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production domain (e.g., `https://yourapp.com`)
7. Add these Authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - Your production domain
8. Click "Create"
9. **Copy your Client ID** - you'll need this

### 4. Create an API Key

1. Still in "Credentials", click "Create Credentials" → "API key"
2. **Copy your API Key** - you'll need this
3. (Optional) Click "Restrict Key" to limit it to Google Calendar API only

### 5. Configure the App

1. Open your NutriTrack app
2. Go to the "Calendar" tab
3. Enter your **OAuth Client ID**
4. Enter your **API Key**
5. Click "Save Configuration"
6. Click "Sign In with Google"
7. Authorize the app to access your Google Calendar

## How It Works

### Manual Sync

Once configured and signed in:
- Your daily nutrition summary appears in the sidebar
- Click "Sync to Google Calendar" button
- A calendar event is created with your daily totals

### What Gets Synced

The calendar event includes:
- **Title**: Daily Nutrition - [X] calories
- **Description**: 
  - Total Calories
  - Fat, Carbs, and Protein breakdown
  - Optional notes
- **Date**: Full day event (midnight to midnight)
- **Color**: Blue

### Auto-Update Feature (Future Enhancement)

To sync automatically at midnight:

```javascript
// In home.tsx, add this useEffect:
useEffect(() => {
  const checkAndSync = () => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      // Auto-sync logic here
      if (isCalendarAuthenticated && entries.length > 0) {
        // Calculate daily totals and sync
      }
    }
  };

  // Check every minute
  const interval = setInterval(checkAndSync, 60000);
  return () => clearInterval(interval);
}, [isCalendarAuthenticated, entries]);
```

## API Endpoints Used

### Create Event
```javascript
gapi.client.calendar.events.insert({
  calendarId: "primary",
  resource: eventObject
})
```

### Update Event
```javascript
gapi.client.calendar.events.patch({
  calendarId: "primary",
  eventId: eventId,
  resource: eventObject
})
```

### List Events
```javascript
gapi.client.calendar.events.list({
  calendarId: "primary",
  timeMin: startDate,
  timeMax: endDate
})
```

## Security Best Practices

1. **Never commit credentials to version control**
   - Credentials are stored in localStorage only
   - Add `.env` to `.gitignore` if using environment variables

2. **Restrict API Key**
   - In Google Cloud Console, restrict your API key to:
     - HTTP referrers (your domain only)
     - Google Calendar API only

3. **OAuth Consent Screen**
   - Only request necessary scopes
   - Keep test users list updated
   - Submit for verification if going to production

4. **Token Management**
   - Tokens are managed by Google Identity Services
   - Tokens expire automatically
   - Users can revoke access anytime

## Troubleshooting

### "Access blocked: This app's request is invalid"
- Make sure you added authorized origins and redirect URIs in Google Cloud Console
- Check that the URLs match exactly (including http/https)

### "API key not valid"
- Verify the API key is copied correctly
- Check that Google Calendar API is enabled
- Ensure API key restrictions allow your domain

### "Sign-in popup blocked"
- Allow popups for your domain
- Try signing in again

### "Calendar events not syncing"
- Make sure you're signed in (check Calendar tab)
- Verify you have entries with nutrition data
- Check browser console for errors

## Rate Limits

Google Calendar API has the following limits:
- **Queries per day**: 1,000,000
- **Queries per 100 seconds per user**: 500

For a personal nutrition tracker, these limits should be more than sufficient.

## Next Steps

1. **Add automatic daily sync at midnight**
2. **Add OCR for extracting nutrition facts from photos**
3. **Add weekly/monthly summary reports**
4. **Export data to spreadsheets**
5. **Add reminders and notifications**

## Support

For issues with:
- **Google Calendar API**: [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- **OAuth 2.0**: [Google Identity Documentation](https://developers.google.com/identity/protocols/oauth2)
- **This app**: Check the browser console for error messages
