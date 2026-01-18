# ChatFocus Development Setup

## Project Structure

ChatFocus has been refactored into a production-ready, modular architecture. See [FOLDER_STRUCTURE.md](../architecture/FOLDER_STRUCTURE.md) for complete details.

## Quick Start

### Extension Development

1. **Prerequisites**
   ```bash
   # No build process required for extension (vanilla JS/CSS)
   # Just need a modern browser (Chrome/Edge)
   ```

2. **Load Extension**
   - Open Chrome/Edge
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/` directory

3. **Development Workflow**
   - Edit files in `extension/content/`
   - Reload extension in browser
   - Refresh target page (ChatGPT, Claude, etc.)

### Web Application Development

```bash
cd web/landing
npm install
npm run dev
```

### Backend Development

```bash
cd backend
npm install
npm run dev
```

## File Organization

### Extension Structure

```
extension/
├── content/           # Content scripts (injected into pages)
│   ├── core/         # Core functionality
│   ├── features/     # Feature modules
│   ├── sites/        # Site adapters
│   └── storage/      # Storage management
├── popup/            # Extension popup UI
├── options/          # Settings page
├── background/       # Background service worker
└── styles/           # Stylesheets
```

### Key Files

- `extension/content/main.js` - Main initialization
- `extension/content/core/config.js` - Configuration
- `extension/content/core/state.js` - State management
- `extension/manifest.json` - Extension manifest

## Adding Features

### 1. Create Feature Module

```bash
mkdir -p extension/content/features/my-feature
touch extension/content/features/my-feature/my-feature.js
```

### 2. Implement Feature

```javascript
// extension/content/features/my-feature/my-feature.js
export function initMyFeature() {
    // Feature logic
}
```

### 3. Add Styles

```bash
touch extension/styles/components/my-feature.css
```

### 4. Register Feature

```javascript
// extension/content/main.js
import { initMyFeature } from './features/my-feature/my-feature.js';

initMyFeature();
```

## Adding Site Support

See [../architecture/MULTI_SITE.md](../architecture/MULTI_SITE.md) for detailed guide.

Quick steps:
1. Create `extension/content/sites/{site-name}/`
2. Add `selectors.js` and `adapter.js`
3. Register in `main.js`
4. Update `manifest.json` permissions

## Code Style

- **ES6 Modules**: Use import/export
- **JSDoc Comments**: Document public functions
- **Naming Conventions**:
  - Functions: `camelCase`
  - Classes/Adapters: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Files: `kebab-case.js`

## Testing

### Manual Testing
1. Load extension
2. Navigate to ChatGPT
3. Verify features work:
   - Message folding
   - Table of contents
   - Search/highlighting
   - Code-only mode

### Automated Testing
```bash
# TODO: Set up Jest/Playwright
npm test
```

## Building for Production

### Extension
```bash
# Create release package
./scripts/package-extension.sh
```

### Web Application
```bash
cd web/landing
npm run build
```

### Backend
```bash
cd backend
npm run build
```

## Common Tasks

### Add a New Setting
1. Add to `extension/content/core/config.js`
2. Add UI in `extension/options/options.html`
3. Add storage in `extension/content/storage/settings.js`

### Debug Content Script
1. Open DevTools on target page
2. Check Console for "ChatFocus" logs
3. Use `debugger;` statements
4. Inspect `window` for extension state

### Update Styles
1. Edit files in `extension/styles/components/`
2. Follow CSS architecture in `styles.css`
3. Use CSS custom properties for theming

## Troubleshooting

### Extension Not Loading
- Check `chrome://extensions/` for errors
- Verify `manifest.json` syntax
- Check file permissions

### Features Not Working
- Open DevTools Console
- Look for ChatFocus errors
- Verify selectors match current site DOM

### Styles Not Applying
- Hard refresh page (Ctrl+Shift+R)
- Check CSS specificity
- Inspect element to see applied styles

## Resources

- [Architecture Docs](../architecture/)
- [API Documentation](../api/)
- [Contributing Guide](CONTRIBUTING.md)
- [Site Adapter Guide](SITE_ADAPTER_GUIDE.md)

## Getting Help

- Check existing issues
- Read architecture docs
- Ask in discussions
- Create detailed bug reports
