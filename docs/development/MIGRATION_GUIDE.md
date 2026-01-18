# Migration Guide: Monolithic to Modular

## Overview

This guide explains how to migrate from the current single-file structure (`content.js` - 1332 lines) to the new modular architecture.

## Migration Strategy

The migration can be done in phases without breaking existing functionality.

### Phase 1: Set Up New Structure (✅ Complete)

- [x] Create folder structure
- [x] Create core modules
- [x] Create site adapters
- [x] Document architecture

### Phase 2: Extract Core Functionality (In Progress)

**Goal**: Move shared utilities and configuration

1. **Config & Icons** (✅ Done)
   - `content.js` lines 1-29 → `core/config.js` + `core/icons.js`

2. **State Management** (✅ Done)
   - `content.js` lines 32-40 → `core/state.js`

3. **Utilities** (✅ Done)
   - `content.js` lines 42-80 → `core/utils.js`

4. **Storage** (✅ Done)
   - `content.js` lines 83-147 → `storage/settings.js`

### Phase 3: Extract Features

**Goal**: Modularize each feature

1. **Message Processing** (✅ Done)
   - Extract to `features/message-folding/processing.js`
   - Functions: `extractPreviewText`, `extractFullText`, `determineMessageType`

2. **Message Folding** (To Do)
   - Extract to `features/message-folding/folding.js`
   - Functions: `processMessage`, `foldOldMessages`

3. **Table of Contents** (To Do)
   - Extract to `features/table-of-contents/toc.js`
   - Functions: `createTableOfContents`, `updateTableOfContents`, `toggleTOC`

4. **Search & Highlighting** (To Do)
   - Extract to `features/table-of-contents/search.js`
   - Functions: `highlightSearchTerm`, `clearSearchHighlights`, `filterTOCItems`

5. **Floating Controls** (To Do)
   - Extract to `features/controls/floating-controls.js`
   - Functions: `createFloatingControls`, `makeDraggable`

6. **Control Actions** (To Do)
   - Extract to `features/controls/actions.js`
   - Functions: `toggleExpandCollapseAll`, `expandAllMessages`, `collapseAllMessages`

7. **Code Mode** (To Do)
   - Extract to `features/code-mode/code-mode.js`
   - Functions: `toggleCodeMode`, `hasCodeBlocks`, `updateCodeModeClasses`

### Phase 4: Organize Styles

**Goal**: Split monolithic styles.css into components

1. **Base Styles**
   - Design system variables → `styles/base.css`

2. **Component Styles**
   - Message folding → `styles/components/message-folding.css`
   - TOC → `styles/components/toc.css`
   - Controls → `styles/components/controls.css`
   - Code mode → `styles/components/code-mode.css`

3. **Theme Styles**
   - Light theme → `styles/themes/light.css`
   - Dark theme → `styles/themes/dark.css`

### Phase 5: Main Entry Point

**Goal**: Coordinate all modules

Create `content/main.js` that:
- Detects current site
- Loads appropriate adapter
- Initializes all features
- Sets up observers

### Phase 6: Update Manifest

Update `manifest.json` to point to new files:

```json
{
  "content_scripts": [{
    "js": [
      "content/main.js"
    ],
    "css": [
      "styles/base.css",
      "styles/components/message-folding.css",
      "styles/components/toc.css",
      "styles/components/controls.css",
      "styles/components/code-mode.css"
    ]
  }]
}
```

## File Mapping

### Current → New Structure

```
content.js (1332 lines)
├── Lines 1-29    → core/config.js + core/icons.js
├── Lines 32-40   → core/state.js
├── Lines 42-80   → core/utils.js
├── Lines 83-147  → storage/settings.js
├── Lines 150-226 → features/message-folding/processing.js
├── Lines 227-395 → features/message-folding/folding.js
├── Lines 397-478 → features/table-of-contents/search.js
├── Lines 480-541 → features/table-of-contents/toc.js
├── Lines 543-561 → features/table-of-contents/highlighting.js
├── Lines 563-674 → features/controls/floating-controls.js
├── Lines 676-771 → features/controls/actions.js
├── Lines 772-817 → features/code-mode/code-mode.js
└── Lines 860-945 → main.js (initialization)
```

### Styles Mapping

```
styles.css (900+ lines)
├── Lines 1-102   → styles/base.css (design tokens)
├── Lines 104-325 → styles/components/message-folding.css
├── Lines 327-616 → styles/components/toc.css
├── Lines 617-724 → styles/components/controls.css
├── Lines 726-776 → styles/components/code-mode.css
└── Lines 778-895 → styles/themes/dark.css
```

## Implementation Steps

### Step 1: Parallel Development

Keep `content.js` working while building new structure:

```
extension/
├── content.js          # OLD (still working)
├── styles.css          # OLD (still working)
└── content/            # NEW (in development)
    ├── main.js
    └── ...
```

### Step 2: Create Entry Point

```javascript
// extension/content/main.js
import { ChatGPTAdapter } from './sites/chatgpt/adapter.js';
import { loadSettings } from './storage/settings.js';
import { initMessageFolding } from './features/message-folding/folding.js';
import { initTOC } from './features/table-of-contents/toc.js';
import { initControls } from './features/controls/floating-controls.js';
import { initCodeMode } from './features/code-mode/code-mode.js';

// Detect site and load adapter
const adapter = ChatGPTAdapter; // Auto-detect in production

async function init() {
    await loadSettings();
    adapter.init();

    // Initialize features
    initMessageFolding(adapter);
    initTOC(adapter);
    initControls();
    initCodeMode();
}

init();
```

### Step 3: Extract One Feature at a Time

1. Copy feature code to new module
2. Update imports/exports
3. Test feature works
4. Remove from old file
5. Repeat for next feature

### Step 4: Switch to New Structure

Update `manifest.json`:

```json
{
  "content_scripts": [{
    "js": ["content/main.js"],
    "type": "module"  // Enable ES6 modules
  }]
}
```

### Step 5: Remove Old Files

After verifying everything works:
1. Delete old `content.js`
2. Delete old `styles.css`
3. Clean up any leftover files

## Testing Checklist

After migration, verify:

- [ ] Messages fold/unfold correctly
- [ ] TOC displays and updates
- [ ] Search works and highlights
- [ ] Code-only mode filters correctly
- [ ] Controls are draggable
- [ ] Settings persist
- [ ] Dark mode works
- [ ] All keyboard shortcuts work
- [ ] Extension loads on ChatGPT
- [ ] No console errors

## Rollback Plan

If issues arise:
1. Revert `manifest.json` to old structure
2. Keep old files as backup
3. Debug new structure in parallel
4. Switch back when fixed

## Benefits After Migration

1. **Maintainability**
   - Small, focused files (<300 lines each)
   - Easy to find and fix bugs
   - Clear separation of concerns

2. **Extensibility**
   - Add new features without touching existing code
   - Add new sites with just an adapter
   - Easy to add/remove features

3. **Collaboration**
   - Multiple developers can work simultaneously
   - Clear module boundaries reduce conflicts
   - Easier to review pull requests

4. **Testing**
   - Each module can be tested independently
   - Easier to mock dependencies
   - Better code coverage

5. **Performance**
   - Only load needed modules
   - Better tree-shaking opportunities
   - Faster development builds

## Timeline

- **Week 1**: Extract core + utilities (✅ Done)
- **Week 2**: Extract feature modules
- **Week 3**: Split styles, create main entry
- **Week 4**: Testing and refinement
- **Week 5**: Deploy to production

## Notes

- Keep both structures working during transition
- Test thoroughly at each step
- Document any API changes
- Update contributor guidelines
