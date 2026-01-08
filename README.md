# Hacker News Readability Enhancer

A Chrome extension that improves the reading experience on Hacker News with larger fonts, better spacing, and Chinese translations for comments.

## Features

- 📖 **Enhanced Readability**: Larger font sizes and improved line spacing for easier reading
- 🌐 **Chinese Translation**: One-click translation of comments to Chinese
- ⚡ **Easy Toggle**: Enable/disable features through the extension popup
- 🎨 **Clean Design**: Maintains Hacker News aesthetic while improving usability

## Installation

### From Source

1. Clone this repository or download the ZIP file:
   ```bash
   git clone https://github.com/qcbegin/hacker-news-browser-plugin.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" by toggling the switch in the top-right corner

4. Click "Load unpacked" button

5. Select the directory containing the extension files

6. The extension icon should appear in your Chrome toolbar

## Usage

1. Visit any Hacker News page (https://news.ycombinator.com)

2. The extension will automatically enhance readability with larger fonts

3. Click the extension icon to open the settings popup

4. Toggle features on/off:
   - **Enhanced Readability**: Increases font sizes and improves spacing
   - **Chinese Translation**: Adds translation buttons to comments

5. To translate a comment:
   - Look for the "译" button next to each comment
   - Click it to see the Chinese translation
   - Click again to hide the translation

## Configuration

The extension saves your preferences automatically. Your settings will persist across browser sessions and apply to all Hacker News pages.

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Storage (for saving preferences), Active Tab (for page interaction)
- **Translation API**: Uses MyMemory Translation API (free, with rate limits)

## Privacy

This extension:
- Only runs on Hacker News pages (news.ycombinator.com)
- Stores preferences locally in Chrome sync storage
- Only sends comment text to translation API when you click "译"
- Does not collect or transmit any personal data

## Development

To modify the extension:

1. Make changes to the source files:
   - `manifest.json` - Extension configuration
   - `content.js` - Main functionality
   - `styles.css` - Styling
   - `popup.html` / `popup.js` - Settings UI

2. Reload the extension in `chrome://extensions/`

3. Refresh any Hacker News pages to see changes

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use and modify as needed.

## Acknowledgments

- Hacker News for being an awesome community
- Translation service provided by MyMemory API
