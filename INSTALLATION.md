# Installation Guide

## Quick Start

Follow these steps to install the Hacker News Readability Enhancer extension in Chrome:

### Step 1: Download the Extension

Clone the repository or download it as a ZIP file:

```bash
git clone https://github.com/qcbegin/hacker-news-browser-plugin.git
```

Or click the "Code" button on GitHub and select "Download ZIP", then extract the files.

### Step 2: Open Chrome Extensions Page

1. Open Google Chrome
2. Navigate to `chrome://extensions/` in your address bar
3. Or click the three-dot menu → More Tools → Extensions

### Step 3: Enable Developer Mode

In the top-right corner of the Extensions page, toggle the **Developer mode** switch to ON.

### Step 4: Load the Extension

1. Click the **Load unpacked** button
2. Navigate to the folder containing the extension files
3. Select the `hacker-news-browser-plugin` folder (the one containing `manifest.json`)
4. Click **Select Folder** (or **Open** on Mac)

### Step 5: Pin the Extension (Optional)

1. Click the puzzle piece icon in Chrome's toolbar
2. Find "Hacker News Readability Enhancer" in the list
3. Click the pin icon to keep it visible in your toolbar

## Using the Extension

### Automatic Enhancement

Once installed, the extension automatically enhances Hacker News pages:
- Larger fonts (14px for comments, 16px for titles)
- Better line spacing (1.7)
- Improved readability

### Translation Feature

To translate a comment to Chinese:
1. Visit any Hacker News discussion page
2. Look for the small "译" button next to each comment timestamp
3. Click "译" to see the Chinese translation
4. Click again to hide the translation

### Settings

Click the extension icon in your toolbar to access settings:
- **Enhanced Readability**: Toggle larger fonts and better spacing
- **Chinese Translation**: Show/hide translation buttons

Your preferences are saved automatically and sync across your Chrome browsers.

## Troubleshooting

### Extension doesn't appear after loading
- Make sure you selected the correct folder (containing `manifest.json`)
- Check that all files are present: manifest.json, content.js, styles.css, popup.html, popup.js, and the icons folder
- Try reloading the extension

### Changes don't apply on Hacker News
- Refresh the Hacker News page
- Make sure you're on news.ycombinator.com
- Check that the extension is enabled in chrome://extensions/

### Translation doesn't work
- The free translation API has rate limits
- Check your internet connection
- Try again in a few moments if you see an error
- Some very long comments may take longer to translate

### Extension icon doesn't show
- Click the puzzle piece icon in Chrome's toolbar
- Find the extension and click the pin icon

## Updating the Extension

When a new version is available:

1. Download or pull the latest code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Refresh any open Hacker News pages

## Uninstalling

To remove the extension:

1. Go to `chrome://extensions/`
2. Find "Hacker News Readability Enhancer"
3. Click **Remove**
4. Confirm the removal

## Browser Compatibility

This extension is designed for:
- **Chrome** (tested on latest version)
- **Edge** (Chromium-based)
- **Brave**
- **Opera**
- Other Chromium-based browsers

**Note:** Firefox uses a different extension format and would require modifications.

## Privacy & Permissions

The extension requires minimal permissions:
- **Storage**: To save your preferences
- **Active Tab**: To modify Hacker News pages
- **Host Permission** (news.ycombinator.com): Only runs on Hacker News

The extension:
- Does NOT collect personal data
- Does NOT track your browsing
- Only sends comment text to translation API when you click "译"
- Stores preferences locally in Chrome sync storage

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Open an issue on GitHub
3. Include browser version and error details from the console (F12)
