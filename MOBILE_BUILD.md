# Aulock Tracker - Mobile Build Guide

This guide explains how to build and run the Aulock Tracker as a native Android mobile app using Capacitor.

## Prerequisites

### For Android Development
- **Node.js** (already installed)
- **Android Studio** - [Download here](https://developer.android.com/studio)
- **Java Development Kit (JDK)** - Android Studio includes this

## Project Structure

After setup, your project now includes:
- `android/` - Native Android project (managed by Capacitor)
- `capacitor.config.ts` - Capacitor configuration
- `src/config/api.js` - API configuration for mobile/web

## Important: Backend Configuration

Before running the mobile app, you need to configure the backend URL:

### Option 1: For Local Testing (Recommended for Development)

1. Find your computer's local network IP address:
   - Windows: Open Command Prompt and run `ipconfig`
   - Look for "IPv4 Address" under your active network adapter (e.g., `192.168.1.100`)

2. Update `src/config/api.js`:
   ```javascript
   const API_BASE_URL = isMobile 
     ? 'http://192.168.1.100:3000' // Replace with YOUR local IP
     : 'http://localhost:3000';
   ```

3. Make sure your backend is running:
   ```bash
   cd backend
   npm run dev
   ```

4. Ensure your phone/emulator is on the same WiFi network as your computer

### Option 2: For Production (Deployed Backend)

1. Deploy your backend to a cloud service (e.g., Heroku, Railway, Render)
2. Update `src/config/api.js` with your production URL:
   ```javascript
   const API_BASE_URL = isMobile 
     ? 'https://your-backend.com' // Your production URL
     : 'http://localhost:3000';
   ```

## Building the App

### Step 1: Build the Web Assets

Every time you make changes to your React code, rebuild:

```bash
npm run build
```

### Step 2: Sync with Capacitor

After building, sync the changes to the native project:

```bash
npm run cap:sync
```

Or use the shorthand:
```bash
npx cap sync
```

## Running on Android

### Method 1: Using Android Studio (Recommended)

1. Open the Android project in Android Studio:
   ```bash
   npm run cap:open:android
   ```
   Or:
   ```bash
   npx cap open android
   ```

2. Wait for Android Studio to finish indexing and syncing Gradle

3. **Connect a device or start an emulator:**
   - **Physical Device:** Enable USB debugging on your Android phone and connect via USB
   - **Emulator:** Click the device dropdown → "Device Manager" → Create or start a virtual device

4. Click the green "Run" button (▶️) in Android Studio

5. The app will install and launch on your device/emulator

### Method 2: Using Command Line

Run directly on a connected device or emulator:

```bash
npm run cap:run:android
```

## Testing the App

### 1. Test Login
- Use the credentials from your backend seed data
- Example: `admin@aulock.com` / `admin123`

### 2. Test Navigation
- Verify you can navigate between Login, Dashboard, and Admin pages
- Check that the back button works correctly

### 3. Test API Connectivity
- Ensure the app can fetch data from your backend
- Try creating a new session (for teachers)
- Try creating a new school (for admins)

### 4. Test Mobile Features
- Check that the splash screen appears on launch
- Verify the status bar color matches your app theme
- Test on different screen sizes

## Troubleshooting

### "Cannot connect to backend" or API errors

**Problem:** The mobile app can't reach your backend server.

**Solutions:**
1. Verify your backend is running (`cd backend && npm run dev`)
2. Check that the IP address in `src/config/api.js` is correct
3. Ensure your phone/emulator is on the same WiFi network
4. Try accessing `http://YOUR_IP:3000/api/stats/global` in your phone's browser to test connectivity
5. Check your firewall isn't blocking port 3000

### Android Studio Gradle sync failed

**Problem:** Gradle build errors in Android Studio.

**Solutions:**
1. Click "File" → "Invalidate Caches / Restart"
2. Ensure you have a stable internet connection (Gradle downloads dependencies)
3. Check that you have the required Android SDK installed (Android Studio will prompt you)

### App crashes on launch

**Problem:** The app opens then immediately closes.

**Solutions:**
1. Check Android Studio's Logcat for error messages
2. Ensure you ran `npm run build` before `npx cap sync`
3. Try cleaning the project: In Android Studio, "Build" → "Clean Project"

### Changes not appearing in the app

**Problem:** You made code changes but they don't show up.

**Solution:**
1. Always rebuild: `npm run build`
2. Then sync: `npx cap sync`
3. Rerun the app in Android Studio

## Development Workflow

Here's the typical workflow when developing:

1. **Make changes** to your React code (`src/` files)
2. **Test in browser** first: `npm run dev`
3. **Build for mobile**: `npm run build`
4. **Sync to native**: `npm run cap:sync`
5. **Run in Android Studio** or use `npm run cap:run:android`

> **Tip:** For faster development, test most features in the web browser first. Only test mobile-specific features (like splash screen, status bar) on the actual device.

## Updating Your App

When you want to release a new version:

1. Update version in `package.json`
2. Update version in `android/app/build.gradle`:
   ```gradle
   versionCode 2  // Increment this
   versionName "1.1.0"  // Update this
   ```
3. Build and sync as usual
4. Generate a signed APK/AAB in Android Studio for distribution

## Next Steps

### For Testing
- Install the app on multiple Android devices
- Test different screen sizes and Android versions
- Verify all features work offline (if applicable)

### For Production
- Set up a production backend server
- Update API configuration with production URL
- Generate a signed release build
- Prepare for Google Play Store submission

### For iOS (Future)
If you want to build for iOS later:
1. You'll need a Mac with Xcode
2. Run `npx cap add ios`
3. Follow similar steps with Xcode instead of Android Studio

## Useful Commands Reference

```bash
# Development
npm run dev                    # Run web app locally
npm run build                  # Build for production
npm run cap:sync              # Sync web assets to native projects

# Android
npm run cap:open:android      # Open in Android Studio
npm run cap:run:android       # Run on device/emulator

# Capacitor
npx cap sync                  # Sync all platforms
npx cap update                # Update Capacitor dependencies
npx cap doctor                # Check Capacitor setup
```

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Studio Guide](https://developer.android.com/studio/intro)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
