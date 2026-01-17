# 🎯 ChatFocus - Auto-Collapse AI Chats

A production-ready browser extension that automatically collapses past messages in AI chat interfaces (ChatGPT, Claude) to help you focus on the current conversation.

## ✨ Features

### Core Functionality
- **Auto-Collapse**: Automatically collapses older messages, keeping only recent ones visible
- **Smart Preview**: Shows a preview of collapsed messages with customizable length
- **State Persistence**: Remembers which messages you've expanded/collapsed across page reloads
- **Type Detection**: Distinguishes between user and AI messages with different styling

### User Experience
- **Keyboard Shortcuts**: 
  - `Ctrl+Shift+E` (Mac: `Cmd+Shift+E`) - Expand all messages
  - `Ctrl+Shift+C` (Mac: `Cmd+Shift+C`) - Collapse all messages
  - `Ctrl+Shift+T` (Mac: `Cmd+Shift+T`) - Toggle extension on/off
  - `Ctrl+Shift+O` (Mac: `Cmd+Shift+O`) - Toggle Table of Contents
- **Table of Contents**: Navigate through your conversation with a sidebar that shows all messages
- **AI Summarization**: Automatic summaries for longer AI responses
- **Native ChatGPT Styling**: Seamlessly integrated UI that feels like a built-in feature
- **Settings Page**: Full-featured options page for customization
- **Popup Menu**: Quick access to toggle and controls
- **Accessibility**: Full keyboard navigation and ARIA labels

### Production Features
- **Error Handling**: Comprehensive error handling and graceful degradation
- **Performance Optimized**: Efficient mutation observer with debouncing
- **Multiple Selector Strategies**: Works even if site structure changes
- **Dark Mode Support**: Automatic dark mode detection and styling
- **High Contrast Support**: Respects user's accessibility preferences
- **Reduced Motion Support**: Honors user's motion preferences

## 🚀 Installation

### From Source

1. Clone or download this repository
2. **Create Icons** (optional but recommended):
   - Open `create-icons.html` in your browser
   - Click "Download All Icons"
   - Save the three PNG files to the `icons/` directory
   - Or manually create 16x16, 48x48, and 128x128 PNG icons
3. Open Chrome/Edge and navigate to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked"
6. Select the `chat-focus` directory

### From Chrome Web Store
*(Coming soon)*

## 📖 Usage

### Basic Usage
Once installed, ChatFocus works automatically:
- Open ChatGPT or Claude
- Older messages will automatically collapse with a subtle, native-style preview
- Click on a collapsed message to expand it
- Click the "Collapse" button (appears on hover) to collapse an expanded message
- Click the 📑 button in the top-right to open the Table of Contents
- Navigate messages quickly using the TOC sidebar

### Settings
1. Click the extension icon in your browser toolbar
2. Click "Settings" or right-click the icon and select "Options"
3. Customize:
   - **Enable/Disable**: Toggle the extension on or off
   - **Messages to Keep Open**: Number of recent messages to keep expanded (1-5)
   - **Preview Text Length**: Characters to show in collapsed preview (30-200)

### Keyboard Shortcuts
- **Expand All**: `Ctrl+Shift+E` - Expands all collapsed messages
- **Collapse All**: `Ctrl+Shift+C` - Collapses all expanded messages
- **Toggle Extension**: `Ctrl+Shift+T` - Quickly enable/disable the extension

## 🛠️ Development

### Project Structure
```
chat-focus/
├── content.js          # Main content script
├── styles.css          # Extension styles
├── manifest.json       # Extension manifest
├── options.html        # Settings page
├── options.js          # Settings page logic
├── popup.html          # Extension popup
├── popup.js            # Popup logic
├── background.js       # Background service worker
└── README.md           # This file
```

### Building
No build process required - the extension uses vanilla JavaScript and can be loaded directly.

### Testing
1. Load the extension in developer mode
2. Test on both ChatGPT and Claude
3. Verify settings persistence
4. Test keyboard shortcuts
5. Test in both light and dark modes

## 🔧 Configuration

### Default Settings
- **Enabled**: `true`
- **Messages to Keep Open**: `1`
- **Preview Length**: `85` characters
- **Debounce Delay**: `500ms`

### Customization
All settings can be changed via the options page. Settings are synced across devices using Chrome's sync storage.

## 🐛 Troubleshooting

### Extension Not Working
1. Check if the extension is enabled in the popup
2. Refresh the ChatGPT/Claude page
3. Check browser console for errors (F12)
4. Verify you're on a supported site (chatgpt.com or claude.ai)

### Messages Not Collapsing
1. Ensure you have more messages than the "Keep Open" setting
2. Check if the extension is enabled
3. Try manually collapsing with `Ctrl+Shift+C`

### Settings Not Saving
1. Check browser console for errors
2. Verify Chrome sync is enabled
3. Try resetting to defaults and reconfiguring

## 📝 Changelog

### Version 2.0.0
- Complete rewrite for production readiness
- Added settings page and popup
- Added keyboard shortcuts
- Added state persistence
- Improved error handling
- Performance optimizations
- Accessibility improvements
- Dark mode and high contrast support

### Version 1.0
- Initial release
- Basic auto-collapse functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built for the AI chat community
- Inspired by the need for better focus in long conversations

## 🔮 Future Features

- [ ] Search functionality within collapsed messages
- [ ] Export/import settings
- [ ] Per-site configuration
- [ ] Animation preferences
- [ ] Custom preview templates
- [ ] Integration with more AI chat platforms

---

Made with ❤️ for better AI chat experiences
