# iOS Google Maps API Key Configuration

## Setup Instructions

The Google Maps API key for iOS is now stored securely in a configuration file instead of being hardcoded.

### Files Created:

1. **`ios/Config.xcconfig`** - Contains your actual API key (ignored by git)
2. **`ios/Config.xcconfig.example`** - Template file for other developers
3. **Updated `.gitignore`** - Prevents `Config.xcconfig` from being committed

### How to Link Config.xcconfig to Xcode:

1. **Open Xcode:**

   ```bash
   open ios/rovin.xcworkspace
   ```

2. **Add the Config file to your project:**

   - In Xcode, select the `rovin` project in the Project Navigator
   - Click on the `rovin` project (blue icon at the top)
   - Under the "Info" tab, look for "Configurations"
   - For both Debug and Release configurations:
     - Click the dropdown under "rovin" target
     - Select "Config" from the list (if it appears)
     - If it doesn't appear, you need to add it first:
       - Click the "+" button at the bottom
       - Select "Add Configuration File"
       - Choose `Config.xcconfig`

3. **Alternative method (drag and drop):**

   - Drag `Config.xcconfig` from Finder into your Xcode project
   - Make sure "Copy items if needed" is unchecked
   - Add it to the `rovin` target

4. **Verify the setup:**
   - The API key should now be read from `Info.plist` which gets it from `Config.xcconfig`
   - Build and run your app to ensure maps work correctly

### For Team Members:

1. Copy `Config.xcconfig.example` to `Config.xcconfig`:

   ```bash
   cp ios/Config.xcconfig.example ios/Config.xcconfig
   ```

2. Replace `YOUR_API_KEY_HERE` with your actual Google Maps API key

3. Follow the linking instructions above

### Security Notes:

- ✅ `Config.xcconfig` is in `.gitignore` and won't be committed
- ✅ API key is read from configuration file, not hardcoded
- ✅ `Config.xcconfig.example` provides a template for team members
- ✅ Same approach used for Android in `gradle.properties`

### Current Implementation:

The API key is now loaded in `AppDelegate.swift` like this:

```swift
if let apiKey = Bundle.main.object(forInfoDictionaryKey: "GOOGLE_MAPS_API_KEY") as? String {
  GMSServices.provideAPIKey(apiKey)
}
```

And it's defined in `Info.plist` as:

```xml
<key>GOOGLE_MAPS_API_KEY</key>
<string>$(GOOGLE_MAPS_API_KEY)</string>
```

Which reads from `Config.xcconfig`:

```
GOOGLE_MAPS_API_KEY = YOUR_ACTUAL_KEY_HERE
```
