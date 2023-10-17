# ditto-reactnative-app
React Native client for ditto assistant. Works by connecting to [nlp_server](http://github.com/omarzanji/nlp_server)

## Run in emulator:
1. cd into `ditto/`
2. run `npm install` if first time.
3. run `npx react-native run-android` after starting [Android Studio Emulator](https://developer.android.com/studio) or plugging in Androud device with USB Debugging mode on.

## Building APK (Android)
1. Run the React Native build command for Android:
    `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
2. Navigate into `android/`.
3. Run: `gradlew assembleDebug`
4. Build location: `ditto/android/app/build/outputs/apk/debug/app-debug.apk`

## Building IOS App (Instructions coming soon...)
1. :D