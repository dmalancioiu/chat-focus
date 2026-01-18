# ChatFocus Browser Extension

## Current Status

🚧 **In Transition**: Migrating from monolithic to modular architecture

### Working Files (Current)
- ✅ `content.js` (1332 lines) - Currently active
- ✅ `styles.css` (900+ lines) - Currently active
- ✅ `manifest.json` - Current manifest
- ✅ `popup/`, `options/`, `background/` - Working as-is

### New Modular Structure (Ready)
- ✅ `content/` - New modular content scripts
  - ✅ `core/` - Core functionality (config, state, utils, icons)
  - ✅ `features/` - Feature modules
  - ✅ `sites/` - Site adapters (ChatGPT, Claude, Gemini)
  - ✅ `storage/` - Settings management
- 📁 `styles/components/` - Component-based styles (ready)

## Loading the Extension

### Current Version (Working)
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder

The extension will load using the current `content.js` and `styles.css`.

## Architecture

### Current (Monolithic)
```
extension/
├── content.js          ← 1332 lines, all features
├── styles.css          ← 900+ lines, all styles
├── popup/
├── options/
└── manifest.json
```

### Future (Modular)
```
extension/
├── content/
│   ├── core/           ← Shared utilities
│   ├── features/       ← Self-contained features
│   ├── sites/          ← Site adapters
│   └── main.js         ← Entry point
├── styles/
│   ├── components/     ← Feature-specific styles
│   └── themes/         ← Light/dark themes
├── popup/
├── options/
└── manifest.json       ← Updated for modules
```

## New Modules Created

### Core (4 files)
- `content/core/config.js` - Configuration constants
- `content/core/state.js` - State management
- `content/core/utils.js` - Utility functions
- `content/core/icons.js` - SVG icons

### Features (1 file, more to come)
- `content/features/message-folding/processing.js` - Message processing

### Storage (1 file)
- `content/storage/settings.js` - Settings persistence

### Site Adapters (6 files)
- `content/sites/chatgpt/selectors.js` - ChatGPT selectors
- `content/sites/chatgpt/adapter.js` - ChatGPT adapter
- `content/sites/claude/selectors.js` - Claude selectors (placeholder)
- `content/sites/claude/adapter.js` - Claude adapter (placeholder)
- `content/sites/gemini/selectors.js` - Gemini selectors (placeholder)
- `content/sites/gemini/adapter.js` - Gemini adapter (placeholder)

## Next Steps

To complete the migration:

1. **Extract Features** - Move code from `content.js` to feature modules
2. **Create Entry Point** - Build `content/main.js`
3. **Split Styles** - Organize `styles.css` into components
4. **Update Manifest** - Point to new structure
5. **Test** - Verify everything works
6. **Deploy** - Switch to new structure

See [`/docs/development/MIGRATION_GUIDE.md`](../docs/development/MIGRATION_GUIDE.md) for details.

## File Guide

| File | Purpose | Status |
|------|---------|--------|
| `manifest.json` | Extension configuration | Current |
| `content.js` | All content script logic | Migrating → `content/` |
| `styles.css` | All styles | Migrating → `styles/` |
| `popup/` | Extension popup UI | Complete |
| `options/` | Settings page | Complete |
| `background.js` | Background script | Complete |
| `content/` | **New modular structure** | Ready |

## Development

### Current Workflow
1. Edit `content.js` or `styles.css`
2. Reload extension
3. Refresh ChatGPT page

### Future Workflow (After Migration)
1. Edit specific module in `content/features/`
2. Reload extension
3. Refresh page

## Documentation

- **Architecture**: [`/docs/architecture/`](../docs/architecture/)
- **Development**: [`/docs/development/`](../docs/development/)
- **Project Overview**: [`/PROJECT_STRUCTURE.md`](../PROJECT_STRUCTURE.md)

## Multi-Site Support

The new architecture supports multiple AI chat platforms:

- ✅ **ChatGPT** (chat.openai.com) - Fully implemented
- 📋 **Claude** (claude.ai) - Structure ready
- 📋 **Gemini** (gemini.google.com) - Structure ready

Adding a new site is as simple as:
1. Create adapter in `content/sites/{site-name}/`
2. Define selectors and implementation
3. Register in main entry point

See [`/docs/architecture/MULTI_SITE.md`](../docs/architecture/MULTI_SITE.md) for details.

## Features

Current features (all in `content.js`, to be modularized):

- ✅ **Message Folding** - Collapse/expand messages
- ✅ **Table of Contents** - Navigate conversation
- ✅ **Search & Highlighting** - Find and highlight text
- ✅ **Code-Only Mode** - Show only code blocks
- ✅ **Floating Controls** - Quick access buttons
- ✅ **Keyboard Shortcuts** - Productivity shortcuts

Future features (easy to add with new structure):
- AI Chat History across platforms
- Advanced search filters
- Export conversations
- Custom themes
- Collaboration features

## Tech Stack

- **Language**: JavaScript (ES6+)
- **Modules**: ES6 import/export
- **Styling**: CSS (custom properties)
- **APIs**: Chrome Extension APIs
- **Storage**: chrome.storage (sync + local)

## Questions?

- See [`/docs/development/SETUP.md`](../docs/development/SETUP.md) for setup
- See [`/PROJECT_STRUCTURE.md`](../PROJECT_STRUCTURE.md) for overview
- See [`/REFACTORING_SUMMARY.md`](../REFACTORING_SUMMARY.md) for what's been done
