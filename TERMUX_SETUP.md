# Running NutriTrack on Termux (Samsung A15)

## Initial Termux Setup

### 1. Install Termux
Download from [F-Droid](https://f-droid.org/en/packages/com.termux/) (NOT Google Play - the Play Store version is outdated)

### 2. Update Packages
```bash
pkg update && pkg upgrade
```

### 3. Install Required Packages
```bash
# Install Node.js and Git
pkg install nodejs git

# Install build tools
pkg install python build-essential

# Grant storage permissions
termux-setup-storage
```

### 4. Clone/Copy Your Project
```bash
# Create a projects directory
cd ~/storage/shared
mkdir projects
cd projects

# If using Git:
git clone <your-repo-url>
cd nutritrack

# OR copy files manually to this directory
```

### 5. Install Dependencies
```bash
npm install
```

### 6. Run Development Server
```bash
npm run dev
```

Access at: `http://localhost:5173`

## Performance Optimization for 4GB RAM

### Memory Management Tips

1. **Close other apps** before running
2. **Use swap file** if needed:
```bash
# Create 1GB swap file
dd if=/dev/zero of=~/swapfile bs=1M count=1024
chmod 600 ~/swapfile
mkswap ~/swapfile
swapon ~/swapfile
```

3. **Limit Vite memory**:
```bash
export NODE_OPTIONS="--max-old-space-size=512"
npm run dev
```

### Keep Termux Running in Background

Install Termux:Boot (from F-Droid) to auto-start services, or use:
```bash
# Acquire wakelock to prevent sleep
termux-wake-lock

# When done:
termux-wake-unlock
```

## Google OAuth for Local App

### Update Redirect URIs

In Google Cloud Console, add:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

For Android app (after packaging), add:
- `com.nutritrack.app:/oauth2redirect`
- Custom scheme for your app

## Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Camera not working
- Camera works in Termux browser
- Will work better as packaged Android app

### Out of memory
```bash
# Clear cache
npm cache clean --force

# Reduce build size
export NODE_ENV=production
npm run build
```

## Accessing from Phone Browser

1. Open Chrome/Firefox on your phone
2. Go to `http://localhost:5173`
3. Add to home screen for app-like experience

## Next Step: Package as Android App

See ANDROID_BUILD.md for packaging instructions.
