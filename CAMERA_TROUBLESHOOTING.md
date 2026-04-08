# 📸 Camera Troubleshooting Guide

## Common Camera Errors & Solutions

### ❌ Error: "Permission Denied" or "NotAllowedError"

This is the most common error. It means your browser blocked camera access.

#### **Solution: Grant Camera Permission**

##### **Chrome / Edge (Desktop)**
1. Look at the address bar (where the URL is)
2. Click the **🔒 lock icon** or **ⓘ info icon** (left of the URL)
3. Find "Camera" in the permissions list
4. Change it from "Block" to **"Allow"**
5. Refresh the page (F5 or Ctrl+R)
6. Click "Open Camera" again

##### **Chrome / Edge (Android)**
1. Tap the **⋮** (three dots) menu
2. Select **"Settings"**
3. Go to **"Site settings"**
4. Tap **"Camera"**
5. Find `localhost` or your site URL
6. Change to **"Allow"**
7. Go back to the app
8. Click "Open Camera" again

##### **Safari (Desktop)**
1. In the menu bar, click **Safari** → **Settings for This Website**
2. Find **"Camera"**
3. Change to **"Allow"**
4. Refresh the page
5. Click "Open Camera" again

##### **Safari (iOS)**
1. Open **Settings** app on your iPhone
2. Scroll down to **Safari**
3. Tap **"Camera"**
4. Change to **"Ask"** or **"Allow"**
5. Go back to the app
6. Click "Open Camera" again

##### **Firefox**
1. Click the **🔒 lock icon** in the address bar
2. Click **"More Information"** or arrow **>**
3. Go to **"Permissions"** tab
4. Find **"Use the Camera"**
5. Uncheck **"Use Default"**
6. Check **"Allow"**
7. Refresh the page
8. Click "Open Camera" again

---

### 🔐 Why is Permission Needed?

Browsers require explicit permission to access your camera for **security and privacy** reasons:
- Prevents malicious websites from spying
- Gives you control over which sites can use your camera
- Required by browser security policies

**This is normal and expected!** Just grant permission once, and the browser will remember.

---

### 🌐 HTTPS / Localhost Requirement

**Important**: Camera access only works on:
- ✅ `https://` (secure HTTPS sites)
- ✅ `http://localhost` (local development)
- ✅ `http://127.0.0.1` (local development)
- ❌ `http://` other addresses (will be blocked)

#### **If You See "Camera not supported"**
- Make sure you're accessing via `localhost` or HTTPS
- HTTP (non-secure) connections are blocked by browsers

#### **For Termux Users:**
When running `npm run dev`, access the app as:
- ✅ `http://localhost:5173` (works!)
- ✅ `http://127.0.0.1:5173` (works!)
- ❌ `http://192.168.x.x:5173` (blocked - not localhost)

---

### 📱 Camera Not Found Error

#### Symptoms:
- "No camera device was detected"
- Camera works in other apps but not in browser

#### Solutions:

1. **Check if camera exists:**
   - Test with device's native camera app
   - On Android: Open Camera app
   - On iOS: Open Camera app
   - On Desktop: Check Device Manager (Windows) or System Preferences (Mac)

2. **Check if camera is in use:**
   - Close other apps using the camera (Zoom, Skype, etc.)
   - Close other browser tabs that might be using camera
   - Restart your browser

3. **Browser settings:**
   - Make sure camera is not disabled globally:
     - **Chrome**: Settings → Privacy and security → Site settings → Camera
     - **Firefox**: Settings → Privacy & Security → Permissions → Camera
     - **Safari**: Settings → Websites → Camera

4. **On Android (Termux):**
   - Grant storage permission: `termux-setup-storage`
   - Grant camera permission in Android settings
   - Chrome needs camera permission at system level:
     - Settings → Apps → Chrome → Permissions → Camera → Allow

5. **Restart device:**
   - Sometimes camera driver needs restart
   - Turn off phone/computer completely
   - Turn back on and try again

---

### ⚙️ Advanced Troubleshooting

#### Check Camera in Browser Console

Open browser console (F12 or Ctrl+Shift+I), paste this code:

```javascript
// Test if camera API is available
console.log("getUserMedia available:", 
  !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));

// List available cameras
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    const cameras = devices.filter(d => d.kind === 'videoinput');
    console.log(`Found ${cameras.length} camera(s):`, cameras);
  })
  .catch(err => console.error("Error:", err));

// Test camera access
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    console.log("✅ Camera access granted!");
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => console.error("❌ Camera error:", err.name, err.message));
```

**Expected output if working:**
```
getUserMedia available: true
Found 2 camera(s): [...]
✅ Camera access granted!
```

**If you see errors:**
- `NotAllowedError` → Permission denied (see solutions above)
- `NotFoundError` → No camera detected
- `NotSupportedError` → Browser doesn't support camera API

---

### 🔧 Specific Browser Issues

#### **Chrome/Edge - "Camera already in use"**
1. Close all other tabs
2. Go to `chrome://webrtc-internals/` (Chrome) or `edge://webrtc-internals/` (Edge)
3. Check which tabs are using camera
4. Close those tabs
5. Try again

#### **Firefox - Permission Remembered Incorrectly**
1. Click 🔒 in address bar
2. Click **"Clear these settings for future visits"**
3. Refresh page
4. Click "Open Camera" - it will ask permission again
5. This time click **"Allow"**

#### **Safari - Autoplay Issues**
Make sure the video element has:
- `autoPlay` attribute ✅ (we have this)
- `playsInline` attribute ✅ (we have this)
- `muted` attribute ✅ (we added this)

#### **Android Chrome - Black Screen**
If camera opens but shows black screen:
1. Check if camera lens is covered
2. Try switching to front camera (if available)
3. Clear Chrome cache: Settings → Privacy → Clear browsing data
4. Update Chrome to latest version

---

### 📋 Quick Checklist

Before asking for help, verify:

- [ ] Using Chrome, Edge, Safari, or Firefox (not Opera Mini, UC Browser, etc.)
- [ ] Accessing via `localhost` or HTTPS
- [ ] Clicked "Allow" when browser asked for camera permission
- [ ] No other app or browser tab is using the camera
- [ ] Camera works in device's native camera app
- [ ] Browser is up to date
- [ ] Tried refreshing the page
- [ ] Tried restarting the browser

---

### 🔄 Reset Everything (Nuclear Option)

If nothing works, try this complete reset:

#### **Chrome/Edge:**
```
1. Go to Settings → Privacy and security → Site settings
2. Click "Camera"
3. Remove the blocked/allowed site
4. Click "View permissions and data stored across sites"
5. Search for "localhost" or your domain
6. Click trash icon to delete all data
7. Restart browser
8. Try again - it will ask permission fresh
```

#### **Firefox:**
```
1. Go to Settings → Privacy & Security
2. Under "Cookies and Site Data" click "Manage Data"
3. Search for "localhost"
4. Click "Remove Selected"
5. Under "Permissions" → "Camera" click "Settings"
6. Remove localhost entry
7. Restart browser
8. Try again
```

#### **Safari:**
```
1. Safari → Settings → Websites → Camera
2. Remove localhost or your domain
3. Safari → Settings → Privacy → Manage Website Data
4. Remove localhost
5. Restart Safari
6. Try again
```

---

### 🆘 Still Not Working?

#### **Alternative: Use Another Browser**
- If Chrome doesn't work, try Firefox
- If Firefox doesn't work, try Edge
- If desktop doesn't work, try mobile (or vice versa)

#### **Alternative: Upload Photos Instead**
While we work on camera access, you can:
1. Take photo with device's camera app
2. We can add a file upload option
3. Upload the photo to the app

#### **For Developers: Add File Upload Fallback**
```typescript
// We can add this as an alternative:
<input 
  type="file" 
  accept="image/*" 
  capture="environment"
  onChange={handleFileUpload}
/>
```

---

### 📖 Understanding the Error Messages

#### **App's Error Messages:**

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "Camera Permission Denied" | You clicked "Block" or "Deny" | Grant permission in browser settings |
| "No Camera Found" | Browser can't detect camera | Check device, close other apps |
| "Camera Constraint Error" | Camera doesn't support high quality | Click "Try Again" - will use lower quality |
| "Camera not supported" | Browser doesn't support camera API | Use Chrome, Edge, Safari, or Firefox |
| "Camera Error" | Generic error | Check HTTPS/localhost, refresh page |

#### **Browser Console Errors:**

| Console Error | Meaning |
|--------------|---------|
| `NotAllowedError` | Permission denied |
| `NotFoundError` | No camera device |
| `NotReadableError` | Camera is in use by another app |
| `OverconstrainedError` | Requested camera quality not available |
| `TypeError` | Browser doesn't support camera API |

---

### ✅ Camera Working Checklist

You'll know camera is working when:
- ✅ No error messages appear
- ✅ Live video preview shows in black box
- ✅ You can see yourself/food in the preview
- ✅ Capture button appears at bottom
- ✅ Clicking capture button takes a photo
- ✅ Photo preview shows after capture

---

### 💡 Tips for Best Results

Once camera is working:

1. **Good Lighting:**
   - Natural light is best
   - Avoid direct sunlight (causes glare)
   - Use overhead lights if indoors

2. **Camera Position:**
   - Hold phone/camera directly above food
   - Keep camera steady
   - Fill the frame with food

3. **Focus:**
   - Tap screen to focus (on mobile)
   - Wait a second for autofocus
   - Make sure food is in focus before capturing

4. **Privacy:**
   - Photos are stored locally on your device
   - Photos are NOT uploaded to any server
   - You can delete them by clearing browser data

---

## 🔐 Security & Privacy

### What Permissions Does the App Need?

**Camera Permission:**
- Used to take photos of food
- Only accessed when you click "Open Camera"
- Video stream never leaves your device
- Can be revoked anytime in browser settings

### What Does the App Do With Photos?

**Storage:**
- Photos stored in browser's localStorage
- Photos stay on YOUR device only
- Never uploaded to any server
- Stored as base64 data URLs

**Usage:**
- Attached to nutrition entries
- Displayed in sidebar
- Used for your reference only

**Deletion:**
- Delete entry → photo deleted too
- Clear browser data → all photos deleted
- No way to recover deleted photos

### Can I Disable Camera?

**Yes!** The camera feature is optional:
- Skip the Camera tab entirely
- Just use Calculator tab to add entries
- Entries work fine without photos
- Photos are optional, not required

---

## 📱 Platform-Specific Notes

### **Termux on Android:**
- Camera works via Chrome browser
- Access as `http://localhost:5173`
- Chrome needs system-level camera permission
- Keep Termux running in background

### **iOS (iPhone/iPad):**
- Use Safari (best support)
- Chrome on iOS also works
- Must grant permission in Safari settings
- PWA version has full camera access

### **Desktop:**
- Chrome, Edge, Firefox all work
- Need webcam or built-in camera
- External cameras supported
- Better for testing than actual use

### **Android Native Browser:**
- Chrome recommended
- Samsung Internet works
- Firefox works
- Avoid old/outdated browsers

---

**Camera should work now!** If you still have issues after following this guide, the problem might be device-specific or require system-level permissions.
