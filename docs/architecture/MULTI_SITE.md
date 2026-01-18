# Multi-Site Architecture

## Overview
ChatFocus is designed to work across multiple AI chat platforms (ChatGPT, Claude, Gemini, etc.). This document explains how the multi-site architecture works.

## Core Concept: Site Adapters

Each supported site has its own **adapter** that provides site-specific implementations while maintaining a common interface.

## Adapter Structure

```javascript
// extension/content/sites/{site-name}/adapter.js
export const SiteAdapter = {
    name: 'sitename',
    domains: ['chat.sitename.com'],

    // Required methods
    init() { },
    getMessages() { },
    detectMessageType(element) { },

    // Optional methods
    onNewMessage(element) { },
    cleanup() { }
};
```

## Selector Files

Each site defines its own selectors:

```javascript
// extension/content/sites/{site-name}/selectors.js
export const SELECTORS = {
    // Message containers
    articles: ['article', '.message-container'],

    // Author role detection
    authorRole: ['[data-author]', '.author-role'],

    // Text content
    textContent: ['.markdown', '.message-text'],

    // Code blocks
    codeBlocks: ['pre code', '.code-block']
};
```

## Site-Specific Styles

```css
/* extension/content/sites/{site-name}/styles.css */

/* Override or extend base styles for this site */
.chat-focus-label {
    /* Site-specific adjustments */
}
```

## Adapter Registry

The main entry point maintains a registry of all adapters:

```javascript
// extension/content/main.js
import { ChatGPTAdapter } from './sites/chatgpt/adapter.js';
import { ClaudeAdapter } from './sites/claude/adapter.js';
import { GeminiAdapter } from './sites/gemini/adapter.js';

const adapters = [
    ChatGPTAdapter,
    ClaudeAdapter,
    GeminiAdapter
];

// Auto-detect current site
const currentAdapter = adapters.find(adapter =>
    adapter.domains.some(domain => window.location.hostname.includes(domain))
);
```

## Example: ChatGPT Adapter

```javascript
// extension/content/sites/chatgpt/adapter.js
import { SELECTORS } from './selectors.js';

export const ChatGPTAdapter = {
    name: 'chatgpt',
    domains: ['chat.openai.com', 'chatgpt.com'],
    selectors: SELECTORS,

    init() {
        console.log('ChatFocus: Initialized for ChatGPT');
        // ChatGPT-specific initialization
    },

    getMessages() {
        return Array.from(document.querySelectorAll(SELECTORS.articles[0]));
    },

    detectMessageType(element) {
        const authorRole = element.querySelector('[data-message-author-role]');
        if (!authorRole) return 'unknown';

        const role = authorRole.getAttribute('data-message-author-role');
        return role === 'user' ? 'user' : 'ai';
    },

    onNewMessage(element) {
        // Called when a new message is detected
        // ChatGPT-specific handling if needed
    }
};
```

## Example: Claude Adapter

```javascript
// extension/content/sites/claude/adapter.js
import { SELECTORS } from './selectors.js';

export const ClaudeAdapter = {
    name: 'claude',
    domains: ['claude.ai'],
    selectors: SELECTORS,

    init() {
        console.log('ChatFocus: Initialized for Claude');
    },

    getMessages() {
        // Claude uses different DOM structure
        return Array.from(document.querySelectorAll(SELECTORS.articles[0]));
    },

    detectMessageType(element) {
        // Claude-specific message type detection
        const isUser = element.classList.contains('human-message');
        return isUser ? 'user' : 'ai';
    }
};
```

## Adding a New Site

To add support for a new AI chat platform:

### 1. Create Site Directory
```bash
mkdir -p extension/content/sites/{site-name}
```

### 2. Create Selectors File
```javascript
// extension/content/sites/{site-name}/selectors.js
export const SELECTORS = {
    articles: ['.message'], // Adjust to site's structure
    authorRole: ['.author'],
    textContent: ['.text'],
    codeBlocks: ['pre']
};
```

### 3. Create Adapter File
```javascript
// extension/content/sites/{site-name}/adapter.js
import { SELECTORS } from './selectors.js';

export const SiteNameAdapter = {
    name: 'sitename',
    domains: ['sitename.com'],
    selectors: SELECTORS,

    init() {
        // Initialize
    },

    getMessages() {
        // Return array of message elements
    },

    detectMessageType(element) {
        // Return 'user' or 'ai'
    }
};
```

### 4. Create Site-Specific Styles (Optional)
```css
/* extension/content/sites/{site-name}/styles.css */
/* Site-specific style overrides */
```

### 5. Register Adapter
```javascript
// extension/content/main.js
import { SiteNameAdapter } from './sites/sitename/adapter.js';

const adapters = [
    // ... existing adapters
    SiteNameAdapter
];
```

### 6. Update Manifest
```json
{
  "content_scripts": [{
    "matches": [
      "*://sitename.com/*"
    ]
  }]
}
```

## Adapter Interface

All adapters must implement:

### Required Properties
- `name`: String identifier
- `domains`: Array of domain patterns

### Required Methods
- `init()`: Initialize adapter
- `getMessages()`: Return array of message elements
- `detectMessageType(element)`: Return 'user', 'ai', or 'unknown'

### Optional Methods
- `onNewMessage(element)`: Handle new message detection
- `cleanup()`: Cleanup when adapter is disabled
- `getCodeBlocks(element)`: Get code blocks from message
- `shouldProcessMessage(element)`: Skip certain messages

## Best Practices

1. **Fallback Selectors**: Provide multiple selector options
2. **Feature Detection**: Check for site-specific features before using
3. **Graceful Degradation**: Core features should work even if site changes
4. **Minimal Site-Specific Code**: Keep adapters thin, logic in core
5. **Test Across Updates**: Sites update frequently, test regularly

## Benefits

1. **Maintainability**: Site-specific code is isolated
2. **Extensibility**: Easy to add new sites
3. **Testability**: Each adapter can be tested independently
4. **Resilience**: Changes to one site don't affect others
5. **Developer Experience**: Clear pattern for contributors

## Testing

Each adapter should have tests that verify:
- Message detection works
- Message type detection is accurate
- Code block detection works
- Selectors match current DOM structure

## Migration Strategy

For existing installations:
1. Core functionality works the same way
2. Site detection happens automatically
3. Settings are preserved
4. No user action required
