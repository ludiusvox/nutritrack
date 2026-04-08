update procedure:

1. Rebuild the Web Project
First, you need to compile your frontend code into the production folder.
If you are using Vite, Angular, or React, run your specific build script:

Bash
# Common commands (check your package.json)
npm run build 
# OR
vite build
2. Sync with Capacitor
Now that the dist (or www) folder is updated, you must tell Capacitor to copy those files into the Android project's assets:

Bash
npx cap copy android
# Then sync to be safe
npx cap sync android
3. Re-run the Gradle Build
Now that the native Android project has the fresh assets, compile the APK again:

Bash
cd android
./gradlew clean assembleDebug
Note: If you're on Windows, use .\gradlew.bat clean assembleDebug.

Why this happens (The Capacitor Flow)
Web Source: Where you write your code (Live Reload / Dev Server).

Web Build: npm run build turns that code into static files in /dist.

Capacitor Copy: npx cap copy moves those files into android/app/src/main/assets/public.

Gradle Build: Compiles those assets into the final .apk file.

Quick Check
To verify it worked before you even open the APK, you can check the timestamp of the asset file:
ls -l android/app/src/main/assets/public/index.html

If that timestamp doesn't match "just now," the APK will still be the old version.

Once that's built, remember to copy it over to your root folder again:
cp android/app/build/outputs/apk/debug/app-debug.apk ./w-weight.apk

Are you seeing the new dist folder files updating correctly when you run your build command?